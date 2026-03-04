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
  CircularProgress
} from '@mui/material'
import {
  CheckCircle,
  Lock
} from '@mui/icons-material'
import {
  authAPI
} from '../../services/api'
import {
  useNavigate
} from 'react-router-dom'

const ForgotPasswordRequest = () => {
  const [identifier, setIdentifier] = useState('') // email or phone
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [verified, setVerified] = useState(false)
  
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    if (!identifier) {
      setError('Please enter your email or phone')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const isEmail = /@/.test(identifier)
      const payload = isEmail ? { email: identifier, purpose: 'reset_password' } : { phone: identifier, purpose: 'reset_password' }
      await authAPI.requestOtp(payload)
      setOtpSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setError('Please enter the verification code')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const isEmail = /@/.test(identifier)
      const payload = isEmail ? { email: identifier, otp: otpCode, purpose: 'reset_password' } : { phone: identifier, otp: otpCode, purpose: 'reset_password' }
      const res = await authAPI.verifyOtp(payload)
      
      setVerified(true)
      setOtpSent(false)
      
      if (res.data?.resetToken) {
        setTimeout(() => {
          navigate('/reset-password', { state: { resetToken: res.data.resetToken } })
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#00c853',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 2
    }}>
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">Forgot Password</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Enter your registered email or phone to receive a verification code.
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <TextField 
                fullWidth 
                label="Email or Phone" 
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                sx={{ mb: 2 }} 
                disabled={verified}
              />
              
              {!verified && (
                <Box>
                  {!otpSent ? (
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      onClick={handleSendOtp} 
                      disabled={loading}
                      sx={{ py: 1.5 }}
                    >
                      {loading ? 'Sending...' : 'Send Verification Code'}
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Enter 6-digit Code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        onClick={handleVerifyOtp}
                        disabled={loading || !otpCode}
                      >
                        {loading ? 'Verifying...' : 'Verify'}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              
              {verified && (
                <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <CheckCircle sx={{ color: '#4caf50' }} />
                  <Typography variant="body1" color="#00c853" fontWeight="bold">Verified! Redirecting...</Typography>
                </Box>
              )}
            </Box>
            
            {!verified && (
              <Button 
                variant="text" 
                onClick={() => navigate('/login')} 
                sx={{ textTransform: 'none' }}
              >
                Back to Login
              </Button>
            )}
            
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default ForgotPasswordRequest
