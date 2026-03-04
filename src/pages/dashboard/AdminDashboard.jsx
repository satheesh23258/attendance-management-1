import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  People,
  Assignment,
  LocationOn,
  TrendingUp,
  AccessTime,
  CheckCircle,
  Pending,
  Error
} from '@mui/icons-material'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import DashboardLayout from '../../components/DashboardLayout'
import { employeeAPI, attendanceAPI, userAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    activeServices: 0,
    liveLocations: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [employees, setEmployees] = useState([])
  const [pendingAdmins, setPendingAdmins] = useState([])

  useEffect(() => {
    // Initialize with default values first
    setStats({
      totalEmployees: 0,
      presentToday: 0,
      activeServices: 0,
      liveLocations: 0
    })

    const loadDashboardData = async () => {
      try {
        // Fetch all employees from database
        const employeesRes = await employeeAPI.getAll()
        const employeesList = employeesRes.data?.data || employeesRes.data || []
        setEmployees(employeesList)

        // Update stats with real data
        setStats(prev => ({
          ...prev,
          totalEmployees: employeesList.length
        }))

        // Try to fetch today's attendance stats
        try {
          const attendanceRes = await attendanceAPI.getTodayAttendance()
          const presentCount = attendanceRes.data?.filter(a => a.status === 'present').length || 0
          setStats(prev => ({
            ...prev,
            presentToday: presentCount
          }))
        } catch (err) {
          console.warn('Failed to fetch attendance:', err.message)
        }

        // Create recent activities from real employees
        try {
          const activities = employeesList.slice(0, 3).map(emp => ({
            title: `${emp.name} - ${emp.department || 'Department'}`,
            time: emp.createdAt || new Date().toLocaleDateString(),
            icon: <People color="primary" />
          }))
          setRecentActivities(activities)
        } catch (err) {
          console.warn('Silent fail fetching activities', err.message)
        }

        try {
          const pendingRes = await userAPI.getPendingAdmins();
          setPendingAdmins(pendingRes.data || []);
        } catch (err) {
          console.warn('Failed to fetch pending admins', err.message);
        }
      } catch (error) {
        console.warn('Failed to load dashboard data:', error.message)
        // Continue with empty data - don't break the page
      }
    }

    // Create mock monthly attendance data (always available)
    setAttendanceData([
      { month: 'January', present: 20, absent: 2 },
      { month: 'February', present: 22, absent: 0 },
      { month: 'March', present: 18, absent: 4 },
      { month: 'April', present: 21, absent: 1 },
      { month: 'May', present: 19, absent: 3 },
      { month: 'June', present: 22, absent: 0 }
    ])

    loadDashboardData()
  }, [user])

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <People />,
      color: '#000000', // Red color
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: <AccessTime />,
      color: '#000000', // Red color
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Active Services',
      value: stats.activeServices,
      icon: <Assignment />,
      color: '#000000', // Red color
      change: '+3%',
      changeType: 'increase'
    },
    {
      title: 'Live Locations',
      value: stats.liveLocations,
      icon: <LocationOn />,
      color: '#000000', // Red color
      change: '+2',
      changeType: 'increase'
    }
  ]

  const getIcon = (type) => {
    switch (type) {
      case 'attendance':
        return <AccessTime color="primary" />
      case 'service':
        return <Assignment color="secondary" />
      default:
        return <TrendingUp />
    }
  }

  const handleApproveAdmin = async (id) => {
    try {
      await userAPI.approveAdmin(id);
      toast.success('Admin request approved');
      setPendingAdmins(prev => prev.filter(admin => admin.id !== id && admin._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve admin');
    }
  };

  const handleRejectAdmin = async (id) => {
    try {
      if(window.confirm('Are you sure you want to reject this request?')) {
        await userAPI.rejectAdmin(id);
        toast.success('Admin request rejected');
        setPendingAdmins(prev => prev.filter(admin => admin.id !== id && admin._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject admin');
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard">
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
            <strong>System Role:</strong> ADMINISTRATOR ACCESS, <strong>Status:</strong> Active Session
          </Typography>
        </Box>
      </Paper>

      

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {card.value}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingUp
                        sx={{
                          color: card.changeType === 'increase' ? '#00c853' : '#000000',
                          mr: 0.5,
                          fontSize: 16
                        }}
                      />
                      <Typography
                        variant="body2"
                        color={card.changeType === 'increase' ? '#00c853' : '#000000'}
                      >
                        {card.change} from last month
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pending Admins Approval Section */}
      {pendingAdmins.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card sx={{ borderLeft: '4px solid #00c853', bgcolor: '#fff4e5' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Pending sx={{ color: '#00c853', mr: 1 }} />
                  <Typography variant="h6" color="#00c853">
                    Pending Admin Approvals ({pendingAdmins.length})
                  </Typography>
                </Box>
                <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingAdmins.map((admin) => (
                        <TableRow key={admin._id || admin.id}>
                          <TableCell sx={{ fontWeight: 'medium' }}>{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{admin.phone}</TableCell>
                          <TableCell>{admin.department}</TableCell>
                          <TableCell align="right">
                            <Button 
                              variant="contained" 
                              color="success" 
                              size="small" 
                              sx={{ mr: 1, textTransform: 'none' }}
                              onClick={() => handleApproveAdmin(admin._id || admin.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outlined" 
                              color="error" 
                              size="small"
                              sx={{ textTransform: 'none' }}
                              onClick={() => handleRejectAdmin(admin._id || admin.id)}
                            >
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tables Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
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
                      <TableCell>Total</TableCell>
                      <TableCell>Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(attendanceData) && attendanceData.length > 0 ? (
                      attendanceData.map((row, index) => {
                        const present = row.present || 0
                        const absent = row.absent || 0
                        const total = present + absent
                        const rate = total > 0 ? Math.round((present / total) * 100) : 0

                        return (
                          <TableRow key={index}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell>{present}</TableCell>
                            <TableCell>{absent}</TableCell>
                            <TableCell>{total}</TableCell>
                            <TableCell>
                              <Chip
                                label={`${rate}%`}
                                size="small"
                                color={rate > 90 ? 'success' : 'warning'}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            No attendance data available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Attendance Summary
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Count</TableCell>
                      <TableCell>Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Chip label="Present" color="success" size="small" />
                      </TableCell>
                      <TableCell>{stats.presentToday}</TableCell>
                      <TableCell>
                        {stats.totalEmployees > 0 ? `${Math.round((stats.presentToday / stats.totalEmployees) * 100)}%` : '0%'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Absent" color="error" size="small" />
                      </TableCell>
                      <TableCell>{stats.totalEmployees - stats.presentToday}</TableCell>
                      <TableCell>
                        {stats.totalEmployees > 0 ? `${Math.round(((stats.totalEmployees - stats.presentToday) / stats.totalEmployees) * 100)}%` : '0%'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Service Statistics Table */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Priority Distribution
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Priority</TableCell>
                      <TableCell>Count</TableCell>
                      <TableCell>Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Chip label="High" color="error" size="small" />
                      </TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>40%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Medium" color="warning" size="small" />
                      </TableCell>
                      <TableCell>10</TableCell>
                      <TableCell>33%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Low" color="success" size="small" />
                      </TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>27%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#000000' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}

export default AdminDashboard
