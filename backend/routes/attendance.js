const express = require("express")
const router = express.Router()
const ExcelJS = require("exceljs")
const Attendance = require("../models/Attendance")
const Volunteer = require("../models/Volunteer")

// Save attendance for multiple volunteers
router.post("/", async (req, res) => {
  try {
    const { attendanceData, date } = req.body
    const attendanceDate = new Date(date)

    // Delete existing attendance for the date
    await Attendance.deleteMany({ date: attendanceDate })

    // Create new attendance records
    const attendanceRecords = attendanceData.map((record) => ({
      volunteerId: record.volunteerId,
      volunteerName: record.volunteerName,
      rollNumber: record.rollNumber,
      status: record.status,
      date: attendanceDate,
    }))

    const savedRecords = await Attendance.insertMany(attendanceRecords)
    res.status(201).json({
      message: "Attendance saved successfully",
      count: savedRecords.length,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get attendance for a specific date
router.get("/:date", async (req, res) => {
  try {
    const date = new Date(req.params.date)
    const attendance = await Attendance.find({ date }).sort({ volunteerName: 1 })
    res.json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Download attendance report as CSV
router.get("/report/:date", async (req, res) => {
  try {
    const date = new Date(req.params.date)
    const attendance = await Attendance.find({ date }).sort({ volunteerName: 1 })

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Attendance Report")

    // Add headers
    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Roll Number", key: "rollNumber", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Date", key: "date", width: 15 },
    ]

    // Add data
    attendance.forEach((record, index) => {
      worksheet.addRow({
        sno: index + 1,
        name: record.volunteerName,
        rollNumber: record.rollNumber,
        status: record.status,
        date: date.toDateString(),
      })
    })

    // Style the header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }

    // Set response headers
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", `attachment; filename=attendance-${date.toISOString().split("T")[0]}.xlsx`)

    // Write to response
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
