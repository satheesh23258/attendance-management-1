import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  AccessTime,
  CheckCircle,
  Schedule,
  ArrowBack
} from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  CircularProgress
} from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { attendanceAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AttendanceDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [stats, setStats] = useState({
    presentDays: 0,
    totalHours: 0,
    avgHours: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [todayRes, historyRes] = await Promise.all([
        attendanceAPI.getTodayAttendance(),
        attendanceAPI.getMyHistory()
      ])

      const todayData = todayRes.data.data || todayRes.data
      setTodayAttendance(todayData)

      const historyData = historyRes.data.data || historyRes.data || []
      setAttendanceHistory(historyData)

      calculateStats(historyData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (history) => {
    // Basic stats calculation based on history
    // Filter for current month
    const now = new Date()
    const currentMonthHistory = history.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getMonth() === now.getMonth() &&
        recordDate.getFullYear() === now.getFullYear() &&
        record.status === 'Present'
    })

    const presentDays = currentMonthHistory.length

    // Assuming duration is string "9h 30m" or similar, need parsing if real calculation needed
    // For now simplistic parsing or existing field
    let totalHours = 0
    currentMonthHistory.forEach(record => {
      if (record.workingHours) {
        totalHours += parseFloat(record.workingHours)
      } else if (record.duration) {
        const parts = record.duration.split('h')
        if (parts.length > 0) totalHours += parseFloat(parts[0])
      }
    })

    const avgHours = presentDays > 0 ? (totalHours / presentDays).toFixed(1) : 0

    setStats({
      presentDays,
      totalHours: totalHours.toFixed(1),
      avgHours
    })
  }

  const handleBack = () => {
    navigate(-1)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return '#00c853' // success
      case 'Late': return '#00c853' // warning
      case 'Absent': return '#000000' // error
      case 'Half Day': return '#0288d1' // info
      default: return '#000000' // grey
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isCheckedIn = todayAttendance && todayAttendance.checkIn && !todayAttendance.checkOut

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        background: '#00c853',
        color: 'white',
        p: 3,
        borderRadius: 2,
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <IconButton
          color="inherit"
          onClick={() => navigate(-1)}
          sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Attendance Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Track your attendance and working hours
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Current Status Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: isCheckedIn ? '#00c853' : '#00c853',
                      mr: 2,
                      width: 64,
                      height: 64
                    }}
                  >
                    {isCheckedIn ? <CheckCircle sx={{ fontSize: 32 }} /> : <Schedule sx={{ fontSize: 32 }} />}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {isCheckedIn ? 'Currently Checked In' : 'Not Checked In'}
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {new Date().toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                {todayAttendance ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Today's Attendance
                    </Typography>
                    <Typography variant="h6">
                      Check-in: {todayAttendance.checkIn || '--:--'}
                    </Typography>
                    {todayAttendance.checkOut && (
                      <Typography variant="h6">
                        Check-out: {todayAttendance.checkOut}
                      </Typography>
                    )}
                    {(todayAttendance.workingHours || todayAttendance.duration) && (
                      <Typography variant="h6">
                        Working Hours: {todayAttendance.workingHours || todayAttendance.duration}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No attendance record for today.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Monthly Stats */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Present This Month
                    </Typography>
                    <Typography variant="h4">
                      {stats.presentDays}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#00c853', width: 56, height: 56 }}>
                    <CheckCircle />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Total Hours
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalHours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hours
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#00c853', width: 56, height: 56 }}>
                    <AccessTime />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Average Hours
                    </Typography>
                    <Typography variant="h4">
                      {stats.avgHours}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Per day
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#00c853', width: 56, height: 56 }}>
                    <TrendingUp />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Attendance History */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Attendance History
            </Typography>
            <List>
              {attendanceHistory.slice(0, 5).map((record) => (
                <ListItem key={record.id || record._id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(record.status) }}>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle2">
                          {new Date(record.date).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={record.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(record.status),
                            color: 'white'
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Check-in: {record.checkIn} | Check-out: {record.checkOut || 'Not checked out'}
                        </Typography>
                        <Typography variant="body2">
                          Working Hours: {record.workingHours || record.duration}
                        </Typography>
                        {record.location && (
                          <Typography variant="caption" color="text.secondary">
                            Location: {record.location.address || 'N/A'}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {attendanceHistory.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No attendance history found.
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default AttendanceDashboard
