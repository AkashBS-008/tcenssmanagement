"use client"

import { useState } from "react"
import { addVolunteer } from "../services/api"
import { toast } from "react-toastify"

const AddVolunteer = ({ onVolunteerAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    registerNumber: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.rollNumber || !formData.registerNumber) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      await addVolunteer(formData)
      setFormData({ name: "", rollNumber: "", registerNumber: "" })
      onVolunteerAdded()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add volunteer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>🧑‍🎓 Add New Volunteer</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter volunteer's full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rollNumber">Roll Number</label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            placeholder="Enter roll number (e.g., 21CS001)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="registerNumber">Register Number</label>
          <input
            type="text"
            id="registerNumber"
            name="registerNumber"
            value={formData.registerNumber}
            onChange={handleChange}
            placeholder="Enter register number"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? " Adding..." : " Add Volunteer"}
        </button>
      </form>
    </div>
  )
}

export default AddVolunteer
