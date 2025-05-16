import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
    {
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        checkInTime: {
            type: Date,
            default: Date.now
        },
        location: {
            type: {
                lat: {type: Number},
                lng: {type: Number}
            },
            required: true,
            _id: false
        },
        status: {
            type: String,
            default: "Checked-In"
        },
    },
    {
        timestamps: true,
    }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;