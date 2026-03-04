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
import {
  authAPI
} from '../../services/api'
import {
  useLocation,
  useNavigate
} from 'react-router-dom'

const VerifyOtp = () => {
  const location = useLocation()
          <Typography variant="h6" gutterBottom>Enter verification code</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            We sent a 6-digit code to your phone. Enter it here to continue.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField fullWidth label="OTP code" value={otp} onChange={(e) => setOtp(e.target.value)} sx={{ mb: 2 }} />
          <Button variant="contained" fullWidth onClick={handleVerify} disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</Button>
          <Button variant="text" fullWidth onClick={handleResend} sx={{ mt: 1 }} disabled={resendTimer > 0}>
            {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default VerifyOtp
