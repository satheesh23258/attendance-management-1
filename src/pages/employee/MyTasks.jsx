import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  IconButton
} from '@mui/material'
import {
  Assignment,
  Schedule,
  CheckCircle,
  Pending,
  ArrowBack,
  PriorityHigh,
  LowPriority,
  AccessTime
} from '@mui/icons-material'
import DashboardLayout from '../../components/DashboardLayout'

const MyTasks = () => {
  const [tasks] = useState([
    {
      id: 1,
      title: 'Complete Project Documentation',
      description: 'Write comprehensive documentation for the new employee management system',
      priority: 'high',
      status: 'in-progress',
      progress: 75,
      dueDate: '2024-01-30',
      assignedBy: 'John Doe'
    },
    {
      id: 2,
      title: 'Review Code Changes',
      description: 'Review and approve pending pull requests from team members',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      dueDate: '2024-01-28',
      assignedBy: 'Jane Smith'
    },
    {
      id: 3,
      title: 'Team Meeting Preparation',
      description: 'Prepare slides and agenda for weekly team sync',
      priority: 'low',
      status: 'completed',
      progress: 100,
      dueDate: '2024-01-25',
      assignedBy: 'Sarah Johnson'
    },
    {
      id: 4,
      title: 'Bug Fix: Login Issue',
      description: 'Fix the authentication bug reported by QA team',
      priority: 'high',
      status: 'in-progress',
      progress: 40,
      dueDate: '2024-01-27',
      assignedBy: 'Mike Wilson'
    }
  ])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <PriorityHigh />
      case 'medium': return <AccessTime />
      case 'low': return <LowPriority />
      default: return <Assignment />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in-progress': return 'warning'
      case 'pending': return 'default'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle color="success" />
      case 'in-progress': return <Schedule color="warning" />
      case 'pending': return <Pending color="action" />
      default: return <Assignment />
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <DashboardLayout title="Tasks & Assignments">
      {/* Header */}
      <Box sx={{
        background: '#00c853',
        color: 'white',
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
            onClick={handleBack}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              My Tasks
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Track and manage your assigned tasks
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Task Management"
          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {tasks.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {tasks.filter(t => t.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {tasks.filter(t => t.priority === 'high').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Priority
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tasks List */}
        <Typography variant="h5" gutterBottom>
          Task List
        </Typography>

        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h3">
                      {task.title}
                    </Typography>
                    {getStatusIcon(task.status)}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      icon={getPriorityIcon(task.priority)}
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                    <Chip
                      label={task.status.replace('-', ' ')}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">{task.progress}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {task.assignedBy.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {task.assignedBy}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Due: {task.dueDate}
                    </Typography>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={task.status === 'completed'}
                  >
                    {task.status === 'completed' ? 'Completed' : 'Update Progress'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  )
}

export default MyTasks
