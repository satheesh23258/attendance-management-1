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
  Error,
  Schedule,
  Warning
} from '@mui/icons-material'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { employeeAPI, attendanceAPI } from '../../services/api'
import { useTheme } from '../../contexts/ThemeContext'
import DashboardLayout from '../../components/DashboardLayout'

const HRDashboard = () => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    averageHours: 0,
    pendingLeaves: 5
  })

  const [topPerformers, setTopPerformers] = useState([])
  const [attendanceTrend, setAttendanceTrend] = useState([])
  const [departmentStats, setDepartmentStats] = useState([])

  useEffect(() => {
    const loadHRDashboardData = async () => {
      try {
        // Fetch all employees from database
        const employeesRes = await employeeAPI.getAll()
        const employees = employeesRes.data?.data || employeesRes.data || []

        // Try to fetch today's attendance
        let presentToday = 0
        try {
          const attendanceRes = await attendanceAPI.getTodayAttendance()
          presentToday = attendanceRes.data?.filter(a => a.status === 'present').length || 0
        } catch (err) {
          console.warn('Failed to fetch attendance:', err.message)
        }

        setStats({
          totalEmployees: employees.length,
          presentToday,
          averageHours: 8.5,
          pendingLeaves: 5
        })

        // Set top performers from real employees
        const performers = employees.slice(0, 3).map((emp, idx) => ({
          name: emp.name,
          completedTasks: Math.random() * 50 | 0,
          score: 70 + Math.random() * 30 | 0
        }))
        setTopPerformers(performers)

        // Set department stats calculated from real employees
        const deptMap = {}
        employees.forEach(emp => {
          const dept = emp.department || 'Other'
          deptMap[dept] = (deptMap[dept] || 0) + 1
        })

        const deptStats = Object.entries(deptMap).map(([dept, count]) => ({
          department: dept,
          score: Math.min(100, 70 + (count * 5))
        }))
        setDepartmentStats(deptStats)
      } catch (error) {
        console.warn('Failed to load HR dashboard data:', error.message)
        // Continue with empty data - don't break the page
      }
    }

    // Set attendance trend data (always available)
    const trendData = [
      { month: 'Jan', present: 142, absent: 8 },
      { month: 'Feb', present: 138, absent: 12 },
      { month: 'Mar', present: 145, absent: 5 },
      { month: 'Apr', present: 140, absent: 10 },
      { month: 'May', present: 148, absent: 7 },
      { month: 'Jun', present: 135, absent: 15 }
    ]
    setAttendanceTrend(trendData)

    loadHRDashboardData()
  }, [user])

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <People />,
      color: colors.primary.main,
      change: '+2%',
      changeType: 'increase'
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: <AccessTime />,
      color: colors.secondary.main,
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Average Hours',
      value: stats.averageHours,
      icon: <Schedule />,
      color: '#00c853',
      change: '+0.5',
      changeType: 'increase'
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: <Warning />,
      color: '#000000',
      change: '-1',
      changeType: 'decrease'
    }
  ]

  return (
    <DashboardLayout title="HR Dashboard">
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
            <strong>System Role:</strong> HUMAN RESOURCES PORTAL, <strong>Status:</strong> Active Session
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
                        {card.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: '#000000', color: 'black' }}>
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Top Performers and Attendance */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performers
              </Typography>
              <List>
                {topPerformers.map((performer, index) => (
                  <ListItem key={performer.name}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#000000', color: 'black' }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
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
                        sx={{
                          width: 100,
                          mt: 1,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#000000'
                          },
                          backgroundColor: 'rgba(255, 193, 7, 0.2)'
                        }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Attendance
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
                        {Math.round((stats.presentToday / stats.totalEmployees) * 100)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Absent" color="error" size="small" />
                      </TableCell>
                      <TableCell>{stats.totalEmployees - stats.presentToday}</TableCell>
                      <TableCell>
                        {Math.round(((stats.totalEmployees - stats.presentToday) / stats.totalEmployees) * 100)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}

export default HRDashboard
