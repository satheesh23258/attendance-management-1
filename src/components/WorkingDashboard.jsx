import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import HRDashboard from '../pages/dashboard/HRDashboard'
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard'
import HybridDashboard from '../pages/dashboard/HybridDashboard'
import { RoleThemeProvider } from '../contexts/ThemeContext'

const WorkingDashboard = () => {
  const { role } = useParams()

  switch ((role || '').toLowerCase()) {
    case 'admin':
      return (
        <RoleThemeProvider role="admin">
          <AdminDashboard />
        </RoleThemeProvider>
      )
    case 'hr':
      return (
        <RoleThemeProvider role="hr">
          <HRDashboard />
        </RoleThemeProvider>
      )
    case 'employee':
      return (
        <RoleThemeProvider role="employee">
          <EmployeeDashboard />
        </RoleThemeProvider>
      )
    case 'hybrid':
      return (
        <RoleThemeProvider role="hybrid">
          <HybridDashboard />
        </RoleThemeProvider>
      )
    default:
      // If role param missing or unknown, redirect to home/login
      return <Navigate to="/" replace />
  }
}

export default WorkingDashboard
