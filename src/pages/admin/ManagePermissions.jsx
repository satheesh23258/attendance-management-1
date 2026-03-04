import React, { useState, useEffect } from 'react'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Alert
} from '@mui/material'
import { CheckCircle, Cancel, Edit, ArrowBack } from '@mui/icons-material'
import { employeeAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const ManagePermissions = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [hybridRole, setHybridRole] = useState('hr') // Default to granting HR access
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchEmployees()
    }, [])

    const fetchEmployees = async () => {
        try {
            setLoading(true)
            const { data } = await employeeAPI.getAll()
            setEmployees(data.data || data)
        } catch (error) {
            toast.error('Failed to load employees')
        } finally {
            setLoading(false)
        }
    }

    const handleGrantPermission = async () => {
        try {
            // API call to grant permission 
            // Assuming a new endpoint or updating user profile
            const endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/hybrid-permissions/grant`
            await axios.post(endpoint, {
                employeeId: selectedEmployee._id || selectedEmployee.id,
                permissions: {
                    canAccessHR: true,
                    canAccessEmployee: true,
                    canViewReports: true,
                    canManageAttendance: false,
                    canManageLeaves: true
                },
                notes: 'Granted via Manage Permissions'
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })

            toast.success(`Hybrid permission granted to ${selectedEmployee.name}`)
            setOpenDialog(false)
            fetchEmployees() // Refresh
        } catch (error) {
            console.error("Error granting permission:", error)
            toast.error('Failed to grant permission')
        }
    }

    const openGrantDialog = (employee) => {
        setSelectedEmployee(employee)
        setOpenDialog(true)
    }

    return (
        <Box sx={{ p: 3 }}>
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
                        onClick={() => navigate(-1)}
                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Hybrid Permissions
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Manage dual Role-HR access for employees
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
                Grant "Hybrid" access to employees, allowing them to switch between Employee and HR views.
            </Alert>

            <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Current Role</TableCell>
                            <TableCell>Hybrid Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((emp) => (
                            <TableRow key={emp.id || emp._id}>
                                <TableCell>{emp.name}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>{emp.role}</TableCell>
                                <TableCell>
                                    {emp.hybridPermissions?.hasAccess ? (
                                        <Chip label="Hybrid" color="success" size="small" />
                                    ) : (
                                        <Chip label="Standard" color="default" size="small" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => openGrantDialog(emp)}
                                        disabled={emp.role === 'admin'}
                                    >
                                        Manage Access
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Grant Hybrid Access</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Allow <strong>{selectedEmployee?.name}</strong> to access HR functionalities?
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Additional Role</InputLabel>
                        <Select
                            value={hybridRole}
                            onChange={(e) => setHybridRole(e.target.value)}
                            label="Additional Role"
                        >
                            <MenuItem value="hr">HR (Human Resources)</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleGrantPermission} variant="contained" color="primary">
                        Grant Access
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ManagePermissions
