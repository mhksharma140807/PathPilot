export const careerProjects = {
  "full-stack-developer": {
    title: "Career Progress Tracker App",
    description: "Build a full-stack MERN application that allows students to track learning modules, record progress metrics, and view real-time analytics.",
    skills: ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
  },
  "data-analyst": {
    title: "Interactive Data Analytics Dashboard",
    description: "Analyze complex datasets using Python and SQL, then create interactive visualization charts to present actionable business insights.",
    skills: ["Python", "Pandas", "SQL", "Data Visualization", "Statistics"],
  },
  "ai-engineer": {
    title: "AI-Powered Recommendation Engine",
    description: "Train a machine learning model to provide tailored career recommendations and content suggestions based on user skill profiles.",
    skills: ["Python", "Machine Learning", "Scikit-Learn", "NumPy", "APIs"],
  },
  "ui-ux-designer": {
    title: "Career Learning Dashboard Prototype",
    description: "Design a high-fidelity, accessible EdTech dashboard in Figma complete with design systems, user flows, and interactive prototypes.",
    skills: ["Figma", "UX Research", "Wireframing", "Prototyping", "Design Systems"],
  },
  "android-developer": {
    title: "Personal Learning Tracker App",
    description: "Develop a native Android mobile application in Kotlin to help students organize daily study tasks, set goals, and monitor module progress.",
    skills: ["Android Studio", "Kotlin", "UI Development", "Local Storage", "REST APIs"],
  },
  "cloud-engineer": {
    title: "Cloud Infrastructure & Monitoring System",
    description: "Deploy microservices onto cloud infrastructure with automated monitoring pipelines, load balancing, and containerized deployments.",
    skills: ["Cloud Infrastructure", "Docker", "Monitoring", "CI/CD", "REST APIs"],
  },
};

export const getRecommendedProject = (career) => {
  if (!career) return null;

  const slug = career.slug || (career.title ? career.title.toLowerCase().replace(/\s+/g, "-") : "");
  
  if (careerProjects[slug]) {
    return careerProjects[slug];
  }

  // Fallback match by keywords
  const titleLower = (career.title || "").toLowerCase();
  if (titleLower.includes("full stack") || titleLower.includes("web")) return careerProjects["full-stack-developer"];
  if (titleLower.includes("data")) return careerProjects["data-analyst"];
  if (titleLower.includes("ai") || titleLower.includes("machine")) return careerProjects["ai-engineer"];
  if (titleLower.includes("ui") || titleLower.includes("ux") || titleLower.includes("design")) return careerProjects["ui-ux-designer"];
  if (titleLower.includes("android") || titleLower.includes("mobile")) return careerProjects["android-developer"];
  if (titleLower.includes("cloud") || titleLower.includes("devops")) return careerProjects["cloud-engineer"];

  return {
    title: `${career.title || "Career"} Showcase Project`,
    description: `Build a comprehensive portfolio project demonstrating mastery across core ${career.title || "career"} skills.`,
    skills: career.skills || ["Domain Mastery", "Portfolio Deliverable"],
  };
};
