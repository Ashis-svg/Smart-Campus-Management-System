import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./config/db.js";

// =========================
// Routes
// =========================
import authRoutes           from "./routes/authRoutes.js";
import registerRoutes       from "./routes/registerRoutes.js";

// Student
import messRoutes           from "./routes/messRoutes.js";
import complaintRoutes      from "./routes/complaintRoutes.js";
import academicsRoutes      from "./routes/academicsRoutes.js";

// Admin
import adminMessRoutes      from "./routes/adminMessRoutes.js";
import adminComplaintRoutes from "./routes/adminComplaintRoutes.js";
import adminAcademicsRoutes from "./routes/adminAcademicsRoutes.js";

// Shared
import opinionRoutes        from "./routes/opinionRoutes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

// =========================
// Middlewares
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Home
// =========================
app.get("/", (req, res) => {
  res.send("Campus Media Backend Running...");
});

// =========================
// Authentication
// =========================
app.use("/", authRoutes);
app.use("/", registerRoutes); // exposes /student/register and /admin/register

// =========================
// Student Routes
// =========================
app.use("/student/mess",      messRoutes);
app.use("/student/complaint", complaintRoutes);
app.use("/student/academics", academicsRoutes);

// =========================
// Admin Routes
// =========================
app.use("/admin/mess",        adminMessRoutes);
app.use("/admin/complaint",   adminComplaintRoutes);
app.use("/admin/academics",   adminAcademicsRoutes);

// =========================
// Shared Routes
// =========================
app.use("/opinion", opinionRoutes); // used by both students and admins

// =========================
// 404
// =========================
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

// =========================
// Start Server
// =========================
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));