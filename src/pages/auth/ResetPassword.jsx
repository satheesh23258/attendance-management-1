import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Avatar,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  VpnKey,
  Lock,
  LockOutlined,
  Visibility,
  VisibilityOff,
  CheckCircle,
  ShieldOutlined
} from '@mui/icons-material'
import {
  authAPI
} from '../../services/api'
import {
  useLocation,
  useNavigate
} from 'react-router-dom'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state || {}
  const resetToken = state.resetToken || ''
  const identifier = state.identifier || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters for security.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match. Please verify.')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      // payload structure matches project backend
      await authAPI.resetPassword({ resetToken, identifier, newPassword: password })
      setSuccess(true)
      toast.success('Password updated successfully!')
      
      setTimeout(() => {
        navigate('/login') // Redirect to main login portal
      }, 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Session may have expired.')
      toast.error('Session expired. Please start over.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#1B5E20', // Matching HR Portal dark green
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Card sx={{ 
          boxShadow: '0 25px 70px rgba(0,0,0,0.06)', 
          borderRadius: 8, // Modern curved corners
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.02)'
        }}>
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Avatar sx={{ 
                bgcolor: '#000000', 
                color: '#FFFFFF', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 3,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }}>
                <LockOutlined sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: '#1a1a1a', 
                letterSpacing: '-1.5px',
                mb: 1 
              }}>
                Set New Password
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {identifier ? `Updating account: ${identifier}` : 'Final Step Recovery'}
              </Typography>
            </Box>

            <Divider sx={{ mb: 5, borderColor: 'rgba(0,0,0,0.05)' }} />

            {error && (
              <Alert severity="error" sx={{ mb: 4, borderRadius: 3, fontWeight: 500 }}>
                {error}
              </Alert>
            )}

            {!success ? (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Password Input */}
                <Typography variant="subtitle2" sx={{ mb: 1.5, ml: 1, fontWeight: 700, color: '#333' }}>
                  Secure New Password
                </Typography>
                <TextField 
                  fullWidth 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 4,
                      height: 60,
                      bgcolor: '#fcfcfc',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKey sx={{ color: '#00c853', ml: 1 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ mr: 1 }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* Confirm Password Input */}
                <Typography variant="subtitle2" sx={{ mb: 1.5, ml: 1, fontWeight: 700, color: '#333' }}>
                  Re-type Password
                </Typography>
                <TextField 
                  fullWidth 
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Verify your entry"
                  value={confirm} 
                  onChange={(e) => setConfirm(e.target.value)} 
                  sx={{ 
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 4,
                      height: 60,
                      bgcolor: '#fcfcfc',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CheckCircle sx={{ color: '#00c853', ml: 1 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirm(!showConfirm)} sx={{ mr: 1 }}>
                          {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button 
                  type="submit"
                  variant="contained" 
                  fullWidth 
                  disabled={loading || !password}
                  sx={{ 
                    py: 2.2, 
                    bgcolor: '#000000', 
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '17px',
                    textTransform: 'none',
                    borderRadius: 4,
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: '#222', transform: 'translateY(-2px)' },
                    transition: '0.4s'
                  }}
                >
                  {loading ? 'Securing account...' : 'Finalize Password Change'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ 
                p: 5, 
                bgcolor: '#F1F8E9', 
                borderRadius: 6, 
                textAlign: 'center',
                border: '1px solid #C8E6C9'
              }}>
                <CheckCircle sx={{ color: '#00c853', fontSize: 60, mb: 2 }} />
                <Typography variant="h5" color="#1b5e20" fontWeight="900" sx={{ mb: 1 }}>Success!</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Security update complete. Redirecting you to the login portal...
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, opacity: 0.4 }}>
              <ShieldOutlined sx={{ fontSize: 20 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                SECURE AUTHENTICATION HUB
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default ResetPassword
