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
  InputAdornment
} from '@mui/material'
import {
  CheckCircle,
  ArrowBack,
  Phone,
  Email,
  VpnKey,
  LockOutlined
} from '@mui/icons-material'
import {
  authAPI
} from '../../services/api'
import {
  useNavigate
} from 'react-router-dom'
import toast from 'react-hot-toast'

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
      // Using sendVerificationOtp as it's the standard for this project
      await authAPI.sendVerificationOtp({ identifier, type: isEmail ? 'email' : 'phone' })
      setOtpSent(true)
      toast.success('Verification code sent!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Ensure your identifier is correct.')
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
      const res = await authAPI.verifyOtp({ identifier, otp: otpCode, purpose: 'reset_password' })
      
      setVerified(true)
      setOtpSent(false)
      toast.success('Identity verified!')
      
      if (res.data?.resetToken) {
        setTimeout(() => {
          navigate('/reset-password', { state: { resetToken: res.data.resetToken, identifier } })
        }, 1500)
      } else {
        // Fallback for different API responses
        setTimeout(() => {
          navigate('/reset-password', { state: { identifier } })
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#1B5E20', // Matching the HR Portal dark green
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Card sx={{ 
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)', 
          borderRadius: 8, // Very rounded for modern look
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.02)'
        }}>
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            {/* Logo/Icon Container */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Avatar sx={{ 
                bgcolor: '#1b5e20', // Dark green matching project theme
                color: '#FFFFFF', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 3,
                boxShadow: '0 8px 20px rgba(27, 94, 32, 0.2)'
              }}>
                <VpnKey sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: '#1a1a1a', 
                letterSpacing: '-1px',
                mb: 1 
              }}>
                Account Recovery
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Identify yourself to regain access
              </Typography>
            </Box>

            <Divider sx={{ mb: 5, borderColor: 'rgba(0,0,0,0.06)' }} />
            
            {error && (
              <Alert severity="error" sx={{ mb: 4, borderRadius: 3, fontWeight: 500 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" noValidate>
              {/* Main Input Field */}
              <Typography variant="subtitle2" sx={{ mb: 1, ml: 1, fontWeight: 700, color: '#333' }}>
                Email or Mobile Number
              </Typography>
              <TextField 
                fullWidth 
                placeholder="e.g. employee@company.com"
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                disabled={verified || otpSent}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    height: 60,
                    bgcolor: '#f9f9f9',
                    fontSize: '1.1rem',
                    transition: '0.3s',
                    '&:hover': { bgcolor: '#fff' },
                    '&.Mui-focused': { bgcolor: '#fff' }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/@/.test(identifier) ? (
                        <Email sx={{ color: '#00c853', ml: 1 }} />
                      ) : (
                        <Phone sx={{ color: '#00c853', ml: 1 }} />
                      )}
                    </InputAdornment>
                  )
                }}
              />
              
              {/* OTP Field */}
              {otpSent && !verified && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, ml: 1, fontWeight: 700, color: '#333' }}>
                    Verification Code
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="6-digit PIN"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    sx={{ 
                      mb: 4,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        height: 60,
                        bgcolor: '#f9f9f9',
                        fontSize: '1.1rem'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckCircle sx={{ color: '#00c853', ml: 1 }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              )}

              {/* Action Button */}
              {!verified ? (
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={!otpSent ? handleSendOtp : handleVerifyOtp} 
                  disabled={loading || !identifier}
                  sx={{ 
                    py: 2.2, 
                    bgcolor: '#000000', // Black button matching portal style
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '17px',
                    textTransform: 'none',
                    borderRadius: 4,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: '#222', transform: 'translateY(-2px)' },
                    transition: '0.4s'
                  }}
                >
                  {loading ? 'Processing security...' : (otpSent ? 'Verify My Identity' : 'Request Security Code')}
                </Button>
              ) : (
                <Box sx={{ 
                  p: 4, 
                  bgcolor: '#F1F8E9', 
                  borderRadius: 5, 
                  textAlign: 'center',
                  border: '1px solid #C8E6C9'
                }}>
                  <CheckCircle sx={{ color: '#00c853', fontSize: 50, mb: 2 }} />
                  <Typography variant="h6" color="#1b5e20" fontWeight="800">Verified</Typography>
                  <Typography variant="body2" color="text.secondary">Step 1 complete. Loading reset options...</Typography>
                </Box>
              )}
            </Box>

            {/* Bottom Actions */}
            <Box sx={{ mt: 5, pt: 4, borderTop: '1px dotted rgba(0,0,0,0.1)', textAlign: 'center' }}>
               <Button 
                 variant="outlined"
                 startIcon={<ArrowBack />}
                 onClick={() => navigate('/login')}
                 sx={{ 
                   textTransform: 'none', 
                   color: '#2c3e50',
                   borderColor: '#cfd8dc',
                   fontWeight: 600,
                   px: 4,
                   py: 1.5,
                   borderRadius: 4,
                   '&:hover': { borderColor: '#1b5e20', color: '#1b5e20', bgcolor: 'transparent' }
                 }}
               >
                 Return to Sign In
               </Button>
               
               <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, opacity: 0.5 }}>
                  <LockOutlined sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
                    PROTECTED BY 256-BIT ENCRYPTION
                  </Typography>
               </Box>
            </Box>
            
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default ForgotPasswordRequest
