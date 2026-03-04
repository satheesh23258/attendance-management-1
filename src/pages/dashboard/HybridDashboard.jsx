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
  CheckCircle,
  Schedule,
  PlayArrow,
  Stop,
  Notifications,
  TrendingUp,
  People,
  Event,
  Security,
  Person,
  Assessment,
  EventNote,
  Timeline,
  EventBusy as LeaveRequest
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  attendanceAPI,
  serviceAPI,
  notificationAPI,
  employeeAPI
} from '../../services/api'
import DashboardLayout from '../../components/DashboardLayout'
import axios from 'axios'

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hybrid-tabpanel-${index}`}
      aria-labelledby={`hybrid-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const HybridDashboard = () => {
  const { user } = useAuth()
  const { colors } = useTheme()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [myServices, setMyServices] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hybridPermission, setHybridPermission] = useState(null)

  // HR-specific states
  const [hrStats, setHrStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    averageHours: 0,
    pendingLeaves: 5
  })
  const [topPerformers, setTopPerformers] = useState([])
  const [attendanceTrend, setAttendanceTrend] = useState([])

  useEffect(() => {
    fetchHybridPermission()
    fetchEmployeeData()
    fetchHRData()
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const fetchHybridPermission = async () => {
    try {
      // Temporarily comment out API call to prevent errors
      // const token = localStorage.getItem('token')
      // const response = await axios.get('/api/hybrid-permissions/my-permission', {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // setHybridPermission(response.data)
      
      // Set mock data for now
      setHybridPermission({
        permission: {
          grantedBy: 'Admin',
          accessCount: 5,
          lastAccessed: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      })
    } catch (error) {
      console.error('Error fetching hybrid permission:', error)
    }
  }

  const fetchEmployeeData = async () => {
    try {
      // Get today's attendance for current user
      const attRes = await attendanceAPI.getTodayAttendance()
      if (attRes.data && attRes.data.length > 0) {
        setTodayAttendance(attRes.data[0])
        setIsCheckedIn(!attRes.data[0].checkOut)
      } else {
        setTodayAttendance(null)
        setIsCheckedIn(false)
      }

      // Get user's services
      const srvRes = await serviceAPI.getAll({ assignedTo: user?.id })
      setMyServices(srvRes.data || [])

      // Get recent notifications
      const notifRes = await notificationAPI.getAll({ limit: 3 })
      setNotifications(notifRes.data || [])
    } catch (error) {
      console.error('Error fetching employee data:', error)
    }
  }

  const fetchHRData = async () => {
    try {
      const empRes = await employeeAPI.getAll()
      const totalEmp = empRes.data?.length || 0

      // Simplified HR Stats because we don't have dedicated aggregate endpoints yet
      setHrStats({
        totalEmployees: totalEmp,
        presentToday: 0, // Would need endpoint
        averageHours: 0,
        pendingLeaves: 0
      })

      setTopPerformers([])
      setAttendanceTrend([])
    } catch (error) {
      console.error('Error fetching HR data:', error)
    }
  }

  const handleCheckIn = async () => {
    try {
      const res = await attendanceAPI.checkIn({
        location: { latitude: 0, longitude: 0, address: 'Office' }
      })
      setIsCheckedIn(true)
      setTodayAttendance(res.data.attendance)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCheckOut = async () => {
    try {
      const res = await attendanceAPI.checkOut({
        location: { latitude: 0, longitude: 0, address: 'Office' }
      })
      setIsCheckedIn(false)
      setTodayAttendance(res.data.attendance)
    } catch (error) {
      console.error(error)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const getServiceColor = (status) => {
    switch (status) {
      case 'pending': return colors.secondary.main
      case 'in_progress': return colors.primary.main
      case 'completed': return '#00c853'
      default: return '#000000'
    }
  }

  const getServicePriority = (priority) => {
    switch (priority) {
      case 'high': return '#000000'
      case 'medium': return '#00c853'
      case 'low': return '#00c853'
      default: return '#000000'
    }
  }

  return (
    <DashboardLayout title="Hybrid Dashboard">
      {/* Hybrid Permission Alert */}
      {hybridPermission && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small">
              View Details
            </Button>
          }
        >
          You have hybrid access with special permissions. Granted by {hybridPermission.permission?.grantedBy}.
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab icon={<Person />} label="Employee View" />
          <Tab icon={<People />} label="HR View" />
          <Tab icon={<Assessment />} label="Analytics" />
        </Tabs>
      </Paper>

      {/* Employee View Tab */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom sx={{ color: colors.primary.main, fontWeight: 600 }}>
          Employee Dashboard
        </Typography>
        
        {/* Quick Actions */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attendance
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
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
                    <Typography variant="body2" color="text.secondary">
                      Check-in: {todayAttendance.checkIn}
                    </Typography>
                    {todayAttendance.checkOut && (
                      <Typography variant="body2" color="text.secondary">
                        Check-out: {todayAttendance.checkOut}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
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
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Services
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
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
                  <Typography variant="body2" color="text.secondary">
                    Pending: {myServices.filter(s => s.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
      </TabPanel>

      {/* HR View Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom sx={{ color: colors.primary.main, fontWeight: 600 }}>
          HR Dashboard
        </Typography>

        {/* HR Stats */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Total Employees
                    </Typography>
                    <Typography variant="h4" component="div">
                      {hrStats.totalEmployees}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: colors.primary.main }}>
                    <People />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Present Today
                    </Typography>
                    <Typography variant="h4" component="div">
                      {hrStats.presentToday}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: colors.secondary.main }}>
                    <AccessTime />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Average Hours
                    </Typography>
                    <Typography variant="h4" component="div">
                      {hrStats.averageHours}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#00c853' }}>
                    <Schedule />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Pending Leaves
                    </Typography>
                    <Typography variant="h4" component="div">
                      {hrStats.pendingLeaves}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#000000' }}>
                    <LeaveRequest />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Overview */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attendance Overview (Last 6 Months)
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell>Present</TableCell>
                        <TableCell>Absent</TableCell>
                        <TableCell>Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceTrend.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell>{row.present}</TableCell>
                          <TableCell>{row.absent}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${Math.round((row.present / (row.present + row.absent)) * 100)}%`}
                              size="small"
                              color={((row.present / (row.present + row.absent)) * 100) > 90 ? 'success' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performers
                </Typography>
                <List>
                  {topPerformers.map((performer, index) => (
                    <ListItem key={performer.name}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: colors.primary.main }}>
                          {index + 1}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={performer.name}
                        secondary={`${performer.completedTasks} tasks completed`}
                      />
                      <Box textAlign="right">
                        <Typography variant="h6" color="primary">
                          {performer.score}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={performer.score}
                          sx={{ width: 100, mt: 1 }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom sx={{ color: colors.primary.main, fontWeight: 600 }}>
          Analytics Overview
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hybrid Access Statistics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Access Count
                    </Typography>
                    <Typography variant="h4">
                      {hybridPermission?.permission?.accessCount || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Accessed
                    </Typography>
                    <Typography variant="body1">
                      {hybridPermission?.permission?.lastAccessed 
                        ? new Date(hybridPermission.permission.lastAccessed).toLocaleString()
                        : 'Never'
                      }
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Permission Expires
                    </Typography>
                    <Typography variant="body1">
                      {hybridPermission?.permission?.expiresAt 
                        ? new Date(hybridPermission.permission.expiresAt).toLocaleDateString()
                        : 'N/A'
                      }
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<People />}
                    onClick={() => navigate('/hr/employee-records')}
                    fullWidth
                  >
                    Manage Employee Records
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Assessment />}
                    onClick={() => navigate('/hr/analytics')}
                    fullWidth
                  >
                    View HR Analytics
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Assignment />}
                    onClick={() => navigate('/employee/services')}
                    fullWidth
                  >
                    My Services
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </DashboardLayout>
  )
}

export default HybridDashboard
