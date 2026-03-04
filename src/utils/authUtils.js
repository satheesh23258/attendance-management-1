// JWT Token Simulation
export const generateJWT = (user) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiry
    iss: 'employee-management-system'
  }
  
  // Simulate JWT encoding (in real app, use crypto library)
  const encodedString = btoa(JSON.stringify(header)) + '.' + 
                       btoa(JSON.stringify(payload)) + '.' + 
                       btoa('mock-signature')
  
  return encodedString
}

export const decodeJWT = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    
    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    return payload
  } catch (error) {
    return null
  }
}

// Password encryption simulation (bcrypt-like)
export const hashPassword = (password) => {
  // Simulate password hashing (in real app, use bcrypt)
  const salt = 'random_salt_' + Math.random().toString(36).substring(7)
  const hash = btoa(password + salt)
  return salt + '$' + hash
}

export const verifyPassword = (password, hashedPassword) => {
  try {
    const [salt, hash] = hashedPassword.split('$')
    const computedHash = btoa(password + salt)
    return hash === computedHash
  } catch (error) {
    return false
  }
}

// Session management
export const setSessionTimeout = (dispatch, minutes = 60) => {
  const timeoutId = setTimeout(() => {
    dispatch({ type: 'SESSION_EXPIRED' })
    toast.error('Session expired. Please login again.')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }, minutes * 60 * 1000)
  
  return timeoutId
}

// Activity tracking
export const updateLastActivity = (dispatch) => {
  dispatch({ type: 'UPDATE_ACTIVITY' })
  localStorage.setItem('lastActivity', Date.now().toString())
}

// Check session validity
export const checkSessionValidity = (dispatch) => {
  const lastActivity = localStorage.getItem('lastActivity')
  const token = localStorage.getItem('token')
  
  if (!token || !lastActivity) {
    dispatch({ type: 'SESSION_EXPIRED' })
    return false
  }
  
  const decoded = decodeJWT(token)
  if (!decoded) {
    dispatch({ type: 'SESSION_EXPIRED' })
    return false
  }
  
  const timeSinceActivity = Date.now() - parseInt(lastActivity)
  const maxInactivity = 60 * 60 * 1000 // 1 hour
  
  if (timeSinceActivity > maxInactivity) {
    dispatch({ type: 'SESSION_EXPIRED' })
    return false
  }
  
  return true
}

// Role-based permissions
export const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    'admin': 3,
    'hr': 2,
    'employee': 1
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export const canAccessFeature = (userRole, feature) => {
  const permissions = {
    'admin': [
      'manage_employees', 'system_settings', 'user_management',
      'system_reports', 'audit_logs', 'api_access'
    ],
    'hr': [
      'employee_records', 'attendance_reports', 'performance',
      'analytics', 'service_management'
    ],
    'employee': [
      'my_tasks', 'check_in_out', 'my_location', 'my_profile',
      'service_requests'
    ]
  }
  
  return permissions[userRole]?.includes(feature) || false
}

// API request interceptor
export const createAuthenticatedRequest = (token) => {
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
}

// Error handling for authentication
export const handleAuthError = (error, dispatch) => {
  if (error.response?.status === 401) {
    dispatch({ type: 'SESSION_EXPIRED' })
    toast.error('Authentication failed. Please login again.')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  } else if (error.response?.status === 403) {
    toast.error('Access denied. You don\'t have permission for this action.')
  } else {
    toast.error('An error occurred. Please try again.')
  }
}
