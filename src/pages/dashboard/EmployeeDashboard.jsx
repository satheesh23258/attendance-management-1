import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Avatar,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Badge
} from '@mui/material'
import {
  AccessTime,
  Assignment,
  LocationOn,
  TrendingUp,
  CheckCircle,
  Schedule,
  PlayArrow,
  Stop,
  Notifications,
  People,
  Event,
  Security,
  Person,
  Assessment,
  EventNote,
  Timeline
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { attendanceAPI } from '../../services/api'
import DashboardLayout from '../../components/DashboardLayout'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const { colors } = useTheme()
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [myServices, setMyServices] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Initialize with default values first
    setTodayAttendance({
      checkIn: null,
      checkOut: null,
      status: 'Absent'
    })
    setIsCheckedIn(false)

    const loadEmployeeData = async () => {
      try {
        // Fetch today's attendance for current user
        const attendanceRes = await attendanceAPI.getTodayAttendance()
        const userAttendance = attendanceRes.data?.[0] || {
          checkIn: null,
          checkOut: null,
          status: 'Absent'
        }
        setTodayAttendance(userAttendance)
        setIsCheckedIn(userAttendance?.checkIn && !userAttendance?.checkOut)
      } catch (error) {
        console.warn('Failed to load employee data:', error.message)
        // Continue with empty data - don't break the page
      }
    }

    // Set default notifications
    const userNotifications = [
      {
        title: 'Welcome to the system!',
        message: 'Your account has been successfully created.',
        timestamp: new Date().toISOString(),
        read: false,
        userId: user?.id
      }
    ]
    setNotifications(userNotifications)

    loadEmployeeData()

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [user])

  const navigate = useNavigate()

  const handleCheckIn = () => {
    // Simulate check-in
    setIsCheckedIn(true)
    setTodayAttendance({
      checkIn: currentTime.toLocaleTimeString(),
      status: 'present'
    })
  }

  const handleCheckOut = () => {
    // Simulate check-out
    setIsCheckedIn(false)
    setTodayAttendance(prev => ({
      ...prev,
      checkOut: currentTime.toLocaleTimeString()
    }))
  }

  const getServiceColor = (status) => {
    switch (status) {
      case 'pending':
        return colors.secondary.main
      case 'in_progress':
        return colors.primary.main
      case 'completed':
        return '#00c853'
      default:
        return '#000000'
    }
  }

  const getServicePriority = (priority) => {
    switch (priority) {
      case 'high':
        return '#000000'
      case 'medium':
        return '#00c853'
      case 'low':
        return '#00c853'
      default:
        return '#000000'
    }
  }

  return (
    <DashboardLayout title="Employee Dashboard">
      {/* Clear Kongu-Style Header */}
      <Paper elevation={0} sx={{
        mb: 4,
        borderRadius: 2,
        bgcolor: '#ffffff',
        border: '1px solid #e0e0e0',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
          <Box sx={{ 
            px: 4, 
            py: 2, 
            borderBottom: '2px solid #2f80ed',
            color: '#2f80ed',
            fontWeight: 'bold',
            mb: '-1px',
            fontSize: '15px'
          }}>
            Dashboard / Overview
          </Box>
        </Box>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#555' }}>
            <strong>System Role:</strong> EMPLOYEE PORTAL, <strong>Status:</strong> Active Session
          </Typography>
        </Box>
      </Paper>

      {/* Quick Actions Header */}
      

      {/* Welcome Alert */}
      {!todayAttendance?.checkIn && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Don't forget to check in when you arrive at work!
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance Status
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Current Time
                  </Typography>
                  <Typography variant="h4">
                    {currentTime.toLocaleTimeString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: isCheckedIn ? colors.primary.main : colors.secondary.main }}>
                  {isCheckedIn ? <CheckCircle /> : <Schedule />}
                </Avatar>
              </Box>

              {todayAttendance ? (
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Check-in: {todayAttendance.checkIn}
                  </Typography>
                  {todayAttendance.checkOut && (
                    <Typography variant="body2" color="textSecondary">
                      Check-out: {todayAttendance.checkOut}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Not checked in yet
                </Typography>
              )}

              <Box mt={2}>
                {!isCheckedIn ? (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayArrow />}
                    onClick={handleCheckIn}
                    disabled={!!todayAttendance?.checkOut}
                  >
                    Check In
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Stop />}
                    onClick={handleCheckOut}
                    color="error"
                  >
                    Check Out
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Services
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Active Services
                  </Typography>
                  <Typography variant="h4">
                    {myServices.filter(s => s.status === 'in_progress').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: colors.primary.main }}>
                  <Assignment />
                </Avatar>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Pending: {myServices.filter(s => s.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed: {myServices.filter(s => s.status === 'completed').length}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={<Assignment />}
                onClick={() => navigate('/employee/services')}
              >
                View All Services
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Notifications and Services */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Notifications
              </Typography>
              <List>
                {notifications.map((notification, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemIcon>
                      {notification.type === 'info' && <Notifications color="primary" />}
                      {notification.type === 'success' && <CheckCircle color="success" />}
                      {notification.type === 'warning' && <TrendingUp color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={notification.time}
                    />
                  </ListItem>
                ))}
              </List>
              <Box textAlign="center" mt={2}>
                <Button
                  variant="text"
                  onClick={() => navigate('/employee/notifications')}
                >
                  View All Notifications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}

export default EmployeeDashboard
