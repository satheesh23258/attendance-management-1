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
  Divider,
  IconButton
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
  CalendarToday,
  Badge
} from '@mui/icons-material'

const MyProfile = () => {
  const [profile, setProfile] = useState({
    id: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    employeeId: 'EMP001',
    joinDate: '2022-01-15',
    manager: 'Jane Smith',
    location: 'New York Office',
    status: 'Active',
    avatar: null
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({ ...profile })
  const [openDialog, setOpenDialog] = useState(false)

  const handleEdit = () => {
    setEditedProfile({ ...profile })
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfile({ ...editedProfile })
    setIsEditing(false)
    setOpenDialog(false)
  }

  const handleCancel = () => {
    setEditedProfile({ ...profile })
    setIsEditing(false)
    setOpenDialog(false)
  }

  const handleBack = () => {
    window.history.back()
  }

  const handleInputChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value })
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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
          <IconButton color="inherit" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            My Profile
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="inherit" 
          startIcon={isEditing ? <Cancel /> : <Edit />}
          onClick={isEditing ? handleCancel : handleEdit}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 2, 
                    fontSize: 48,
                    bgcolor: 'primary.main'
                  }}
                >
                  {getInitials(profile.name)}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {profile.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {profile.position}
                </Typography>
                <Chip 
                  label={profile.status} 
                  color="success" 
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Employee ID: {profile.employeeId}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={isEditing ? editedProfile.name : profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={isEditing ? editedProfile.email : profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={isEditing ? editedProfile.phone : profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={isEditing ? editedProfile.department : profile.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Work Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      value={isEditing ? editedProfile.position : profile.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Manager"
                      value={isEditing ? editedProfile.manager : profile.manager}
                      onChange={(e) => handleInputChange('manager', e.target.value)}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={isEditing ? editedProfile.location : profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Join Date"
                      value={profile.joinDate}
                      disabled
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        2
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Years at Company
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        95%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Attendance Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        12
                    </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Projects Completed
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Save Button (only show when editing) */}
        {isEditing && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              startIcon={<Save />}
              onClick={() => setOpenDialog(true)}
              sx={{ mr: 2 }}
            >
              Save Changes
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<Cancel />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Save Profile Changes</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save the changes to your profile?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyProfile
