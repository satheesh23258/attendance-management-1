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
  History,
  Person
} from '@mui/icons-material'

const CheckInOutTest = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(null)
  const [todayRecords, setTodayRecords] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = () => {
    const now = new Date()
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
  }

  const handleCheckOut = () => {
    const now = new Date()
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
  }

  const handleBack = () => {
    window.history.back()
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
          <IconButton color="inherit" onClick={handleBack} title="Back">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            Check In/Out
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: 'white', color: '#00c853' }}>
          <Person />
        </Avatar>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Current Time Card */}
        <Card sx={{ mb: 4, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h2" color="primary" gutterBottom>
              {formatTime(currentTime)}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {formatDate(currentTime)}
            </Typography>
            <Chip 
              label={isCheckedIn ? "Checked In" : "Not Checked In"}
              color={isCheckedIn ? "success" : "default"}
              size="large"
            />
          </CardContent>
        </Card>

        {/* Check In/Out Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent sx={{ py: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'success.main', 
                  mx: 'auto', 
                  mb: 2, 
                  width: 64, 
                  height: 64 
                }}>
                  <Login sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Check In
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Mark your attendance for today
                </Typography>
                <Button 
                  variant="contained" 
                  color="success"
                  fullWidth
                  size="large"
                  disabled={isCheckedIn}
                  onClick={() => setOpenDialog(true)}
                >
                  Check In Now
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent sx={{ py: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'error.main', 
                  mx: 'auto', 
                  mb: 2, 
                  width: 64, 
                  height: 64 
                }}>
                  <ExitToApp sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Check Out
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  End your work day
                </Typography>
                <Button 
                  variant="contained" 
                  color="error"
                  fullWidth
                  size="large"
                  disabled={!isCheckedIn}
                  onClick={() => setOpenDialog(true)}
                >
                  Check Out Now
                </Button>
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
                  <Typography variant="h4" color="success.main">
                    {checkInTime ? formatTime(checkInTime) : '--:--:--'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check In Time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {checkOutTime ? formatTime(checkOutTime) : '--:--:--'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check Out Time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {checkInTime && checkOutTime 
                      ? `${Math.round((checkOutTime - checkInTime) / (1000 * 60 * 60))}h ${Math.round(((checkOutTime - checkInTime) % (1000 * 60 * 60)) / (1000 * 60))}m`
                      : '--h --m'
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Hours
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
              Today's Records
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

export default CheckInOutTest
