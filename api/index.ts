import express from "express";
import nodemailer from "nodemailer";
// NO path, NO fs, NO url, NO createViteServer



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

// Create Express app
const app = express();
app.use(express.json());

// In-memory visitor counter
let visitorCount = 1250;

// Visitor Tracking
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/index.html') {
    visitorCount++;
  }
  next();
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Visitor Count
app.get("/api/visitor-count", (req, res) => {
  res.json({ count: visitorCount });
});

// Appointment Booking
app.post("/api/appointments", async (req, res) => {
  try {
    const appointmentData = req.body;
    await sendAppointmentEmail(appointmentData);
    res.json({ success: true, id: 'appt-' + Date.now() });
  } catch (error: any) {
    console.error("[API] Failed:", error.message);
    res.status(500).json({ error: error.message || "Failed to book appointment" });
  }
});

// Export app directly — NO app.listen(), NO Vite, NO Promise
export default app;
