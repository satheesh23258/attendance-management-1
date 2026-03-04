import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  authAPI
} from '../../services/api'
import {
  useLocation,
  useNavigate
} from 'react-router-dom'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state || {}
  const resetToken = state.resetToken || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await authAPI.resetPassword({ resetToken, newPassword: password })
      alert('Password reset successful. Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Reset Password</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField fullWidth label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} sx={{ mb: 2 }} />
          <Button variant="contained" fullWidth onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save Password'}</Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ResetPassword
