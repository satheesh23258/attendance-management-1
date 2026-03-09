import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert
} from '@mui/material'
import {
  LocationOn,
  MyLocation,
  Refresh,
  Person,
  AccessTime,
  Navigation,
  Timeline,
  ArrowBack,
  Info,
  Warning
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { attendanceAPI, employeeAPI, locationAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { loadGoogleMaps } from '../../utils/googleMapsLoader'

const LiveLocation = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const googleMapRef = useRef(null)
  const markersRef = useRef({})
  const polylineRef = useRef(null)
  const directionsServiceRef = useRef(null)
  const directionsRendererRef = useRef(null)

  const [locations, setLocations] = useState([])
  const [employeeMap, setEmployeeMap] = useState({})
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [showRoutes, setShowRoutes] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })
  const [mapZoom, setMapZoom] = useState(12)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [mapError, setMapError] = useState(null)


  // Initialize Google Map
  useEffect(() => {
    const initMap = async () => {
      try {
        setMapError(null)
        
        if (!mapRef.current) {
          console.warn('Map container not found')
          return
        }

        // Load Google Maps API
        console.log('Loading Google Maps API...')
        const google = await loadGoogleMaps()
        
        if (!google || !google.maps) {
          throw new Error('Google Maps API failed to load properly')
        }

        console.log('✅ Initializing map...')
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          zoom: mapZoom,
          center: mapCenter,
          mapTypeId: 'roadmap',
          gestureHandling: 'greedy',
          fullscreenControl: true,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true
        })

        console.log('✅ Map initialized successfully')

        directionsServiceRef.current = new google.maps.DirectionsService()
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: googleMapRef.current,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#0055ff',
            strokeOpacity: 0.8,
            strokeWeight: 5
          }
        })
        
        // Load data after map is ready
        await fetchData()
      } catch (error) {
        console.error('Map initialization error:', error)
        setMapError(error.message || 'Failed to load Google Maps')
        toast.error('Failed to load Google Maps: ' + error.message)
      }
    }

    const timer = setTimeout(initMap, 500)
    return () => clearTimeout(timer)
  }, [])

  // Update map whenever locations or selectedEmployee changes
  useEffect(() => {
    if (googleMapRef.current && locations.length > 0) {
      console.log('🗺️ Updating map markers...')
      updateMapMarkers(locations)
    }
  }, [locations, selectedEmployee])

  // Real-time location polling
  useEffect(() => {
    if (!googleMapRef.current) return

    const pollLocations = async () => {
      try {
        await fetchLiveLocations()
      } catch (error) {
        console.error('Polling error:', error)
      }
    }

    // Update every 10 seconds for real-time tracking
    const interval = setInterval(pollLocations, 10000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setMapError(null)
      
      console.log('📍 Fetching employees and locations...')
      
      const [empRes, locRes] = await Promise.all([
        employeeAPI.getAll(),
        locationAPI.getLiveLocations()
      ])

      console.log('✅ Employees fetched:', empRes.data)
      console.log('✅ Locations fetched:', locRes.data)

      const allEmployees = empRes.data.data || empRes.data || []
      setEmployees(allEmployees)

      const map = {}
      allEmployees.forEach((emp) => {
        map[emp.email] = emp
        map[emp.id] = emp
        map[emp._id] = emp
      })
      setEmployeeMap(map)

      if (locRes.data) {
        if (Array.isArray(locRes.data)) {
          setLocations(locRes.data)
          console.log(`✅ Loaded ${locRes.data.length} live locations`)
        } else {
          console.warn('Location data is not an array:', locRes.data)
          setLocations([])
        }
      } else {
        console.warn('No location data received')
        setLocations([])
      }

      // If no locations, create mock data for demo
      if (!locRes.data || locRes.data.length === 0) {
        console.log('⚠️ No live locations found. Creating mock data...')
        const mockLocations = allEmployees.slice(0, 4).map((emp, index) => ({
          id: emp._id || emp.id,
          employeeId: emp._id || emp.id,
          employeeName: emp.name,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.05,
          longitude: -74.006 + (Math.random() - 0.5) * 0.05,
          address: ['Office Main Building', 'Client Site - Manhattan', 'Field Location', 'Remote Location'][index],
          isActive: index < 2, // First 2 are active
          timestamp: new Date(),
          accuracy: Math.floor(Math.random() * 20 + 10)
        }))
        setLocations(mockLocations)
        console.log('✅ Mock locations created:', mockLocations)
      }
    } catch (err) {
      console.error('❌ Failed to load data:', err)
      setMapError(err.message || 'Failed to load location data')
      toast.error('Failed to load location data: ' + (err.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLiveLocations = async () => {
    try {
      console.log('🔄 Polling live locations...')
      const res = await locationAPI.getLiveLocations()
      if (res.data) {
        if (Array.isArray(res.data)) {
          setLocations(res.data)
          console.log(`✅ Updated ${res.data.length} live locations`)
        } else {
          console.warn('Location data is not an array')
        }
      }
    } catch (error) {
      console.error('❌ Failed to update locations:', error)
    }
  }

  const updateMapMarkers = (locationsData) => {
    if (!googleMapRef.current) return

    // Filter locations based on selected employee
    const filteredLocs = selectedEmployee === 'all'
      ? locationsData
      : locationsData.filter(loc => loc.employeeId === parseInt(selectedEmployee) || loc.employeeId === selectedEmployee)

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null))
    markersRef.current = {}

    // Clear existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
    }

    const markers = []
    const bounds = new window.google.maps.LatLngBounds()

    // Add markers for each location
    filteredLocs.forEach((location) => {
      const lat = parseFloat(location.latitude) || 40.7128
      const lng = parseFloat(location.longitude) || -74.0060
      const position = { lat, lng }

      // Create custom marker
      const marker = new window.google.maps.Marker({
        position,
        map: googleMapRef.current,
        title: getEmployeeName(location.employeeId),
        animation: window.google.maps.Animation.DROP,
        icon: getMarkerIcon(location.isActive)
      })

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: createMarkerContent(location)
      })

      marker.addListener('click', () => {
        // Close all other info windows
        Object.keys(markersRef.current).forEach(key => {
          if (markersRef.current[key].infoWindow) {
            markersRef.current[key].infoWindow.close()
          }
        })
        infoWindow.open(googleMapRef.current, marker)
        setSelectedLocation(location)
        setShowDetails(true)
      })

      marker.infoWindow = infoWindow
      markersRef.current[location.id] = marker
      markers.push(position)
      bounds.extend(position)
    })

    // Draw polyline if showRoutes is enabled
    if (showRoutes && markers.length > 1) {
      polylineRef.current = new window.google.maps.Polyline({
        path: markers,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        map: googleMapRef.current
      })
    }

    // Fit bounds
    if (markers.length > 0) {
      googleMapRef.current.fitBounds(bounds)
      if (markers.length === 1) {
        googleMapRef.current.setZoom(15)
      }
    }
  }

  const getMarkerIcon = (isActive) => {
    return `http://maps.google.com/mapfiles/ms/micons/${isActive ? 'green' : 'red'}-dot.png`
  }

  const createMarkerContent = (location) => {
    const employeeName = getEmployeeName(location.employeeId)
    const status = location.isActive ? 'Active' : 'Inactive'
    const timestamp = new Date(location.timestamp).toLocaleTimeString()

    return `
      <div style="padding: 10px; min-width: 200px;">
        <h4 style="margin: 5px 0; color: #333;">${employeeName}</h4>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">
          <strong>Address:</strong> ${location.address}
        </p>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">
          <strong>Status:</strong> <span style="color: ${location.isActive ? 'green' : 'red'};">${status}</span>
        </p>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">
          <strong>Lat:</strong> ${parseFloat(location.latitude).toFixed(4)}<br/>
          <strong>Lng:</strong> ${parseFloat(location.longitude).toFixed(4)}
        </p>
        <p style="margin: 5px 0; font-size: 11px; color: #999;">
          Last updated: ${timestamp}
        </p>
      </div>
    `
  }

  const getEmployeeName = (employeeId) => {
    const employee = employeeMap[employeeId] || employees.find(e => e.id === employeeId || e._id === employeeId)
    return employee ? employee.name : 'Unknown'
  }

  const getEmployeeEmail = (employeeId) => {
    const employee = employeeMap[employeeId] || employees.find(e => e.id === employeeId || e._id === employeeId)
    return employee ? employee.email : null
  }

  const getEmployeeAvatar = (employeeId) => {
    const employee = employeeMap[employeeId] || employees.find(e => e.id === employeeId || e._id === employeeId)
    return employee ? employee.avatar : ''
  }

  const getStatusColor = (isActive) => {
    return isActive ? '#00c853' : '#f44336'
  }

  const filteredLocations = selectedEmployee === 'all'
    ? locations
    : locations.filter(loc => loc.employeeId === parseInt(selectedEmployee) || loc.employeeId === selectedEmployee)

  const canMarkAttendance = user && (user.role === 'admin' || user.role === 'hr')

  const handleMarkAttendance = async (loc, status) => {
    if (!canMarkAttendance) return
    if (!status) return

    const emp = employees.find(e => e.id === loc.employeeId || e._id === loc.employeeId || e.employeeId === loc.employeeId)
    if (!emp) {
      toast.error('Employee not found in system')
      return
    }

    try {
      await attendanceAPI.mark({
        employeeId: emp.id,
        officeLat: 40.7128,
        officeLng: -74.0060,
        radiusMeters: 500,
        allowedStartTime: '09:30',
        statusOverride: status,
      })
      toast.success(`Attendance marked as ${status} for ${emp.name}`)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to mark attendance')
    }
  }

  const handleRefresh = () => {
    fetchData()
    toast.success('Location data refreshed')
  }

  const handleCenterOnUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          googleMapRef.current?.setCenter(userLocation)
          googleMapRef.current?.setZoom(15)
          toast.success('Centered on your location')
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Unable to get your location')
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser')
    }
  }

  const handleShowRoute = (locationId) => {
    const location = filteredLocations.find(l => l.id === locationId)
    if (location && googleMapRef.current) {
      const position = {
        lat: parseFloat(location.latitude) || 40.7128,
        lng: parseFloat(location.longitude) || -74.0060
      }
      googleMapRef.current.setCenter(position)
      googleMapRef.current.setZoom(16)
      
      // Attempt routing
      drawRouteToEmployee(location)
    }
  }

  const drawRouteToEmployee = (targetLocation) => {
    if (!navigator.geolocation || !directionsServiceRef.current || !directionsRendererRef.current) {
      toast.error('Routing not available yet');
      return;
    }
    
    // Clear old route
    directionsRendererRef.current.setDirections({routes: []});

    navigator.geolocation.getCurrentPosition((position) => {
      const origin = { lat: position.coords.latitude, lng: position.coords.longitude };
      const destination = { 
        lat: parseFloat(targetLocation.latitude) || 40.7128, 
        lng: parseFloat(targetLocation.longitude) || -74.006 
      };

      directionsServiceRef.current.route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRendererRef.current.setDirections(result);
          toast.success('Route generated!');
        } else {
          toast('No driving route available to this location.', { icon: '🚙' });
        }
      });
    }, (error) => {
      toast.error('Cannot get your current location to generate route');
    });
  }


  // We don't want to return early if isLoading is true because it prevents mapRef from mounting,
  // which causes initMap() to fail silently.
  const renderLoadingOverlay = () => {
    if (isLoading) {
      return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', flexDirection: 'column', gap: 2 }}>
          <CircularProgress color="success" />
          <Typography variant="body2" color="text.primary">
            Loading location data and initializing map...
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (mapError) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 3 }}>
        <Box sx={{
          background: '#00c853',
          color: 'white',
          p: 3,
          mb: 3,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Warning sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6">Map Loading Error</Typography>
            <Typography variant="body2">{mapError}</Typography>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Troubleshooting:</Typography>
            <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
              1. Check that .env file has VITE_GOOGLE_MAPS_API_KEY set:
                 VITE_GOOGLE_MAPS_API_KEY=AIzaSyCy5HQVsFRhuA4-zyIeHFbhxUVJ_nYAnfY

              2. Verify the API key is valid and enabled in Google Cloud Console
              
              3. Enable these APIs in Google Cloud Console:
                 - Maps JavaScript API
                 - Places API
                 - Maps Embed API

              4. Check browser console (F12) for more detailed error messages

              5. Try refreshing the page (Ctrl+R)

              6. Check your API key restrictions:
                 - If restricted by HTTP referer, add: localhost:3000
                 - If restricted by IP, ensure your IP is whitelisted
            </Typography>

            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
              onClick={() => {
                setMapError(null)
                setIsLoading(true)
                window.location.reload()
              }}
            >
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {renderLoadingOverlay()}
      {/* Header */}
      <Box sx={{
        background: '#00c853',
        color: 'white',
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            title="Go back"
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Live Location Tracking
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Real-time employee location monitoring with Google Maps
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={handleRefresh} title="Refresh">
            <Refresh />
          </IconButton>
          <IconButton color="inherit" onClick={handleCenterOnUser} title="Center on my location">
            <MyLocation />
          </IconButton>
        </Box>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Employee</InputLabel>
                <Select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  label="Filter by Employee"
                >
                  <MenuItem value="all">All Employees ({locations.length})</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id || employee._id} value={employee.id || employee._id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showRoutes}
                    onChange={(e) => {
                      setShowRoutes(e.target.checked)
                    }}
                  />
                }
                label="Show Routes/Paths"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                sx={{
                  background: user?.role === 'admin'
                    ? '#00c853'
                    : '#00c853',
                  color: user?.role === 'admin' ? 'white' : 'black',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }
                }}
                startIcon={<Navigation />}
                onClick={() => updateMapMarkers(locations)}
                fullWidth
              >
                Refresh Map
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Map */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Google Maps Live View
                </Typography>
                <Chip
                  icon={<Info />}
                  label={`${filteredLocations.length} employees tracked`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              {mapError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Map Error:</strong> {mapError}
                  </Typography>
                  <Typography variant="caption">
                    Check browser console (F12) for details. Verify your Google Maps API key is valid and enabled.
                  </Typography>
                </Alert>
              )}

              <Box
                ref={mapRef}
                sx={{
                  height: 550,
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #ddd',
                  backgroundColor: '#e8eaf6'
                }}
              />
              <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <Typography variant="caption" color="text.secondary">
                  🟢 Green markers = Active employees | 🔴 Red markers = Inactive employees
                  <br />
                  Click on markers to view detailed information
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Employee List */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Employees ({filteredLocations.filter(l => l.isActive).length})
              </Typography>
              <List sx={{ maxHeight: 550, overflow: 'auto' }}>
                {filteredLocations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No employees to display
                  </Typography>
                ) : (
                  filteredLocations.map((location) => (
                    <ListItem
                      key={location.id}
                      alignItems="flex-start"
                      sx={{
                        mb: 1,
                        p: 1.5,
                        backgroundColor: location.isActive ? '#f0f7f4' : '#fef5f5',
                        borderRadius: '8px',
                        border: `1px solid ${getStatusColor(location.isActive)}33`,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: location.isActive ? '#dff0e8' : '#fce8e8',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleShowRoute(location.id)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={getEmployeeAvatar(location.employeeId)}
                          sx={{
                            border: `3px solid ${getStatusColor(location.isActive)}`
                          }}
                        >
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {getEmployeeName(location.employeeId)}
                            </Typography>
                            <Chip
                              label={location.isActive ? 'Active' : 'Inactive'}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(location.isActive),
                                color: 'white',
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              📍 {location.address}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.3 }}>
                              🕐 {new Date(location.timestamp).toLocaleTimeString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              📌 {parseFloat(location.latitude).toFixed(4)}, {parseFloat(location.longitude).toFixed(4)}
                            </Typography>
                            {canMarkAttendance && (
                              <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="success"
                                  sx={{ fontSize: '0.7rem', py: 0.3 }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMarkAttendance(location, 'present')
                                  }}
                                >
                                  Present
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  sx={{ fontSize: '0.7rem', py: 0.3 }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMarkAttendance(location, 'absent')
                                  }}
                                >
                                  Absent
                                </Button>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Location Details Dialog */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Location Details - {selectedLocation && getEmployeeName(selectedLocation.employeeId)}
        </DialogTitle>
        <DialogContent>
          {selectedLocation && (
            <Box sx={{ pt: 2 }}>
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Employee:</strong> {getEmployeeName(selectedLocation.employeeId)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Address:</strong> {selectedLocation.address}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Latitude:</strong> {parseFloat(selectedLocation.latitude).toFixed(6)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Longitude:</strong> {parseFloat(selectedLocation.longitude).toFixed(6)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Status:</strong> {selectedLocation.isActive ? '✅ Active' : '❌ Inactive'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Last Updated:</strong> {new Date(selectedLocation.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Accuracy:</strong> {selectedLocation.accuracy ? `${selectedLocation.accuracy}m` : 'N/A'}
                </Typography>
              </Paper>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setShowDetails(false)
                    drawRouteToEmployee(selectedLocation)
                  }}
                >
                  Show Route to Employee
                </Button>
              </Box>

              {canMarkAttendance && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={() => {
                      handleMarkAttendance(selectedLocation, 'present')
                      setShowDetails(false)
                    }}
                  >
                    Mark Present
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => {
                      handleMarkAttendance(selectedLocation, 'absent')
                      setShowDetails(false)
                    }}
                  >
                    Mark Absent
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default LiveLocation
