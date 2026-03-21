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

// Initialize files if they don't exist
const initializeData = async () => {
  if (!existsSync(CAREERS_FILE)) {
    // We'll import the default careers from the source if possible, or just use a placeholder
    // For now, let's use a simple placeholder or wait for the first save
    writeFileSync(CAREERS_FILE, JSON.stringify([], null, 2));
  }
  if (!existsSync(APPOINTMENTS_FILE)) {
    writeFileSync(APPOINTMENTS_FILE, JSON.stringify([], null, 2));
  }
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
      console.warn("[Email] SMTP config missing. Skipping email.");
      return null;
    }
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

const app = express();
const PORT = 3000;

export async function createServer() {
  app.use(cors());
  app.use(express.json());

  // In-memory visitor counter
  let visitorCount = 1250;

  // Visitor Tracking
  app.use((req, _res, next) => {
    if (req.path === '/' || req.path === '/index.html') {
      visitorCount++;
    }
    next();
  });

  // Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Visitor Count
  app.get("/api/visitor-count", (_req, res) => {
    console.log(`[API] GET /api/visitor-count - current count: ${visitorCount}`);
    res.json({ count: visitorCount });
  });

  // Careers API
  app.get("/api/careers", async (_req, res) => {
    try {
      if (!existsSync(CAREERS_FILE)) {
        return res.json([]);
      }
      const data = await fs.readFile(CAREERS_FILE, 'utf-8');
      const careers = data ? JSON.parse(data) : [];
      res.json(careers);
    } catch (error: any) {
      console.error("[API] Failed to read careers:", error);
      res.status(500).json({ error: "Failed to read careers" });
    }
  });

  app.post("/api/careers", async (req, res) => {
    try {
      const careers = req.body;
      await fs.writeFile(CAREERS_FILE, JSON.stringify(careers, null, 2));
      res.json({ success: true });
    } catch (error: any) {
      console.error("[API] Failed to save careers:", error);
      res.status(500).json({ error: "Failed to save careers" });
    }
  });

  // Appointments API
  app.get("/api/appointments", async (_req, res) => {
    try {
      if (!existsSync(APPOINTMENTS_FILE)) {
        return res.json([]);
      }
      const data = await fs.readFile(APPOINTMENTS_FILE, 'utf-8');
      const appointments = data ? JSON.parse(data) : [];
      res.json(appointments);
    } catch (error: any) {
      console.error("[API] Failed to read appointments:", error);
      res.status(500).json({ error: "Failed to read appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = req.body;
      const id = 'appt-' + Date.now();
      const newAppointment = { ...appointmentData, id, createdAt: new Date().toISOString() };
      
      // Save to file
      let appointments = [];
      if (existsSync(APPOINTMENTS_FILE)) {
        const data = await fs.readFile(APPOINTMENTS_FILE, 'utf-8');
        appointments = data ? JSON.parse(data) : [];
      }
      appointments.push(newAppointment);
      await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));

      // Send email
      await sendAppointmentEmail(newAppointment);
      
      res.json({ success: true, id });
    } catch (error: any) {
      console.error("[API] Failed:", error.message);
      res.status(500).json({ error: error.message || "Failed to book appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fs.readFile(APPOINTMENTS_FILE, 'utf-8');
      const appointments = JSON.parse(data);
      const filtered = appointments.filter((a: any) => a.id !== id);
      await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(filtered, null, 2));
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
