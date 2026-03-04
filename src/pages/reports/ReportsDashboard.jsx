import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  LinearProgress,
  Paper,
  Tab,
  Tabs
} from '@mui/material'
import {
  Download,
  Assessment,
  TrendingUp,
  People,
  Assignment,
  AccessTime,
  LocationOn
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { employeeAPI } from '../../services/api'

const ReportsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState(0)
  const [reportData, setReportData] = useState({
    attendance: { monthlyData: [] },
    services: { totalServices: 0, monthlyData: [] },
    performance: { topPerformers: [], departmentPerformance: [] }
  })
  const [employees, setEmployees] = useState([])

  const periods = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' }
  ]

  const COLORS = ['#00c853', '#00c853', '#00c853', '#000000', '#000000', '#795548']

  useEffect(() => {
    // In a real app, this would fetch data based on the selected period
    // Since API reports endpoints don't exist yet, we only load employees
    const loadData = async () => {
      try {
        const empRes = await employeeAPI.getAll()
        setEmployees(empRes.data || [])
      } catch (err) {
        console.error('Error loading employees for reports', err)
      }
    }
    loadData()
  }, [selectedPeriod])

  const handleExport = (format, type) => {
    console.log(`Exporting ${type} report as ${format}`)
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported as ${format.toUpperCase()}`)
  }

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Reports & Analytics
        </Typography>
        <Box>
          <FormControl sx={{ mr: 2, minWidth: 150 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              label="Period"
            >
              {periods.map((period) => (
                <MenuItem key={period.value} value={period.value}>
                  {period.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => handleExport('pdf', 'comprehensive')}
          >
            Export All Reports
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Employees
                  </Typography>
                  <Typography variant="h4">
                    {employees.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active workforce
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#00c853', width: 56, height: 56 }}>
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
                    Attendance Rate
                  </Typography>
                  <Typography variant="h4">
                    {reportData.attendance.monthlyData[5]?.present || 90}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#00c853', width: 56, height: 56 }}>
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
                    Services Completed
                  </Typography>
                  <Typography variant="h4">
                    {reportData.services.totalServices}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total completed
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#00c853', width: 56, height: 56 }}>
                  <Assignment />
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
                    Avg Performance
                  </Typography>
                  <Typography variant="h4">
                    87%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Company average
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#000000', width: 56, height: 56 }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Report Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedReport}
          onChange={(e, newValue) => setSelectedReport(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Attendance Analytics" icon={<AccessTime />} />
          <Tab label="Service Analytics" icon={<Assignment />} />
          <Tab label="Performance Analytics" icon={<TrendingUp />} />
          <Tab label="Department Analytics" icon={<People />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={selectedReport} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attendance Trend (6 Months)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reportData.attendance.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="present"
                      stackId="1"
                      stroke="#00c853"
                      fill="#00c853"
                      fillOpacity={0.6}
                      name="Present"
                    />
                    <Area
                      type="monotone"
                      dataKey="absent"
                      stackId="1"
                      stroke="#000000"
                      fill="#000000"
                      fillOpacity={0.6}
                      name="Absent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attendance Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: 85, color: '#00c853' },
                        { name: 'Absent', value: 10, color: '#000000' },
                        { name: 'Late', value: 5, color: '#00c853' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Present', value: 85, color: '#00c853' },
                        { name: 'Absent', value: 10, color: '#000000' },
                        { name: 'Late', value: 5, color: '#00c853' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedReport} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Service Priority Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.services.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="high" stackId="a" fill="#000000" name="High" />
                    <Bar dataKey="medium" stackId="a" fill="#00c853" name="Medium" />
                    <Bar dataKey="low" stackId="a" fill="#00c853" name="Low" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Service Status Overview
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: 136, color: '#00c853' },
                        { name: 'In Progress', value: 8, color: '#00c853' },
                        { name: 'Pending', value: 12, color: '#00c853' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Completed', value: 136, color: '#00c853' },
                        { name: 'In Progress', value: 8, color: '#00c853' },
                        { name: 'Pending', value: 12, color: '#00c853' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedReport} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performers
                </Typography>
                {reportData.performance.topPerformers.map((performer, index) => (
                  <Box key={performer.name} mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">
                        {index + 1}. {performer.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {performer.score}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={performer.score}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.attendance.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="present"
                      stroke="#00c853"
                      strokeWidth={2}
                      name="Performance Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedReport} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Department Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.performance.departmentPerformance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="department" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#00c853" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Department Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={employees.reduce((acc, emp) => {
                        const existing = acc.find(item => item.name === emp.department)
                        if (existing) {
                          existing.value += 1
                        } else {
                          acc.push({ name: emp.department, value: 1 })
                        }
                        return acc
                      }, [])}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {employees.reduce((acc, emp) => {
                        const existing = acc.find(item => item.name === emp.department)
                        if (existing) {
                          existing.value += 1
                        } else {
                          acc.push({ name: emp.department, value: 1 })
                        }
                        return acc
                      }, []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Export Options */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Export Reports
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Download />}
                onClick={() => handleExport('pdf', 'attendance')}
              >
                Attendance PDF
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Download />}
                onClick={() => handleExport('excel', 'attendance')}
              >
                Attendance Excel
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Download />}
                onClick={() => handleExport('pdf', 'services')}
              >
                Services PDF
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Download />}
                onClick={() => handleExport('excel', 'services')}
              >
                Services Excel
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ReportsDashboard
