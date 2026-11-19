/* ============================================================
   KHALED — PORTFOLIO CONTENT
   ------------------------------------------------------------
   This is the only file you need to edit for most changes.
   Everything below is plain text / arrays. No build step.
   ============================================================ */

window.SITE = {
  person: {
    name: "Khaled",
    role: "Full-Stack & Web Developer",
    email: "khaled2isnoop@gmail.com",
    // Digits only, with country code, e.g. "971501234567". Leave empty to
    // hide the WhatsApp actions until you are ready to publish the number.
    whatsapp: "201147080934",
    location: "Egypt — remote",
    availability: "Open for new projects",
    // Used for the footer clock. Any IANA timezone works, e.g. "Europe/London".
    timezone: "Africa/Cairo",
  },

  contact: {
    // Optional JSON endpoint (Formspree, a serverless function, your own API).
    // Leave empty for Netlify Forms on a Netlify deploy, with a local preview
    // inbox at dashboard.html while developing.
    endpoint: "",
    storageKey: "portfolio-inbox",
    // Production inbox for Netlify Forms (shown on dashboard.html when deployed).
    inboxUrl: "https://app.netlify.com/projects/khaled-alaa-portfolio/forms",
    projectTypes: [
      "Full-stack application",
      "Website / WordPress",
      "WooCommerce store",
      "Maintenance / fixes",
      "Something else",
    ],
    budgets: ["Under $2k", "$2k – $5k", "$5k – $10k", "$10k+", "Let's talk"],
  },

  hero: {
    eyebrow: "Portfolio — 2026",
    lead:
      "I build, customize, and maintain practical web experiences with React, Node.js, Express, MongoDB, WordPress, and WooCommerce.",
    marquee: [
      "Full-stack JavaScript",
      "React interfaces",
      "Node.js & Express",
      "WordPress & WooCommerce",
      "Deployment & maintenance",
    ],
  },

  socials: [
    {
      label: "GitHub",
      handle: "@khaled24682",
      href: "https://github.com/khaled24682",
    },
    {
      label: "LinkedIn",
      handle: "/in/khaled-alaa-932664316",
      href: "https://www.linkedin.com/in/khaled-alaa-932664316/",
    },
  ],

  about: {
    statement:
      "I build and maintain modern websites and web applications — React front ends, Node.js back ends, and WordPress or WooCommerce sites.",
    body:
      "I enjoy solving real website problems, from implementing application features to tracking down issues that affect performance, usability, or reliability. I have worked with JavaScript-based full-stack applications as well as WordPress sites, adapting to different project requirements and existing codebases. Alongside development, I have gained experience with deployment workflows, VPS environments, website migrations, caching, domain configuration, and third-party integrations. I value clear communication, practical solutions, and building websites that are useful and maintainable.",
    now: [
      "Building React and Node.js applications",
      "Customizing WordPress and WooCommerce sites",
      "Handling deployment, DNS, SSL, and performance fixes",
    ],
  },

  // There are no verified numeric claims in the source profile, so these are
  // honest focus areas rather than invented counters. Numeric values still
  // animate, in case you want to add real numbers later.
  stats: [
    { value: "Full-stack", label: "React · Node.js · Express · MongoDB" },
    { value: "WordPress", label: "Themes, plugins & WooCommerce" },
    { value: "Operations", label: "Deployment, DNS, SSL & performance" },
  ],

  projects: [
    {
      id: "body-trip",
      index: "01",
      title: "Body Trip",
      subtitle: "Online course platform",
      type: "Full-stack",
      role: "Developer",
      stack: ["Node.js", "Express.js", "EJS", "MongoDB"],
      summary:
        "Body Trip (رحلة الجسد) is a server-rendered course platform with a structured online course, time-limited learner access, and a video lesson library.",
      challenge:
        "The platform needed to deliver a structured course, manage time-limited access for learners, and serve a video lesson library from a server-rendered Node.js stack.",
      approach:
        "Worked with the existing Express and EJS application and its MongoDB data, with attention to the course-access experience and the production deployment workflow on a VPS using PM2.",
      scope: "Course-access experience and production deployment workflow.",
      context:
        "Worked within an existing server-rendered platform and its production VPS/PM2 setup.",
      accent: "#c6ff3d",
      art: 1,
      artTag: "NODE / EJS",
    },
    {
      id: "corporatefix",
      index: "02",
      title: "CorporateFix.net",
      subtitle: "Corporate website & blog",
      type: "Front-end",
      role: "Front-end developer",
      stack: ["React", "CSS", "RTL"],
      summary:
        "A React-based corporate website with a blog, refined for Arabic right-to-left presentation.",
      challenge:
        "The React site needed its blog and testimonial content to present cleanly within an Arabic RTL layout and an established brand palette.",
      approach:
        "Worked on the React-based website and its blog area, addressed responsive presentation for testimonial content, and worked within the existing RTL visual context and brand palette.",
      scope: "Blog presentation and responsive UI refinements.",
      context:
        "Contributed within an existing React codebase and an established Arabic brand system.",
      accent: "#8b7bff",
      art: 2,
      artTag: "REACT / RTL",
    },
    {
      id: "sina-plus",
      index: "03",
      title: "sina-plus.com",
      subtitle: "WordPress website",
      type: "WordPress",
      role: "WordPress developer",
      stack: ["WordPress", "Elementor", "ACF Pro", "LiteSpeed Cache"],
      summary:
        "Troubleshooting and maintenance for a WordPress site built with Elementor and ACF Pro.",
      challenge:
        "The WordPress/Elementor site needed front-end troubleshooting around ACF Pro content, layout behavior, and cache-related styling.",
      approach:
        "Investigated ACF Pro content and layout behavior, worked with LiteSpeed Cache and CSS regeneration, and handled troubleshooting and maintenance in the WordPress/Elementor environment.",
      scope: "Front-end presentation and cache-related styling fixes.",
      context:
        "Maintenance and troubleshooting within an existing WordPress/Elementor site.",
      accent: "#5ad1ff",
      art: 3,
      artTag: "WORDPRESS / ACF",
    },
    {
      id: "nqatplus",
      index: "04",
      title: "nqatplus.sa",
      subtitle: "WooCommerce handover & maintenance",
      type: "WooCommerce",
      role: "Maintenance developer",
      stack: ["WordPress", "WooCommerce", "Cloudways", "DNS", "SSL"],
      summary:
        "Technical handover and maintenance planning for an existing Arabic WooCommerce storefront.",
      challenge:
        "An existing Arabic WooCommerce store needed a new development and maintenance workflow covering hosting, backups, DNS, themes, plugins, payments, shipping, and custom code.",
      approach:
        "Reviewed the handover requirements for WordPress administration, hosting, backups, DNS, themes, plugins, payment and shipping integrations, and custom code. Worked with Cloudways hosting, domain/DNS configuration, and SSL setup.",
      scope: "Technical handover and maintenance planning.",
      context:
        "Handover and maintenance context — not the original store design or build.",
      accent: "#ff7a59",
      art: 4,
      artTag: "WOOCOMMERCE / OPS",
    },
  ],

  capabilities: [
    {
      icon: "code",
      title: "Interface Engineering",
      body:
        "Production React and TypeScript with an eye on the last 10%: accessible semantics, resilient states, and interfaces that stay fast under real data.",
      tags: ["React", "TypeScript", "Next.js", "Tailwind"],
    },
    {
      icon: "server",
      title: "Backend & Infrastructure",
      body:
        "APIs and data models that hold up. Realtime services, caching, queues, and CI/CD pipelines designed for teams, not demos.",
      tags: ["Node.js", "PostgreSQL", "Redis", "AWS"],
    },
    {
      icon: "spark",
      title: "Creative Development",
      body:
        "WebGL, shaders, and motion systems that serve the product instead of distracting from it. Scroll-driven stories with a performance budget.",
      tags: ["Three.js", "GLSL", "GSAP", "Canvas"],
    },
    {
      icon: "compass",
      title: "Product & Systems",
      body:
        "Comfortable in the ambiguous middle: discovery, architecture, design partnership, and the unglamorous work of shipping on time.",
      tags: ["Architecture", "DX", "A11y", "Analytics"],
    },
  ],

  // Drawn from the services section of the profile. There were no verifiable
  // employers or dates in the source, so this replaces the old timeline.
  services: [
    {
      period: "01",
      role: "Full-stack development",
      company: "React · Node.js · Express · MongoDB",
      location: "",
      summary:
        "React interfaces, Node.js and Express backends, and MongoDB-backed web applications.",
      tags: ["React", "Node.js", "Express", "MongoDB"],
    },
    {
      period: "02",
      role: "WordPress & WooCommerce",
      company: "Customization, maintenance & support",
      location: "",
      summary:
        "WordPress customization and maintenance, WooCommerce store setup support and administration, responsive fixes, and front-end troubleshooting.",
      tags: ["WordPress", "WooCommerce", "Elementor", "ACF Pro"],
    },
    {
      period: "03",
      role: "Deployment & operations",
      company: "VPS, hosting, DNS & SSL",
      location: "",
      summary:
        "Website deployment and basic VPS/application operations, including Cloudways, Hostinger, PM2, domains, DNS, SSL, and backups.",
      tags: ["Cloudways", "Hostinger", "PM2", "DNS", "SSL"],
    },
    {
      period: "04",
      role: "Analytics & integrations",
      company: "Tracking, pixels & payment gateways",
      location: "",
      summary:
        "Analytics and tracking implementation support with Google Tag Manager and Meta Pixel, plus payment gateway configuration and webhook troubleshooting.",
      tags: ["GTM", "GA4", "Meta Pixel", "Moyasar"],
    },
  ],

  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Three.js",
    "WebGL",
    "GLSL",
    "GSAP",
    "PostgreSQL",
    "Redis",
    "Prisma",
    "Tailwind",
    "Figma",
    "Docker",
    "AWS",
    "Vercel",
    "Vitest",
    "Playwright",
    "Framer Motion",
    "Python",
  ],
};
