import React, { useState, useEffect } from 'react'
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
  ShieldOutlined,
  CheckCircle,
  TimerOutlined,
  LockResetOutlined,
  VpnKeyOutlined,
  FiberManualRecord
} from '@mui/icons-material'
import {
  authAPI
} from '../../services/api'
import {
  useLocation,
  useNavigate
} from 'react-router-dom'
import toast from 'react-hot-toast'

const VerifyOtp = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Retrieve state data from previous navigation
  const stateData = location.state || {}
  const identifier = stateData.identifier || 'your device'
  const type = stateData.type || 'security'
  const purpose = stateData.purpose || 'verification'

  useEffect(() => {
    let interval = null
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendTimer])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!otp || otp.length < 6) {
      setError('A 6-digit valid security code is required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      // Map to real authAPI call
      await authAPI.verifyOtp({ identifier, otp, purpose })
      toast.success('Security identity confirmed!')
      
      // Redirect based on purpose
      if (purpose === 'reset_password') {
          navigate('/reset-password', { state: { ...stateData } })
      } else {
          navigate('/') // default to login login portal
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification code.')
      toast.error('Verification failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setResendTimer(60) // Cooldown for resends
      await authAPI.sendVerificationOtp({ identifier, type: identifier.includes('@') ? 'email' : 'phone' })
      toast.success('A new security code has been dispatched.')
    } catch (err) {
      setError('Communication error. Unable to resend at this time.')
      setResendTimer(0)
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
          boxShadow: '0 30px 90px rgba(0,0,0,0.07)', 
          borderRadius: 10, // Extreme rounded corners for ultra-modern look
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.02)'
        }}>
          <CardContent sx={{ p: { xs: 4, md: 7 } }}>
            {/* Header / Security Badge */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Avatar sx={{ 
                bgcolor: '#000000', 
                color: '#FFFFFF', 
                width: 90, 
                height: 90, 
                mx: 'auto', 
                mb: 4,
                boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
              }}>
                <VpnKeyOutlined sx={{ fontSize: 45 }} />
              </Avatar>
              <Typography variant="h3" sx={{ 
                fontWeight: 900, 
                color: '#1a1a1a', 
                letterSpacing: '-2px',
                mb: 1.5 
              }}>
                Identity Check
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                 <FiberManualRecord sx={{ fontSize: 10, color: '#00c853' }} />
                 <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                   Two-Factor Authentication Active
                 </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 5, borderColor: 'rgba(0,0,0,0.05)' }} />

            <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, fontWeight: 500, color: '#444' }}>
              We've dispatched a secure verification PIN to <strong>{identifier}</strong>. Enter it below to validate your request.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 4, borderRadius: 3, fontWeight: 600 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleVerify} noValidate>
              <TextField 
                fullWidth 
                placeholder="000000"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 5,
                    height: 70,
                    bgcolor: '#fafafa',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    letterSpacing: '10px',
                    transition: '0.3s',
                    '&:hover': { bgcolor: '#fff' }
                  },
                  '& input': { textAlign: 'center' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShieldOutlined sx={{ color: '#00c853', ml: 1 }} />
                    </InputAdornment>
                  )
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 5 }}>
                 <Button 
                   onClick={handleResend} 
                   disabled={resendTimer > 0}
                   startIcon={<TimerOutlined />}
                   sx={{ 
                     textTransform: 'none', 
                     color: resendTimer > 0 ? 'text.disabled' : '#00c853',
                     fontWeight: 700,
                     fontSize: '14px'
                   }}
                 >
                   {resendTimer > 0 ? `Retry transmission in ${resendTimer}s` : 'Request New Security PIN'}
                 </Button>
              </Box>

              <Button 
                type="submit"
                variant="contained" 
                fullWidth 
                disabled={loading || !otp}
                sx={{ 
                  py: 2.5, 
                  bgcolor: '#000000', 
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '18px',
                  textTransform: 'none',
                  borderRadius: 5,
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  '&:hover': { bgcolor: '#222', transform: 'translateY(-2px)' },
                  transition: '0.4s'
                }}
              >
                {loading ? 'Validating credentials...' : 'Confirm Identity Securely'}
              </Button>
            </Box>

            <Box sx={{ mt: 6, textAlign: 'center', opacity: 0.5 }}>
               <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 2 }}>
                  <LockResetOutlined sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                  SECURE VERIFICATION SHIELD
               </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default VerifyOtp
