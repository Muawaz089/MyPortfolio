// Central data store. Edit this file to change content; no markup changes needed.
window.SITE = {
  bio: "I'm a Computer Science student. I build landing pages and fix broken websites. Low rates, clean work, professional results.",
  facts: [
    ["Studying", "Computer Science"],
    ["Focus", "Web Development"],
    ["Email", "mavizm233@gmail.com"]
  ],

  services: [
    {
      id: "landing",
      type: "Web",
      icon: "WEB",
      title: "Landing Page Design",
      summary: "Fast, good-looking landing pages that convert visitors into customers.",
      bullets: ["Fully responsive design", "Hero, features and contact sections", "Free revisions included"]
    },
    {
      id: "debug",
      type: "Web",
      icon: "FIX",
      title: "Website Debugging",
      summary: "Find and fix layout breaks, mobile issues and JavaScript bugs quickly.",
      bullets: ["CSS and layout bug fixes", "Mobile and cross-browser repairs", "Clear explanation of every fix"]
    }
  ],

  skills: [
    { name: "JavaScript", category: "Programming Languages" },
    { name: "Python", category: "Programming Languages" },
    { name: "HTML5 and CSS3", category: "Frontend Development" },
    { name: "Tailwind CSS", category: "Frontend Development" },
    { name: "Node.js and Express", category: "Backend Development" },
    { name: "REST APIs", category: "Backend Development" },
    { name: "SQL", category: "Databases and Tools" },
    { name: "Git and GitHub", category: "Databases and Tools" }
  ],

  projects: [
    {
      id: "saffron", title: "Saffron Stone Restaurant", status: "Live",
      type: "Landing Page",
      technologies: ["HTML", "CSS", "JavaScript"],
      description: "A warm, elegant restaurant landing page with menu highlights and reservation flow.",
      longDescription: "A fully responsive restaurant website featuring an inviting hero section, menu highlights, and a smooth contact and reservation section. Built with clean HTML, CSS and JavaScript.",
      keyFeatures: ["Responsive mobile-first design", "Menu showcase section", "Reservation and contact flow"],
      modelUrl: "", githubUrl: "", liveUrl: "https://muawaz089.github.io/Saffron-Stone-Restaurant-Website/"
    },
    {
      id: "northstar", title: "Northstar Digital Agency", status: "Live",
      type: "Landing Page",
      technologies: ["HTML", "CSS", "JavaScript"],
      description: "A sleek digital agency landing page built to attract and convert clients.",
      longDescription: "A modern digital agency landing page with bold typography, service highlights, team section and a call-to-action focused layout. Fully responsive across all screen sizes.",
      keyFeatures: ["Bold agency-style layout", "Services and team sections", "Conversion-focused CTA design"],
      modelUrl: "", githubUrl: "", liveUrl: "https://muawaz089.github.io/Northstar-Digital-Digital-Agency-Landing-Page/"
    },
    {
      id: "tindog", title: "TinDog", status: "Live",
      type: "Landing Page",
      technologies: ["HTML", "CSS", "Bootstrap"],
      description: "A fun Tinder-style landing page for dogs, built with Bootstrap.",
      longDescription: "TinDog is a playful Bootstrap landing page inspired by Tinder but for dogs. Features a bold hero, pricing cards, testimonials and a responsive layout.",
      keyFeatures: ["Bootstrap responsive layout", "Pricing and testimonials sections", "Fun, eye-catching design"],
      modelUrl: "", githubUrl: "", liveUrl: "https://muawaz089.github.io/TinDog/"
    },
    {
      id: "furniture", title: "Furniture Store", status: "In progress",
      type: "Full Stack",
      technologies: ["Node.js", "Express", "Tailwind CSS", "model-viewer"],
      description: "A furniture store where you can view products in 3D and place them in your room with AR.",
      longDescription: "Furniture Store is a full-stack store with a product showcase, cart and checkout. Each product opens in an interactive 3D viewer, and on phones the AR button places the item in your space. This project is still being built.",
      keyFeatures: ["Interactive 3D product viewer", "AR placement on supported phones", "Product catalog, cart and wishlist"],
      modelUrl: "",
      githubUrl: "", liveUrl: ""
    },
    {
      id: "customer-data", title: "Customer Data Cleanup", status: "Completed",
      type: "Excel",
      technologies: ["Microsoft Excel", "Data Cleaning"],
      description: "A messy customer list turned into a clean, consistent spreadsheet ready to use.",
      longDescription: "This workbook takes raw customer records and standardizes them across three sheets: Raw Data, Cleaned Data and Cleaning Notes. Duplicates were removed, emails were trimmed and lowercased, names and cities were consistently capitalized, and phone numbers were given one display format. A short summary sheet records every cleaning decision so the work is easy to review.",
      keyFeatures: ["Duplicate removal and normalized emails", "Consistent names, cities and phone formats", "Cleaning notes and summary sheet"],
      modelUrl: "", githubUrl: "", liveUrl: ""
    }
  ]
};
