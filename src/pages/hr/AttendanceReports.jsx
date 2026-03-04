import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  CircularProgress
} from '@mui/material'
import {
  ArrowBack,
  Download,
  FilterList,
  CalendarToday,
  AccessTime,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material'
import { attendanceAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AttendanceReports = () => {
  const navigate = useNavigate()
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    fetchAttendanceData()
  }, [])

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      // fetching all history or specific report endpoint
      const response = await attendanceAPI.getAttendanceHistory()
      setAttendanceData(response.data.data || response.data || [])
    } catch (error) {
      console.error('Error fetching attendance reports:', error)
      toast.error('Failed to load attendance records')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setOpenDialog(true)
  }

  const handleExport = async () => {
    try {
      toast.loading('Generating report...')
      // In a real scenario, this would trigger an API call to download a file
      // For now we can just show a success message as the backend export might need specific handling
      // await reportsAPI.exportReport('attendance', { date: filterDate, department: filterDepartment })

      // Simulating export for demonstration of UI interaction if backend not ready for blob
      setTimeout(() => toast.dismiss(), 1000)
      setTimeout(() => toast.success('Report generated successfully'), 1000)

      generateAttendancePDF() // Keep existing PDF generation as fallback/frontend-only option
    } catch (error) {
      toast.error('Failed to export report')
    }
  }

  const generateAttendancePDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Attendance Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            color: #2c3e50;
          }
          .present {
            background-color: #e8f5e8;
            color: #00c853;
          }
          .absent {
            background-color: #ffebee;
            color: #000000;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>Attendance Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            ${attendanceData.map(record => `
              <tr>
                <td>${record.employeeName || record.userId?.name || 'N/A'}</td>
                <td>${record.employeeId || record.userId?.employeeId || 'N/A'}</td>
                <td>${record.date}</td>
                <td>${record.checkIn}</td>
                <td>${record.checkOut}</td>
                <td class="${record.status?.toLowerCase()}">${record.status}</td>
                <td>${record.duration || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Employee Management System - Attendance Report</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print()
      // Close window after printing (or user cancels)
      setTimeout(() => {
        printWindow.close()
      }, 1000)
    }
  }

  const filteredData = attendanceData.filter(record => {
    return (
      (!filterDepartment || record.department === filterDepartment) &&
      (!filterStatus || record.status === filterStatus) &&
      (!filterDate || record.date === filterDate)
    )
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'success'
      case 'Late': return 'warning'
      case 'Absent': return 'error'
      case 'Half Day': return 'info'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <CheckCircle color="success" />
      case 'Late': return <Schedule color="warning" />
      case 'Absent': return <Cancel color="error" />
      case 'Half Day': return <AccessTime color="info" />
      default: return <CalendarToday />
    }
  }

  const departments = ['All', 'Engineering', 'HR', 'Sales', 'Marketing', 'Finance']
  const statuses = ['All', 'Present', 'Late', 'Absent', 'Half Day']

  const getStatistics = () => {
    const total = filteredData.length
    const present = filteredData.filter(r => r.status === 'Present').length
    const late = filteredData.filter(r => r.status === 'Late').length
    const absent = filteredData.filter(r => r.status === 'Absent').length
    const avgAttendance = total > 0 ? ((present / total) * 100).toFixed(1) : 0

    return { total, present, late, absent, avgAttendance }
  }

  const stats = getStatistics()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        backgroundColor: '#000000', // Enforced Yellow Theme
        color: 'black',
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            Attendance Reports
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Records
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {stats.present}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {stats.late}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Late
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {stats.absent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Rate */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Overall Attendance Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(stats.avgAttendance)}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="h6" color="primary">
                {stats.avgAttendance}%
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    label="Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept === 'All' ? '' : dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status === 'All' ? '' : status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setFilterDepartment('')
                    setFilterStatus('')
                    setFilterDate('')
                  }}
                  sx={{ height: '56px' }}
                >
                  Clear Filters
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Download />}
                  onClick={handleExport}
                  sx={{ height: '56px' }}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attendance Records
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Overtime</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {record.employeeName || record.userId?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {record.employeeId || record.userId?.employeeId || 'N/A'} • {record.department || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>{record.duration}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color={record.overtime && record.overtime !== '0h 0m' ? 'warning.main' : 'text.secondary'}>
                          {record.overtime || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(record.status)}
                          <Chip
                            label={record.status}
                            color={getStatusColor(record.status)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDetails(record)}
                          size="small"
                        >
                          <FilterList />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Attendance Details</DialogTitle>
          <DialogContent>
            {selectedRecord && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Employee Name"
                    value={selectedRecord.employeeName || selectedRecord.userId?.name || ''}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    value={selectedRecord.employeeId || selectedRecord.userId?.employeeId || ''}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    value={selectedRecord.date}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={selectedRecord.status}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Check In"
                    value={selectedRecord.checkIn}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Check Out"
                    value={selectedRecord.checkOut}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Duration"
                    value={selectedRecord.duration}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Overtime"
                    value={selectedRecord.overtime || '0h 0m'}
                    disabled
                    margin="normal"
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default AttendanceReports
