import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link
} from '@mui/material'

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Simple mock authentication
    if (credentials.email === 'admin@company.com' && credentials.password === 'admin123') {
      setSuccess('Login successful! Redirecting to Admin Dashboard...')
      setTimeout(() => {
        window.location.href = '/dashboard/admin'
      }, 1500)
    } else if (credentials.email === 'hr@company.com' && credentials.password === 'hr123') {
      setSuccess('Login successful! Redirecting to HR Dashboard...')
      setTimeout(() => {
        window.location.href = '/dashboard/hr'
      }, 1500)
    } else if (credentials.email === 'mike@company.com' && credentials.password === 'employee123') {
      setSuccess('Login successful! Redirecting to Employee Dashboard...')
      setTimeout(() => {
        window.location.href = '/dashboard/employee'
      }, 1500)
    } else {
      setError('Invalid email or password')
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#00c853'
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Login
          </Typography>
          
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Employee Management System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </form>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link href="/signup" underline="hover">
                Sign up here
              </Link>
            </Typography>
          </Box>

          <Box mt={3}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block" textAlign="center">
              Admin: admin@company.com / admin123
            </Typography>
            <Typography variant="caption" display="block" textAlign="center">
              HR: hr@company.com / hr123
            </Typography>
            <Typography variant="caption" display="block" textAlign="center">
              Employee: mike@company.com / employee123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
