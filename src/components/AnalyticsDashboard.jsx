import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert
} from '@mui/material'
import {
  Download,
  Refresh,
  FilterList,
  TrendingUp,
  TrendingDown,
  Assessment,
  CalendarToday,
  People,
  Schedule,
  Assignment,
  LocationOn,
  Money,
  BarChart,
  PieChart,
  Timeline
} from '@mui/icons-material'

const AnalyticsDashboard = ({ userRole }) => {
  const [timeRange, setTimeRange] = useState('month')
  const [reportType, setReportType] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [filters, setFilters] = useState({})
  const [openFilterDialog, setOpenFilterDialog] = useState(false)

  // Mock analytics data
  const mockAnalyticsData = {
    overview: {
      employeeMetrics: {
        totalEmployees: 156,
        activeEmployees: 142,
        newHires: 8,
        turnoverRate: 2.3,
        satisfactionScore: 4.2
      },
      attendanceMetrics: {
        averageAttendance: 94.5,
        punctualityRate: 91.2,
        overtimeHours: 245,
        absentDays: 67
      },
      performanceMetrics: {
        averageRating: 4.1,
        highPerformers: 45,
        improvementNeeded: 12,
        completedGoals: 78
      },
      financialMetrics: {
        totalPayroll: 2450000,
        averageSalary: 15600,
        trainingCosts: 45000,
        recruitmentCosts: 23000
      }
    },
    attendance: {
      dailyAttendance: [
        { date: '2024-01-01', present: 145, absent: 8, late: 3, total: 156 },
        { date: '2024-01-02', present: 148, absent: 5, late: 3, total: 156 },
        { date: '2024-01-03', present: 150, absent: 4, late: 2, total: 156 },
        { date: '2024-01-04', present: 142, absent: 10, late: 4, total: 156 },
        { date: '2024-01-05', present: 138, absent: 12, late: 6, total: 156 }
      ],
      departmentWise: [
        { department: 'Engineering', present: 45, total: 48, rate: 93.8 },
        { department: 'HR', present: 12, total: 12, rate: 100 },
        { department: 'Sales', present: 28, total: 32, rate: 87.5 },
        { department: 'Marketing', present: 18, total: 20, rate: 90 },
        { department: 'Operations', present: 35, total: 36, rate: 97.2 }
      ]
    },
    performance: {
      ratings: [
        { rating: 5, count: 25, percentage: 16.0 },
        { rating: 4, count: 65, percentage: 41.7 },
        { rating: 3, count: 45, percentage: 28.8 },
        { rating: 2, count: 15, percentage: 9.6 },
        { rating: 1, count: 6, percentage: 3.8 }
      ],
      departmentPerformance: [
        { department: 'Engineering', avgRating: 4.2, highPerformers: 20 },
        { department: 'HR', avgRating: 4.5, highPerformers: 8 },
        { department: 'Sales', avgRating: 3.8, highPerformers: 10 },
        { department: 'Marketing', avgRating: 4.0, highPerformers: 12 },
        { department: 'Operations', avgRating: 3.9, highPerformers: 8 }
      ]
    },
    financial: {
      payrollBreakdown: [
        { category: 'Salaries', amount: 1850000, percentage: 75.5 },
        { category: 'Benefits', amount: 367500, percentage: 15.0 },
        { category: 'Training', amount: 45000, percentage: 1.8 },
        { category: 'Recruitment', amount: 23000, percentage: 0.9 },
        { category: 'Other', amount: 164500, percentage: 6.7 }
      ],
      departmentCosts: [
        { department: 'Engineering', cost: 980000, employees: 48 },
        { department: 'Sales', cost: 650000, employees: 32 },
        { department: 'Marketing', cost: 420000, employees: 20 },
        { department: 'Operations', cost: 280000, employees: 36 },
        { department: 'HR', cost: 120000, employees: 12 }
      ]
    }
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange, reportType, filters])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setData(mockAnalyticsData[reportType] || mockAnalyticsData.overview)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format) => {
    // Simulate export functionality
    const exportData = {
      reportType,
      timeRange,
      filters,
      data: data,
      exportDate: new Date().toISOString()
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${reportType}-${Date.now()}.json`
      a.click()
    } else if (format === 'csv') {
      // Convert to CSV and download
      console.log('Exporting as CSV...')
    }
  }

  const MetricCard = ({ title, value, subtitle, trend, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontSize: 32, color }}>{icon}</Box>
            <Box>
              <Typography variant="h4" color={color} sx={{ fontWeight: 'bold' }}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
            </Box>
          </Box>
          {trend !== undefined && (
            <Chip
              icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
              label={`${Math.abs(trend)}%`}
              color={trend > 0 ? 'success' : 'error'}
              size="small"
            />
          )}
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )

  const renderOverviewAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Employee Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Employees"
              value={data.employeeMetrics?.totalEmployees}
              subtitle="Active workforce"
              icon="👥"
              color="#00c853"
              trend={2.5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Active Employees"
              value={data.employeeMetrics?.activeEmployees}
              subtitle="Currently working"
              icon="✅"
              color="#4caf50"
              trend={1.8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="New Hires"
              value={data.employeeMetrics?.newHires}
              subtitle="This month"
              icon="🆕"
              color="#00c853"
              trend={15.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Satisfaction Score"
              value={data.employeeMetrics?.satisfactionScore}
              subtitle="Out of 5.0"
              icon="😊"
              color="#000000"
              trend={0.3}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Attendance Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Attendance"
              value={`${data.attendanceMetrics?.averageAttendance}%`}
              subtitle="Monthly average"
              icon="📅"
              color="#4caf50"
              trend={1.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Punctuality Rate"
              value={`${data.attendanceMetrics?.punctualityRate}%`}
              subtitle="On-time arrivals"
              icon="⏰"
              color="#00c853"
              trend={-0.5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Overtime Hours"
              value={data.attendanceMetrics?.overtimeHours}
              subtitle="This month"
              icon="⏳"
              color="#00c853"
              trend={8.7}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Absent Days"
              value={data.attendanceMetrics?.absentDays}
              subtitle="Total days"
              icon="🏖️"
              color="#00c853"
              trend={-12.3}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Performance Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Rating"
              value={data.performanceMetrics?.averageRating}
              subtitle="Out of 5.0"
              icon="⭐"
              color="#000000"
              trend={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="High Performers"
              value={data.performanceMetrics?.highPerformers}
              subtitle="Top performers"
              icon="🏆"
              color="#4caf50"
              trend={5.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Need Improvement"
              value={data.performanceMetrics?.improvementNeeded}
              subtitle="Performance plan"
              icon="📈"
              color="#00c853"
              trend={-8.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Completed Goals"
              value={data.performanceMetrics?.completedGoals}
              subtitle="% of goals met"
              icon="🎯"
              color="#000000"
              trend={3.4}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Financial Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Payroll"
              value={`$${(data.financialMetrics?.totalPayroll / 1000000).toFixed(2)}M`}
              subtitle="Monthly"
              icon="💰"
              color="#4caf50"
              trend={2.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Average Salary"
              value={`$${data.financialMetrics?.averageSalary.toLocaleString()}`}
              subtitle="Per employee"
              icon="💵"
              color="#00c853"
              trend={1.5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Training Costs"
              value={`$${data.financialMetrics?.trainingCosts.toLocaleString()}`}
              subtitle="This month"
              icon="📚"
              color="#00c853"
              trend={8.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Recruitment Costs"
              value={`$${data.financialMetrics?.recruitmentCosts.toLocaleString()}`}
              subtitle="This month"
              icon="🔍"
              color="#000000"
              trend={-5.2}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )

  const renderAttendanceAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Attendance Trend
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Present</TableCell>
                    <TableCell align="right">Absent</TableCell>
                    <TableCell align="right">Late</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.dailyAttendance?.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell>{day.date}</TableCell>
                      <TableCell align="right">{day.present}</TableCell>
                      <TableCell align="right">{day.absent}</TableCell>
                      <TableCell align="right">{day.late}</TableCell>
                      <TableCell align="right">{day.total}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${((day.present / day.total) * 100).toFixed(1)}%`}
                          color={((day.present / day.total) * 100) >= 90 ? 'success' : 'warning'}
                          size="small"
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
              Department-wise Attendance
            </Typography>
            {data.departmentWise?.map((dept) => (
              <Box key={dept.department} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{dept.department}</Typography>
                  <Typography variant="body2">
                    {dept.present}/{dept.total} ({dept.rate}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={dept.rate}
                  sx={{ height: 8, borderRadius: 4 }}
                  color={dept.rate >= 90 ? 'success' : dept.rate >= 80 ? 'warning' : 'error'}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderPerformanceAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Rating Distribution
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rating</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell>Visual</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.ratings?.map((rating) => (
                    <TableRow key={rating.rating}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {'⭐'.repeat(rating.rating)}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{rating.count}</TableCell>
                      <TableCell align="right">{rating.percentage}%</TableCell>
                      <TableCell>
                        <LinearProgress
                          variant="determinate"
                          value={rating.percentage}
                          sx={{ width: 100 }}
                          color={rating.rating >= 4 ? 'success' : rating.rating >= 3 ? 'warning' : 'error'}
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

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Department Performance
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Avg Rating</TableCell>
                    <TableCell align="right">High Performers</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.departmentPerformance?.map((dept) => (
                    <TableRow key={dept.department}>
                      <TableCell>{dept.department}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={dept.avgRating}
                          color={dept.avgRating >= 4 ? 'success' : dept.avgRating >= 3.5 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{dept.highPerformers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderFinancialAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payroll Breakdown
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell>Visual</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.payrollBreakdown?.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">${item.amount.toLocaleString()}</TableCell>
                      <TableCell align="right">{item.percentage}%</TableCell>
                      <TableCell>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{ width: 100 }}
                          color="primary"
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

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Department Costs
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Cost</TableCell>
                    <TableCell align="right">Employees</TableCell>
                    <TableCell align="right">Avg Cost/Employee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.departmentCosts?.map((dept) => (
                    <TableRow key={dept.department}>
                      <TableCell>{dept.department}</TableCell>
                      <TableCell align="right">${dept.cost.toLocaleString()}</TableCell>
                      <TableCell align="right">{dept.employees}</TableCell>
                      <TableCell align="right">
                        ${Math.round(dept.cost / dept.employees).toLocaleString()}
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
  )

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: '#00c853', 
        color: 'white', 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={() => window.history.back()}>
            <Assessment />
          </IconButton>
          <Typography variant="h4">
            Analytics & Reports
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
              sx={{ 
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
              sx={{ 
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              <MenuItem value="overview">Overview</MenuItem>
              <MenuItem value="attendance">Attendance</MenuItem>
              <MenuItem value="performance">Performance</MenuItem>
              <MenuItem value="financial">Financial</MenuItem>
            </Select>
          </FormControl>

          <IconButton color="inherit" onClick={() => setOpenFilterDialog(true)}>
            <FilterList />
          </IconButton>

          <IconButton color="inherit" onClick={loadAnalyticsData}>
            <Refresh />
          </IconButton>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Download />}
            onClick={() => handleExport('json')}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ width: '100%', mt: 4 }}>
            <LinearProgress />
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
              Loading analytics data...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Report Content */}
            {reportType === 'overview' && renderOverviewAnalytics()}
            {reportType === 'attendance' && renderAttendanceAnalytics()}
            {reportType === 'performance' && renderPerformanceAnalytics()}
            {reportType === 'financial' && renderFinancialAnalytics()}
          </>
        )}
      </Box>

      {/* Filter Dialog */}
      <Dialog open={openFilterDialog} onClose={() => setOpenFilterDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select label="Department">
                  <MenuItem value="">All Departments</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="hr">HR</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFilterDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenFilterDialog(false)} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AnalyticsDashboard
