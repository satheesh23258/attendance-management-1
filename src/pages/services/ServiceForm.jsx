import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material'
import {
  Save,
  Cancel,
  Assignment,
  Description,
  Schedule,
  LocationOn,
  ArrowBack
} from '@mui/icons-material'
import { serviceAPI, employeeAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'

const ServiceForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    assignedTo: '',
    dueDate: '',
    location: ''
  })

  const [employees, setEmployees] = useState([])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const categories = [
    'IT Support',
    'Facilities',
    'Maintenance',
    'Security',
    'Transportation',
    'Cleaning',
    'Other'
  ]

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true)
        // Fetch employees for dropdown
        const empResponse = await employeeAPI.getAll()
        const employeeData = empResponse.data.data || empResponse.data || []
        setEmployees(employeeData)

        // If edit mode, fetch service details
        if (isEdit) {
          const serviceResponse = await serviceAPI.getById(id)
          const service = serviceResponse.data
          setFormData({
            title: service.title,
            description: service.description,
            priority: service.priority,
            category: service.category,
            assignedTo: service.assignedTo?._id || service.assignedTo || '',
            dueDate: service.dueDate ? service.dueDate.split('T')[0] : '',
            location: service.location?.address || ''
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data')
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Service title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign this service to someone'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    } else {
      const dueDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const submissionData = {
        ...formData,
        location: formData.location ? { address: formData.location } : undefined
      }

      if (isEdit) {
        await serviceAPI.update(id, submissionData)
        toast.success('Service updated successfully')
      } else {
        await serviceAPI.create(submissionData)
        toast.success('Service created successfully')
      }
      navigate('/admin/services')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error(error.response?.data?.message || 'Failed to save service')
      setErrors({
        general: error.response?.data?.message || 'Failed to save service. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/services')
  }

  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleCancel}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Edit Service' : 'Create New Service'}
        </Typography>
      </Box>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Service Details */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Service Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  InputProps={{
                    startAdornment: (
                      <Assignment sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    disabled={isLoading}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <Typography variant="caption" color="error">
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: (
                      <Description sx={{ mr: 1, mt: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                    disabled={isLoading}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.assignedTo}>
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    label="Assign To"
                    disabled={isLoading}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id || employee._id} value={employee.id || employee._id}>
                        {employee.name} - {employee.role}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.assignedTo && (
                    <Typography variant="caption" color="error">
                      {errors.assignedTo}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location (Optional)"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ServiceForm
