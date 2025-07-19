"use client"

import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"
import AddVolunteer from "./components/AddVolunteer"
import AttendanceMarking from "./components/AttendanceMarking"
import RemoveVolunteer from "./components/RemoveVolunteer"
import { getVolunteers } from "./services/api"

function App() {
  const [volunteers, setVolunteers] = useState([])
  const [activeTab, setActiveTab] = useState("attendance")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVolunteers()
  }, [])

  const fetchVolunteers = async () => {
    try {
      setLoading(true)
      const data = await getVolunteers()
      setVolunteers(data)
    } catch (error) {
      toast.error("Failed to fetch volunteers")
    } finally {
      setLoading(false)
    }
  }

  const handleVolunteerAdded = () => {
    fetchVolunteers()
    toast.success("Volunteer added successfully!")
  }

  const handleVolunteerRemoved = () => {
    fetchVolunteers()
    toast.success("Volunteer removed successfully!")
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1> TCE NSS Management System</h1>
          <p>Thiagarajar College of Engineering - National Service Scheme</p>
          <p>created by <a href="https://www.instagram.com/atman_akash_/">🧑‍🎓</a></p>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
           Mark Attendance
        </button>
        <button className={`tab-button ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>
           Add Volunteer
        </button>
        <button
          className={`tab-button ${activeTab === "remove" ? "active" : ""}`}
          onClick={() => setActiveTab("remove")}
        >
           Remove Volunteer
        </button>
      </nav>

      <main className="main-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === "attendance" && <AttendanceMarking volunteers={volunteers} />}
            {activeTab === "add" && <AddVolunteer onVolunteerAdded={handleVolunteerAdded} />}
            {activeTab === "remove" && <RemoveVolunteer onVolunteerRemoved={handleVolunteerRemoved} />}
          </>
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
