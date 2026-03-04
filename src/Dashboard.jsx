import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar
} from '@mui/material'
import {
  Dashboard,
  People,
  Assignment,
  AccessTime,
  Notifications,
  Settings,
  Logout
} from '@mui/icons-material'

const Dashboard = ({ userRole = 'employee' }) => {
  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Dashboard'
      case 'hr':
        return 'HR Dashboard'
      default:
        return 'Employee Dashboard'
    }
  }

  const getRoleColor = () => {
    switch (userRole) {
      case 'admin':
        return '#000000'
      case 'hr':
        return '#f2c94c'
      default:
        return '#2f80ed'
    }
  }

  const headerTextColor = userRole === 'hr' ? 'black' : 'white'
  const handleLogout = () => {
    window.location.href = '/login'
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        backgroundColor: getRoleColor(),
        color: headerTextColor,
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h4">
          Employee Management System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: getRoleColor() }}>
            {userRole.toUpperCase().charAt(0)}
          </Avatar>
          <Typography variant="h6">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to {getWelcomeMessage()}
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          This is your personalized dashboard. You can manage your activities from here.
        </Typography>

        {/* Dashboard Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#00c853', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <Dashboard />
              </Avatar>
              <Typography variant="h6">Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                Overview
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#00c853', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <People />
              </Avatar>
              <Typography variant="h6">Employees</Typography>
              <Typography variant="body2" color="text.secondary">
                {userRole === 'admin' ? 'Manage Staff' : 'Team Members'}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#00c853', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <Assignment />
              </Avatar>
              <Typography variant="h6">Services</Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks & Projects
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#000000', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <AccessTime />
              </Avatar>
              <Typography variant="h6">Attendance</Typography>
              <Typography variant="body2" color="text.secondary">
                Time Tracking
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" fullWidth startIcon={<AccessTime />}>
                  Check In
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" fullWidth startIcon={<Assignment />}>
                  New Service
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" fullWidth startIcon={<Notifications />}>
                  Notifications
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" fullWidth startIcon={<Settings />}>
                  Settings
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • You logged in successfully
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Welcome to the Employee Management System
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Explore the dashboard features
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Dashboard
