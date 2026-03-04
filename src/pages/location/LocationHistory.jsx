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
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Avatar,
  Chip,
  IconButton
} from '@mui/material'
import {
  LocationOn,
  AccessTime,
  Navigation,
  DateRange,
  FilterList,
  Download,
  Timeline,
  Person
} from '@mui/icons-material'
import { locationAPI, employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

const LocationHistory = () => {
  const [locationHistory, setLocationHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTimeRange, setSelectedTimeRange] = useState('today')
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, empRes] = await Promise.all([
          locationAPI.getLocationHistory(),
          employeeAPI.getAll()
        ])
        const locData = locRes?.data || []
        setLocationHistory(locData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
        setFilteredHistory(locData)
        setEmployees(empRes?.data || [])
      } catch (error) {
        toast.error('Failed to load location history')
        console.error(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    filterHistory()
  }, [selectedEmployee, selectedDate, selectedTimeRange, locationHistory])

  const filterHistory = () => {
    let filtered = locationHistory

    // Filter by employee
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(record => record.employeeId === parseInt(selectedEmployee))
    }

    // Filter by date
    if (selectedTimeRange === 'today') {
      const today = new Date().toISOString().split('T')[0]
      filtered = filtered.filter(record => 
        record.timestamp.split('T')[0] === today
      )
    } else if (selectedTimeRange === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      filtered = filtered.filter(record => 
        new Date(record.timestamp) >= weekAgo
      )
    } else if (selectedTimeRange === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      filtered = filtered.filter(record => 
        new Date(record.timestamp) >= monthAgo
      )
    }

    // Filter by specific date
    if (selectedDate) {
      filtered = filtered.filter(record => 
        record.timestamp.split('T')[0] === selectedDate
      )
    }

    setFilteredHistory(filtered)
  }

  const getActivityColor = (activity) => {
    switch (activity) {
      case 'Check-in':
        return '#00c853'
      case 'Check-out':
        return '#000000'
      case 'Movement':
        return '#00c853'
      default:
        return '#000000'
    }
  }

  const getEmployeeAvatar = (employeeId) => {
    const employee = employees.find(u => (u.id || u._id) === employeeId)
    return employee ? employee.avatar : ''
  }

  const handleExport = (format) => {
    console.log(`Exporting location history as ${format}`)
    alert(`Location history exported as ${format.toUpperCase()}`)
  }

  const handleViewRoute = (employeeId) => {
    console.log(`Viewing route for employee ${employeeId}`)
    alert('Route view would open here with map visualization')
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Location History
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleExport('csv')}
            sx={{ mr: 1 }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  label="Employee"
                >
                  <MenuItem value="all">All Employees</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id || employee._id} value={employee.id || employee._id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="custom">Custom Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={selectedTimeRange !== 'custom'}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {filteredHistory.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Records
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="secondary">
                  {new Set(filteredHistory.map(h => h.employeeId)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employees Tracked
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {filteredHistory.filter(h => h.activity === 'Check-in').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check-ins
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="error.main">
                  {filteredHistory.filter(h => h.activity === 'Check-out').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check-outs
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Location History Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Location History Records
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Coordinates</TableCell>
                  <TableCell>Accuracy</TableCell>
                  <TableCell>Speed</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={getEmployeeAvatar(record.employeeId)}
                          sx={{ mr: 2, width: 32, height: 32 }}
                        >
                          <Person />
                        </Avatar>
                        {record.employeeName}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.activity}
                        size="small"
                        sx={{
                          backgroundColor: getActivityColor(record.activity),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {record.address}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
                          Location
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" fontFamily="monospace">
                        {record.latitude.toFixed(6)}, {record.longitude.toFixed(6)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ±{record.accuracy}m
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {record.speed ? `${record.speed} km/h` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewRoute(record.employeeId)}
                        title="View Route"
                      >
                        <Timeline />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Route Visualization
          </Typography>
          <Box
            sx={{
              height: 300,
              backgroundColor: '#f5f5f5',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Select an employee and click "View Route" to see their location history on a map.
              <br />
              This would integrate with Google Maps to show route polylines and markers.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LocationHistory
