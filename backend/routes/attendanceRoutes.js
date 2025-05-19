import express from "express";

import Attendance from "../models/Attendance.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/attendance/check-in
// @desc    Check-in user
// @access  Private
router.post("/check-in", protect, async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ message: "Missing lat and lng co-ordinates" });
  }

  try {
    const attendance = new Attendance({
      userId: req.user.id,
      location: { lat, lng },
    });

    await attendance.save();

    res.status(201).json({ message: "Checked-In", attendance });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

// @route   POST /api/attendance/check-out
// @desc    Check-out checked-in users
// @access  Private
router.post("/check-out", protect, async (req, res) => {
  try {
    const latestAttendance = await Attendance.findOne({
      userId: req.user.id,
      checkOutTime: null,
    }).sort({ createdAt: -1 });

    if (!latestAttendance) {
      res.status(404).json("No active check-in found");
    }

    latestAttendance.checkOutTime = new Date();
    latestAttendance.status = "Checked-out";
    await latestAttendance.save();

    res.status(201).json({message: "Checked-Out", latestAttendance})
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
