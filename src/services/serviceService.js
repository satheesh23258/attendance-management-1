// Service request management system
class ServiceService {
  constructor() {
    this.services = []
    this.categories = [
      { id: 'it', name: 'IT Support', icon: '💻' },
      { id: 'hr', name: 'HR Services', icon: '👥' },
      { id: 'facilities', name: 'Facilities', icon: '🏢' },
      { id: 'maintenance', name: 'Maintenance', icon: '🔧' },
      { id: 'security', name: 'Security', icon: '🔒' },
      { id: 'admin', name: 'Administrative', icon: '📋' }
    ]
    this.priorities = [
      { id: 'low', name: 'Low', color: '#4caf50' },
      { id: 'normal', name: 'Normal', color: '#00c853' },
      { id: 'high', name: 'High', color: '#00c853' },
      { id: 'urgent', name: 'Urgent', color: '#00c853' }
    ]
    this.statuses = [
      { id: 'pending', name: 'Pending', color: '#9e9e9e' },
      { id: 'assigned', name: 'Assigned', color: '#00c853' },
      { id: 'in_progress', name: 'In Progress', color: '#00c853' },
      { id: 'resolved', name: 'Resolved', color: '#4caf50' },
      { id: 'closed', name: 'Closed', color: '#666666' },
      { id: 'cancelled', name: 'Cancelled', color: '#00c853' }
    ]
  }

  // Create new service request
  createServiceRequest(serviceData) {
    const serviceRequest = {
      id: 'SR' + Date.now(),
      title: serviceData.title,
      description: serviceData.description,
      category: serviceData.category,
      priority: serviceData.priority || 'normal',
      status: 'pending',
      requesterId: serviceData.requesterId,
      requesterName: serviceData.requesterName,
      requesterEmail: serviceData.requesterEmail,
      requesterDepartment: serviceData.requesterDepartment,
      assignedToId: null,
      assignedToName: null,
      assignedToEmail: null,
      location: serviceData.location || null,
      estimatedTime: serviceData.estimatedTime || null,
      actualTime: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: serviceData.dueDate || null,
      completedAt: null,
      attachments: serviceData.attachments || [],
      tags: serviceData.tags || [],
      comments: [],
      history: [
        {
          action: 'created',
          timestamp: new Date().toISOString(),
          userId: serviceData.requesterId,
          userName: serviceData.requesterName,
          details: 'Service request created'
        }
      ],
      rating: null,
      feedback: null,
      metadata: serviceData.metadata || {}
    }

    this.services.push(serviceRequest)
    return serviceRequest
  }

  // Update service request
  updateServiceRequest(serviceId, updates, userId, userName) {
    const service = this.services.find(s => s.id === serviceId)
    if (!service) {
      throw new Error('Service request not found')
    }

    const previousStatus = service.status
    Object.assign(service, updates)
    service.updatedAt = new Date().toISOString()

    // Add to history
    service.history.push({
      action: 'updated',
      timestamp: new Date().toISOString(),
      userId: userId,
      userName: userName,
      details: `Updated: ${Object.keys(updates).join(', ')}`,
      changes: updates
    })

    // Handle status change
    if (updates.status && updates.status !== previousStatus) {
      this.handleStatusChange(service, previousStatus, updates.status, userId, userName)
    }

    return service
  }

  // Handle status changes
  handleStatusChange(service, oldStatus, newStatus, userId, userName) {
    const statusChange = {
      action: 'status_changed',
      timestamp: new Date().toISOString(),
      userId: userId,
      userName: userName,
      details: `Status changed from ${oldStatus} to ${newStatus}`,
      oldStatus: oldStatus,
      newStatus: newStatus
    }

    service.history.push(statusChange)

    // Set completion timestamp
    if (newStatus === 'resolved' || newStatus === 'closed') {
      service.completedAt = new Date().toISOString()
    }

    // Calculate actual time if service is completed
    if (newStatus === 'resolved' && service.createdAt) {
      const created = new Date(service.createdAt)
      const completed = new Date(service.completedAt)
      service.actualTime = Math.round((completed - created) / (1000 * 60 * 60)) // hours
    }
  }

  // Assign service request to employee
  assignServiceRequest(serviceId, assigneeId, assigneeName, assigneeEmail, userId, userName) {
    return this.updateServiceRequest(serviceId, {
      assignedToId: assigneeId,
      assignedToName: assigneeName,
      assignedToEmail: assigneeEmail,
      status: 'assigned'
    }, userId, userName)
  }

  // Add comment to service request
  addComment(serviceId, comment, userId, userName, isInternal = false) {
    const service = this.services.find(s => s.id === serviceId)
    if (!service) {
      throw new Error('Service request not found')
    }

    const commentData = {
      id: Date.now().toString(),
      text: comment,
      userId: userId,
      userName: userName,
      timestamp: new Date().toISOString(),
      isInternal: isInternal
    }

    service.comments.push(commentData)
    service.updatedAt = new Date().toISOString()

    // Add to history
    service.history.push({
      action: 'comment_added',
      timestamp: new Date().toISOString(),
      userId: userId,
      userName: userName,
      details: `Comment added: ${comment.substring(0, 50)}...`
    })

    return commentData
  }

  // Add attachment to service request
  addAttachment(serviceId, attachment, userId, userName) {
    const service = this.services.find(s => s.id === serviceId)
    if (!service) {
      throw new Error('Service request not found')
    }

    const attachmentData = {
      id: Date.now().toString(),
      name: attachment.name,
      size: attachment.size,
      type: attachment.type,
      url: attachment.url,
      uploadedBy: userId,
      uploadedByName: userName,
      uploadedAt: new Date().toISOString()
    }

    service.attachments.push(attachmentData)
    service.updatedAt = new Date().toISOString()

    return attachmentData
  }

