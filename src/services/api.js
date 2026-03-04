import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout on actual 401 authentication errors, not network errors
    if (error.response?.status === 401 && error.response?.data) {
      // This is a real auth error from the server
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Dispatch logout action instead of redirecting
      window.dispatchEvent(new CustomEvent('auth-expired'))
    }
    // Don't reject network errors with 401 - let components handle API failures gracefully
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  requestOtp: (data) => api.post('/auth/request-otp', data),
  sendVerificationOtp: (data) => api.post('/auth/send-verification-otp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  updateProfile: (data) => api.put('/auth/profile', data),
}

// User API
export const userAPI = {
  getPendingAdmins: () => api.get('/users/pending-admins'),
  approveAdmin: (id) => api.patch(`/users/${id}/approve`),
  rejectAdmin: (id) => api.patch(`/users/${id}/reject`),
}

// Employee API
export const employeeAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  toggleStatus: (id) => api.patch(`/employees/${id}/toggle-status`),
}

// Attendance API
export const attendanceAPI = {
  checkIn: (data) => api.post('/attendance/check-in', data),
  checkOut: (data) => api.post('/attendance/check-out', data),
  getTodayAttendance: () => api.get('/attendance/today'),
  getMyHistory: (params) => api.get('/attendance/my-history', { params }),
  getAttendanceHistory: (params) => api.get('/attendance/history', { params }),
  getMonthlyReport: (params) => api.get('/attendance/monthly-report', { params }),
  getAttendanceStats: (params) => api.get('/attendance/stats', { params }),
  mark: (data) => api.post('/attendance/mark', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  remove: (id) => api.delete(`/attendance/${id}`),
}

// Location API
export const locationAPI = {
  getCurrentLocation: () => api.get('/location/current'),
  updateLocation: (data) => api.post('/location/update', data),
  getLocationHistory: (params) => api.get('/location/history', { params }),
  getLiveLocations: () => api.get('/location/live'),
  getRouteHistory: (params) => api.get('/location/route-history', { params }),
}

// Service API
export const serviceAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  assignService: (id, data) => api.post(`/services/${id}/assign`, data),
  updateStatus: (id, status) => api.patch(`/services/${id}/status`, { status }),
  getMyServices: () => api.get('/services/my'),
}

// Notification API
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  getUnreadCount: (params) => api.get('/notifications/unread-count', { params }),
  delete: (id) => api.delete(`/notifications/${id}`),
}

// Reports API
export const reportsAPI = {
  getAttendanceReport: (params) => api.get('/reports/attendance', { params }),
  getServiceReport: (params) => api.get('/reports/services', { params }),
  getEmployeePerformance: (params) => api.get('/reports/performance', { params }),
  exportReport: (type, params) => api.get(`/reports/export/${type}`, {
    params,
    responseType: 'blob'
  }),
}

// Leave API
export const leaveAPI = {
  apply: (data) => api.post('/leaves', data),
  getMyLeaves: () => api.get('/leaves/my'),
  getAll: () => api.get('/leaves'),
  updateStatus: (id, data) => api.put(`/leaves/${id}/status`, data),
}

// Settings API
export const settingsAPI = {
  getUserSettings: () => api.get('/settings/user'),
  updateUserSettings: (data) => api.put('/settings/user', data),
  getSystemSettings: () => api.get('/settings/system'),
  updateSystemSettings: (data) => api.put('/settings/system', data),
}

export default api
