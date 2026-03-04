// Location tracking service with real-time features
class LocationService {
  constructor() {
    this.watchId = null
    this.currentLocation = null
    this.locationHistory = []
    this.geoFences = []
    this.isTracking = false
    this.callbacks = []
  }

  // Start real-time location tracking
  startTracking(callback, options = {}) {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser')
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      ...options
    }

    this.callbacks.push(callback)
    this.isTracking = true

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
          formattedTime: new Date(position.timestamp).toLocaleTimeString(),
          formattedDate: new Date(position.timestamp).toLocaleDateString()
        }

        this.currentLocation = locationData
        this.locationHistory.push(locationData)
        
        // Keep only last 100 locations
        if (this.locationHistory.length > 100) {
          this.locationHistory = this.locationHistory.slice(-100)
        }

        // Check geo-fences
        this.checkGeoFences(locationData)

        // Notify all callbacks
        this.callbacks.forEach(cb => cb(locationData))
      },
      (error) => {
        console.error('Location tracking error:', error)
        this.callbacks.forEach(cb => cb(null, error))
      },
      defaultOptions
    )
  }

  // Stop location tracking
  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    this.isTracking = false
    this.callbacks = []
  }

  // Get current location once
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          }
          resolve(locationData)
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  // Add geo-fence
  addGeoFence(fence) {
    const geoFence = {
      id: fence.id || Date.now().toString(),
      name: fence.name,
      latitude: fence.latitude,
      longitude: fence.longitude,
      radius: fence.radius || 100, // meters
      type: fence.type || 'circle', // circle, polygon
      coordinates: fence.coordinates || null,
      active: true,
      createdAt: new Date().toISOString()
    }
    
    this.geoFences.push(geoFence)
    return geoFence
  }

  // Check if location is within geo-fence
  checkGeoFences(location) {
    const results = []
    
    this.geoFences.forEach(fence => {
      if (!fence.active) return
      
      const isWithin = this.isWithinGeoFence(location, fence)
      
      if (isWithin !== fence.lastStatus) {
        fence.lastStatus = isWithin
        fence.lastChecked = new Date().toISOString()
        
        results.push({
          fenceId: fence.id,
          fenceName: fence.name,
          isWithin,
          location,
          timestamp: new Date().toISOString()
        })
      }
    })
    
    return results
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // Distance in meters
  }

  // Check if location is within a geo-fence
  isWithinGeoFence(location, fence) {
    if (fence.type === 'circle') {
      const distance = this.calculateDistance(
        location.latitude, location.longitude,
        fence.latitude, fence.longitude
      )
      return distance <= fence.radius
    }
    
    // Add polygon support here if needed
    return false
  }

  // Get location history for a time range
  getLocationHistory(startDate, endDate) {
    return this.locationHistory.filter(location => {
      const locationTime = new Date(location.timestamp)
      return locationTime >= startDate && locationTime <= endDate
    })
  }

  // Get today's location summary
  getTodaySummary() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayLocations = this.locationHistory.filter(location => 
      new Date(location.timestamp) >= today
    )

    if (todayLocations.length === 0) {
      return {
        totalLocations: 0,
        firstLocation: null,
        lastLocation: null,
        totalDistance: 0,
        averageAccuracy: 0
      }
    }

    const firstLocation = todayLocations[0]
    const lastLocation = todayLocations[todayLocations.length - 1]
    
    let totalDistance = 0
    for (let i = 1; i < todayLocations.length; i++) {
      totalDistance += this.calculateDistance(
        todayLocations[i-1].latitude, todayLocations[i-1].longitude,
        todayLocations[i].latitude, todayLocations[i].longitude
      )
    }

    const averageAccuracy = todayLocations.reduce((sum, loc) => 
      sum + loc.accuracy, 0) / todayLocations.length

    return {
      totalLocations: todayLocations.length,
      firstLocation,
      lastLocation,
      totalDistance: Math.round(totalDistance),
      averageAccuracy: Math.round(averageAccuracy)
    }
  }

  // Export location data
  exportLocationData(format = 'json') {
    const data = {
      currentLocation: this.currentLocation,
      locationHistory: this.locationHistory,
      geoFences: this.geoFences,
      exportDate: new Date().toISOString()
    }

    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    } else if (format === 'csv') {
      // Convert to CSV format
      const headers = ['timestamp', 'latitude', 'longitude', 'accuracy', 'speed']
      const rows = this.locationHistory.map(loc => [
        loc.timestamp,
        loc.latitude,
        loc.longitude,
        loc.accuracy,
        loc.speed || 0
      ])
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
    
    return data
  }

  // Clear location history
  clearHistory() {
    this.locationHistory = []
  }

  // Get tracking status
  getTrackingStatus() {
    return {
      isTracking: this.isTracking,
      currentLocation: this.currentLocation,
      totalLocations: this.locationHistory.length,
      activeGeoFences: this.geoFences.filter(f => f.active).length
    }
  }
}

// Create singleton instance
const locationService = new LocationService()

export default locationService
