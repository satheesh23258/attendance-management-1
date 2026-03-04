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
  Paper,
  IconButton
} from '@mui/material'
import {
  LocationOn,
  AccessTime,
  ArrowBack,
  CheckCircle,
  History,
  Map,
  MyLocation as MyLocationIcon,
  EditLocation
} from '@mui/icons-material'

const MyLocation = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'Office Building, 123 Main St, New York, NY 10001'
  })
  const [locationHistory, setLocationHistory] = useState([
    {
      id: 1,
      time: '09:00 AM',
      date: '2024-01-26',
      address: 'Office Building, 123 Main St, New York, NY 10001',
      type: 'check-in',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      time: '02:30 PM',
      date: '2024-01-26',
      address: 'Conference Room, Floor 5, Office Building',
      type: 'movement',
      coordinates: { lat: 40.7129, lng: -74.0061 }
    },
    {
      id: 3,
      time: '06:00 PM',
      date: '2024-01-25',
      address: 'Office Building, 123 Main St, New York, NY 10001',
      type: 'check-out',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    }
  ])
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [newAddress, setNewAddress] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `Current Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
          }
          setCurrentLocation(newPosition)

          // Add to history
          const newRecord = {
            id: locationHistory.length + 1,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString(),
            address: newPosition.address,
            type: 'update',
            coordinates: { lat: newPosition.latitude, lng: newPosition.longitude }
          }
          setLocationHistory([newRecord, ...locationHistory])
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  const handleUpdateLocation = () => {
    if (newAddress.trim()) {
      const updatedLocation = {
        ...currentLocation,
        address: newAddress
      }
      setCurrentLocation(updatedLocation)

      // Add to history
      const newRecord = {
        id: locationHistory.length + 1,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        address: newAddress,
        type: 'manual-update',
        coordinates: { lat: currentLocation.latitude, lng: currentLocation.longitude }
      }
      setLocationHistory([newRecord, ...locationHistory])
      setNewAddress('')
      setOpenUpdateDialog(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  const getLocationIcon = (type) => {
    switch (type) {
      case 'check-in': return <CheckCircle color="success" />
      case 'check-out': return <LocationOn color="error" />
      case 'movement': return <MyLocationIcon color="info" />
      case 'update': return <MyLocationIcon color="primary" />
      case 'manual-update': return <EditLocation color="warning" />
      default: return <LocationOn />
    }
  }

  const getLocationTypeColor = (type) => {
    switch (type) {
      case 'check-in': return 'success'
      case 'check-out': return 'error'
      case 'movement': return 'info'
      case 'update': return 'primary'
      case 'manual-update': return 'warning'
      default: return 'default'
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        background: '#00c853',
        color: 'white',
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        borderRadius: '0 0 16px 16px'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={handleBack}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              My Location
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Track and update your current location
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Employee Portal"
          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Current Location Card */}
        <Card sx={{ mb: 4, background: '#00c853', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h5">
                Current Location
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {currentLocation.address}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Coordinates: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Last updated: {currentTime.toLocaleTimeString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Location Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent sx={{ py: 3 }}>
                <Avatar sx={{
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2,
                  width: 56,
                  height: 56
                }}>
                  <MyLocationIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Get Current Location
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Use GPS to get your current location
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleGetCurrentLocation}
                >
                  Get Location
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent sx={{ py: 3 }}>
                <Avatar sx={{
                  bgcolor: 'warning.main',
                  mx: 'auto',
                  mb: 2,
                  width: 56,
                  height: 56
                }}>
                  <EditLocation sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Update Location
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Manually update your location
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  onClick={() => setOpenUpdateDialog(true)}
                >
                  Update Location
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Location Statistics */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today's Location Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {locationHistory.filter(l => l.date === new Date().toLocaleDateString()).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location Updates Today
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {locationHistory.filter(l => l.type === 'check-in').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check-ins This Week
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {locationHistory.filter(l => l.type === 'check-out').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check-outs This Week
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Location History */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Location History
            </Typography>
            <List>
              {locationHistory.map((record) => (
                <ListItem key={record.id} sx={{ mb: 1 }}>
                  <ListItemIcon>
                    {getLocationIcon(record.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={record.address}
                    secondary={`${record.date} at ${record.time}`}
                  />
                  <Chip
                    label={record.type.replace('-', ' ')}
                    color={getLocationTypeColor(record.type)}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Update Location Dialog */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Location</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Enter your current location address:
          </Typography>
          <TextField
            fullWidth
            label="Location Address"
            multiline
            rows={3}
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="e.g., Conference Room, Floor 5, Office Building"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateLocation}
            variant="contained"
            disabled={!newAddress.trim()}
          >
            Update Location
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyLocation
