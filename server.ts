import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import fs from "fs/promises";
import { existsSync, mkdirSync, writeFileSync } from "fs";

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR);
}

const CAREERS_FILE = path.join(DATA_DIR, 'careers.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');

// In-memory fallback for Vercel/Read-only filesystems
let memoryCareers: any[] = [];
let memoryAppointments: any[] = [];
let memoryVisitors: any[] = [];

// Initialize files if they don't exist
const initializeData = async () => {
  console.log("[Server] Initializing data files...");
  try {
    if (existsSync(CAREERS_FILE)) {
      const data = await fs.readFile(CAREERS_FILE, 'utf-8');
      memoryCareers = data ? JSON.parse(data) : [];
    } else {
      console.log("[Server] Creating careers.json");
      writeFileSync(CAREERS_FILE, JSON.stringify([], null, 2));
    }
    
    if (existsSync(APPOINTMENTS_FILE)) {
      const data = await fs.readFile(APPOINTMENTS_FILE, 'utf-8');
      memoryAppointments = data ? JSON.parse(data) : [];
    } else {
      console.log("[Server] Creating appointments.json");
      writeFileSync(APPOINTMENTS_FILE, JSON.stringify([], null, 2));
    }

    if (existsSync(VISITORS_FILE)) {
      const data = await fs.readFile(VISITORS_FILE, 'utf-8');
      memoryVisitors = data ? JSON.parse(data) : [];
    } else {
      console.log("[Server] Creating visitors.json");
      writeFileSync(VISITORS_FILE, JSON.stringify([], null, 2));
    }
  } catch (e) {
    console.warn("[Server] File system initialization failed, using in-memory storage only:", e);
  }
  console.log("[Server] Data initialization complete");
};

initializeData();

// Email Transporter Helper
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  const host = (process.env.SMTP_HOST || "").trim();
  const port = parseInt((process.env.SMTP_PORT || "587").trim());
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");

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

const app = express();
const PORT = 3000;

export async function createServer() {
  app.use(cors());
  app.use(express.json());

  // Visitor Tracking
  app.use(async (req, _res, next) => {
    // Track unique IP addresses for main page visits
    if (req.path === '/' || req.path === '/index.html' || req.path === '/api/visitor-count') {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const ipString = Array.isArray(ip) ? ip[0] : ip;
      
      const existingVisitor = memoryVisitors.find(v => v.ip === ipString);
      if (!existingVisitor) {
        const newVisitor = {
          ip: ipString,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString(),
          visits: 1
        };
        memoryVisitors.push(newVisitor);
        try {
          await fs.writeFile(VISITORS_FILE, JSON.stringify(memoryVisitors, null, 2));
        } catch (e) {
          console.warn("[Server] Failed to save visitors to file");
        }
      } else {
        existingVisitor.visits = (existingVisitor.visits || 1) + 1;
        existingVisitor.lastVisit = new Date().toISOString();
        // We don't necessarily need to save on every visit, but for unique IP tracking it's fine
      }
    }
    next();
  });

  // Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
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
        await fs.writeFile(CAREERS_FILE, JSON.stringify(careers, null, 2));
      } catch (e) {
        console.warn("[API] Failed to save careers to file, saved in memory only");
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("[API] Failed to save careers:", error);
      res.status(500).json({ error: "Failed to save careers" });
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

      const id = 'appt-' + Date.now();
      const newAppointment = { ...appointmentData, id, createdAt: new Date().toISOString() };
      
      memoryAppointments.push(newAppointment);
      
      try {
        await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(memoryAppointments, null, 2));
      } catch (e) {
        console.warn("[API] Failed to save appointments to file, saved in memory only");
      }

      // Send email
      try {
        await sendAppointmentEmail(newAppointment);
        console.log("[API] Appointment email sent successfully");
      } catch (err) {
        console.error("[API] Appointment email failed:", err);
      }
      
      res.json({ success: true, id });
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
        await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(memoryAppointments, null, 2));
      } catch (e) {
        console.warn("[API] Failed to delete appointment from file, updated in memory only");
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

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

if (isMain || process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  createServer().then((app) => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
