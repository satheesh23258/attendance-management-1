import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Alert,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Avatar
} from '@mui/material'
import {
  Add,
  Remove,
  Security,
  Person,
  AccessTime,
  CheckCircle,
  Error,
  Warning,
  ArrowBack
} from '@mui/icons-material'
import axios from 'axios'
import { useTheme } from '../../contexts/ThemeContext'

const HybridPermissions = () => {
  const { colors } = useTheme()
  const [permissions, setPermissions] = useState([])
  const [eligibleEmployees, setEligibleEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [permissionForm, setPermissionForm] = useState({
    canAccessHR: true,
    canAccessEmployee: true,
    canViewReports: true,
    canManageAttendance: false,
    canMarkAttendanceForOthers: false,
    canManageLeaves: true,
    notes: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Use mock data for demo
    setPermissions([
      {
        _id: '1',
        employee: {
          _id: '3',
          name: 'John Smith',
          email: 'john@company.com',
          employeeId: 'EMP003'
        },
        permissions: {
          canAccessHR: true,
          canAccessEmployee: true,
          canViewReports: true,
          canManageAttendance: true,
          canMarkAttendanceForOthers: true,
          canManageLeaves: false
        },
        grantedBy: 'Admin',
        grantedAt: new Date('2024-01-15'),
        expiresAt: new Date('2024-12-31'),
        accessCount: 25,
        lastAccessed: new Date(),
        status: 'active'
      }
    ])

    setEligibleEmployees([
      {
        _id: '3',
        name: 'John Smith',
        email: 'john@company.com',
        employeeId: 'EMP003',
        department: 'IT'
      },
      {
        _id: '4',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        employeeId: 'EMP004',
        department: 'HR'
      },
      {
        _id: '5',
        name: 'Mike Wilson',
        email: 'mike@company.com',
        employeeId: 'EMP005',
        department: 'Sales'
      }
    ])
    setLoading(false)
  }, [])

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/hybrid-permissions/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPermissions(response.data)
    } catch (error) {
      console.error('Error fetching permissions:', error)
      setError('Failed to fetch permissions')
    } finally {
      setLoading(false)
    }
  }

  const fetchEligibleEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/hybrid-permissions/eligible-employees', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEligibleEmployees(response.data)
    } catch (error) {
      console.error('Error fetching eligible employees:', error)
    }
  }

  const handleGrantPermission = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee')
      return
    }

    try {
      // For demo, create mock permission
      const newPermission = {
        _id: Date.now().toString(),
        employee: eligibleEmployees.find(emp => emp._id === selectedEmployee),
        permissions: permissionForm,
        grantedBy: 'Admin',
        grantedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        accessCount: 0,
        lastAccessed: null,
        status: 'active'
      }

      setPermissions(prev => [...prev, newPermission])
      setSuccess('Hybrid permission granted successfully!')
      setOpenDialog(false)
      setSelectedEmployee('')
      setPermissionForm({
        canAccessHR: true,
        canAccessEmployee: true,
        canViewReports: true,
        canManageAttendance: false,
        canMarkAttendanceForOthers: false,
        canManageLeaves: true,
        notes: ''
      })
      setError('')
    } catch (error) {
      setError('Failed to grant permission')
    }
  }

  const handleRevokePermission = async (permissionId) => {
    try {
      // For demo, update mock data
      setPermissions(prev =>
        prev.map(p =>
          p._id === permissionId
            ? { ...p, status: 'revoked' }
            : p
        )
      )
      setSuccess('Permission revoked successfully')
    } catch (error) {
      setError('Failed to revoke permission')
    }
  }

  const getStatusChip = (status, expiresAt) => {
    if (status === 'revoked') {
      return <Chip label="Revoked" color="error" size="small" icon={<Error />} />
    }

    if (new Date(expiresAt) < new Date()) {
      return <Chip label="Expired" color="default" size="small" icon={<Warning />} />
    }

    return <Chip label="Active" color="success" size="small" icon={<CheckCircle />} />
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background.default }}>
      {/* Red Header */}
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
            onClick={() => window.history.back()}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Hybrid System Access
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage employee dual-role permissions and access history
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>

        {/* Error and Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Grant Permission Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              fontWeight: 500
            }}
          >
            Grant Hybrid Permission
          </Button>
        </Box>

        {/* Permissions Table */}
        <Card sx={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Permissions</TableCell>
                    <TableCell>Granted By</TableCell>
                    <TableCell>Granted Date</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: colors.primary.main, width: 32, height: 32 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {permission.employee.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {permission.employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {permission.permissions.canAccessHR && (
                            <Chip label="HR" size="small" color="primary" />
                          )}
                          {permission.permissions.canAccessEmployee && (
                            <Chip label="Employee" size="small" color="secondary" />
                          )}
                          {permission.permissions.canViewReports && (
                            <Chip label="Reports" size="small" color="info" />
                          )}
                          {permission.permissions.canManageLeaves && (
                            <Chip label="Leave Mgmt" size="small" color="warning" />
                          )}
                          {permission.permissions.canManageAttendance && (
                            <Chip label="Attendance" size="small" color="success" />
                          )}
                          {permission.permissions.canMarkAttendanceForOthers && (
                            <Chip label="Mark for Others" size="small" color="error" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {permission.grantedBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(permission.grantedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(permission.expiresAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(permission.status, permission.expiresAt)}
                      </TableCell>
                      <TableCell>
                        {permission.status === 'active' && (
                          <IconButton
                            onClick={() => handleRevokePermission(permission._id)}
                            color="error"
                            size="small"
                          >
                            <Remove />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Grant Permission Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>Grant Hybrid Permission</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Employee</InputLabel>
                  <Select
                    value={selectedEmployee}
                    label="Select Employee"
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    {eligibleEmployees.map((employee) => (
                      <MenuItem key={employee._id} value={employee._id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: colors.primary.main }}>
                            <Person sx={{ fontSize: 14 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{employee.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {employee.email} • {employee.department}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Permissions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={permissionForm.canAccessHR}
                        onChange={(e) => setPermissionForm(prev => ({
                          ...prev,
                          canAccessHR: e.target.checked
                        }))}
                      />
                    }
                    label="Access HR Dashboard"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={permissionForm.canAccessEmployee}
                        onChange={(e) => setPermissionForm(prev => ({
                          ...prev,
                          canAccessEmployee: e.target.checked
                        }))}
                      />
                    }
                    label="Access Employee Dashboard"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={permissionForm.canViewReports}
                        onChange={(e) => setPermissionForm(prev => ({
                          ...prev,
                          canViewReports: e.target.checked
                        }))}
                      />
                    }
                    label="View Reports"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={permissionForm.canManageLeaves}
                        onChange={(e) => setPermissionForm(prev => ({
                          ...prev,
                          canManageLeaves: e.target.checked
                        }))}
                      />
                    }
                    label="Manage Leave Requests"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={permissionForm.canManageAttendance}
                        onChange={(e) => setPermissionForm(prev => ({
                          ...prev,
                          canManageAttendance: e.target.checked
                        }))}
                      />
                    }
                    label="Manage Attendance"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={permissionForm.canMarkAttendanceForOthers}
                        onChange={(e) => setPermissionForm(prev => ({
                          ...prev,
                          canMarkAttendanceForOthers: e.target.checked
                        }))}
                      />
                    }
                    label="Mark Attendance for Others"
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes (Optional)"
                  value={permissionForm.notes}
                  onChange={(e) => setPermissionForm(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder="Add any notes about this permission grant..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleGrantPermission}
              variant="contained"
              sx={{ textTransform: 'none', borderRadius: 1.5 }}
            >
              Grant Permission
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default HybridPermissions