  // Rate and provide feedback for completed service
  rateService(serviceId, rating, feedback, userId, userName) {
    return this.updateServiceRequest(serviceId, {
      rating: rating,
      feedback: feedback
    }, userId, userName)
  }

  // Get service request by ID
  getServiceRequest(serviceId) {
    return this.services.find(s => s.id === serviceId) || null
  }

  // Get all service requests with filters
  getServiceRequests(filters = {}) {
    let services = [...this.services]

    // Apply filters
    if (filters.status) {
      services = services.filter(s => s.status === filters.status)
    }
    if (filters.priority) {
      services = services.filter(s => s.priority === filters.priority)
    }
    if (filters.category) {
      services = services.filter(s => s.category === filters.category)
    }
    if (filters.requesterId) {
      services = services.filter(s => s.requesterId === filters.requesterId)
    }
    if (filters.assignedToId) {
      services = services.filter(s => s.assignedToId === filters.assignedToId)
    }
    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      services = services.filter(s => {
        const created = new Date(s.createdAt)
        return created >= start && created <= end
      })
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      services = services.filter(s => 
        s.title.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm)
      )
    }

    // Sort
    if (filters.sortBy) {
      services.sort((a, b) => {
        switch (filters.sortBy) {
          case 'createdAt':
            return new Date(b.createdAt) - new Date(a.createdAt)
          case 'priority':
            const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          case 'status':
            return a.status.localeCompare(b.status)
          default:
            return 0
        }
      })
    }

    return services
  }

  // Get service statistics
  getStatistics(filters = {}) {
    const services = this.getServiceRequests(filters)
    
    const stats = {
      total: services.length,
      byStatus: {},
      byPriority: {},
      byCategory: {},
      averageResolutionTime: 0,
      completionRate: 0,
      satisfactionScore: 0
    }

    let totalResolutionTime = 0
    let completedServices = 0
    let totalRating = 0
    let ratedServices = 0

    services.forEach(service => {
      // Status statistics
      stats.byStatus[service.status] = (stats.byStatus[service.status] || 0) + 1
      
      // Priority statistics
      stats.byPriority[service.priority] = (stats.byPriority[service.priority] || 0) + 1
      
      // Category statistics
      stats.byCategory[service.category] = (stats.byCategory[service.category] || 0) + 1
      
      // Resolution time
      if (service.actualTime) {
        totalResolutionTime += service.actualTime
        completedServices++
      }
      
      // Satisfaction score
      if (service.rating) {
        totalRating += service.rating
        ratedServices++
      }
    })

    stats.averageResolutionTime = completedServices > 0 ? 
      Math.round(totalResolutionTime / completedServices) : 0
    
    stats.completionRate = services.length > 0 ? 
      Math.round((completedServices / services.length) * 100) : 0
    
    stats.satisfactionScore = ratedServices > 0 ? 
      Math.round((totalRating / ratedServices) * 10) / 10 : 0

    return stats
  }

  // Get services assigned to user
  getAssignedServices(userId) {
    return this.services.filter(s => s.assignedToId === userId)
  }

  // Get services requested by user
  getRequestedServices(userId) {
    return this.services.filter(s => s.requesterId === userId)
  }

  // Get overdue services
  getOverdueServices() {
    const now = new Date()
    return this.services.filter(s => 
      s.dueDate && 
      new Date(s.dueDate) < now && 
      !['resolved', 'closed', 'cancelled'].includes(s.status)
    )
  }

  // Get services needing attention
  getServicesNeedingAttention() {
    return this.services.filter(s => 
      ['pending', 'assigned'].includes(s.status) && s.priority === 'urgent'
    )
  }

  // Export service data
  exportServiceData(format = 'json', filters = {}) {
    const services = this.getServiceRequests(filters)
    
    if (format === 'json') {
      return JSON.stringify(services, null, 2)
    } else if (format === 'csv') {
      const headers = [
        'ID', 'Title', 'Category', 'Priority', 'Status', 
        'Requester', 'Assigned To', 'Created Date', 'Due Date', 'Completed Date'
      ]
      
      const rows = services.map(s => [
        s.id,
        s.title,
        s.category,
        s.priority,
        s.status,
        s.requesterName,
        s.assignedToName || 'Unassigned',
        s.createdAt,
        s.dueDate || '',
        s.completedAt || ''
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
    
    return services
  }

  // Get categories
  getCategories() {
    return this.categories
  }

  // Get priorities
  getPriorities() {
    return this.priorities
  }

  // Get statuses
  getStatuses() {
    return this.statuses
  }

  // Delete service request
  deleteServiceRequest(serviceId, userId, userName) {
    const index = this.services.findIndex(s => s.id === serviceId)
    if (index === -1) {
      throw new Error('Service request not found')
    }

    const service = this.services[index]
    
    // Add to history before deletion
    service.history.push({
      action: 'deleted',
      timestamp: new Date().toISOString(),
      userId: userId,
      userName: userName,
      details: 'Service request deleted'
    })

    // Archive instead of actual delete
    this.services.splice(index, 1)
    return service
  }

  // Bulk operations
  bulkUpdate(serviceIds, updates, userId, userName) {
    const results = []
    
    serviceIds.forEach(serviceId => {
      try {
        const updated = this.updateServiceRequest(serviceId, updates, userId, userName)
        results.push({ success: true, serviceId, service: updated })
      } catch (error) {
        results.push({ success: false, serviceId, error: error.message })
      }
    })
    
    return results
  }
}

// Create singleton instance
const serviceService = new ServiceService()

export default serviceService
