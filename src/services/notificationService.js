// Comprehensive notification system
class NotificationService {
  constructor() {
    this.notifications = []
    this.subscribers = []
    this.settings = {
      enablePush: true,
      enableEmail: true,
      enableInApp: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    }
    this.pushSubscription = null
  }

  // Initialize notification service
  async initialize() {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }

    // Initialize service worker for push notifications
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        this.pushSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array('mock-vapid-key')
        })
      } catch (error) {
        console.log('Service Worker registration failed:', error)
      }
    }
  }

  // Create notification
  createNotification(notification) {
    const newNotification = {
      id: Date.now().toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info', // info, success, warning, error
      priority: notification.priority || 'normal', // low, normal, high, urgent
      category: notification.category || 'general',
      actionUrl: notification.actionUrl || null,
      actionText: notification.actionText || null,
      icon: notification.icon || null,
      imageUrl: notification.imageUrl || null,
      timestamp: new Date().toISOString(),
      read: false,
      userId: notification.userId || null,
      metadata: notification.metadata || {}
    }

    this.notifications.unshift(newNotification)
    
    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100)
    }

    // Send notifications based on settings
    this.sendNotification(newNotification)
    
    // Notify subscribers
    this.notifySubscribers(newNotification)

    return newNotification
  }

  // Send notification through different channels
  async sendNotification(notification) {
    // Check quiet hours
    if (this.isQuietHours() && notification.priority !== 'urgent') {
      return
    }

    // In-app notification
    if (this.settings.enableInApp) {
      this.showInAppNotification(notification)
    }

    // Push notification
    if (this.settings.enablePush && this.pushSubscription) {
      await this.sendPushNotification(notification)
    }

    // Email notification (simulation)
    if (this.settings.enableEmail && notification.priority === 'urgent') {
      await this.sendEmailNotification(notification)
    }
  }

  // Show in-app notification
  showInAppNotification(notification) {
    // This would integrate with your UI notification component
    console.log('In-app notification:', notification)
  }

  // Send push notification
  async sendPushNotification(notification) {
    try {
      await fetch('/api/notifications/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: this.pushSubscription,
          notification: {
            title: notification.title,
            body: notification.message,
            icon: notification.icon,
            image: notification.imageUrl,
            data: {
              actionUrl: notification.actionUrl,
              notificationId: notification.id
            },
            actions: notification.actionText ? [{
              action: 'view',
              title: notification.actionText
            }] : []
          }
        })
      })
    } catch (error) {
      console.error('Push notification failed:', error)
    }
  }

  // Send email notification (simulation)
  async sendEmailNotification(notification) {
    console.log('Email notification sent:', notification)
    // In real app, integrate with email service
  }

  // Subscribe to notifications
  subscribe(callback) {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  // Notify all subscribers
  notifySubscribers(notification) {
    this.subscribers.forEach(callback => {
      try {
        callback(notification)
      } catch (error) {
        console.error('Notification subscriber error:', error)
      }
    })
  }

  // Get notifications for user
  getUserNotifications(userId, filters = {}) {
    let notifications = this.notifications.filter(n => 
      !userId || n.userId === userId
    )

    // Apply filters
    if (filters.type) {
      notifications = notifications.filter(n => n.type === filters.type)
    }
    if (filters.category) {
      notifications = notifications.filter(n => n.category === filters.category)
    }
    if (filters.unreadOnly) {
      notifications = notifications.filter(n => !n.read)
    }
    if (filters.limit) {
      notifications = notifications.slice(0, filters.limit)
    }

    return notifications
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      notification.readAt = new Date().toISOString()
    }
  }

  // Mark all notifications as read
  markAllAsRead(userId) {
    this.notifications.forEach(n => {
      if (!userId || n.userId === userId) {
        n.read = true
        n.readAt = new Date().toISOString()
      }
    })
  }

  // Delete notification
  deleteNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId)
  }

  // Clear all notifications
  clearNotifications(userId) {
    if (userId) {
      this.notifications = this.notifications.filter(n => n.userId !== userId)
    } else {
      this.notifications = []
    }
  }

  // Get unread count
  getUnreadCount(userId) {
    return this.notifications.filter(n => 
      (!userId || n.userId === userId) && !n.read
    ).length
  }

  // Check if it's quiet hours
  isQuietHours() {
    if (!this.settings.quietHours.enabled) {
      return false
    }

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [startHour, startMin] = this.settings.quietHours.start.split(':').map(Number)
    const [endHour, endMin] = this.settings.quietHours.end.split(':').map(Number)
    
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      // Overnight quiet hours (e.g., 22:00 to 08:00)
      return currentTime >= startTime || currentTime <= endTime
    }
  }

  // Update notification settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings }
  }

  // Get notification settings
  getSettings() {
    return { ...this.settings }
  }

  // Create predefined notifications
  createAttendanceNotification(employeeName, type) {
    return this.createNotification({
      title: `Attendance ${type}`,
      message: `${employeeName} has ${type.toLowerCase()}ed successfully`,
      type: 'success',
      category: 'attendance',
      priority: 'normal'
    })
  }

  createServiceRequestNotification(requestId, status) {
    return this.createNotification({
      title: `Service Request Update`,
      message: `Request #${requestId} status: ${status}`,
      type: 'info',
      category: 'service',
      actionUrl: `/service-requests/${requestId}`,
      actionText: 'View Request'
    })
  }

  createLocationAlertNotification(employeeName, location) {
    return this.createNotification({
      title: 'Location Alert',
      message: `${employeeName} has entered ${location}`,
      type: 'warning',
      category: 'location',
      priority: 'high'
    })
  }

  createSystemMaintenanceNotification(message) {
    return this.createNotification({
      title: 'System Maintenance',
      message: message,
      type: 'warning',
      category: 'system',
      priority: 'high'
    })
  }

  // Utility function for VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    
    return outputArray
  }

  // Get notification statistics
  getStatistics(userId) {
    const userNotifications = this.getUserNotifications(userId)
    
    const stats = {
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length,
      byType: {},
      byCategory: {},
      byPriority: {}
    }

    userNotifications.forEach(n => {
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1
      stats.byCategory[n.category] = (stats.byCategory[n.category] || 0) + 1
      stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1
    })

    return stats
  }
}

// Create singleton instance
const notificationService = new NotificationService()

export default notificationService
