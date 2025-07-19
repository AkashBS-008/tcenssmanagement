"use client"

import { useState, useEffect } from "react"
import { saveAttendance, downloadAttendanceReport } from "../services/api"
import { toast } from "react-toastify"

const AttendanceMarking = ({ volunteers }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Initialize attendance state
    const initialAttendance = {}
    volunteers.forEach((volunteer) => {
      initialAttendance[volunteer._id] = "Present" // Default to Present
    })
    setAttendance(initialAttendance)
  }, [volunteers])

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAttendanceChange = (volunteerId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [volunteerId]: status,
    }))
  }

  const handleSaveAttendance = async () => {
    try {
      setLoading(true)

      const attendanceData = volunteers.map((volunteer) => ({
        volunteerId: volunteer._id,
        volunteerName: volunteer.name,
        rollNumber: volunteer.rollNumber,
        status: attendance[volunteer._id] || "Present",
      }))

      await saveAttendance(attendanceData, selectedDate)
      toast.success("Attendance saved successfully!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save attendance")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    try {
      setLoading(true)
      const blob = await downloadAttendanceReport(selectedDate)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `attendance-${selectedDate}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Report downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download report")
    } finally {
      setLoading(false)
    }
  }

  const presentCount = Object.values(attendance).filter((status) => status === "Present").length
  const absentCount = Object.values(attendance).filter((status) => status === "Absent").length

  return (
    <div className="card">
      <h2> Mark Attendance</h2>

      <div className="date-selector">
        <label htmlFor="date"> Select Date:</label>
        <input type="date" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      <div className="search-box">
        <span className="search-icon"></span>
        <input
          type="text"
          placeholder="Search volunteers by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="volunteer-list">
        {filteredVolunteers.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#718096" }}>
            {volunteers.length === 0
              ? "No volunteers found. Please add volunteers first."
              : "No volunteers match your search."}
          </div>
        ) : (
          filteredVolunteers.map((volunteer) => (
            <div key={volunteer._id} className="volunteer-item">
              <div className="volunteer-info">
                <h4>{volunteer.name}</h4>
                <p>
                  Roll: {volunteer.rollNumber} | Reg: {volunteer.registerNumber}
                </p>
              </div>
              <div className="attendance-controls">
                <button
                  className={`attendance-btn present ${attendance[volunteer._id] === "Present" ? "active" : ""}`}
                  onClick={() => handleAttendanceChange(volunteer._id, "Present")}
                >
                   Present
                </button>
                <button
                  className={`attendance-btn absent ${attendance[volunteer._id] === "Absent" ? "active" : ""}`}
                  onClick={() => handleAttendanceChange(volunteer._id, "Absent")}
                >
                   Absent
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {volunteers.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              margin: "1rem 0",
              padding: "1rem",
              background: "#f7fafc",
              borderRadius: "10px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#48bb78" }}>{presentCount}</div>
              <div style={{ color: "#4a5568" }}>Present</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f56565" }}>{absentCount}</div>
              <div style={{ color: "#4a5568" }}>Absent</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#667eea" }}>{volunteers.length}</div>
              <div style={{ color: "#4a5568" }}>Total</div>
            </div>
          </div>

          <div className="actions-bar">
            <button className="btn btn-success" onClick={handleSaveAttendance} disabled={loading}>
              {loading ? " Saving..." : " Save Attendance"}
            </button>
            <button className="btn btn-primary" onClick={handleDownloadReport} disabled={loading}>
              {loading ? " Downloading..." : " Download Report"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default AttendanceMarking
