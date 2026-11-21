# Muawaz Habib — Personal Portfolio Website

A production-quality personal portfolio website designed and built for **Muawaz Habib**, Computer Science Student & Aspiring Web Developer.

Built with **HTML5, CSS3, Tailwind CSS, Vanilla JavaScript, Node.js, and Express.js**.

---

## Key Features

* **Hero Section & Animated Name**: Features a responsive design with periodic smooth text fade, blur, and scale animation for **Muawaz Habib**. Respects `prefers-reduced-motion` settings.
* **Sticky Navigation Bar**: Smooth scroll to all sections (`Home`, `About`, `Services`, `Skills`, `Projects`, `Contact`), active section indicator via `IntersectionObserver`, and mobile hamburger drawer.
* **Data-Driven Architecture**: All skills, projects, services, and bio details are stored in `public/js/data.js`. Adding new items does not require editing markup or CSS.
* **Dynamic Skill Filtering**: Skills grid with filter tabs ("All", "Programming Languages", "Frontend Development", "Backend Development", "Databases & Tools").
* **Interactive Project Showcase**: Project cards with technology tags, status badges, GitHub repository links, and interactive modal dialogs for deep-dive descriptions.
* **Express Backend & Contact API**: Real-time frontend form validation connected to a Node.js + Express backend endpoint (`POST /api/contact`).
* **Accessibility & SEO**: Semantic landmarks, keyboard navigation support, focus-visible indicators, meta descriptions, and OpenGraph headers.

---

## Directory Structure

```text
m:/Portflio_002/
├── public/
│   ├── index.html        # Main HTML structure & semantic landmarks
│   ├── css/
│   │   ├── styles.css     # Custom CSS tokens & animations
│   │   └── tailwind.css   # Output stylesheet for Tailwind utility classes
│   ├── js/
│   │   ├── data.js        # Central data store (Skills, Projects, Services, Bio)
│   │   └── main.js        # Frontend interactions, DOM rendering, API fetch
│   └── assets/
│       └── images/        # Project preview artwork
├── src/
│   └── input.css          # Tailwind source CSS directives
├── server.js              # Node.js + Express backend server & contact API
├── package.json           # Project dependencies & scripts
├── tailwind.config.js     # Custom Tailwind theme tokens
└── README.md              # Project documentation
```

---

## How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Express Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   Open [http://localhost:3000](http://localhost:3000)

---

## Customizing Portfolio Data

### Adding or Updating Skills
Open `public/js/data.js` and add a new object to `skillsData`:
```javascript
{
  name: "Docker",
  category: "Databases & Tools",
  status: "Learning",
  description: "Containerization fundamentals and Dockerfiles"
}
```

### Adding or Updating Projects
Open `public/js/data.js` and add a new object to `projectsData`:
```javascript
{
  id: "my-new-project",
  title: "My New Project",
  category: "Full-Stack",
  status: "Live Project",
  featured: true,
  description: "Short summary of the project.",
  longDescription: "Detailed description of architecture and features.",
  technologies: ["JavaScript", "Express.js", "MongoDB"],
  image: "/assets/images/my-project.png",
  githubUrl: "https://github.com/muawaz/my-new-project",
  liveUrl: "https://myproject.com",
  isPlaceholder: false,
  keyFeatures: [
    "Feature 1 description",
    "Feature 2 description"
  ]
}
```

---

## Connecting Email Delivery for the Contact Form

The Express endpoint `/api/contact` validates messages and tries these delivery methods in order:

1. **Gmail SMTP (Nodemailer)** - used when `SMTP_PASS` is set in `.env`.
2. **FormSubmit fallback** - tried on the server, then retried from the visitor's browser if the server cannot reach it.
3. **Direct email link** - shown in the form if both services fail, so a visitor can still contact you.

### Enable Gmail SMTP (recommended)

1. Turn on 2-Step Verification for the Gmail account.
2. Generate a new 16-character App Password at https://myaccount.google.com/apppasswords.
3. Create a `.env` file in the project root with these values (never commit it):
   ```text
   EMAIL_RECIPIENT=mavizm233@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=mavizm233@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```
4. Restart the server. Check the console for `[SMTP Delivered]` after a test submission.

### Enable the FormSubmit fallback

1. Leave `SMTP_PASS` empty in `.env`.
2. Submit the contact form once from the live site.
3. Open the confirmation email sent to `EMAIL_RECIPIENT` and click the activation link once.
4. Future submissions are forwarded to your inbox automatically.

The form never reports "sent" unless a delivery service accepted the message. Failed deliveries are logged in the server console.

---

## Deploying to Render

1. Push this folder to a GitHub repository. `.env` is ignored by Git, so secrets stay local.
2. In Render, choose **New > Web Service** and connect that repository.
3. Settings:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free (the service sleeps when idle, so the first request may take a few seconds)
4. Under **Environment**, add:
   - `EMAIL_RECIPIENT` = `mavizm233@gmail.com`
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = `mavizm233@gmail.com`
   - `SMTP_PASS` = your 16-character Gmail App Password

   Do not set `PORT`; Render provides it automatically.
5. Click **Create Web Service** and open your `onrender.com` URL when the build finishes.
6. Submit the contact form and check Render Logs for `[SMTP Delivered]`. If SMTP is left unset, submit once and click the FormSubmit confirmation link sent to the recipient inbox.
7. Every future `git push` redeploys the site automatically.
