import express from 'express'

import Attendance from '../models/Attendance.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/check-in", protect, async(req, res) => {
    const {lat, lng} = req.body;

    if (!lat || !lng) {
        return res.status(400).json({message: "Missing lat and lng co-ordinates"});
    }

    try {
        const attendance = new Attendance({
            userId: req.user.id,
            location: {lat, lng},
        });

        await attendance.save()

        res.status(201).json({message: "Checked-In", attendance});
    } catch (err) {
        res.status(500).json({message: "Server Error", error: err});
    }
});

export default router;