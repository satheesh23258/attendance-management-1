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
  Avatar,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Save,
  Cancel,
  PhotoCamera,
  Person,
  Email,
  Phone,
  Business,
  Badge
} from '@mui/icons-material'
import { employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

const EmployeeForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: 'employee',
    employeeId: '',
    avatar: '',
    isActive: true
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState('')

  const departments = [
    'IT',
    'Human Resources',
    'Sales',
    'Marketing',
    'Finance',
    'Operations',
    'Customer Support'
  ]

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'hr', label: 'HR' },
    { value: 'employee', label: 'Employee' }
  ]

  useEffect(() => {
    if (isEdit) {
      const loadEmployee = async () => {
        try {
          const res = await employeeAPI.getById(id)
          if (res.data) {
            setFormData(res.data)
            setAvatarPreview(res.data.avatar || '')
          }
        } catch (error) {
          toast.error('Failed to load employee details')
        }
      }
      loadEmployee()
    }
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required'
    }
    
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required'
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
      if (isEdit) {
        await employeeAPI.update(id, formData)
        toast.success('Employee updated successfully')
      } else {
        await employeeAPI.create(formData)
        toast.success('Employee created successfully')
      }
      navigate('/admin/employees')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save employee')
      setErrors({
        general: 'Failed to save employee. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/employees')
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Employee' : 'Add New Employee'}
      </Typography>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Avatar Upload */}
              <Grid item xs={12} display="flex" justifyContent="center">
                <Box textAlign="center">
                  <Avatar
                    src={avatarPreview}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  >
                    <Person sx={{ fontSize: 60 }} />
                  </Avatar>
                  <input
                    accept="image/*"
                    id="avatar-upload"
                    type="file"
                    hidden
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatar-upload">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  <Typography variant="caption" display="block">
                    Upload Photo
                  </Typography>
                </Box>
              </Grid>

              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  error={!!errors.employeeId}
                  helperText={errors.employeeId}
                  InputProps={{
                    startAdornment: (
                      <Badge sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.department}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    label="Department"
                    disabled={isLoading}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.department && (
                    <Typography variant="caption" color="error">
                      {errors.department}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Role"
                    disabled={isLoading}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                {isLoading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Add Employee')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EmployeeForm
