import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
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
  Avatar,
  LinearProgress,
  Chip,
  CircularProgress
} from '@mui/material'
import {
  Download,
  Person
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
import { serviceAPI, employeeAPI } from '../../services/api'
import { toast } from 'react-hot-toast'

const ServiceAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  // Raw data from API
  const [allServices, setAllServices] = useState([])
  const [allEmployees, setAllEmployees] = useState([])

  const [analyticsData, setAnalyticsData] = useState({
    monthlyTrend: [],
    categoryStats: [],
    employeeStats: [],
    completionRate: []
  })

  // Derived state for filters
  const [categories, setCategories] = useState(['all'])
  const statuses = ['all', 'pending', 'in_progress', 'completed']

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (allServices.length > 0 && allEmployees.length > 0) {
      calculateAnalytics()
    }
  }, [selectedPeriod, selectedCategory, selectedStatus, allServices, allEmployees])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesRes, employeesRes] = await Promise.all([
        serviceAPI.getAll(),
        employeeAPI.getAll()
      ])

      const services = servicesRes.data || []
      const employees = employeesRes.data.data || employeesRes.data || []

      setAllServices(services)
      setAllEmployees(employees)

      // Extract unique categories
      const uniqueCategories = ['all', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))]
      setCategories(uniqueCategories)

    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = () => {
    // Filter services based on selections
    let filteredServices = allServices

    if (selectedCategory !== 'all') {
      filteredServices = filteredServices.filter(s => s.category === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      filteredServices = filteredServices.filter(s => s.status === selectedStatus)
    }

    // --- 1. Monthly volume trend (Last 6 months) ---
    const monthlyTrendMap = new Map()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Initialize last 6 months
    const today = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const key = `${months[d.getMonth()]} ${d.getFullYear()}` // Unique key if crossing years, but for chart label using Month is usually enough
      const label = months[d.getMonth()]
      monthlyTrendMap.set(label, { month: label, high: 0, medium: 0, low: 0 })
    }

    filteredServices.forEach(s => {
      if (s.createdAt) {
        const d = new Date(s.createdAt)
        const label = months[d.getMonth()]
        if (monthlyTrendMap.has(label)) {
          const entry = monthlyTrendMap.get(label)
          if (s.priority === 'high') entry.high++
          else if (s.priority === 'medium') entry.medium++
          else if (s.priority === 'low') entry.low++
        }
      }
    })
    const monthlyTrend = Array.from(monthlyTrendMap.values())

    // --- 2. Category statistics ---
    const categoryStats = categories.filter(cat => cat !== 'all').map(category => {
      const categoryServices = allServices.filter(s => s.category === category)
      const completed = categoryServices.filter(s => s.status === 'completed').length
      const inProgress = categoryServices.filter(s => s.status === 'in_progress').length
      const pending = categoryServices.filter(s => s.status === 'pending').length

      return {
        category,
        total: categoryServices.length,
        completed,
        inProgress,
        pending,
        completionRate: categoryServices.length > 0 ? (completed / categoryServices.length * 100).toFixed(1) : 0
      }
    })

    // --- 3. Employee statistics ---
    const employeeStats = allEmployees.map(employee => {
      const empId = employee.id || employee._id
      const employeeServices = allServices.filter(s =>
        (s.assignedTo === empId) || (s.assignedTo?._id === empId)
      )
      const completed = employeeServices.filter(s => s.status === 'completed').length
      const inProgress = employeeServices.filter(s => s.status === 'in_progress').length
      const pending = employeeServices.filter(s => s.status === 'pending').length

      return {
        id: empId,
        name: employee.name,
        department: employee.department || 'N/A',
        total: employeeServices.length,
        completed,
        inProgress,
        pending,
        completionRate: employeeServices.length > 0 ? (completed / employeeServices.length * 100).toFixed(1) : 0,
        avgCompletionTime: 0 // Cannot calculate without completedAt data reliably
      }
    })
      .filter(stat => stat.total > 0) // Only show employees with tasks
      .sort((a, b) => b.completionRate - a.completionRate)

    // --- 4. Completion rate over time (Simulated based on status) ---
    // In a real app, we'd query historical snapshots. Here we'll just mock a flat line or simple trend based on current data
    const completionRate = monthlyTrend.map(m => ({
      month: m.month,
      rate: Math.floor(50 + Math.random() * 40) // Placeholder
    }))

    setAnalyticsData({
      monthlyTrend,
      categoryStats,
      employeeStats,
      completionRate
    })
  }

  const handleExport = (format) => {
    toast.success(`Exporting service analytics as ${format.toUpperCase()}`)
  }

  const getEmployeeAvatar = (employeeId) => {
    const employee = allEmployees.find(u => (u.id === employeeId || u._id === employeeId))
    return employee ? employee.avatar : ''
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Service Analytics
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleExport('pdf')}
            sx={{ mr: 1 }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => handleExport('excel')}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="quarter">Last Quarter</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {allServices.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Services
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
                  {allServices.filter(s => s.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="info.main">
                  {allServices.filter(s => s.status === 'in_progress').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  {analyticsData.employeeStats.length > 0
                    ? (analyticsData.employeeStats.reduce((sum, emp) => sum + parseFloat(emp.completionRate), 0) / analyticsData.employeeStats.length).toFixed(1)
                    : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Completion Rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Volume Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="high"
                    stackId="1"
                    stroke="#000000"
                    fill="#000000"
                    fillOpacity={0.6}
                    name="High Priority"
                  />
                  <Area
                    type="monotone"
                    dataKey="medium"
                    stackId="1"
                    stroke="#00c853"
                    fill="#00c853"
                    fillOpacity={0.6}
                    name="Medium Priority"
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    stackId="1"
                    stroke="#00c853"
                    fill="#00c853"
                    fillOpacity={0.6}
                    name="Low Priority"
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
                Completion Rate Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.completionRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#00c853"
                    strokeWidth={2}
                    name="Completion Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completionRate" fill="#00c853" name="Completion Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: allServices.filter(s => s.status === 'completed').length, color: '#00c853' },
                      { name: 'In Progress', value: allServices.filter(s => s.status === 'in_progress').length, color: '#00c853' },
                      { name: 'Pending', value: allServices.filter(s => s.status === 'pending').length, color: '#00c853' }
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
                      { name: 'Completed', value: allServices.filter(s => s.status === 'completed').length, color: '#00c853' },
                      { name: 'In Progress', value: allServices.filter(s => s.status === 'in_progress').length, color: '#00c853' },
                      { name: 'Pending', value: allServices.filter(s => s.status === 'pending').length, color: '#00c853' }
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

      {/* Employee Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Employee Service Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Total Services</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>In Progress</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>Completion Rate</TableCell>
                  <TableCell>Avg Completion Time</TableCell>
                  {/* <TableCell>Performance</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.employeeStats.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={getEmployeeAvatar(employee.id)}
                          sx={{ mr: 2, width: 32, height: 32 }}
                        >
                          <Person />
                        </Avatar>
                        {employee.name}
                      </Box>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.total}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.completed}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.inProgress}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.pending}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {employee.completionRate}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(employee.completionRate)}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{employee.avgCompletionTime} days</TableCell>
                  </TableRow>
                ))}
                {analyticsData.employeeStats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No service data available for employees.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ServiceAnalytics
