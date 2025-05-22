import express from "express";

import Attendance from "../models/Attendance.js";
import protect from "../middleware/authMiddleware.js";
import { checkIn, checkOut, history } from "../controllers/attendanceController.js";

const router = express.Router();

// @route   POST /api/attendance/check-in
// @desc    Check-in user
// @access  Private
router.post("/check-in", protect, checkIn);

// @route   POST /api/attendance/check-out
// @desc    Check-out checked-in users
// @access  Private
router.post("/check-out", protect, checkOut);

// @route   POST /api/attendance/check-out
// @desc    Check-out checked-in users
// @access  Private
router.get("/history", protect, history)

export default router;
