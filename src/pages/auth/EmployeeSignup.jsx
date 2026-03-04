import React, { useState } from 'react'
import {
  useNavigate
} from 'react-router-dom'
import {
  authAPI
} from '../../services/api'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  Person,
  PersonAdd,
  Work,
  CheckCircle,
  Visibility,
  VisibilityOff,
  Settings as SettingsIcon,
  Lock
} from '@mui/icons-material'

const EmployeeSignup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    position: '',
    phone: '',
    employeeId: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [phoneOtpCode, setPhoneOtpCode] = useState('')

  const [emailVerified, setEmailVerified] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtpCode, setEmailOtpCode] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      setError('Please enter an email address')
      return
    }
    setVerificationLoading(true)
    setError('')
    try {
      await authAPI.sendVerificationOtp({ identifier: formData.email, type: 'email' })
      setEmailOtpSent(true)
      setSuccess('Verification code sent to your email!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleVerifyEmailOtp = async () => {
    if (!emailOtpCode) {
      setError('Please enter the email verification code')
      return
    }
    setVerificationLoading(true)
    setError('')
    try {
      await authAPI.verifyOtp({ identifier: formData.email, otp: emailOtpCode, purpose: 'verify_email' })
      setEmailVerified(true)
      setEmailOtpSent(false)
      setSuccess('Email verified!')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleSendPhoneOtp = async () => {
    if (!formData.phone) {
      setError('Please enter a phone number')
      return
    }
    setVerificationLoading(true)
    setError('')
    try {
      await authAPI.sendVerificationOtp({ identifier: formData.phone, type: 'phone' })
      setPhoneOtpSent(true)
      setSuccess('Verification code sent to your phone!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtpCode) {
      setError('Please enter the phone verification code')
      return
    }
    setVerificationLoading(true)
    setError('')
    try {
      await authAPI.verifyOtp({ identifier: formData.phone, otp: phoneOtpCode, purpose: 'verify_phone' })
      setPhoneVerified(true)
      setPhoneOtpSent(false)
      setSuccess('Phone verified!')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: 'employee',
        department: formData.department,
        phone: formData.phone,
        employeeId: formData.employeeId,
      })
      
      setSuccess('Employee account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login/employee')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#1B5E20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 2
    }}>
      <Container maxWidth="md">
        <Card sx={{ 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{ 
                bgcolor: '#000000', color: '#FFFFFF', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2 
              }}>
                <PersonAdd sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ color: "#000000" }} gutterBottom fontWeight="bold">
                Employee Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new employee account
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Employee Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="mike@company.com"
                    disabled={emailVerified}
                  
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#1B5E20' }} />
                    </InputAdornment>
                  )
                }}
              />
                  {formData.email && !emailVerified && (
                    <Box sx={{ mt: 1 }}>
                      {!emailOtpSent ? (
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          onClick={handleSendEmailOtp}
                          disabled={verificationLoading}
                        >
                          {verificationLoading ? 'Sending...' : 'Verify Email'}
                        </Button>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            size="small"
                            label="Email OTP"
                            value={emailOtpCode}
                            onChange={(e) => setEmailOtpCode(e.target.value)}
                            placeholder="000000"
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleVerifyEmailOtp}
                            disabled={verificationLoading || !emailOtpCode}
                          >
                            Verify
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                  {emailVerified && (
                    <Box sx={{ mt: 1, p: 0.5, bgcolor: '#e8f5e9', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ color: '#1B5E20', fontSize: 16 }} />
                      <Typography variant="caption" sx={{ color: "#000000" }} gutterBottom fontWeight="bold">Email verified</Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                sx={{ mb: 2 }}
                placeholder="EMP001"
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    disabled={phoneVerified}
                  
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#1B5E20' }} />
                    </InputAdornment>
                  )
                }}
              />
                  {formData.phone && !phoneVerified && (
                    <Box sx={{ mt: 1 }}>
                      {!phoneOtpSent ? (
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          onClick={handleSendPhoneOtp}
                          disabled={verificationLoading}
                        >
                          {verificationLoading ? 'Sending...' : 'Verify Phone'}
                        </Button>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            size="small"
                            label="Phone OTP"
                            value={phoneOtpCode}
                            onChange={(e) => setPhoneOtpCode(e.target.value)}
                            placeholder="000000"
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleVerifyPhoneOtp}
                            disabled={verificationLoading || !phoneOtpCode}
                          >
                            Verify
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                  {phoneVerified && (
                    <Box sx={{ mt: 1, p: 0.5, bgcolor: '#e8f5e9', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ color: '#1B5E20', fontSize: 16 }} />
                      <Typography variant="caption" sx={{ color: "#000000" }} gutterBottom fontWeight="bold">Phone verified</Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  label="Department"
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Customer Support">Customer Support</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                sx={{ mb: 2 }}
                placeholder="Software Engineer"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                helperText="Minimum 8 characters"
              
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#1B5E20' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#000000" }}>
                        {showPassword ? <VisibilityOff sx={{ color: "#000000" }} /> : <Visibility sx={{ color: "#1B5E20" }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#1B5E20' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#000000" }}>
                        {showPassword ? <VisibilityOff sx={{ color: "#000000" }} /> : <Visibility sx={{ color: "#1B5E20" }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !phoneVerified || !emailVerified}
                sx={{ 
                  bgcolor: '#000000', color: '#FFFFFF',
                  '&:hover': { bgcolor: '#000000' },
                  py: 1.5,
                  fontSize: '16px'
                }}
              >
                {!emailVerified || !phoneVerified ? 'Verify Email & Phone to Continue' : (loading ? 'Creating Account...' : 'Create Employee Account')}
              </Button>
            </form>

            {/* Navigation Links */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an employee account?{' '}
                <Button 
                  href="/login/employee" 
                  variant="outlined"
                  sx={{ 
                    textTransform: 'none', 
                    color: '#000000',
                    borderColor: '#1B5E20',
                    mx: 1,
                    '&:hover': { bgcolor: '#f5f5f5', borderColor: '#1B5E20' }
                  }}
                >
                  Sign In
                </Button>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Want to register as different role?{' '}
                <Button 
                  href="/signup/admin" 
                  variant="outlined"
                  sx={{ 
                    textTransform: 'none', 
                    color: '#000000',
                    borderColor: '#1B5E20',
                    mx: 1,
                    '&:hover': { bgcolor: '#f5f5f5', borderColor: '#1B5E20' }
                  }}
                >
                  Admin Signup
                </Button>
                {' | '}
                <Button 
                  href="/signup/hr" 
                  variant="outlined"
                  sx={{ 
                    textTransform: 'none', 
                    color: '#000000',
                    borderColor: '#1B5E20',
                    mx: 1,
                    '&:hover': { bgcolor: '#f5f5f5', borderColor: '#1B5E20' }
                  }}
                >
                  HR Signup
                </Button>
              </Typography>
            </Box>

            {/* Employee Features Notice */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Work sx={{ fontSize: 16, color: '#1B5E20' }} />
                <Typography variant="body2" sx={{ color: "#000000" }} gutterBottom fontWeight="bold">
                  Employee Features
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Access your tasks, check in/out, location tracking, and personal profile.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default EmployeeSignup
