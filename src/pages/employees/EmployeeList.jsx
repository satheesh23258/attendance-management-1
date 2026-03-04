import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material'
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Person,
  Visibility
} from '@mui/icons-material'
import { employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

const EmployeeList = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const loadEmployees = async () => {
    try {
      const response = await employeeAPI.getAll()
      setEmployees(response.data || [])
      setFilteredEmployees(response.data || [])
    } catch (error) {
      toast.error('Failed to load employees')
      console.error(error)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmployees(filtered)
  }, [searchTerm, employees])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleAddEmployee = () => {
    navigate('/admin/employees/new')
  }

  const handleEditEmployee = (employee) => {
    navigate(`/admin/employees/edit/${employee.id}`)
  }

  const handleViewEmployee = (employee) => {
    navigate(`/employees/${employee.id}`)
  }

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee)
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteConfirm = async () => {
    try {
      await employeeAPI.delete(employeeToDelete.id || employeeToDelete._id)
      setEmployees(prev => prev.filter(emp => (emp.id || emp._id) !== (employeeToDelete.id || employeeToDelete._id)))
      toast.success('Employee deleted successfully')
    } catch (error) {
      toast.error('Failed to delete employee')
    } finally {
      setDeleteDialogOpen(false)
      setEmployeeToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setEmployeeToDelete(null)
  }

  const handleToggleStatus = async (employee) => {
    try {
      const id = employee.id || employee._id
      await employeeAPI.toggleStatus(id)
      setEmployees(prev => prev.map(emp =>
        (emp.id || emp._id) === id ? { ...emp, isActive: !emp.isActive } : emp
      ))
      toast.success(`Employee status toggled`)
    } catch (error) {
      toast.error('Failed to toggle employee status')
    } finally {
      handleMenuClose()
    }
  }

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget)
    setSelectedEmployee(employee)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedEmployee(null)
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Employee Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddEmployee}
        >
          Add Employee
        </Button>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search employees by name, email, ID, or department..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee, index) => (
                  <TableRow key={employee.id || employee._id || index} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={employee.avatar}
                          alt={employee.name}
                          sx={{ mr: 2 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.role.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getRoleColor(employee.role),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(employee.isActive),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, employee)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewEmployee(selectedEmployee)}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleEditEmployee(selectedEmployee)}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleToggleStatus(selectedEmployee)}>
          {selectedEmployee?.isActive ? (
            <>
              <Person sx={{ mr: 1 }} />
              Deactivate
            </>
          ) : (
            <>
              <Person sx={{ mr: 1 }} />
              Activate
            </>
          )}
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedEmployee)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {employeeToDelete?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmployeeList
