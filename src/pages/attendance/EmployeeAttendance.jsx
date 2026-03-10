import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../../services/api'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Grid,
  Paper,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  CalendarToday,
  Person,
  Search,
  FilterList,
  Download,
  Refresh,
  CheckCircle,
  Cancel,
  Schedule,
  ArrowBack
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/DashboardLayout'

const EmployeeAttendance = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [totalPresent, setTotalPresent] = useState(0)
  const [totalAbsent, setTotalAbsent] = useState(0)

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await attendanceAPI.getMyHistory()
      // response.data contains the array
      const data = response.data || []

      // Helper to format 24h time to 12h AM/PM
      const formatTime = (timeStr) => {
        if (!timeStr) return null
        const [hours, minutes] = timeStr.split(':')
        const date = new Date()
        date.setHours(hours)
        date.setMinutes(minutes)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      }

      // Helper to format decimal hours to "X hours Y minutes"
      const formatDuration = (hoursDec) => {
        if (!hoursDec) return '0 hours'
        const h = Math.floor(hoursDec)
        const m = Math.round((hoursDec - h) * 60)
        if (h === 0) return `${m} minutes`
        if (m === 0) return `${h} hours`
        return `${h} hours ${m} minutes`
      }

      const formattedData = data.map(record => ({
        ...record,
        id: record._id || record.id, // Ensure we have an id
        day: new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }),
        checkIn: formatTime(record.checkIn),
        checkOut: formatTime(record.checkOut),
        workingHours: formatDuration(record.workingHours),
        overtime: formatDuration(record.overtime)
      }))

      setAttendanceData(formattedData)

      // Calculate totals
      const present = formattedData.filter(record => record.status === 'present').length
      const absent = formattedData.filter(record => record.status === 'absent').length
      setTotalPresent(present)
      setTotalAbsent(absent)
    } catch (error) {
      console.error('Error fetching attendance:', error)
      toast.error('Failed to load attendance history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [user])

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#4caf50'
      case 'absent': return '#00c853'
      case 'late': return '#00c853'
      case 'halfday': return '#00c853'
      default: return '#000000'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle />
      case 'absent': return <Cancel />
      case 'late': return <Schedule />
      case 'halfday': return <Schedule />
      default: return null
    }
  }

  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.day.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMonth = filterMonth === 'all' || record.date.includes(filterMonth)
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    return matchesSearch && matchesMonth && matchesStatus
  })

  const exportAttendance = () => {
    try {
      // Create CSV content
      const headers = ['Date', 'Day', 'Check In', 'Check Out', 'Status', 'Working Hours', 'Overtime']
      const csvContent = [
        headers.join(','),
        ...attendanceData.map(row => [
          row.date,
          row.day,
          row.checkIn || '-',
          row.checkOut || '-',
          row.status,
          row.workingHours,
          row.overtime
        ].join(','))
      ].join('\n')

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Attendance report downloaded!')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export data')
    }
  }

  const refreshData = () => {
    fetchAttendance()
    toast.success('Refreshing data...')
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LinearProgress sx={{ width: '50px' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading attendance data...
        </Typography>
      </Box>
    )
  }

  return (
    <DashboardLayout title="Employee Attendance History">
      {/* Header */}
      <Box sx={{
        backgroundColor: '#00c853',
        color: 'white',
        p: 3,
        borderRadius: 2,
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Go Back">
            <IconButton
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h4">
            {user?.role === 'employee' ? 'My Attendance' : 'Employee Attendance Management'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh Data">
            <IconButton color="inherit" onClick={refreshData}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Data">
            <IconButton color="inherit" onClick={exportAttendance}>
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card sx={{
            backgroundColor: '#e8f5e8',
            border: '2px solid #4caf50',
            borderRadius: 2
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" color="#4caf50" gutterBottom>
                {totalPresent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Present Days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{
            backgroundColor: '#ffebee',
            border: '2px solid #00c853',
            borderRadius: 2
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Cancel sx={{ fontSize: 40, color: '#00c853', mb: 1 }} />
              <Typography variant="h4" color="#00c853" gutterBottom>
                {totalAbsent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Absent Days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: 'white', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance Overview
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Attendance Rate
                  </Typography>
                  <Typography variant="h5" color="#4caf50">
                    {attendanceData.length > 0 ? Math.round((totalPresent / attendanceData.length) * 100) : 0}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    This Month
                  </Typography>
                  <Typography variant="h5" color="#00c853">
                    {totalPresent + totalAbsent} days
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: 'white', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by date or day..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Month</InputLabel>
                    <Select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                    >
                      <MenuItem value="all">All Months</MenuItem>
                      <MenuItem value="2024-02">February 2024</MenuItem>
                      <MenuItem value="2024-01">January 2024</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                      <MenuItem value="halfday">Half Day</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance Table */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: 'white', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance History
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Day</TableCell>
                      <TableCell>Check In</TableCell>
                      <TableCell>Check Out</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Working Hours</TableCell>
                      <TableCell>Overtime</TableCell>
                      {user?.role !== 'employee' && <TableCell>Reason</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAttendance.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.day}</TableCell>
                        <TableCell>{record.checkIn || '-'}</TableCell>
                        <TableCell>{record.checkOut || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.status.toUpperCase()}
                            size="small"
                            icon={getStatusIcon(record.status)}
                            sx={{
                              backgroundColor: getStatusColor(record.status),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                        <TableCell>{record.workingHours}</TableCell>
                        <TableCell>{record.overtime}</TableCell>
                        {user?.role !== 'employee' && (
                          <TableCell>{record.reason || '-'}</TableCell>
                        )}
                      </TableRow>
                    ))}
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

export default EmployeeAttendance
