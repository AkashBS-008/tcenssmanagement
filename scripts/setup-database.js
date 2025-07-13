// MongoDB Database Setup Script
// Run this script to create initial database structure

const mongoose = require("mongoose")

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/tce-nss-attendance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on("error", console.error.bind(console, "Connection error:"))
db.once("open", async () => {
  console.log("Connected to MongoDB")

  try {
    // Create collections if they don't exist
    await db.createCollection("volunteers")
    await db.createCollection("attendances")

    console.log("Database collections created successfully")

    // Create indexes for better performance
    await db.collection("volunteers").createIndex({ rollNumber: 1 }, { unique: true })
    await db.collection("volunteers").createIndex({ registerNumber: 1 }, { unique: true })
    await db.collection("attendances").createIndex({ volunteerId: 1, date: 1 }, { unique: true })

    console.log("Database indexes created successfully")

    // Insert sample data (optional)
    const sampleVolunteers = [
      {
        name: "akash",
        rollNumber: "21CS001",
        registerNumber: "REG001",
        createdAt: new Date(),
      },
      {
        name: "guru",
        rollNumber: "21CS002",
        registerNumber: "REG002",
        createdAt: new Date(),
      },
    ]

    await db.collection("volunteers").insertMany(sampleVolunteers)
    console.log("Sample volunteers added successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
  } finally {
    mongoose.connection.close()
    console.log("Database connection closed")
  }
})
