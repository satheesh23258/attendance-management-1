import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material'
import {
  AccessTime,
  CheckCircle,
  Cancel,
  LocationOn,
  History,
  Info,
  GpsFixed,
  TravelExplore
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import axios from 'axios'
import toast from 'react-hot-toast'

const CheckInOutEnhanced = () => {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [status, setStatus] = useState('not_checked_in') // 'not_checked_in', 'checked_in'
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(null)
  const [todayRecord, setTodayRecord] = useState(null)
  const [employeeProfile, setEmployeeProfile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    fetchTodayStatus()
    fetchEmployeeProfile()
    getCurrentLocation()
    return () => clearInterval(timer)
  }, [])

  const fetchEmployeeProfile = async () => {
    try {
      const { data } = await axios.get('/api/employees/me')
      setEmployeeProfile(data)
    } catch (e) {
      console.error('Failed to fetch employee profile')
    }
  }

  const fetchTodayStatus = async () => {
    try {
      const { data } = await axios.get('/api/attendance/today')
      const myRecord = data.find(r => r.employeeId === user.id)
      if (myRecord) {
        setTodayRecord(myRecord)
        setStatus(myRecord.checkOut ? 'checked_out' : 'checked_in')
      }
    } catch (e) {
      console.error('Failed to fetch attendance status')
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setError("Please enable location access to check-in")
    )
  }

  const handleCheckIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post('/api/attendance/check-in', {
        lat: location?.lat,
        lng: location?.lng
      })
      toast.success('Successfully Checked In!')
      setTodayRecord(data)
      setStatus('checked_in')
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed. Are you within the geo-fence?')
      toast.error('Check-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/attendance/check-out')
      toast.success('Successfully Checked Out!')
      setTodayRecord(data)
      setStatus('checked_out')
    } catch (err) {
      toast.error('Check-out failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Check In / Out">
      <Box sx={{ p: 1 }}>
        <Grid container spacing={3}>
          {/* Time & Status Display */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h3" fontWeight="900" color="primary" gutterBottom>
                {currentTime.toLocaleTimeString()}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Chip 
                  label={status.replace(/_/g, ' ').toUpperCase()} 
                  color={status === 'checked_in' ? 'success' : 'default'}
                  sx={{ px: 2, height: 40, fontSize: '1rem', fontWeight: 'bold' }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
               <Grid item xs={12}>
                  {error && <Alert severity="error" icon={<Info />} sx={{ borderRadius: 3, mb: 1 }}>{error}</Alert>}
               </Grid>
               
               <Grid item xs={6}>
                 <Paper 
                  onClick={status === 'not_checked_in' ? handleCheckIn : null}
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    borderRadius: 4, 
                    cursor: status === 'not_checked_in' ? 'pointer' : 'default',
                    opacity: status === 'not_checked_in' ? 1 : 0.6,
                    border: '2px solid',
                    borderColor: status === 'not_checked_in' ? 'primary.main' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': { transform: status === 'not_checked_in' ? 'translateY(-5px)' : 'none' }
                  }}
                 >
                   <Avatar sx={{ bgcolor: 'success.light', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                     <CheckCircle fontSize="large" />
                   </Avatar>
                   <Typography variant="h6" fontWeight="bold">Check In</Typography>
                   <Typography variant="caption" color="text.secondary">Start your work session</Typography>
                   <Button fullWidth variant="contained" sx={{ mt: 2 }} disabled={status !== 'not_checked_in' || loading}>
                     {loading ? 'Processing...' : 'Punch In'}
                   </Button>
                 </Paper>
               </Grid>

               <Grid item xs={6}>
                 <Paper 
                  onClick={status === 'checked_in' ? handleCheckOut : null}
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    borderRadius: 4, 
                    cursor: status === 'checked_in' ? 'pointer' : 'default',
                    opacity: status === 'checked_in' ? 1 : 0.6,
                    border: '2px solid',
                    borderColor: status === 'checked_in' ? 'secondary.main' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': { transform: status === 'checked_in' ? 'translateY(-5px)' : 'none' }
                  }}
                 >
                   <Avatar sx={{ bgcolor: 'error.light', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                     <Cancel fontSize="large" />
                   </Avatar>
                   <Typography variant="h6" fontWeight="bold">Check Out</Typography>
                   <Typography variant="caption" color="text.secondary">End your day session</Typography>
                   <Button fullWidth variant="contained" color="secondary" sx={{ mt: 2 }} disabled={status !== 'checked_in' || loading}>
                     {loading ? 'Processing...' : 'Punch Out'}
                   </Button>
                 </Paper>
               </Grid>
            </Grid>
          </Grid>

          {/* Location & Geo-fence Info */}
          <Grid item xs={12}>
             <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                   <GpsFixed color="primary" />
                   <Typography variant="h6" fontWeight="bold">Geo-Fencing Analysis</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                 <Grid container spacing={3}>
                   <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3 }}>
                         <Typography variant="caption" color="text.secondary" display="block">CURRENT STATUS</Typography>
                         <Typography variant="body1" fontWeight="bold" color={location ? "success.main" : "error.main"}>
                            {location ? "Signal Active" : "Searching for Signal..."}
                         </Typography>
                      </Box>
                   </Grid>
                   <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3 }}>
                         <Typography variant="caption" color="text.secondary" display="block">WORK MODE</Typography>
                         <Typography variant="body1" fontWeight="bold">
                            {employeeProfile?.isRemote ? "Remote / Hybrid" : `Office Bound (${employeeProfile?.officeLocation?.radius || 100}m)`}
                         </Typography>
                      </Box>
                   </Grid>
                   <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3 }}>
                         <Typography variant="caption" color="text.secondary" display="block">TODAY'S COVERAGE</Typography>
                         <Typography variant="body1" fontWeight="bold">
                            {todayRecord?.workingHours || 0} Hours Tracked
                         </Typography>
                      </Box>
                   </Grid>
                </Grid>
             </Paper>
          </Grid>

          {/* History / Recent Records */}
          <Grid item xs={12}>
             <Typography variant="h6" sx={{ mb: 2, ml: 1 }}>Recent Punch Records</Typography>
             <Card sx={{ borderRadius: 4 }}>
                <List>
                   {todayRecord ? (
                     <>
                        <ListItem>
                           <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                           <ListItemText primary="Check In" secondary={`${todayRecord.date} at ${todayRecord.checkIn}`} />
                           <Chip label="Verified" size="small" color="success" variant="outlined" />
                        </ListItem>
                        {todayRecord.checkOut && (
                          <ListItem>
                             <ListItemIcon><Cancel color="error" /></ListItemIcon>
                             <ListItemText primary="Check Out" secondary={`${todayRecord.date} at ${todayRecord.checkOut}`} />
                             <Chip label="Logged" size="small" variant="outlined" />
                          </ListItem>
                        )}
                     </>
                   ) : (
                     <ListItem><ListItemText primary="No records found for today" /></ListItem>
                   )}
                </List>
             </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}

export default CheckInOutEnhanced
