import express from "express";
import { createServer as createViteServer } from "vite";
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
if (fs.existsSync(configPath)) {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

// Initialize Firebase Admin
try {
  if (firebaseConfig.projectId) {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
  } else {
    admin.initializeApp();
  }
  console.log("[Firebase Admin] Initialized successfully");
} catch (error) {
  console.error("[Firebase Admin] Initialization error:", error);
}

// Get Firestore instance with specific database ID if provided
const db = firebaseConfig.firestoreDatabaseId 
  ? admin.firestore(firebaseConfig.firestoreDatabaseId)
  : admin.firestore();

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Visitor Tracking Middleware
  app.use(async (req, res, next) => {
    if (req.path.includes('.') || req.path.startsWith('/api/admin')) {
      return next();
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip) {
      try {
        const ipStr = Array.isArray(ip) ? ip[0] : ip.toString().split(',')[0].trim();
        const now = new Date();
        
        // Use Firestore for IP logging
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
    res.json({ status: "ok" });
  });

  // Visitor Count API
  app.get("/api/visitor-count", async (req, res) => {
    try {
      const snapshot = await db.collection('ip_logs').count().get();
      res.json({ count: snapshot.data().count });
    } catch (error) {
      console.error("Failed to get visitor count:", error);
      res.status(500).json({ error: "Failed to get visitor count" });
    }
  });

  // Email Test API (Debug)
  app.get("/api/debug/email-test", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    try {
      await sendAppointmentEmail({
        user_email: email,
        user_name: "Test User",
        consultant_name: "Vineet Bansal",
        appointment_time: new Date().toISOString(),
        top_recommendation: "Test Career"
      });
      res.json({ success: true, message: "Test email sent" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Appointment Booking API
  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = req.body;
      
      // Save to Firestore
      const docRef = await db.collection('appointments').add({
        ...appointmentData,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      // Send Email
      await sendAppointmentEmail(appointmentData);

      res.json({ success: true, id: docRef.id });
    } catch (error: any) {
      console.error("Failed to book appointment:", error);
      res.status(500).json({ error: "Failed to book appointment" });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
