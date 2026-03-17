import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
const altConfigPath = path.join(__dirname, "..", "firebase-applet-config.json");
let firebaseConfig: any = {};

const loadConfig = () => {
  console.log("[Debug] Current CWD:", process.cwd());
  console.log("[Debug] Current __dirname:", __dirname);
  try {
    if (fs.existsSync(configPath)) {
      firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      console.log("[Firebase Config] Loaded from process.cwd()");
    } else if (fs.existsSync(altConfigPath)) {
      firebaseConfig = JSON.parse(fs.readFileSync(altConfigPath, "utf-8"));
      console.log("[Firebase Config] Loaded from __dirname/..");
    } else {
      console.warn("[Firebase Config] Config file not found. Trying environment variables.");
      firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
        firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || process.env.VITE_FIREBASE_DATABASE_ID
      };
    }
    console.log("[Firebase Config] Project ID:", firebaseConfig.projectId);
    console.log("[Firebase Config] Database ID:", firebaseConfig.firestoreDatabaseId);
    console.log("[Firebase Config] Keys found:", Object.keys(firebaseConfig).join(", "));
  } catch (e: any) {
    console.error("[Firebase Config] Error loading config:", e.message);
  }
};

loadConfig();

// Initialize Firebase Admin at top level
// Firebase Admin removed to eliminate dependency
let db: any = null;
const getDb = () => null;
const resetDbToDefault = () => null;

// Email Transporter Helper
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  const host = (process.env.SMTP_HOST || "").trim();
  const port = parseInt((process.env.SMTP_PORT || "587").trim());
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");

  if (!transporter) {
    if (!host || !user || !pass) {
      console.warn("[Email Debug] SMTP configuration missing. Email sending will be skipped.");
      return null;
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return transporter;
};

const sendAppointmentEmail = async (appointment: any) => {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const from = process.env.SMTP_FROM || (process.env.SMTP_USER?.includes('@') ? process.env.SMTP_USER : 'noreply@careerexplorer.com');
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
    from: `"Career Explorer" <${from}>`,
    to: user_email,
    subject: "Appointment Confirmation - Career Explorer",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #4f46e5;">Appointment Confirmed!</h2>
        <p>Hello <strong>${user_name}</strong>,</p>
        <p>Your career counseling appointment has been successfully scheduled.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Consultant:</strong> ${consultant_name}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Top Recommendation:</strong> ${top_recommendation}</p>
        </div>
        
        <p>Please ensure you are available at the scheduled time. We look forward to helping you explore your career path!</p>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">This is an automated message from Career Explorer. Please do not reply to this email.</p>
      </div>
    `
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`[Email] Success! Message ID: ${info.messageId}`);
  } catch (error: any) {
    console.error("[Email] Failed to send appointment email:", error);
  }
};

async function createServer() {
  const app = express();
  app.use(express.json());

  // In-memory visitor counter (resets on restart)
  let visitorCount = 1250; // Starting with a base number

  // Visitor Tracking Middleware
  app.use(async (req, res, next) => {
    if (req.path === '/' || req.path === '/index.html') {
      visitorCount++;
    }
    next();
  });

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", firebase: false });
  });

  // Visitor Count API
  app.get("/api/visitor-count", async (req, res) => {
    res.json({ count: visitorCount });
  });

  // Appointment Booking API
  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = req.body;
      console.log("[API] Attempting to send email...");
      await sendAppointmentEmail(appointmentData);
      res.json({ success: true, id: 'local-' + Date.now() });
    } catch (error: any) {
      console.error("[API] Failed to book appointment:", error.message);
      res.status(500).json({ error: error.message || "Failed to book appointment" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  return app;
}

const serverPromise = createServer();

export default serverPromise;
