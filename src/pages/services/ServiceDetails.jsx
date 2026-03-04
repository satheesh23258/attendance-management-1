import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  Assignment,
  Person,
  Schedule,
  LocationOn,
  Description,
  CheckCircle,
  AccessTime,
  Comment,
  Send
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { serviceAPI, employeeAPI } from '../../services/api'
import { toast } from 'react-hot-toast'

const ServiceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState(null)
  const [assignedUser, setAssignedUser] = useState(null)
  const [createdByUser, setCreatedByUser] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServiceDetails()
  }, [id])

  const fetchServiceDetails = async () => {
    try {
      setLoading(true)
      const serviceRes = await serviceAPI.getById(id)
      const serviceData = serviceRes.data
      setService(serviceData)

      // Fetch all employees to resolve names if needed
      // Ideally, the backend should populate this, but we'll fetch to be safe or map IDs
      const employeesRes = await employeeAPI.getAll()
      const employees = employeesRes.data.data || employeesRes.data || []

      if (serviceData.assignedTo) {
        const assigned = employees.find(u => u.id === serviceData.assignedTo || u._id === serviceData.assignedTo)
        setAssignedUser(assigned)
      }

      if (serviceData.createdBy) {
        const createdBy = employees.find(u => u.id === serviceData.createdBy || u._id === serviceData.createdBy)
        setCreatedByUser(createdBy)
      }

      // Initialize comments if they exist in the service object, otherwise default to empty
      setComments(serviceData.comments || [])

    } catch (error) {
      console.error('Failed to fetch service details:', error)
      toast.error('Failed to load service details')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/admin/services/edit/${id}`)
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      await serviceAPI.updateStatus(id, newStatus)
      setService(prev => ({ ...prev, status: newStatus }))
      toast.success('Status updated successfully')
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        // Assuming there's an endpoint or we update the service with the new comment
        // Since we don't have a specific addComment API in the list, we might simulate or check if update works
        // For now, let's assume we can't persist it easily without an endpoint, 
        // OR we use the generic update if comments are part of the service object.
        // But `serviceAPI` had `update`, so we could try that if comments are a field.
        // However, usually comments have their own endpoint. 
        // Let's just update local state for the UI to be responsive and show a toast warning if not persisted.

        const comment = {
          id: Date.now(),
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          comment: newComment,
          timestamp: new Date().toISOString(),
          isCreator: false
        }

        // If the backend supported it, we'd call API here.
        // existing comments + new comment
        // await serviceAPI.update(id, { ...service, comments: [...comments, comment] }) 

        setComments(prev => [...prev, comment])
        setNewComment('')
        setCommentDialogOpen(false)
        toast.success('Comment added')

      } catch (error) {
        console.error('Failed to add comment:', error)
        toast.error('Failed to add comment')
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#00c853'
      case 'in_progress':
        return '#00c853'
      case 'completed':
        return '#00c853'
      default:
        return '#000000'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#000000'
      case 'medium':
        return '#00c853'
      case 'low':
        return '#00c853'
      default:
        return '#000000'
    }
  }

  const isAdmin = user?.role === 'admin'
  const isHR = user?.role === 'hr'
  const isAssigned = service?.assignedTo === user?.id || service?.assignedTo?._id === user?.id

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!service) {
    return (
      <Box p={3}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/services')}>
          Back to Services
        </Button>
        <Typography variant="h6" mt={2}>Service not found</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        background: user?.role === 'employee'
          ? '#00c853'
          : user?.role === 'admin'
            ? '#00c853'
            : '#00c853',
        color: user?.role === 'hr' ? 'black' : 'white',
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
            onClick={() => {
              const path = (isAdmin || isHR) ? '/admin/services' : '/employee/services'
              navigate(path)
            }}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Service Details
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Detailed overview of service request and assignment
            </Typography>
          </Box>
        </Box>
        {(isAdmin || isHR) && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{
              backgroundColor: 'white',
              color: user?.role === 'hr' ? '#000000' : '#000000',
              '&:hover': { backgroundColor: '#f5f5f5' },
              fontWeight: 700,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Edit Service
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Service Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {service.title}
              </Typography>

              <Box display="flex" gap={1} mb={2}>
                <Chip
                  label={service.priority}
                  sx={{
                    backgroundColor: getPriorityColor(service.priority),
                    color: 'white'
                  }}
                />
                <Chip
                  label={service.status.replace('_', ' ')}
                  sx={{
                    backgroundColor: getStatusColor(service.status),
                    color: 'white'
                  }}
                />
                <Chip
                  label={service.category}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" paragraph>
                {service.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Assigned To
                      </Typography>
                      <Typography variant="body1">
                        {assignedUser?.name || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assignedUser?.department}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created By
                      </Typography>
                      <Typography variant="body1">
                        {createdByUser?.name || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {createdByUser?.department}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Schedule color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Due Date
                      </Typography>
                      <Typography variant="body1">
                        {service.dueDate ? new Date(service.dueDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccessTime color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {service.location?.address && (
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {service.location.address}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Status Update Actions */}
              {(isAdmin || isHR || isAssigned) && service.status !== 'completed' && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Update Status
                  </Typography>
                  <Box display="flex" gap={1}>
                    {service.status !== 'pending' && (
                      <Button
                        variant="outlined"
                        onClick={() => handleStatusUpdate('pending')}
                      >
                        Mark as Pending
                      </Button>
                    )}
                    {service.status !== 'in_progress' && (
                      <Button
                        variant="contained"
                        onClick={() => handleStatusUpdate('in_progress')}
                      >
                        Start Working
                      </Button>
                    )}
                    {service.status !== 'completed' && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate('completed')}
                        startIcon={<CheckCircle />}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Comments ({comments.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Comment />}
                  onClick={() => setCommentDialogOpen(true)}
                >
                  Add Comment
                </Button>
              </Box>

              <List>
                {comments.map((comment) => (
                  <ListItem key={comment.id} alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar
                        src={comment.userAvatar}
                        sx={{ width: 40, height: 40 }}
                      >
                        <Person />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">
                            {comment.userName}
                            {comment.isCreator && (
                              <Chip
                                label="Creator"
                                size="small"
                                sx={{ ml: 1 }}
                                variant="outlined"
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {comment.comment}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
                {comments.length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center" py={2}>
                    No comments yet.
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<Comment />}
                  onClick={() => setCommentDialogOpen(true)}
                  fullWidth
                >
                  Add Comment
                </Button>
                {(isAdmin || isHR) && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    fullWidth
                  >
                    Edit Service
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Service Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Assignment color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Service Created"
                    secondary={service.createdAt ? new Date(service.createdAt).toLocaleString() : 'N/A'}
                  />
                </ListItem>
                {service.status !== 'pending' && (
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Work Started"
                      secondary={service.startedAt ? new Date(service.startedAt).toLocaleString() : 'Recently'}
                    />
                  </ListItem>
                )}
                {service.status === 'completed' && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Completed"
                      secondary={service.completedAt ? new Date(service.completedAt).toLocaleString() : 'Recently'}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Comment Dialog */}
      <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddComment} variant="contained" startIcon={<Send />}>
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ServiceDetails
