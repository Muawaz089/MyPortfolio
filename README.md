# Muawaz Habib — Personal Portfolio Website

A production-quality personal portfolio website designed and built for **Muawaz Habib**, Computer Science Student & Aspiring Web Developer.

Built with **HTML5, CSS3, Tailwind CSS, Vanilla JavaScript, Node.js, and Express.js**.

---

## 🚀 Key Features

* **Hero Section & Animated Name**: Features a responsive design with periodic smooth text fade, blur, and scale animation for **Muawaz Habib**. Respects `prefers-reduced-motion` settings.
* **Sticky Navigation Bar**: Smooth scroll to all sections (`Home`, `About`, `Services`, `Skills`, `Projects`, `Contact`), active section indicator via `IntersectionObserver`, and mobile hamburger drawer.
* **Data-Driven Architecture**: All skills, projects, services, and bio details are stored in `public/js/data.js`. Adding new items does not require editing markup or CSS.
* **Dynamic Skill Filtering**: Skills grid with filter tabs ("All", "Programming Languages", "Frontend Development", "Backend Development", "Databases & Tools").
* **Interactive Project Showcase**: Project cards with technology tags, status badges, GitHub repository links, and interactive modal dialogs for deep-dive descriptions.
* **Express Backend & Contact API**: Real-time frontend form validation connected to a Node.js + Express backend endpoint (`POST /api/contact`).
* **Accessibility & SEO**: Semantic landmarks, keyboard navigation support, focus-visible indicators, meta descriptions, and OpenGraph headers.

---

## 📁 Directory Structure

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
├── .env.example           # Environment variables template
└── README.md              # Project documentation
```

---

## 🛠️ How to Run Locally

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

## 📝 Customizing Portfolio Data

### Adding or Updating Skills
Open `public/js/data.js` and add a new object to `skillsData`:
```javascript
{
  name: "Docker",
  category: "Databases & Tools",
  icon: "🐳",
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

## 📧 Connecting Real Email Dispatch for Contact Form

The Express backend endpoint `/api/contact` in `server.js` validates inputs and accepts messages.

To connect actual email sending (via Nodemailer or SendGrid):
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your SMTP host, port, user, and password credentials in `.env`.
3. Install Nodemailer (`npm install nodemailer`) and configure `transporter.sendMail(...)` in `server.js`.
