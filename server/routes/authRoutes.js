import express from "express";
import { login, adminLogin } from "../controllers/authController.js";

const router = express.Router();

// ===========================
// STUDENT AUTHENTICATION
// ===========================
router.post("/student/login", login);

// ===========================
// ADMIN AUTHENTICATION
// ===========================
router.post("/admin/login", adminLogin);

export default router;