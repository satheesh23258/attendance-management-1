import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  ArrowBack,
  TrendingUp,
  TrendingDown,
  People,
  Assessment,
  Schedule,
  AttachMoney,
  Download,
  Refresh
} from '@mui/icons-material'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month')
  const [openDialog, setOpenDialog] = useState(false)

  const handleBack = () => {
    window.history.back()
  }

  const handleExport = () => {
    alert('Export functionality would download analytics data as PDF/Excel file')
  }

  const handleRefresh = () => {
    alert('Data refreshed successfully!')
  }

  const analyticsData = {
    employeeMetrics: {
      totalEmployees: 156,
      activeEmployees: 142,
      newHires: 12,
      turnoverRate: 3.2,
      avgTenure: 2.8,
      satisfactionScore: 4.2
    },
    attendanceMetrics: {
      avgAttendanceRate: 94.5,
      punctualityRate: 91.2,
      absentDays: 24,
      lateDays: 18,
      overtimeHours: 156,
      productivityIndex: 87.3
    },
    performanceMetrics: {
      avgPerformanceScore: 4.1,
      highPerformers: 45,
      meetingTargets: 78,
      trainingCompletion: 92,
      promotionRate: 8.5,
      skillGapIndex: 12.4
    },
    financialMetrics: {
      totalPayroll: 2450000,
      avgSalary: 15600,
      trainingCosts: 45000,
      recruitmentCosts: 28000,
      benefitsCosts: 612000,
      costPerHire: 4200
    }
  }

  const MetricCard = ({ title, value, subtitle, trend, color, icon }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 1, 
            bgcolor: `${color}.light`, 
            color: `${color}.main`,
            mr: 2
          }}>
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', color: trend > 0 ? 'success.main' : 'error.main' }}>
              {trend > 0 ? <TrendingUp /> : <TrendingDown />}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
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
          <IconButton color="inherit" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            HR Analytics Dashboard
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            color="inherit"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button 
            variant="outlined" 
            color="inherit"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Time Range Selector */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Analytics Overview
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="quarter">Last Quarter</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Employee Metrics */}
        <Typography variant="h6" gutterBottom>
          Employee Metrics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Total Employees"
              value={analyticsData.employeeMetrics.totalEmployees}
              subtitle={`Active: ${analyticsData.employeeMetrics.activeEmployees}`}
              trend={2.1}
              color="primary"
              icon={<People />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="New Hires"
              value={analyticsData.employeeMetrics.newHires}
              subtitle="This month"
              trend={15.3}
              color="success"
              icon={<TrendingUp />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Turnover Rate"
              value={`${analyticsData.employeeMetrics.turnoverRate}%`}
              subtitle="Annual rate"
              trend={-0.8}
              color="error"
              icon={<TrendingDown />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Avg Tenure"
              value={`${analyticsData.employeeMetrics.avgTenure} yrs`}
              subtitle="Average years of service"
              trend={0.3}
              color="info"
              icon={<Schedule />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Satisfaction Score"
              value={analyticsData.employeeMetrics.satisfactionScore}
              subtitle="Out of 5.0"
              trend={1.2}
              color="warning"
              icon={<Assessment />}
            />
          </Grid>
        </Grid>

        {/* Attendance Metrics */}
        <Typography variant="h6" gutterBottom>
          Attendance Metrics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Attendance Rate"
              value={`${analyticsData.attendanceMetrics.avgAttendanceRate}%`}
              subtitle="Monthly average"
              trend={1.5}
              color="success"
              icon={<Schedule />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Punctuality Rate"
              value={`${analyticsData.attendanceMetrics.punctualityRate}%`}
              subtitle="On-time arrivals"
              trend={0.8}
              color="primary"
              icon={<TrendingUp />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Absent Days"
              value={analyticsData.attendanceMetrics.absentDays}
              subtitle="This month"
              trend={-12.3}
              color="error"
              icon={<TrendingDown />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Overtime Hours"
              value={analyticsData.attendanceMetrics.overtimeHours}
              subtitle="Total this month"
              trend={8.7}
              color="warning"
              icon={<Schedule />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Productivity Index"
              value={analyticsData.attendanceMetrics.productivityIndex}
              subtitle="Out of 100"
              trend={3.2}
              color="success"
              icon={<Assessment />}
            />
          </Grid>
        </Grid>

        {/* Performance Metrics */}
        <Typography variant="h6" gutterBottom>
          Performance Metrics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Avg Performance Score"
              value={analyticsData.performanceMetrics.avgPerformanceScore}
              subtitle="Out of 5.0"
              trend={0.4}
              color="primary"
              icon={<Assessment />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="High Performers"
              value={analyticsData.performanceMetrics.highPerformers}
              subtitle="Score ≥ 4.5"
              trend={12.5}
              color="success"
              icon={<TrendingUp />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Meeting Targets"
              value={`${analyticsData.performanceMetrics.meetingTargets}%`}
              subtitle="Of employees"
              trend={5.2}
              color="info"
              icon={<Assessment />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Training Completion"
              value={`${analyticsData.performanceMetrics.trainingCompletion}%`}
              subtitle="Of assigned courses"
              trend={3.8}
              color="success"
              icon={<TrendingUp />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Promotion Rate"
              value={`${analyticsData.performanceMetrics.promotionRate}%`}
              subtitle="Annual rate"
              trend={1.1}
              color="warning"
              icon={<TrendingUp />}
            />
          </Grid>
        </Grid>

        {/* Financial Metrics */}
        <Typography variant="h6" gutterBottom>
          Financial Metrics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Total Payroll"
              value={`$${(analyticsData.financialMetrics.totalPayroll / 1000000).toFixed(2)}M`}
              subtitle="Monthly"
              trend={2.3}
              color="primary"
              icon={<AttachMoney />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Avg Salary"
              value={`$${analyticsData.financialMetrics.avgSalary.toLocaleString()}`}
              subtitle="Per employee"
              trend={1.8}
              color="success"
              icon={<AttachMoney />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Training Costs"
              value={`$${analyticsData.financialMetrics.trainingCosts.toLocaleString()}`}
              subtitle="This month"
              trend={-5.2}
              color="warning"
              icon={<AttachMoney />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Recruitment Costs"
              value={`$${analyticsData.financialMetrics.recruitmentCosts.toLocaleString()}`}
              subtitle="This month"
              trend={8.9}
              color="info"
              icon={<AttachMoney />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Benefits Costs"
              value={`$${(analyticsData.financialMetrics.benefitsCosts / 1000).toFixed(0)}K`}
              subtitle="Monthly"
              trend={1.5}
              color="primary"
              icon={<AttachMoney />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Cost Per Hire"
              value={`$${analyticsData.financialMetrics.costPerHire.toLocaleString()}`}
              subtitle="Average"
              trend={-3.1}
              color="success"
              icon={<AttachMoney />}
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => alert('Generate detailed employee report')}
                >
                  Employee Report
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => alert('Generate attendance analysis')}
                >
                  Attendance Analysis
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => alert('Generate performance summary')}
                >
                  Performance Summary
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => alert('Generate financial overview')}
                >
                  Financial Overview
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Analytics
