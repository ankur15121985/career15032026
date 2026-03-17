import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseConfig: any = {};
try {
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    console.log("[Firebase Config] Loaded from file");
  } else {
    console.warn("[Firebase Config] Config file not found at", configPath);
    firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
      firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || process.env.VITE_FIREBASE_DATABASE_ID
    };
  }
} catch (e) {
  console.error("[Firebase Config] Error loading config:", e);
}

// Initialize Firebase Admin at top level
let db: admin.firestore.Firestore;
try {
  if (!admin.apps.length) {
    if (firebaseConfig.projectId) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
      console.log("[Firebase Admin] Initialized with Project ID:", firebaseConfig.projectId);
    } else {
      admin.initializeApp();
      console.log("[Firebase Admin] Initialized with default credentials");
    }
  }
  
  // Initialize db after app is ready
  db = firebaseConfig.firestoreDatabaseId 
    ? admin.firestore(firebaseConfig.firestoreDatabaseId)
    : admin.firestore();
} catch (error) {
  console.error("[Firebase Admin] Initialization error:", error);
}

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

const app = express();
app.use(express.json());

// Visitor Tracking Middleware
app.use(async (req, res, next) => {
  if (req.path.includes('.') || req.path.startsWith('/api/admin')) {
    return next();
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip && db) {
    try {
      const ipStr = Array.isArray(ip) ? ip[0] : ip.toString().split(',')[0].trim();
      const now = new Date();
      
      const ipLogsCol = db.collection('ip_logs');
      const snapshot = await ipLogsCol
        .where('ip_address', '==', ipStr)
        .orderBy('visited_at', 'desc')
        .limit(1)
        .get();
      
      let shouldLog = true;
      if (!snapshot.empty) {
        const lastLog = snapshot.docs[0].data();
        const lastVisited = lastLog.visited_at.toDate();
        if (now.getTime() - lastVisited.getTime() < 3600000) {
          shouldLog = false;
        }
      }

      if (shouldLog) {
        await ipLogsCol.add({
          ip_address: ipStr,
          visited_at: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (e) {
      console.error("Failed to log IP to Firestore:", e);
    }
  }
  next();
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", firebase: !!db });
});

// Visitor Count API
app.get("/api/visitor-count", async (req, res) => {
  try {
    if (!db) throw new Error("Database not initialized");
    const snapshot = await db.collection('ip_logs').count().get();
    res.json({ count: snapshot.data().count });
  } catch (error: any) {
    console.error("Failed to get visitor count:", error);
    res.status(500).json({ error: error.message });
  }
});

// Appointment Booking API
app.post("/api/appointments", async (req, res) => {
  try {
    if (!db) throw new Error("Database not initialized");
    const appointmentData = req.body;
    const docRef = await db.collection('appointments').add({
      ...appointmentData,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    await sendAppointmentEmail(appointmentData);
    res.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("Failed to book appointment:", error);
    res.status(500).json({ error: error.message || "Failed to book appointment" });
  }
});

// For local development
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
