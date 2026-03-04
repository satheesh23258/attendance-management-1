import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Schedule,
  AttachFile,
  Phone,
  Person,
  Event,
  Description,
  Notifications,
  Edit,
  Delete,
  History
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'

const LeaveRequestDetails = () => {
  const { user } = useAuth()
  const [leaveRequests, setLeaveRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [editDialog, setEditDialog] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockRequests = [
      {
        id: 1,
        employeeName: user?.name || 'Current User',
        employeeId: user?.employeeId || 'EMP000',
        department: user?.department || 'General',
        leaveType: 'Annual Leave',
        startDate: '2024-01-15',
        endDate: '2024-01-19',
        days: 5,
        reason: 'Family vacation to visit parents',
        status: 'approved',
        appliedDate: '2024-01-10',
        approvedBy: 'Jane Smith',
        approvedDate: '2024-01-12',
        emergencyContact: '+1234567890',
        attachment: 'vacation_plans.pdf',
        lastModified: '2024-01-12',
        modifiedBy: 'Jane Smith'
      },
      {
        id: 2,
        employeeName: user?.name || 'Current User',
        employeeId: user?.employeeId || 'EMP000',
        department: user?.department || 'General',
        leaveType: 'Sick Leave',
        startDate: '2024-01-20',
        endDate: '2024-01-21',
        days: 2,
        reason: 'Medical appointment for checkup',
        status: 'pending',
        appliedDate: '2024-01-19',
        approvedBy: null,
        approvedDate: null,
        emergencyContact: '+0987654321',
        attachment: 'medical_certificate.pdf',
        lastModified: '2024-01-19',
        modifiedBy: 'Current User'
      },
      {
        id: 3,
        employeeName: user?.name || 'Current User',
        employeeId: user?.employeeId || 'EMP000',
        department: user?.department || 'General',
        leaveType: 'Personal Leave',
        startDate: '2024-01-05',
        endDate: '2024-01-05',
        days: 1,
        reason: 'Personal work',
        status: 'rejected',
        appliedDate: '2024-01-03',
        approvedBy: 'John Manager',
        approvedDate: '2024-01-04',
        emergencyContact: '+1122334455',
        attachment: null,
        rejectionReason: 'Insufficient notice period',
        lastModified: '2024-01-04',
        modifiedBy: 'John Manager'
      }
    ]
    setLeaveRequests(mockRequests)
    
    // Mock notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Leave Approved',
        message: 'Your Annual Leave request has been approved by Jane Smith',
        date: '2024-01-12',
        read: false,
        requestId: 1
      },
      {
        id: 2,
        type: 'info',
        title: 'Leave Under Review',
        message: 'Your Sick Leave request is currently under review',
        date: '2024-01-19',
        read: false,
        requestId: 2
      },
      {
        id: 3,
        type: 'error',
        title: 'Leave Rejected',
        message: 'Your Personal Leave request was rejected. Reason: Insufficient notice period',
        date: '2024-01-04',
        read: true,
        requestId: 3
      }
    ]
    setNotifications(mockNotifications)
  }, [user])

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4caf50'
      case 'pending': return '#00c853'
      case 'rejected': return '#00c853'
      default: return '#000000'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />
      case 'pending': return <Schedule />
      case 'rejected': return <Cancel />
      default: return <Event />
    }
  }

  const handleCancelRequest = () => {
    if (selectedRequest && selectedRequest.status === 'pending') {
      setLeaveRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'cancelled', lastModified: new Date().toISOString().split('T')[0], modifiedBy: user?.name }
            : req
        )
      )
      toast.success('Leave request cancelled successfully!')
      setCancelDialog(false)
    }
  }

  const handleEditRequest = () => {
    // In real app, this would open an edit form
    toast.info('Edit functionality coming soon!')
    setEditDialog(false)
  }

  const handleDeleteRequest = () => {
    if (selectedRequest && (selectedRequest.status === 'rejected' || selectedRequest.status === 'cancelled')) {
      setLeaveRequests(prev => prev.filter(req => req.id !== selectedRequest.id))
      toast.success('Leave request deleted successfully!')
      setSelectedRequest(null)
    }
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
  }

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length
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
          <IconButton color="inherit" onClick={() => window.history.back()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            My Leave Requests
          </Typography>
          <Chip 
            label={`${leaveRequests.length} Total`} 
            color="info" 
            variant="filled"
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit">
            <Notifications />
            {getUnreadNotificationsCount() > 0 && (
              <Box sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: '#00c853',
                color: 'white',
                borderRadius: '50%',
                width: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 'bold'
              }}>
                {getUnreadNotificationsCount()}
              </Box>
            )}
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Leave Requests List */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Leave Request History
                </Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Leave Type</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Applied Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveRequests.map((request) => (
                        <TableRow 
                          key={request.id} 
                          hover 
                          sx={{ cursor: 'pointer' }}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={request.leaveType}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {request.days} days
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.startDate} to {request.endDate}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={request.status}
                              size="small"
                              icon={getStatusIcon(request.status)}
                              sx={{
                                backgroundColor: getStatusColor(request.status),
                                color: 'white'
                              }}
                            />
                          </TableCell>
                          <TableCell>{request.appliedDate}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="text"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedRequest(request)
                                }}
                              >
                                View
                              </Button>
                              {request.status === 'pending' && (
                                <>
                                  <Button
                                    size="small"
                                    variant="text"
                                    color="warning"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditDialog(true)
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="text"
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setCancelDialog(true)
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {(request.status === 'rejected' || request.status === 'cancelled') && (
                                <Button
                                  size="small"
                                  variant="text"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteRequest()
                                  }}
                                >
                                  Delete
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications Panel */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {notifications.map((notification) => (
                    <ListItem 
                      key={notification.id} 
                      divider
                      sx={{ 
                        backgroundColor: notification.read ? 'transparent' : '#f8f9fa',
                        cursor: 'pointer'
                      }}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <ListItemIcon>
                        {notification.type === 'success' && <CheckCircle color="success" />}
                        {notification.type === 'error' && <Cancel color="error" />}
                        {notification.type === 'info' && <Schedule color="info" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.title}
                        secondary={
                          <>
                            <Typography variant="body2" sx={{ fontSize: 12 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {notification.date}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Selected Request Details */}
        {selectedRequest && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Request Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Employee Information
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="body2"><strong>Name:</strong> {selectedRequest.employeeName}</Typography>
                    <Typography variant="body2"><strong>ID:</strong> {selectedRequest.employeeId}</Typography>
                    <Typography variant="body2"><strong>Department:</strong> {selectedRequest.department}</Typography>
                    <Typography variant="body2"><strong>Emergency Contact:</strong> {selectedRequest.emergencyContact || 'Not provided'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Leave Details
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="body2"><strong>Type:</strong> {selectedRequest.leaveType}</Typography>
                    <Typography variant="body2"><strong>Duration:</strong> {selectedRequest.days} days</Typography>
                    <Typography variant="body2"><strong>Period:</strong> {selectedRequest.startDate} to {selectedRequest.endDate}</Typography>
                    <Typography variant="body2"><strong>Reason:</strong> {selectedRequest.reason}</Typography>
                    {selectedRequest.attachment && (
                      <Typography variant="body2"><strong>Attachment:</strong> 📎 {selectedRequest.attachment}</Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Application Status
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="body2"><strong>Applied:</strong> {selectedRequest.appliedDate}</Typography>
                    <Typography variant="body2"><strong>Status:</strong> {selectedRequest.status}</Typography>
                    <Typography variant="body2"><strong>Processed by:</strong> {selectedRequest.approvedBy || 'Pending'}</Typography>
                    {selectedRequest.approvedDate && (
                      <Typography variant="body2"><strong>Processed Date:</strong> {selectedRequest.approvedDate}</Typography>
                    )}
                    {selectedRequest.rejectionReason && (
                      <Typography variant="body2" color="error"><strong>Rejection Reason:</strong> {selectedRequest.rejectionReason}</Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Actions
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    {selectedRequest.status === 'pending' && (
                      <>
                        <Button
                          fullWidth
                          variant="contained"
                          color="warning"
                          startIcon={<Edit />}
                          onClick={() => setEditDialog(true)}
                          sx={{ mb: 1 }}
                        >
                          Edit Request
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => setCancelDialog(true)}
                        >
                          Cancel Request
                        </Button>
                      </>
                    )}
                    {(selectedRequest.status === 'rejected' || selectedRequest.status === 'cancelled') && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDeleteRequest}
                      >
                        Delete Request
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Leave Request
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Edit functionality will allow you to modify your leave request details before it's processed.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This feature is coming soon. You'll be able to edit dates, reason, and attachments.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>
            Close
          </Button>
          <Button onClick={handleEditRequest} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cancel Leave Request
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel this leave request?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The request will be marked as cancelled.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>
            No, Keep It
          </Button>
          <Button onClick={handleCancelRequest} variant="contained" color="error">
            Yes, Cancel It
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LeaveRequestDetails
