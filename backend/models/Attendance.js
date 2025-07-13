const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer",
    required: true,
  },
  volunteerName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index to prevent duplicate attendance for same volunteer on same date
attendanceSchema.index({ volunteerId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model("Attendance", attendanceSchema)
