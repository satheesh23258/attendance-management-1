import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid
} from '@mui/material'
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material'

const TestLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([])

  useEffect(() => {
    // Mock leave requests data
    const mockRequests = [
      {
        id: 1,
        leaveType: 'Annual Leave',
        startDate: '2024-01-15',
        endDate: '2024-01-19',
        days: 5,
        reason: 'Family vacation',
        status: 'approved',
        appliedDate: '2024-01-10',
        approvedBy: 'Jane Smith',
        approvedDate: '2024-01-12'
      },
      {
        id: 2,
        leaveType: 'Sick Leave',
        startDate: '2024-01-20',
        endDate: '2024-01-21',
        days: 2,
        reason: 'Medical appointment',
        status: 'pending',
        appliedDate: '2024-01-19',
        approvedBy: null,
        approvedDate: null
      },
      {
        id: 3,
        leaveType: 'Personal Leave',
        startDate: '2024-01-05',
        endDate: '2024-01-05',
        days: 1,
        reason: 'Personal work',
        status: 'rejected',
        appliedDate: '2024-01-03',
        approvedBy: 'John Manager',
        approvedDate: '2024-01-04',
        rejectionReason: 'Insufficient notice period'
      }
    ]
    setLeaveRequests(mockRequests)
  }, [])

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
      default: return null
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ArrowBack 
              sx={{ cursor: 'pointer' }} 
              onClick={() => window.history.back()} 
            />
            My Leave Requests - Status Display
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            Here are all your leave requests with their approval status:
          </Typography>

          <TableContainer component={Card} elevation={0} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Processed By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>
                      {request.days} days
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {request.startDate} to {request.endDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status.toUpperCase()}
                        size="small"
                        icon={getStatusIcon(request.status)}
                        sx={{
                          backgroundColor: getStatusColor(request.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>{request.appliedDate}</TableCell>
                    <TableCell>
                      {request.approvedBy || 'Pending'}
                      {request.approvedDate && (
                        <Typography variant="caption" display="block">
                          on {request.approvedDate}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: '#e8f5e8', border: '2px solid #4caf50' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h6" color="#4caf50">
                    APPROVED
                  </Typography>
                  <Typography variant="body2">
                    {leaveRequests.filter(r => r.status === 'approved').length} requests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: '#fff3e0', border: '2px solid #00c853' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Schedule sx={{ fontSize: 40, color: '#00c853', mb: 1 }} />
                  <Typography variant="h6" color="#00c853">
                    PENDING
                  </Typography>
                  <Typography variant="body2">
                    {leaveRequests.filter(r => r.status === 'pending').length} requests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: '#ffebee', border: '2px solid #00c853' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Cancel sx={{ fontSize: 40, color: '#00c853', mb: 1 }} />
                  <Typography variant="h6" color="#00c853">
                    REJECTED
                  </Typography>
                  <Typography variant="body2">
                    {leaveRequests.filter(r => r.status === 'rejected').length} requests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
              sx={{ mr: 2 }}
            >
              Go Back to Leave Application
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default TestLeaveRequests
