"use client"

import { useState } from "react"
import { searchVolunteerByRegisterNumber, deleteVolunteer } from "../services/api"
import { toast } from "react-toastify"

const RemoveVolunteer = ({ onVolunteerRemoved }) => {
  const [registerNumber, setRegisterNumber] = useState("")
  const [volunteer, setVolunteer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    if (!registerNumber.trim()) {
      toast.error("Please enter a register number")
      return
    }

    try {
      setSearching(true)
      const foundVolunteer = await searchVolunteerByRegisterNumber(registerNumber.trim())
      setVolunteer(foundVolunteer)
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Volunteer not found with this register number")
      } else {
        toast.error("Failed to search volunteer")
      }
      setVolunteer(null)
    } finally {
      setSearching(false)
    }
  }

  const handleDelete = async () => {
    if (!volunteer) return

    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${volunteer.name} (${volunteer.rollNumber})? This action cannot be undone.`,
    )

    if (!confirmDelete) return

    try {
      setLoading(true)
      await deleteVolunteer(volunteer._id)
      setVolunteer(null)
      setRegisterNumber("")
      onVolunteerRemoved()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove volunteer")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="card">
      <h2> Remove Volunteer</h2>

      <div className="form-group">
        <label htmlFor="registerNumber">Register Number</label>
        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            type="text"
            id="registerNumber"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter register number to search"
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={handleSearch} disabled={searching}>
            {searching ? " Searching..." : " Search"}
          </button>
        </div>
      </div>

      {volunteer && (
        <div className="volunteer-preview">
          <h3>Volunteer Details</h3>
          <div className="volunteer-details">
            <div className="detail-item">
              <label>Name:</label>
              <span>{volunteer.name}</span>
            </div>
            <div className="detail-item">
              <label>Roll Number:</label>
              <span>{volunteer.rollNumber}</span>
            </div>
            <div className="detail-item">
              <label>Register Number:</label>
              <span>{volunteer.registerNumber}</span>
            </div>
            <div className="detail-item">
              <label>Added On:</label>
              <span>{new Date(volunteer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? " Removing..." : " Remove Volunteer"}
            </button>
          </div>
        </div>
      )}

      {!volunteer && registerNumber && !searching && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#718096",
            background: "#f7fafc",
            borderRadius: "10px",
            margin: "1rem 0",
          }}
        >
          Enter a register number and click search to find a volunteer to remove.
        </div>
      )}
    </div>
  )
}

export default RemoveVolunteer
