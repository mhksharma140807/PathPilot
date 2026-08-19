const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const careerRoutes = require("./routes/careerRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const curriculumRoutes = require("./routes/curriculumRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const phaseRoutes = require("./routes/phaseRoutes");
const curriculumRequirementRoutes = require("./routes/curriculumRequirementRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminCareerRoutes = require("./routes/adminCareerRoutes");
const adminPhaseRoutes = require("./routes/adminPhaseRoutes");
const adminModuleRoutes = require("./routes/adminModuleRoutes");
const adminCurriculumRequirementRoutes = require("./routes/adminCurriculumRequirementRoutes");

const app = express();

console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
const allowedOrigins = [
  "http://localhost:5173",
  "https://path-pilot-dun.vercel.app",
  "https://pathpilot-chi.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "PathPilot Backend Running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress/curriculum", curriculumRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/phases", phaseRoutes);
app.use("/api/curriculum-requirements", curriculumRequirementRoutes);
app.use("/api/admin/careers", adminCareerRoutes);
app.use("/api/admin/phases", adminPhaseRoutes);
app.use("/api/admin/modules", adminModuleRoutes);
app.use(
  "/api/admin/curriculum-requirements",
  adminCurriculumRequirementRoutes
);
app.use("/api/admin", adminRoutes);

module.exports = app;