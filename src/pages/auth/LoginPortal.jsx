import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Avatar,
  Grid,
  Paper
} from '@mui/material'
import {
  AdminPanelSettings,
  People,
  Person,
  Login as LoginIcon
} from '@mui/icons-material'

const LoginPortal = () => {
  const loginOptions = [
    {
      title: 'Admin Login',
      description: 'System Administrator Access',
      icon: <AdminPanelSettings sx={{ color: '#FFFFFF', fontSize: 35 }} />,
      color: '#000000',
      bgColor: '#FFFFFF',
      route: '/login/admin',
      features: ['Full System Control', 'User Management', 'System Settings', 'Reports']
    },
    {
      title: 'HR Login',
      description: 'Human Resources Portal',
      icon: <People sx={{ color: '#FFFFFF', fontSize: 35 }} />,
      color: '#000000',
      bgColor: '#FFFFFF',
      route: '/login/hr',
      features: ['Employee Management', 'Attendance Tracking', 'Performance Reviews', 'Analytics']
    },
    {
      title: 'Employee Login',
      description: 'Employee Portal',
      icon: <Person sx={{ color: '#FFFFFF', fontSize: 35 }} />,
      color: '#000000',
      bgColor: '#FFFFFF',
      route: '/login/employee',
      features: ['Task Management', 'Check In/Out', 'Location Tracking', 'Profile']
    }
  ]

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#1B5E20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Avatar sx={{ 
            bgcolor: 'white', 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 3 
          }}>
            <LoginIcon sx={{ fontSize: 40, color: '#000000' }} />
          </Avatar>
          <Typography variant="h3" color="white" gutterBottom fontWeight="bold">
            Employee Management System
          </Typography>
          <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
            Choose your role to access the system
          </Typography>
        </Box>

        {/* Login Options */}
        <Grid container spacing={4}>
          {loginOptions.map((option, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                },
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Icon and Title */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar sx={{ 
                      bgcolor: option.color, 
                      width: 70, 
                      height: 70, 
                      mx: 'auto', 
                      mb: 2 
                    }}>
                      {option.icon}
                    </Avatar>
                    <Typography variant="h5" color={option.color} gutterBottom fontWeight="bold">
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box sx={{ mb: 3, minHeight: '120px' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Access Features:</strong>
                    </Typography>
                    {option.features.map((feature, idx) => (
                      <Typography variant="caption" color="text.secondary" key={idx} sx={{ display: 'block', mb: 0.5 }}>
                        • {feature}
                      </Typography>
                    ))}
                  </Box>

                  {/* Login Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    href={option.route}
                    sx={{ 
                      bgcolor: option.color,
                      color: '#FFFFFF',
                      '&:hover': { bgcolor: option.color, opacity: 0.9 },
                      py: 1.5,
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Demo Info */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: 'rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Typography variant="h6" color="white" gutterBottom>
              Demo Credentials
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                  <strong>Admin:</strong><br />
                  admin@company.com<br />
                  admin123
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                  <strong>HR:</strong><br />
                  hr@company.com<br />
                  hr123
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                  <strong>Employee:</strong><br />
                  mike@company.com<br />
                  employee123
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Signup Links */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
            Don't have an account?{' '}
            <Button 
              href="/signup" 
              sx={{ 
                color: 'white', 
                textTransform: 'none',
                textDecoration: 'underline',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Sign Up Here
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginPortal
