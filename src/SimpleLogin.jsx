import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material'

const SimpleLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simple mock authentication
    if (credentials.email === 'admin@company.com' && credentials.password === 'admin123') {
      alert('Login successful! Welcome Admin!')
    } else if (credentials.email === 'hr@company.com' && credentials.password === 'hr123') {
      alert('Login successful! Welcome HR!')
    } else if (credentials.email === 'mike@company.com' && credentials.password === 'employee123') {
      alert('Login successful! Welcome Employee!')
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

export default SimpleLogin
