import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  Business,
  ArrowBack,
  Edit,
  Save,
  Cancel,
  Work,
  School,
  LocationOn
} from '@mui/icons-material'

const MyProfileTest = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike@company.com',
      phone: '+1 (555) 345-6789',
      address: '123 Main St, New York, NY 10001',
      dateOfBirth: '1990-05-15',
      gender: 'Male'
    },
    workInfo: {
      employeeId: 'EMP003',
      department: 'Engineering',
      position: 'Software Engineer',
      joinDate: '2023-06-10',
      manager: 'Jane Smith',
      workLocation: 'New York Office',
      employmentType: 'Full-time'
    },
    education: {
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      university: 'Tech University',
      graduationYear: '2012'
    }
  })

  const [tempData, setTempData] = useState(profileData)

  const handleBack = () => {
    window.history.back()
  }

  const handleEdit = () => {
    setTempData(profileData)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfileData(tempData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempData(profileData)
    setIsEditing(false)
  }

  const handleChange = (category, field, value) => {
    setTempData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const getYearsOfService = () => {
    const joinDate = new Date(profileData.workInfo.joinDate)
    const currentDate = new Date()
    const years = Math.floor((currentDate - joinDate) / (365.25 * 24 * 60 * 60 * 1000))
    return years
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
          <Button color="inherit" onClick={handleBack} startIcon={<ArrowBack />}>
            Back
          </Button>
          <Typography variant="h4">
            My Profile
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEditing ? (
            <>
              <Button color="inherit" onClick={handleCancel} startIcon={<Cancel />}>
                Cancel
              </Button>
              <Button color="inherit" onClick={handleSave} startIcon={<Save />}>
                Save
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleEdit} startIcon={<Edit />}>
              Edit
            </Button>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 4, textAlign: 'center' }}>
          <CardContent sx={{ py: 4 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main', 
              mx: 'auto', 
              mb: 2, 
              width: 100, 
              height: 100,
              fontSize: 40
            }}>
              {getInitials(profileData.personalInfo.firstName, profileData.personalInfo.lastName)}
            </Avatar>
            <Typography variant="h4" gutterBottom>
              {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {profileData.workInfo.position}
            </Typography>
            <Chip 
              label={profileData.workInfo.department}
              color="primary"
              size="medium"
            />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {getYearsOfService()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Years at Company
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  {profileData.workInfo.employeeId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employee ID
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" color="warning.main">
                  {profileData.workInfo.employmentType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employment Type
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" color="info.main">
                  {profileData.workInfo.workLocation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Work Location
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Personal Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person />
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="First Name"
                    value={tempData.personalInfo.firstName}
                    onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                    margin="normal"
                  />
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">First Name</Typography>
                    <Typography variant="body1">{profileData.personalInfo.firstName}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={tempData.personalInfo.lastName}
                    onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                    margin="normal"
                  />
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Last Name</Typography>
                    <Typography variant="body1">{profileData.personalInfo.lastName}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Email"
                    value={tempData.personalInfo.email}
                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                    margin="normal"
                    type="email"
                  />
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{profileData.personalInfo.email}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Phone"
                    value={tempData.personalInfo.phone}
                    onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                    margin="normal"
                  />
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1">{profileData.personalInfo.phone}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    value={tempData.personalInfo.dateOfBirth}
                    onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
                    margin="normal"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1">{profileData.personalInfo.dateOfBirth}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Address"
                    value={tempData.personalInfo.address}
                    onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                    margin="normal"
                  />
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body1">{profileData.personalInfo.address}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Work />
              Work Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Employee ID</Typography>
                  <Typography variant="body1">{profileData.workInfo.employeeId}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Department</Typography>
                  <Typography variant="body1">{profileData.workInfo.department}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Position</Typography>
                  <Typography variant="body1">{profileData.workInfo.position}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Manager</Typography>
                  <Typography variant="body1">{profileData.workInfo.manager}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Join Date</Typography>
                  <Typography variant="body1">{profileData.workInfo.joinDate}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Work Location</Typography>
                  <Typography variant="body1">{profileData.workInfo.workLocation}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School />
              Education
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Degree</Typography>
                  <Typography variant="body1">{profileData.education.degree}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Field</Typography>
                  <Typography variant="body1">{profileData.education.field}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">University</Typography>
                  <Typography variant="body1">{profileData.education.university}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Graduation Year</Typography>
                  <Typography variant="body1">{profileData.education.graduationYear}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default MyProfileTest
