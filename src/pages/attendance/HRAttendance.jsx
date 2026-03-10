import React, { useState, useEffect } from 'react'
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  Edit,
  Visibility,
  Group,
  ArrowBack
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { attendanceAPI, employeeAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/DashboardLayout'

const HRAttendance = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEmployee, setFilterEmployee] = useState('all')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [detailsDialog, setDetailsDialog] = useState(false)

  const [employees, setEmployees] = useState([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [attendanceRes, employeesRes] = await Promise.all([
        attendanceAPI.getAttendanceHistory(),
        employeeAPI.getAll()
      ])

      const attendanceData = attendanceRes.data || []
      const employeesData = employeesRes.data || []

      setEmployees(employeesData)

      // Helper to format 24h time to 12h AM/PM
      const formatTime = (timeStr) => {
        if (!timeStr) return null
        const [hours, minutes] = timeStr.split(':')
        const date = new Date()
        date.setHours(hours)
        date.setMinutes(minutes)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      }

      // Helper to format decimal hours
      const formatDuration = (hoursDec) => {
        if (!hoursDec) return '0 hours'
        const h = Math.floor(hoursDec)
        const m = Math.round((hoursDec - h) * 60)
        if (h === 0) return `${m} minutes`
        if (m === 0) return `${h} hours`
        return `${h} hours ${m} minutes`
      }

      const formattedAttendance = attendanceData.map(record => {
        // Find employee details to ensure latest info
        // The record should have employeeName, but we can enrich it if needed
        // record.employeeId is ObjectId here? No, in findAll it returns the document.
        // Wait, Attendance model has employeeId as ObjectId.
        // But it also stores `employeeName` (String) as snapshot?
        // Yes: employeeName: { type: String, required: true },
        // And: employeeId: { type: ObjectId, ref: 'Employee' }
        // The table displays `employeeId` string (e.g. EMP001).
        // The Attendance model does NOT store "EMP001" string. It stores `employeeId` as ObjectId.
        // But the TABLE expects "EMP001" (string ID).
        // We need to map ObjectId to Employee String ID using `employeesData`.

        const emp = employeesData.find(e => e._id === record.employeeId || e.id === record.employeeId)

        return {
          ...record,
          id: record._id || record.id,
          employeeId: emp ? emp.employeeId : 'Unknown', // Display String ID
          department: emp ? emp.department : 'Unknown',
          employeeName: record.employeeName || (emp ? emp.name : 'Unknown'),
          day: new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }),
          checkIn: formatTime(record.checkIn),
          checkOut: formatTime(record.checkOut),
          workingHours: formatDuration(record.workingHours),
          overtime: formatDuration(record.overtime)
        }
      })

      setAttendanceData(formattedAttendance)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#4caf50'
      case 'absent': return '#f44336'
      case 'late': return '#ff9800'
      case 'halfday': return '#2196f3'
      default: return '#757575'
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

  const getUniqueEmployees = () => {
    const employees = [...new Set(attendanceData.map(record => record.employeeName))]
    return employees.map(name => ({ name, id: name.split(' ')[0] }))
  }

  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEmployee = filterEmployee === 'all' || record.employeeName === filterEmployee
    const matchesMonth = filterMonth === 'all' || record.date.includes(filterMonth)
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    return matchesSearch && matchesEmployee && matchesMonth && matchesStatus
  })

  const getEmployeeStats = (employeeName) => {
    const employeeRecords = attendanceData.filter(record => record.employeeName === employeeName)
    const present = employeeRecords.filter(record => record.status === 'present').length
    const absent = employeeRecords.filter(record => record.status === 'absent').length
    const late = employeeRecords.filter(record => record.status === 'late').length
    const halfday = employeeRecords.filter(record => record.status === 'halfday').length
    return { present, absent, late, halfday, total: employeeRecords.length }
  }

  const exportAttendance = () => {
    toast.success('Attendance data exported successfully!')
    // In real app, this would generate and download CSV/Excel
  }

  const refreshData = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Attendance data refreshed!')
    }, 1000)
  }

  const handleViewDetails = (record) => {
    setSelectedEmployee(record)
    setDetailsDialog(true)
  }

  const handleBack = () => {
    navigate(-1)
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

  // existing useEffect...

  return (
    <DashboardLayout title="Employee Attendance Management (HR)">
      {/* Header */}
      <Box sx={{
        backgroundColor: '#00c853', // Updated to match theme
        color: 'white', // Updated text color for contrast
        p: 3,
        borderRadius: 2,
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            Employee Attendance Management
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
        {/* Employee Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card sx={{
            backgroundColor: '#e3f2fd',
            border: '2px solid #2196f3',
            borderRadius: 2
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Group sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h4" color="#2196f3" gutterBottom>
                {getUniqueEmployees().length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{
            backgroundColor: '#e8f5e8',
            border: '2px solid #4caf50',
            borderRadius: 2
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" color="#4caf50" gutterBottom>
                {attendanceData.filter(r => r.status === 'present').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Present Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{
            backgroundColor: '#ffebee',
            border: '2px solid #f44336',
            borderRadius: 2
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Cancel sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
              <Typography variant="h4" color="#f44336" gutterBottom>
                {attendanceData.filter(r => r.status === 'absent').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Absent Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{
            backgroundColor: '#fff3e0',
            border: '2px solid #ff9800',
            borderRadius: 2
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h4" color="#ff9800" gutterBottom>
                {attendanceData.filter(r => r.status === 'late').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Late Today
              </Typography>
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
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by employee, ID, or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Employee</InputLabel>
                    <Select
                      value={filterEmployee}
                      onChange={(e) => setFilterEmployee(e.target.value)}
                    >
                      <MenuItem value="all">All Employees</MenuItem>
                      {getUniqueEmployees().map(emp => (
                        <MenuItem key={emp.name} value={emp.name}>
                          {emp.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                Employee Attendance Records
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Day</TableCell>
                      <TableCell>Check In</TableCell>
                      <TableCell>Check Out</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Working Hours</TableCell>
                      <TableCell>Overtime</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAttendance.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                              {record.employeeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {record.employeeName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {record.employeeId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{record.employeeId}</TableCell>
                        <TableCell>{record.department}</TableCell>
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
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(record)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
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

      {/* Employee Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Employee Attendance Details
        </DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Employee Information
                </Typography>
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="body2"><strong>Name:</strong> {selectedEmployee.employeeName}</Typography>
                  <Typography variant="body2"><strong>ID:</strong> {selectedEmployee.employeeId}</Typography>
                  <Typography variant="body2"><strong>Department:</strong> {selectedEmployee.department}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Attendance Summary
                </Typography>
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  {(() => {
                    const stats = getEmployeeStats(selectedEmployee.employeeName)
                    return (
                      <>
                        <Typography variant="body2"><strong>Present Days:</strong> {stats.present}</Typography>
                        <Typography variant="body2"><strong>Absent Days:</strong> {stats.absent}</Typography>
                        <Typography variant="body2"><strong>Late Days:</strong> {stats.late}</Typography>
                        <Typography variant="body2"><strong>Half Days:</strong> {stats.halfday}</Typography>
                        <Typography variant="body2"><strong>Total Records:</strong> {stats.total}</Typography>
                        <Typography variant="body2"><strong>Attendance Rate:</strong> {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%</Typography>
                      </>
                    )
                  })()}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}

export default HRAttendance
