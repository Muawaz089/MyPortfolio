import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const RECIPIENT_EMAIL = process.env.EMAIL_RECIPIENT || 'mavizm233@gmail.com';
const FORMSUBMIT_ENDPOINT = process.env.FORMSUBMIT_ENDPOINT || `https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT_EMAIL)}`;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

async function sendViaSmtp({ name, email, subject, message }) {
  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : '';
  if (!smtpPass) return { ok: false, reason: 'SMTP password not configured.' };

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || RECIPIENT_EMAIL,
        pass: smtpPass
      }
    });

    const sender = process.env.SMTP_USER || RECIPIENT_EMAIL;
    await transporter.sendMail({
      from: `"${escapeHtml(name)}" <${sender}>`,
      replyTo: email,
      to: RECIPIENT_EMAIL,
      subject: `[Portfolio Contact] ${subject}`,
      text: `From: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #F4123E;">New Contact Form Message</h2>
          <p><strong>From:</strong> ${escapeHtml(name)} (&lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;)</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${escapeHtml(message)}</p>
        </div>
      `
    });

    console.log(`[SMTP Delivered] From: ${name} <${email}> -> ${RECIPIENT_EMAIL}`);
    return { ok: true, method: 'SMTP' };
  } catch (err) {
    console.error(`[SMTP Failed] ${err.code || 'ERROR'}: ${err.message}`);
    return { ok: false, reason: err.code || err.message };
  }
}

async function sendViaFormSubmit({ name, email, subject, message }) {
  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _replyto: email,
        _subject: `[Portfolio Contact] ${subject}`,
        _template: 'table',
        _captcha: 'false'
      }),
      signal: AbortSignal.timeout(6000)
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok && (data.success || data.message)) {
      const needsActivation = /activat|confirm/i.test(`${data.message || ''} ${data.success || ''}`);
      if (needsActivation) {
        console.log(`[FormSubmit Awaiting Activation] Check ${RECIPIENT_EMAIL} inbox for the confirmation link.`);
        return { ok: false, pending: true, reason: 'FormSubmit activation link sent.' };
      }
      console.log(`[FormSubmit Delivered] From: ${name} <${email}> -> ${RECIPIENT_EMAIL}`);
      return { ok: true, method: 'FormSubmit' };
    }
    console.error(`[FormSubmit Failed] HTTP ${response.status}: ${JSON.stringify(data).slice(0, 300)}`);
    return { ok: false, reason: `FormSubmit HTTP ${response.status}` };
  } catch (err) {
    console.error(`[FormSubmit Error] ${err.name || 'ERROR'}: ${err.message}`);
    return { ok: false, reason: err.message };
  }
}

// Contact Form API Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Server-side validation
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  if (!subject || !subject.trim()) {
    return res.status(400).json({ success: false, message: 'Subject is required.' });
  }

  if (!message || message.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'Message must be at least 10 characters long.' });
  }

  const clean = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();
  const submission = {
    name: clean(name),
    email: clean(email),
    subject: clean(subject),
    message: message.trim()
  };

  const smtpResult = await sendViaSmtp(submission);
  const delivery = smtpResult.ok ? smtpResult : await sendViaFormSubmit(submission);

  if (delivery.ok) {
    return res.status(200).json({
      success: true,
      sent: true,
      method: delivery.method,
      message: 'Your message has been sent to the email.'
    });
  }

  if (delivery.pending) {
    return res.status(200).json({
      success: true,
      sent: false,
      pending: true,
      message: `Almost there: I need to confirm the email forwarding address. Please check ${RECIPIENT_EMAIL} for a FormSubmit confirmation link and click it, then this form will deliver messages.`
    });
  }

  console.log(`[Delivery Failed] From: ${submission.name} <${submission.email}> | Subject: ${submission.subject}`);
  console.log(`[Message Body]: ${submission.message}`);

  return res.status(502).json({
    success: false,
    sent: false,
    message: `The message could not be emailed right now. Please try again later or email ${RECIPIENT_EMAIL} directly.`
  });
});

// Fallback route to serve index.html for SPA/anchor navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Muawaz Habib Portfolio Web Server is running!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Target Email: ${RECIPIENT_EMAIL}`);
  console.log(`=======================================================`);
});
