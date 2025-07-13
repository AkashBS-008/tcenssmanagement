const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()
const path = require("path");

const volunteerRoutes = require("./routes/volunteers")
const attendanceRoutes = require("./routes/attendance")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tce-nss-attendance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/volunteers", volunteerRoutes)
app.use("/api/attendance", attendanceRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "TCE NSS Backend is running!" })
})
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
