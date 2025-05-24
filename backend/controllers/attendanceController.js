import Attendance from "../models/Attendance.js";

export const getTodayAttendance = async (req, res) => {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0,0,0,0)

    const endOfDay = new Date()
    endOfDay.setHours(23,59,59,999)

    const today = Attendance.find({
      userId: req.user.id,
      checkInTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },

    }).sort({createdAt: -1});

    if(!today){
      return res
        .status(400)
        .json({ message: "No attendance record found for today" });
    }

    res.status(201).json(today);
  } catch (error) {
     res.status(500).json({ message: "Server Error", error: err });
  }
}

// POST /check-in
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

// POST /check-out
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

// GET /history
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
