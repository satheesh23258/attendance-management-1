import React, { useState } from 'react'
import {
  Link,
  useNavigate
} from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material'
import {
  useAuth
} from '../../contexts/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const result = await login(formData)
    if (result.success) {
      // Redirect based on user role
      const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
      if (user.role === 'admin') {
        navigate('/admin')
      } else if (user.role === 'hr') {
        navigate('/hr')
      } else {
        navigate('/employee')
      }
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          Sign In
        </Typography>
        
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          Enter your credentials to access the system
        </Typography>

        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign In'
          )}
        </Button>

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              Sign Up
            </Link>
            {' '}|{' '}
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
              Forgot Password
            </Link>
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="caption" display="block" textAlign="center" color="text.secondary">
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
    </Box>
  )
}

export default Login
