import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material'
import {
  AccessTime,
  CheckCircle,
  ExitToApp,
  Login,
  ArrowBack,
  LocationOn,
  Schedule,
  History
} from '@mui/icons-material'
import { attendanceAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CheckInOut = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(null)
  const [todayRecords, setTodayRecords] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    // Load current status from API on mount
    const checkCurrentStatus = async () => {
      try {
        const res = await attendanceAPI.getTodayAttendance()
        if (res.data && res.data.length > 0) {
          const myRecord = res.data[0]; // assuming it returns my record
          if (myRecord.checkIn) {
            setIsCheckedIn(true);
            setCheckInTime(new Date(`${myRecord.date}T${myRecord.checkIn}`));
          }
          if (myRecord.checkOut) {
            setIsCheckedIn(false);
            setCheckOutTime(new Date(`${myRecord.date}T${myRecord.checkOut}`));
          }
        }
      } catch (err) {}
    }
    checkCurrentStatus();

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = async () => {
    try {
      const response = await attendanceAPI.checkIn({ notes });
      const record = response.data;
      const now = new Date();
      setIsCheckedIn(true)
      setCheckInTime(now)
      setTodayRecords([
        ...todayRecords,
        {
          type: 'check-in',
          time: now.toLocaleTimeString(),
          date: now.toLocaleDateString(),
          notes: notes || 'Regular check-in'
        }
      ])
      setNotes('')
      setOpenDialog(false)
      toast.success('Successfully checked in!');
    } catch (err) {
      toast.error('Failed to check in: ' + (err.response?.data?.message || err.message));
    }
  }

  const handleCheckOut = async () => {
    try {
      const response = await attendanceAPI.checkOut({ notes });
      const record = response.data;
      const now = new Date();
      setIsCheckedIn(false)
      setCheckOutTime(now)
      setTodayRecords([
        ...todayRecords,
        {
          type: 'check-out',
          time: now.toLocaleTimeString(),
          date: now.toLocaleDateString(),
          notes: notes || 'Regular check-out'
        }
      ])
      setNotes('')
      setOpenDialog(false)
      toast.success('Successfully checked out!');
    } catch (err) {
      toast.error('Failed to check out: ' + (err.response?.data?.message || err.message));
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A'
    const diff = new Date(end) - new Date(start)
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: '#00c853', 
        color: 'white', 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            Check In/Out
          </Typography>
        </Box>
        <Typography variant="h6">
          Employee Dashboard
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Current Time Card */}
        <Card sx={{ mb: 4, textAlign: 'center', background: '#00c853', color: 'white' }}>
          <CardContent sx={{ py: 4 }}>
            <Typography variant="h2" gutterBottom>
              {currentTime.toLocaleTimeString()}
            </Typography>
            <Typography variant="h6">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </CardContent>
        </Card>

        {/* Check In/Out Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent sx={{ py: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'success.main', 
                  mx: 'auto', 
                  mb: 2, 
                  width: 64, 
                  height: 64 
                }}>
                  <Login sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Check In
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Mark your attendance for today
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  color="success"
                  disabled={isCheckedIn}
                  onClick={() => setOpenDialog(true)}
                  sx={{ px: 4 }}
                >
                  {isCheckedIn ? 'Already Checked In' : 'Check In Now'}
                </Button>
                {checkInTime && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                    Last check-in: {checkInTime.toLocaleTimeString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent sx={{ py: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'error.main', 
                  mx: 'auto', 
                  mb: 2, 
                  width: 64, 
                  height: 64 
                }}>
                  <ExitToApp sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Check Out
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  End your work day
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  color="error"
                  disabled={!isCheckedIn}
                  onClick={() => setOpenDialog(true)}
                  sx={{ px: 4 }}
                >
                  {!isCheckedIn ? 'Check In First' : 'Check Out Now'}
                </Button>
                {checkOutTime && (
                  <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
                    Last check-out: {checkOutTime.toLocaleTimeString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Today's Summary */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today's Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {checkInTime ? checkInTime.toLocaleTimeString() : '--:--:--'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check In Time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error">
                    {checkOutTime ? checkOutTime.toLocaleTimeString() : '--:--:--'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check Out Time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {formatDuration(checkInTime, checkOutTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Duration
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Today's Records */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today's Attendance Records
            </Typography>
            <List>
              {todayRecords.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="No records for today" 
                    secondary="Check in to start tracking your attendance"
                  />
                </ListItem>
              ) : (
                todayRecords.map((record, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {record.type === 'check-in' ? (
                        <CheckCircle color="success" />
                      ) : (
                        <ExitToApp color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={record.type === 'check-in' ? 'Check In' : 'Check Out'}
                      secondary={`${record.time} - ${record.notes}`}
                    />
                    <Chip 
                      label={record.type} 
                      color={record.type === 'check-in' ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isCheckedIn ? 'Check Out Confirmation' : 'Check In Confirmation'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {isCheckedIn 
              ? 'Are you sure you want to check out now?' 
              : 'Are you sure you want to check in now?'
            }
          </Typography>
          <TextField
            fullWidth
            label="Notes (optional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
            variant="contained"
            color={isCheckedIn ? 'error' : 'success'}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CheckInOut
