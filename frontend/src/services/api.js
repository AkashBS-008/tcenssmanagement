import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Volunteer API calls
export const getVolunteers = async () => {
  const response = await api.get("/volunteers")
  return response.data
}

export const addVolunteer = async (volunteerData) => {
  const response = await api.post("/volunteers", volunteerData)
  return response.data
}

export const searchVolunteerByRegisterNumber = async (registerNumber) => {
  const response = await api.get(`/volunteers/search/${registerNumber}`)
  return response.data
}

export const deleteVolunteer = async (volunteerId) => {
  const response = await api.delete(`/volunteers/${volunteerId}`)
  return response.data
}

// Attendance API calls
export const saveAttendance = async (attendanceData, date) => {
  const response = await api.post("/attendance", {
    attendanceData,
    date,
  })
  return response.data
}

export const getAttendance = async (date) => {
  const response = await api.get(`/attendance/${date}`)
  return response.data
}

export const downloadAttendanceReport = async (date) => {
  const response = await api.get(`/attendance/report/${date}`, {
    responseType: "blob",
  })
  return response.data
}

export default api
