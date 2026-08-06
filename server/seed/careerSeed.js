require("dotenv").config();
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}
const mongoose = require("mongoose");

const Career = require("../models/Career");
const Module = require("../models/Module");

const careers = [
  {
    title: "Full Stack Developer",
    slug: "full-stack-developer",
    description:
      "Learn to build complete web applications from frontend interfaces to backend APIs and databases.",
    overview:
      "A practical path covering modern frontend development, backend development, databases, authentication and deployment.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "REST APIs",
    ],
    estimatedDuration: "5-6 months",
  },
  {
    title: "Data Analyst",
    slug: "data-analyst",
    description:
      "Learn how to collect, clean, analyse and visualise data to support meaningful decisions.",
    overview:
      "Build skills in Python, data analysis, visualisation, statistics and reporting.",
    skills: [
      "Python",
      "Pandas",
      "NumPy",
      "SQL",
      "Statistics",
      "Data Visualisation",
    ],
    estimatedDuration: "4-5 months",
  },
  {
    title: "AI Engineer",
    slug: "ai-engineer",
    description:
      "Build a foundation in machine learning, artificial intelligence and intelligent applications.",
    overview:
      "Learn Python, machine learning fundamentals, model development and practical AI applications.",
    skills: [
      "Python",
      "Machine Learning",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "AI Fundamentals",
    ],
    estimatedDuration: "6-8 months",
  },
  {
    title: "UI/UX Designer",
    slug: "ui-ux-designer",
    description:
      "Learn to design intuitive, accessible and visually consistent digital experiences.",
    overview:
      "Develop skills in user research, wireframing, prototyping, visual design and usability.",
    skills: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Visual Design",
      "Figma",
      "Usability",
    ],
    estimatedDuration: "3-4 months",
  },
  {
    title: "Android Developer",
    slug: "android-developer",
    description:
      "Learn to create modern Android applications with structured and maintainable code.",
    overview:
      "Build Android development skills from fundamentals to APIs, storage and application architecture.",
    skills: [
      "Kotlin",
      "Android Studio",
      "UI Development",
      "APIs",
      "Local Storage",
      "App Architecture",
    ],
    estimatedDuration: "4-6 months",
  },
  {
    title: "Cloud Engineer",
    slug: "cloud-engineer",
    description:
      "Learn the fundamentals of cloud infrastructure, deployment, networking and scalable applications.",
    overview:
      "Develop practical cloud skills around infrastructure, deployment, containers and monitoring.",
    skills: [
      "Cloud Fundamentals",
      "Linux",
      "Networking",
      "Docker",
      "Deployment",
      "Cloud Services",
    ],
    estimatedDuration: "5-6 months",
  },
];

const modulesByCareer = {
  "full-stack-developer": [
    ["Web Development Fundamentals", "Build a strong foundation in HTML, CSS and JavaScript."],
    ["Frontend Development", "Learn React and build responsive interactive interfaces."],
    ["Backend Development", "Build REST APIs using Node.js and Express."],
    ["Database and Authentication", "Work with MongoDB, authentication and secure application data."],
  ],

  "data-analyst": [
    ["Python for Data Analysis", "Learn Python fundamentals and data-handling techniques."],
    ["Data Cleaning", "Clean, transform and prepare real-world datasets."],
    ["SQL and Statistics", "Query data and understand essential statistical concepts."],
    ["Data Visualisation", "Create meaningful charts, dashboards and reports."],
  ],

  "ai-engineer": [
    ["Python and AI Foundations", "Build the programming foundation required for AI development."],
    ["Data Preparation", "Prepare datasets for machine learning workflows."],
    ["Machine Learning", "Learn supervised and unsupervised machine learning concepts."],
    ["AI Applications", "Apply models to practical intelligent applications."],
  ],

  "ui-ux-designer": [
    ["Design Fundamentals", "Learn visual hierarchy, typography, spacing and colour principles."],
    ["User Research", "Understand users, problems and product requirements."],
    ["Wireframes and Prototypes", "Turn ideas into structured interactive designs."],
    ["Usability and Design Systems", "Improve usability and maintain consistent interfaces."],
  ],

  "android-developer": [
    ["Kotlin Fundamentals", "Learn Kotlin programming concepts required for Android development."],
    ["Android UI Development", "Create Android interfaces and handle user interaction."],
    ["Data and APIs", "Connect applications to APIs and manage local application data."],
    ["Application Architecture", "Build maintainable Android applications using structured architecture."],
  ],

  "cloud-engineer": [
    ["Cloud Fundamentals", "Understand cloud computing, services and deployment models."],
    ["Linux and Networking", "Develop the system and networking foundation needed for cloud work."],
    ["Containers and Deployment", "Learn Docker and application deployment workflows."],
    ["Cloud Infrastructure", "Understand scalable infrastructure, monitoring and basic automation."],
  ],
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected for seeding.");

    await Career.deleteMany({});
    await Module.deleteMany({});

    const createdCareers = await Career.insertMany(careers);

    const modules = [];

    createdCareers.forEach((career) => {
      const careerModules = modulesByCareer[career.slug];

      careerModules.forEach((module, index) => {
        modules.push({
          career: career._id,
          title: module[0],
          description: module[1],
          order: index + 1,
          estimatedHours: 20,
        });
      });
    });

    await Module.insertMany(modules);

    console.log(`Created ${createdCareers.length} careers.`);
    console.log(`Created ${modules.length} modules.`);
    console.log("Career data seeded successfully.");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();