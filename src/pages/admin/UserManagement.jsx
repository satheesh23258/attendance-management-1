import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar
} from '@mui/material'
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Visibility,
  Star,
  StarBorder
} from '@mui/icons-material'

const UserManagement = () => {
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@company.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-26 10:30 AM',
      department: 'IT',
      phone: '+1 (555) 123-4567',
      permissions: ['all'],
      createdAt: '2023-01-01'
    },
    {
      id: 2,
      username: 'hr_manager',
      email: 'hr@company.com',
      role: 'hr',
      status: 'active',
      lastLogin: '2024-01-26 09:15 AM',
      department: 'HR',
      phone: '+1 (555) 234-5678',
      permissions: ['employee_management', 'reports', 'analytics'],
      createdAt: '2023-02-15'
    },
    {
      id: 3,
      username: 'mike_johnson',
      email: 'mike@company.com',
      role: 'employee',
      status: 'active',
      lastLogin: '2024-01-26 08:45 AM',
      department: 'Engineering',
      phone: '+1 (555) 345-6789',
      permissions: ['view_profile', 'check_in_out', 'tasks'],
      createdAt: '2023-06-10',
      hybrid: false
    },
    {
      id: 4,
      username: 'jane_smith',
      email: 'jane@company.com',
      role: 'hr',
      status: 'active',
      lastLogin: '2024-01-25 04:30 PM',
      department: 'HR',
      phone: '+1 (555) 456-7890',
      permissions: ['employee_management', 'reports', 'analytics'],
      createdAt: '2023-03-20',
      hybrid: false
    },
    {
      id: 5,
      username: 'suspended_user',
      email: 'suspended@company.com',
      role: 'employee',
      status: 'suspended',
      lastLogin: '2024-01-20 02:15 PM',
      department: 'Sales',
      phone: '+1 (555) 567-8901',
      permissions: ['view_profile', 'check_in_out'],
      createdAt: '2023-09-05'
    }
  ])

  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [dialogMode, setDialogMode] = useState('view')

  const handleBack = () => {
    window.history.back()
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setDialogMode('view')
    setOpenDialog(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setDialogMode('edit')
    setOpenDialog(true)
  }

  const handleAddUser = () => {
    setSelectedUser({
      username: '',
      email: '',
      role: 'employee',
      status: 'active',
      department: '',
      phone: '',
      permissions: ['view_profile', 'check_in_out']
    })
    setDialogMode('add')
    setOpenDialog(true)
  }

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.username}?`)) {
      setUsers(users.filter(u => u.id !== user.id))
    }
  }

  const handleToggleHybrid = (targetUser) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Only admins can grant hybrid access')
      return
    }

    if (targetUser.role !== 'employee') {
      toast.error('Hybrid access can only be granted to employees')
      return
    }

    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, hybrid: !u.hybrid } : u))
    // persist hybrid flag by id in localStorage for demo persistence
    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem('hybridUsers') || '{}')
      stored[targetUser.id] = !targetUser.hybrid
      localStorage.setItem('hybridUsers', JSON.stringify(stored))
    }, 0)

    toast.success(`${targetUser.username} hybrid access ${targetUser.hybrid ? 'revoked' : 'granted'}`)
  }

  const handleSaveUser = () => {
    if (dialogMode === 'add') {
      const newUser = {
        ...selectedUser,
        id: Math.max(...users.map(u => u.id)) + 1,
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
    } else {
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u))
    }
    setOpenDialog(false)
  }

  const filteredUsers = users.filter(user => {
    return (
      (!filterRole || user.role === filterRole) &&
      (!filterStatus || user.status === filterStatus)
    )
  })

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error'
      case 'hr': return 'warning'
      case 'employee': return 'primary'
      default: return 'default'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'default'
      case 'suspended': return 'error'
      default: return 'default'
    }
  }

  const getInitials = (username) => {
    return username.split('_').map(n => n[0]).join('').toUpperCase()
  }

  const getStatistics = () => {
    const total = users.length
    const active = users.filter(u => u.status === 'active').length
    const admin = users.filter(u => u.role === 'admin').length
    const hr = users.filter(u => u.role === 'hr').length
    const employee = users.filter(u => u.role === 'employee').length

    return { total, active, admin, hr, employee }
  }

  const stats = getStatistics()

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
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
              User Management
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage system access and user roles
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Add />}
          onClick={handleAddUser}
          sx={{
            bgcolor: 'white',
            color: '#000000',
            fontWeight: 600,
            '&:hover': { bgcolor: '#f5f5f5' },
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {stats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {stats.admin}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {stats.hr}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  HR Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Accounts
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {getInitials(user.username)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {user.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.toUpperCase()}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={getStatusColor(user.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewUser(user)}
                            size="small"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="info"
                            onClick={() => handleEditUser(user)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteUser(user)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                          {currentUser?.role === 'admin' && user.role === 'employee' && (
                            <IconButton
                              color={user.hybrid ? 'warning' : 'default'}
                              onClick={() => handleToggleHybrid(user)}
                              size="small"
                              title={user.hybrid ? 'Revoke Hybrid' : 'Grant Hybrid'}
                            >
                              {user.hybrid ? <Star /> : <StarBorder />}
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* User Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'view' ? 'User Details' :
            dialogMode === 'edit' ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                  disabled={dialogMode === 'view'}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  disabled={dialogMode === 'view'}
                  margin="normal"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    label="Role"
                    disabled={dialogMode === 'view'}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                    label="Status"
                    disabled={dialogMode === 'view'}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={selectedUser.department}
                  onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                  disabled={dialogMode === 'view'}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedUser.phone}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  disabled={dialogMode === 'view'}
                  margin="normal"
                />
              </Grid>
              {dialogMode === 'view' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Login"
                      value={selectedUser.lastLogin}
                      disabled
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Created At"
                      value={selectedUser.createdAt}
                      disabled
                      margin="normal"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          {dialogMode !== 'view' && (
            <Button onClick={handleSaveUser} variant="contained">
              {dialogMode === 'add' ? 'Add User' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement
