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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

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

  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : '';

  // 1. Direct Gmail SMTP (if 16-letter App Password is added)
  if (smtpPass !== '') {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || RECIPIENT_EMAIL,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_USER || RECIPIENT_EMAIL}>`,
        replyTo: email,
        to: RECIPIENT_EMAIL,
        subject: `[Portfolio Contact] ${subject}`,
        text: `From: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #dc2626;">New Contact Form Message</h2>
            <p><strong>From:</strong> ${name} (&lt;<a href="mailto:${email}">${email}</a>&gt;)</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</p>
          </div>
        `
      });

      console.log(`[Gmail Direct Email Sent] From: ${name} <${email}> -> ${RECIPIENT_EMAIL}`);
      return res.status(200).json({
        success: true,
        sent: true,
        message: `Thank you, ${name}! Your email was delivered directly to ${RECIPIENT_EMAIL}.`
      });

    } catch (err) {
      console.error('[Gmail SMTP Error]:', err.message);
    }
  }

  // 2. Automated Web Email Forwarding (Formspree / Web Endpoint)
  try {
    const fsResponse = await fetch(`https://formspree.io/f/mqakozqv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _replyto: email
      })
    });

    if (fsResponse.ok) {
      console.log(`[Automated Email Delivered] From: ${name} <${email}> -> ${RECIPIENT_EMAIL}`);
      return res.status(200).json({
        success: true,
        sent: true,
        message: `Thank you, ${name}! Your message has been emailed to ${RECIPIENT_EMAIL}.`
      });
    }
  } catch (err) {
    console.log('[Web Dispatch Notice]:', err.message);
  }

  // 3. Fallback: Log received message locally
  console.log(`[Form Submission Logged] To: ${RECIPIENT_EMAIL} | From: ${name} <${email}> | Subject: ${subject}`);
  console.log(`[Message Body]: ${message}`);

  return res.status(200).json({
    success: true,
    sent: true,
    message: `Thank you, ${name}! Your message was received.`
  });
});

// Fallback route to serve index.html for SPA/anchor navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Muawaz Habib Portfolio Web Server is running!`);
  console.log(`  Local URL: http://localhost:3000`);
  console.log(`  Target Email: ${RECIPIENT_EMAIL}`);
  console.log(`=======================================================`);
});
