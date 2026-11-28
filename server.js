import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import contactHandler from './api/contact.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contact', contactHandler);

// Fallback route to serve index.html for SPA/anchor navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Muawaz Habib Portfolio Web Server is running!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Email delivery: ${process.env.RESEND_API_KEY ? 'Resend configured' : 'RESEND_API_KEY missing'}`);
  console.log(`=======================================================`);
});
