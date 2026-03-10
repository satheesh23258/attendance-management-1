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
  getHybridPermissions: () => api.get('/hybrid-permissions/my-permission'),
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
  getMe: () => api.get('/employees/me'),
  uploadDocument: (id, formData) => api.post(`/employees/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  submitExpense: (formData) => api.post('/employees/expenses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
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

// Expense API
export const expenseAPI = {
  getAll: () => api.get('/expenses/all'),
  getMyExpenses: () => api.get('/expenses/my'),
  submit: (data) => api.post('/expenses/submit', data),
  updateStatus: (id, data) => api.patch(`/expenses/status/${id}`, data),
}

// Audit API
export const auditAPI = {
  getLogs: (params) => api.get('/audit', { params }),
  getStats: () => api.get('/audit/stats'),
}

// Payroll API
export const payrollAPI = {
  getAll: (params) => api.get('/payroll/all', { params }),
  getMyHistory: () => api.get('/payroll/my'),
  generate: (data) => api.post('/payroll/generate', data),
  updateStatus: (id, data) => api.patch(`/payroll/status/${id}`, data),
}

// Shift API
export const shiftAPI = {
  getAll: (params) => api.get('/shifts/all', { params }),
  getMyHistory: (params) => api.get('/shifts/my', { params }),
  assign: (data) => api.post('/shifts/assign', data),
  remove: (id) => api.delete(`/shifts/${id}`),
}

// Ticket API
export const ticketAPI = {
  getAll: (params) => api.get('/tickets/all', { params }),
  getMyTickets: () => api.get('/tickets/my'),
  create: (data) => api.post('/tickets/create', data),
  update: (id, data) => api.patch(`/tickets/${id}`, data),
}

// Asset API
export const assetAPI = {
  getAll: (params) => api.get('/assets/all', { params }),
  getMyAssets: () => api.get('/assets/my'),
  add: (data) => api.post('/assets/add', data),
  update: (id, data) => api.patch(`/assets/${id}`, data),
}

export default api
