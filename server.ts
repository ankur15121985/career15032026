import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR);
}

const CAREERS_FILE = path.join(DATA_DIR, 'careers.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');
const ASSETS_DIR = path.join(process.cwd(), 'public');
if (!existsSync(ASSETS_DIR)) {
  mkdirSync(ASSETS_DIR);
}

// In-memory fallback for Vercel/Read-only filesystems
let memoryCareers: any[] = [];
let memoryAppointments: any[] = [];
let memoryVisitors: any[] = [];
let memoryLogo: { data: string, mimeType: string } | null = null;
let memoryFavicon: { data: string, mimeType: string } | null = null;

// Vercel KV (Redis) Helper - No dependency version using fetch
const kv = {
  async exec(command: any[]) {
    const url = (process.env.KV_REST_API_URL || "").trim().replace(/^["']|["']$/g, "");
    const token = (process.env.KV_REST_API_TOKEN || "").trim().replace(/^["']|["']$/g, "");
    if (!url || !token) return null;
    
    // Ensure URL is valid and has a protocol
    let finalUrl = url;
    if (!url.startsWith('http')) {
      finalUrl = `https://${url}`;
    }
    
    try {
      finalUrl = new URL(finalUrl).toString();
    } catch (e) {
      console.error(`[KV] Invalid URL: ${finalUrl}`);
      return null;
    }
    try {
      const res = await fetch(finalUrl, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(command)
      });
      const data = await res.json();
      return data.result;
    } catch (e) {
      console.error(`[KV] Command ${command[0]} failed:`, e);
      return null;
    }
  },
  async get(key: string) {
    const result = await this.exec(['GET', key]);
    return result ? JSON.parse(result) : null;
  },
  async set(key: string, value: any) {
    return await this.exec(['SET', key, JSON.stringify(value)]);
  }
};

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// Initialize data from KV or File
const initializeData = async () => {
  if (isInitialized) return;
  console.log("[Server] Initializing data...");
  
  try {
    // Try Vercel KV first
    const [kvCareers, kvAppointments, kvVisitors] = await Promise.all([
      kv.get('careers'),
      kv.get('appointments'),
      kv.get('visitors')
    ]);

    if (kvCareers) {
      memoryCareers = kvCareers;
      console.log("[Server] Loaded careers from Vercel KV");
    } else if (existsSync(CAREERS_FILE)) {
      const data = await fs.readFile(CAREERS_FILE, 'utf-8');
      memoryCareers = data ? JSON.parse(data) : [];
      console.log("[Server] Loaded careers from local file");
    }

    if (kvAppointments) {
      memoryAppointments = kvAppointments;
      console.log("[Server] Loaded appointments from Vercel KV");
    } else if (existsSync(APPOINTMENTS_FILE)) {
      const data = await fs.readFile(APPOINTMENTS_FILE, 'utf-8');
      memoryAppointments = data ? JSON.parse(data) : [];
      console.log("[Server] Loaded appointments from local file");
    }

    if (kvVisitors) {
      memoryVisitors = kvVisitors;
      console.log("[Server] Loaded visitors from Vercel KV, count:", memoryVisitors.length);
    } else if (existsSync(VISITORS_FILE)) {
      const data = await fs.readFile(VISITORS_FILE, 'utf-8');
      memoryVisitors = data ? JSON.parse(data) : [];
      console.log("[Server] Loaded visitors from local file, count:", memoryVisitors.length);
    }

    // Load and restore assets (Logo & Favicon)
    const [kvLogo, kvFavicon] = await Promise.all([
      kv.get('asset_logo'),
      kv.get('asset_favicon')
    ]);

    if (kvLogo) {
      memoryLogo = kvLogo;
      const logoBuffer = Buffer.from(kvLogo.data, 'base64');
      const logoPath = path.join(ASSETS_DIR, 'logo.svg');
      try {
        await fs.writeFile(logoPath, logoBuffer);
        console.log("[Server] Restored logo.svg from Vercel KV");
      } catch (e) {
        console.warn("[Server] Could not write logo.svg to filesystem (likely read-only)");
      }
      
      // Also try to update dist if in production
      const distLogoPath = path.join(process.cwd(), 'dist', 'logo.svg');
      if (existsSync(path.join(process.cwd(), 'dist'))) {
        await fs.writeFile(distLogoPath, logoBuffer).catch(() => {});
      }
    }

    if (kvFavicon) {
      memoryFavicon = kvFavicon;
      const faviconBuffer = Buffer.from(kvFavicon.data, 'base64');
      const faviconPath = path.join(ASSETS_DIR, 'favicon.ico');
      try {
        await fs.writeFile(faviconPath, faviconBuffer);
        console.log("[Server] Restored favicon.ico from Vercel KV");
      } catch (e) {
        console.warn("[Server] Could not write favicon.ico to filesystem (likely read-only)");
      }
      
      const distFaviconPath = path.join(process.cwd(), 'dist', 'favicon.ico');
      if (existsSync(path.join(process.cwd(), 'dist'))) {
        await fs.writeFile(distFaviconPath, faviconBuffer).catch(() => {});
      }
    }
    isInitialized = true;
    console.log("[Server] Data initialization complete");
  } catch (e) {
    console.error("[Server] Data initialization failed:", e);
  }
};

// Start initialization immediately
initializationPromise = initializeData();

// Email Transporter Helper
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  const host = (process.env.SMTP_HOST || "").trim().replace(/^["']|["']$/g, "");
  const port = parseInt((process.env.SMTP_PORT || "587").trim());
  const user = (process.env.SMTP_USER || "").trim().replace(/^["']|["']$/g, "");
  const pass = (process.env.SMTP_PASS || "").trim().replace(/^["']|["']$/g, "");

  if (!transporter) {
    if (!host || !user || !pass) {
      console.warn("[Email] SMTP config missing on Vercel/Environment. Host:", !!host, "User:", !!user, "Pass:", !!pass);
      return null;
    }
    console.log("[Email] Initializing transporter with host:", host, "port:", port);
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
  }
  return transporter;
};

const sendAppointmentEmail = async (appointment: any) => {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@careersirji.com';
  const { user_email, user_name, consultant_name, appointment_time, top_recommendation } = appointment;

  let date = "Scheduled Time";
  try {
    const d = new Date(appointment_time);
    if (!isNaN(d.getTime())) {
      date = d.toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      });
    }
  } catch (e) {
    console.warn("[Email] Failed to format date:", appointment_time);
  }

  const mailOptions = {
    from: `"CareerSirji" <${from}>`,
    to: user_email,
    subject: "Appointment Confirmation - CareerSirji",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="color:#4f46e5;">Appointment Confirmed!</h2>
        <p>Hello <strong>${user_name}</strong>,</p>
        <p>Your career counseling appointment has been successfully scheduled.</p>
        <div style="background:#f8fafc;padding:20px;border-radius:8px;margin:20px 0;">
          <p style="margin:5px 0;"><strong>Consultant:</strong> ${consultant_name}</p>
          <p style="margin:5px 0;"><strong>Time:</strong> ${date}</p>
          <p style="margin:5px 0;"><strong>Top Recommendation:</strong> ${top_recommendation}</p>
        </div>
        <p>We look forward to helping you explore your career path!</p>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0;"/>
        <p style="font-size:12px;color:#64748b;">Automated message from CareerSirji. Do not reply.</p>
      </div>
    `
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`[Email] Sent! ID: ${info.messageId}`);
  } catch (error: any) {
    console.error("[Email] Failed:", error);
  }
};

const sendResultsEmail = async (data: any) => {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@careersirji.com';
  const { user_email, user_name, aq_score, iq_score, recommendations } = data;

  const mailOptions = {
    from: `"CareerSirji" <${from}>`,
    to: user_email,
    subject: "Your Career Assessment Results - CareerSirji",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="color:#4f46e5;">Your Career Assessment Results</h2>
        <p>Hello <strong>${user_name}</strong>,</p>
        <p>Thank you for taking the CareerSirji assessment. Here are your results:</p>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0;">
          <div style="background:#f0fdf4;padding:15px;border-radius:8px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#166534;font-weight:bold;text-transform:uppercase;">AQ Score</p>
            <p style="margin:5px 0;font-size:24px;font-weight:bold;color:#14532d;">${aq_score}%</p>
          </div>
          <div style="background:#fffbeb;padding:15px;border-radius:8px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#92400e;font-weight:bold;text-transform:uppercase;">IQ Score</p>
            <p style="margin:5px 0;font-size:24px;font-weight:bold;color:#78350f;">${iq_score}%</p>
          </div>
        </div>

        <div style="background:#f8fafc;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1e293b;">Top Recommendations:</h3>
          <ul style="padding-left:20px;color:#334155;">
            ${recommendations.map((r: string) => `<li style="margin-bottom:5px;">${r}</li>`).join('')}
          </ul>
        </div>

        <p>We recommend booking a consultation with our expert to discuss these paths in detail.</p>
        
        <div style="text-align:center;margin-top:30px;">
          <a href="https://careersirji.com" style="background:#4f46e5;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Visit CareerSirji</a>
        </div>

        <hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0;"/>
        <p style="font-size:12px;color:#64748b;">Automated message from CareerSirji. Do not reply.</p>
      </div>
    `
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`[Email] Results Sent! ID: ${info.messageId}`);
  } catch (error: any) {
    console.error("[Email] Results Failed:", error);
  }
};

// Helper to get client IP
const getClientIp = (req: express.Request) => {
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const cfIp = req.headers['cf-connecting-ip'];
  
  let ip = forwarded || realIp || cfIp || req.socket.remoteAddress || 'unknown';
  
  if (Array.isArray(ip)) {
    ip = ip[0];
  }
  
  // Handle comma separated list from proxies
  if (typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  
  // Clean up IPv6 prefix if present
  if (typeof ip === 'string' && ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  return ip;
};

const app = express();
const PORT = 3000;

// Middleware to ensure data is initialized before handling requests
app.use(async (_req, _res, next) => {
  if (!isInitialized && initializationPromise) {
    await initializationPromise;
  }
  next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Visitor Tracking
app.use(async (req, _res, next) => {
  // Track unique IP addresses for main page visits and other entry points
  // Only track GET requests for non-API and non-static assets
  const isGet = req.method === 'GET';
  const isApi = req.path.startsWith('/api/');
  const isStatic = req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i);
  
  if (isGet && !isApi && !isStatic) {
    const ipString = getClientIp(req);
    
    console.log(`[Visitor] Tracking request from IP: ${ipString} for path: ${req.path}`);
    
    const existingVisitor = memoryVisitors.find(v => v.ip === ipString);
    if (!existingVisitor) {
      const newVisitor = {
        ip: ipString,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString(),
        visits: 1,
        lastVisit: new Date().toISOString()
      };
      memoryVisitors.push(newVisitor);
      console.log(`[Visitor] New unique visitor added. Total: ${memoryVisitors.length}`);
      
      try {
        // Fire and forget KV update to not block request
        kv.set('visitors', memoryVisitors).catch(e => console.error("[KV] Failed to save new visitor:", e));
        fs.writeFile(VISITORS_FILE, JSON.stringify(memoryVisitors, null, 2)).catch(() => {});
      } catch (e) {
        console.warn("[Server] Failed to trigger visitor save");
      }
    } else {
      existingVisitor.visits = (existingVisitor.visits || 1) + 1;
      existingVisitor.lastVisit = new Date().toISOString();
      console.log(`[Visitor] Existing visitor updated. IP: ${ipString}, Total Visits: ${existingVisitor.visits}`);
      
      // Save updates to KV
      kv.set('visitors', memoryVisitors).catch(e => console.error("[KV] Failed to update existing visitor:", e));
    }
  }
  next();
});

// Track Visit (Manual call from frontend)
app.post("/api/track-visit", (req, res) => {
  const ipString = getClientIp(req);
  
  console.log(`[Visitor] Manual tracking request from IP: ${ipString}`);
  
  const existingVisitor = memoryVisitors.find(v => v.ip === ipString);
  if (!existingVisitor) {
    const newVisitor = {
      ip: ipString,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
      visits: 1,
      lastVisit: new Date().toISOString()
    };
    memoryVisitors.push(newVisitor);
    console.log(`[Visitor] New unique visitor added (manual). Total: ${memoryVisitors.length}`);
    
    kv.set('visitors', memoryVisitors).catch(e => console.error("[KV] Failed to save new visitor:", e));
    fs.writeFile(VISITORS_FILE, JSON.stringify(memoryVisitors, null, 2)).catch(() => {});
  } else {
    existingVisitor.visits = (existingVisitor.visits || 1) + 1;
    existingVisitor.lastVisit = new Date().toISOString();
    console.log(`[Visitor] Existing visitor updated (manual). IP: ${ipString}, Total Visits: ${existingVisitor.visits}`);
    
    kv.set('visitors', memoryVisitors).catch(e => console.error("[KV] Failed to update existing visitor:", e));
  }
  
  res.json({ success: true });
});

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Dynamic Asset Serving (to bypass Vercel static file read-only filesystem)
app.get("/logo.svg", (_req, res, next) => {
  if (memoryLogo) {
    res.setHeader('Content-Type', memoryLogo.mimeType || 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.send(Buffer.from(memoryLogo.data, 'base64'));
  }
  next();
});

app.get("/favicon.ico", (_req, res, next) => {
  if (memoryFavicon) {
    res.setHeader('Content-Type', memoryFavicon.mimeType || 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.send(Buffer.from(memoryFavicon.data, 'base64'));
  }
  next();
});

// Sitemap.xml Generator
app.get("/sitemap.xml", (_req, res) => {
  const baseUrl = process.env.APP_URL || "https://careersirji.com";
  const pages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/graph", priority: "0.9", changefreq: "weekly" },
    { url: "/quiz", priority: "0.8", changefreq: "monthly" },
    { url: "/result", priority: "0.7", changefreq: "monthly" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// Visitor Count
app.get("/api/visitor-count", (_req, res) => {
  res.json({ 
    count: memoryVisitors.length,
    totalVisits: memoryVisitors.reduce((sum, v) => sum + (v.visits || 1), 0)
  });
});

// Visitors List (Admin only)
app.get("/api/visitors", (_req, res) => {
  res.json(memoryVisitors);
});

// Send Results Email
app.post("/api/send-results", async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.user_email) {
      return res.status(400).json({ error: "Missing email data" });
    }
    
    // Send email
    try {
      await sendResultsEmail(data);
      console.log("[API] Results email sent successfully");
    } catch (err) {
      console.error("[API] Results email failed:", err);
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to send results email" });
  }
});

// Careers API
app.get("/api/careers", async (_req, res) => {
  try {
    let careers = memoryCareers;
    if (existsSync(CAREERS_FILE)) {
      const data = await fs.readFile(CAREERS_FILE, 'utf-8');
      careers = data ? JSON.parse(data) : memoryCareers;
    }
    res.json(careers);
  } catch (error: any) {
    console.warn("[API] Failed to read careers from file, using memory:", error);
    res.json(memoryCareers);
  }
});

app.post("/api/careers", async (req, res) => {
  try {
    const careers = req.body;
    if (!Array.isArray(careers)) {
      return res.status(400).json({ error: "Invalid data format. Expected an array." });
    }
    memoryCareers = careers;
    try {
      await kv.set('careers', careers);
      await fs.writeFile(CAREERS_FILE, JSON.stringify(careers, null, 2));
    } catch (e) {
      console.warn("[API] Failed to save careers");
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("[API] Failed to save careers:", error);
    res.status(500).json({ error: "Failed to save careers" });
  }
});

// Asset Upload API
app.post("/api/upload-asset", async (req, res) => {
  try {
    const { type, data, mimeType } = req.body;
    if (!type || !data) {
      return res.status(400).json({ error: "Missing asset data" });
    }

    const buffer = Buffer.from(data, 'base64');
    let fileName = '';
    let kvKey = '';

    if (type === 'logo') {
      fileName = 'logo.svg';
      kvKey = 'asset_logo';
    } else if (type === 'favicon') {
      fileName = 'favicon.ico';
      kvKey = 'asset_favicon';
    } else {
      return res.status(400).json({ error: "Invalid asset type" });
    }

    // Save to memory for immediate serving
    if (type === 'logo') {
      memoryLogo = { data, mimeType };
    } else if (type === 'favicon') {
      memoryFavicon = { data, mimeType };
    }

    // Save to public
    const publicPath = path.join(ASSETS_DIR, fileName);
    try {
      await fs.writeFile(publicPath, buffer);
    } catch (e) {
      console.warn(`[Asset] Could not write ${fileName} to public (likely read-only)`);
    }

    // Save to dist (if exists)
    const distPath = path.join(process.cwd(), 'dist', fileName);
    if (existsSync(path.join(process.cwd(), 'dist'))) {
      await fs.writeFile(distPath, buffer).catch(() => {});
    }

    // Save to KV for persistence
    await kv.set(kvKey, { data, mimeType });

    console.log(`[Asset] Updated ${fileName} and saved to KV`);
    res.json({ success: true });
  } catch (error: any) {
    console.error("[Asset] Upload failed:", error);
    res.status(500).json({ error: "Failed to upload asset" });
  }
});

// Appointments API
app.get("/api/appointments", async (_req, res) => {
  try {
    let appointments = memoryAppointments;
    if (existsSync(APPOINTMENTS_FILE)) {
      const data = await fs.readFile(APPOINTMENTS_FILE, 'utf-8');
      appointments = data ? JSON.parse(data) : memoryAppointments;
    }
    res.json(appointments);
  } catch (error: any) {
    console.warn("[API] Failed to read appointments from file, using memory:", error);
    res.json(memoryAppointments);
  }
});

app.post("/api/appointments", async (req, res) => {
  console.log("[API] POST /api/appointments - body:", JSON.stringify(req.body));
  try {
    const appointmentData = req.body;
    if (!appointmentData || Object.keys(appointmentData).length === 0) {
      return res.status(400).json({ error: "Empty appointment data" });
    }

    const ipString = getClientIp(req);

    const id = appointmentData.id || 'appt-' + Date.now();
    const newAppointment = { ...appointmentData, id, ip: ipString, createdAt: appointmentData.createdAt || new Date().toISOString() };
    
    memoryAppointments.push(newAppointment);
    
    try {
      await kv.set('appointments', memoryAppointments);
      await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(memoryAppointments, null, 2));
    } catch (e) {
      console.warn("[API] Failed to save appointments");
    }

    // Send email
    try {
      await sendAppointmentEmail(newAppointment);
      console.log("[API] Appointment email sent successfully");
    } catch (err) {
      console.error("[API] Appointment email failed:", err);
    }
    
    res.json({ success: true, appointment: newAppointment });
  } catch (error: any) {
    console.error("[API] POST /api/appointments Failed:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

app.delete("/api/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    memoryAppointments = memoryAppointments.filter((a: any) => a.id !== id);
    try {
      await kv.set('appointments', memoryAppointments);
      await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(memoryAppointments, null, 2));
    } catch (e) {
      console.warn("[API] Failed to update appointments after delete");
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

export async function createServer() {

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

// Only start the server if this file is run directly or in development
const isMain = import.meta.url.startsWith('file:') && 
               (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]));

if (isMain || process.env.NODE_ENV === 'development' || !process.env.NODE_ENV || process.env.VERCEL) {
  createServer().then((app) => {
    if (isMain || process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }
  });
}

export default app;
