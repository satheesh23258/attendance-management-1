import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  ArrowBack,
  Email,
  Phone,
  Business,
  Badge,
  AccessTime,
  Assignment,
  LocationOn,
  Edit,
  Person
} from '@mui/icons-material'
import { employeeAPI, attendanceAPI, serviceAPI } from '../../services/api'
import toast from 'react-hot-toast'

const EmployeeProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [serviceHistory, setServiceHistory] = useState([])

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const empRes = await employeeAPI.getById(id)
        if (empRes.data) setEmployee(empRes.data)

        const attRes = await attendanceAPI.getAttendanceHistory({ employeeId: id })
        if (attRes.data) setAttendanceHistory(attRes.data)

        const srvRes = await serviceAPI.getAll({ assignedTo: id })
        if (srvRes.data) setServiceHistory(srvRes.data)
      } catch (error) {
        toast.error('Failed to load employee profile data')
      }
    }
    fetchEmployeeData()
  }, [id])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleEdit = () => {
    navigate(`/admin/employees/edit/${id}`)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#000000'
      case 'hr':
        return '#f2c94c'
      case 'employee':
        return '#2f80ed'
      default:
        return '#000000'
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? '#00c853' : '#000000'
  }

  const getServiceColor = (status) => {
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

  if (!employee) {
    return (
      <Box>
        <Typography variant="h6">Employee not found</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/employees')}
          sx={{ mr: 2 }}
        >
          Back to Employees
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Employee Profile
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={handleEdit}
        >
          Edit Employee
        </Button>
      </Box>

      {/* Employee Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} textAlign="center">
              <Avatar
                src={employee.avatar}
                alt={employee.name}
                sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
              >
                <Person sx={{ fontSize: 80 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {employee.name}
              </Typography>
              <Box display="flex" justifyContent="center" gap={1} mb={2}>
                <Chip
                  label={employee.role.toUpperCase()}
                  sx={{
                    backgroundColor: getRoleColor(employee.role),
                    color: 'white'
                  }}
                />
                <Chip
                  label={employee.isActive ? 'ACTIVE' : 'INACTIVE'}
                  sx={{
                    backgroundColor: getStatusColor(employee.isActive),
                    color: 'white'
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Badge color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Employee ID"
                    secondary={employee.employeeId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={employee.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={employee.phone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Department"
                    secondary={employee.department}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Join Date"
                    secondary={new Date(employee.joinDate).toLocaleDateString()}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Attendance History" icon={<AccessTime />} />
          <Tab label="Service History" icon={<Assignment />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attendance History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Working Hours</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut || '-'}</TableCell>
                      <TableCell>{record.workingHours}h</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          size="small"
                          sx={{
                            backgroundColor: record.status === 'present' ? '#00c853' : '#000000',
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>{record.location?.address || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Service History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service Title</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Completed Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceHistory.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={service.priority}
                          size="small"
                          sx={{
                            backgroundColor: service.priority === 'high' ? '#000000' :
                              service.priority === 'medium' ? '#00c853' : '#00c853',
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={service.status}
                          size="small"
                          sx={{
                            backgroundColor: getServiceColor(service.status),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(service.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(service.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {service.completedAt ?
                          new Date(service.completedAt).toLocaleDateString() : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default EmployeeProfile
