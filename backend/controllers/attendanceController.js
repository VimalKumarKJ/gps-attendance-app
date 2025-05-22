import Attendance from "../models/Attendance.js";

export const checkIn = async (req, res) => {
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
};

export const checkOut = async (req, res) => {
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

    res.status(201).json({ message: "Checked-Out", latestAttendance });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const history = async (req, res) => {
  try {
    const query = { userId: req.user.id };
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    const history = await Attendance.find(query).sort({ createdAt: -1 });
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
