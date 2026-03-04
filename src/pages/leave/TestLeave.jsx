import React, { useState } from 'react'
import { Box, Typography, Button, Card, CardContent, Grid, TextField, Chip, List, ListItem, ListItemText } from '@mui/material'
import { Event, Schedule, CheckCircle, Cancel, TrendingUp, Person } from '@mui/icons-material'

const TestLeave = () => {
  const [testData, setTestData] = useState([
    { id: 1, type: 'info', title: 'Test Notification 1', message: 'This is a test notification', date: '2024-01-15', read: false },
    { id: 2, type: 'success', title: 'Test Success', message: 'Leave request approved successfully', date: '2024-01-10', read: false },
    { id: 3, type: 'warning', title: 'Test Warning', message: 'Leave balance is low', date: '2024-01-05', read: false }
  ])

  const [formData, setFormData] = useState({
    leaveType: 'annual',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    reason: 'Test leave application',
    days: 5
  })

  const handleSubmit = () => {
    alert('Form submitted successfully!')
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      days: 0
    })
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom>
        Leave Management Test - Enhanced Features
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Leave Application Form
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Leave Type"
                value={formData.leaveType}
                onChange={(e) => setFormData(prev => ({ ...prev, leaveType: e.target.value }))}
                select
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Reason"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                Submit Test Application
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Notifications
          </Typography>
          <List>
            {testData.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.title}
                  secondary={item.message}
                  action={
                    <Chip
                      label={item.type}
                      size="small"
                      color={item.type === 'success' ? 'success' : item.type === 'warning' ? 'warning' : 'info'}
                    />
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Analytics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6">Total Requests</Typography>
              <Typography variant="h4">156</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6">Approved</Typography>
              <Typography variant="h4">142</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h4">6</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Leave Balance
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6">Annual Leave</Typography>
              <Typography variant="h4">15 days</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6">Sick Leave</Typography>
              <Typography variant="h4">10 days</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6">Personal Leave</Typography>
              <Typography variant="h4">5 days</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default TestLeave
