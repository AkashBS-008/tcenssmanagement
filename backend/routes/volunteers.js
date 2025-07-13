const express = require("express")
const router = express.Router()
const Volunteer = require("../models/Volunteer")

// Get all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ name: 1 })
    res.json(volunteers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add new volunteer
router.post("/", async (req, res) => {
  try {
    const { name, rollNumber, registerNumber } = req.body

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({
      $or: [{ rollNumber }, { registerNumber }],
    })

    if (existingVolunteer) {
      return res.status(400).json({
        message: "Volunteer with this roll number or register number already exists",
      })
    }

    const volunteer = new Volunteer({
      name,
      rollNumber,
      registerNumber,
    })

    const savedVolunteer = await volunteer.save()
    res.status(201).json(savedVolunteer)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Search volunteer by register number
router.get("/search/:registerNumber", async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({
      registerNumber: req.params.registerNumber,
    })

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" })
    }

    res.json(volunteer)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete volunteer
router.delete("/:id", async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id)

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" })
    }

    res.json({ message: "Volunteer deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
