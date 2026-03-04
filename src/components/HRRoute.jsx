import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const HRRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user?.role !== 'hr' && user?.role !== 'admin' && user?.hybrid !== true) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default HRRoute
