const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const careerRoutes = require("./routes/careerRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
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
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;