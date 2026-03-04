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
    Grid,
    Divider,
    LinearProgress
} from '@mui/material'
import {
    Add,
    Search,
    MoreVert,
    Edit,
    Delete,
    Person,
    Visibility,
    ArrowBack,
    Groups
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { serviceAPI, employeeAPI } from '../../services/api'
import DashboardLayout from '../../components/DashboardLayout'
import { toast } from 'react-hot-toast'

const AdminServiceManagement = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [services, setServices] = useState([])
    const [filteredServices, setFilteredServices] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [priorityFilter, setPriorityFilter] = useState('all')

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [serviceToDelete, setServiceToDelete] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedService, setSelectedService] = useState(null)
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [assignDialogOpen, setAssignDialogOpen] = useState(false)
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [servicesRes, employeesRes] = await Promise.all([
                serviceAPI.getAll(),
                employeeAPI.getAll()
            ])

            setServices(servicesRes.data || [])
            setFilteredServices(servicesRes.data || [])
            setEmployees(employeesRes.data.data || employeesRes.data || [])
        } catch (error) {
            console.error('Failed to fetch data:', error)
            toast.error('Failed to load management data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let filtered = services

        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(service => service.status === statusFilter)
        }

        if (priorityFilter !== 'all') {
            filtered = filtered.filter(service => service.priority === priorityFilter)
        }

        setFilteredServices(filtered)
    }, [searchTerm, statusFilter, priorityFilter, services])

    const handleAddService = () => navigate('/admin/services/new')
    const handleEditService = (service) => navigate(`/admin/services/edit/${service.id || service._id}`)
    const handleViewService = (service) => navigate(`/admin/services/${service.id || service._id}`)

    const handleDeleteClick = (service) => {
        setServiceToDelete(service)
        setDeleteDialogOpen(true)
        handleMenuClose()
    }

    const handleDeleteConfirm = async () => {
        try {
            await serviceAPI.delete(serviceToDelete.id || serviceToDelete._id)
            setServices(prev => prev.filter(s => (s.id || s._id) !== (serviceToDelete.id || serviceToDelete._id)))
            setDeleteDialogOpen(false)
            toast.success('Service deleted successfully')
        } catch (error) {
            toast.error('Delete failed')
        }
    }

    const handleAssignConfirm = async () => {
        try {
            await serviceAPI.assignService(selectedService.id || selectedService._id, { employeeId: selectedEmployeeId })
            setServices(prev => prev.map(s =>
                (s.id || s._id) === (selectedService.id || selectedService._id) ? { ...s, assignedTo: selectedEmployeeId } : s
            ))
            setAssignDialogOpen(false)
            toast.success('Service assigned')
        } catch (error) {
            toast.error('Assignment failed')
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#00c853'
            case 'in_progress': return '#00c853'
            case 'completed': return '#00c853'
            default: return '#000000'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#000000'
            case 'medium': return '#00c853'
            case 'low': return '#00c853'
            default: return '#000000'
        }
    }

    const getEmployee = (id) => employees.find(e => e.id === id || e._id === id)

    const handleMenuClick = (event, service) => {
        setAnchorEl(event.currentTarget)
        setSelectedService(service)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedService(null)
    }

    const stats = {
        total: services.length,
        pending: services.filter(s => s.status === 'pending').length,
        inProgress: services.filter(s => s.status === 'in_progress').length,
        completed: services.filter(s => s.status === 'completed').length
    }

    return (
        <DashboardLayout title="Admin Service Management">
            {/* Header */}
            <Box sx={{
                background: '#000000',
                color: 'white',
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/dashboard/admin')}
                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Service Management
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Add />}
                    onClick={handleAddService}
                    sx={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'white' },
                        fontWeight: 600,
                        px: 3
                    }}
                >
                    Create Service
                </Button>
            </Box>

            <Box px={3} pt={3}>
                {/* Filters */}
                <Card sx={{ mb: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: 2 }}>
                    <CardContent sx={{ py: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4.5}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Search fontSize="small" color="action" /></InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3.75}>
                                <TextField
                                    fullWidth
                                    select
                                    size="small"
                                    label="Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="in_progress">In Progress</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3.75}>
                                <TextField
                                    fullWidth
                                    select
                                    size="small"
                                    label="Priority"
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Priority</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="low">Low</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Top Stats */}
                <Grid container spacing={3} mb={4}>
                    {[
                        { label: 'Total Services', value: stats.total, color: '#000000' },
                        { label: 'Pending', value: stats.pending, color: '#00c853' },
                        { label: 'In Progress', value: stats.inProgress, color: '#00c853' },
                        { label: 'Completed', value: stats.completed, color: '#00c853' }
                    ].map((s, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Card sx={{
                                height: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                borderRadius: 2
                            }}>
                                <Typography variant="h3" fontWeight={700} sx={{ color: s.color }}>
                                    {s.value}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {s.label}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Services Table */}
                <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#ffffff' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Service</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Assigned To</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Priority</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Created</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Due Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#666' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}><LinearProgress /></TableCell></TableRow>
                            ) : filteredServices.length === 0 ? (
                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 10 }}>No services found</TableCell></TableRow>
                            ) : filteredServices.map((service) => {
                                const operator = getEmployee(service.assignedTo)
                                return (
                                    <TableRow key={service.id || service._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#333' }}>
                                                    {service.title || 'Untitled'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {service.category}
                                                </Typography>
                                                {service.description && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {service.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Avatar src={operator?.avatar} sx={{ width: 36, height: 36, bgcolor: '#eee', color: '#999' }}>
                                                    <Person />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {operator?.name || 'Unassigned'}
                                                    </Typography>
                                                    {operator && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {operator.department || 'Staff'}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={service.priority || 'medium'}
                                                size="small"
                                                sx={{
                                                    bgcolor: getPriorityColor(service.priority),
                                                    color: 'white',
                                                    fontWeight: 500,
                                                    borderRadius: '12px',
                                                    minWidth: '70px',
                                                    textTransform: 'lowercase'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={service.status || 'pending'}
                                                size="small"
                                                sx={{
                                                    bgcolor: getStatusColor(service.status),
                                                    color: 'white',
                                                    fontWeight: 500,
                                                    borderRadius: '12px',
                                                    minWidth: '85px',
                                                    textTransform: 'lowercase'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {service.createdAt ? new Date(service.createdAt).toLocaleDateString('en-GB') : '18/02/2026'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {service.dueDate ? new Date(service.dueDate).toLocaleDateString('en-GB') : 'Invalid Date'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={(e) => handleMenuClick(e, service)}><MoreVert /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Menus and Dialogs */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { handleViewService(selectedService); handleMenuClose(); }}>
                    <Visibility sx={{ mr: 1, fontSize: 18 }} /> View Details
                </MenuItem>
                <MenuItem onClick={() => { handleEditService(selectedService); handleMenuClose(); }}>
                    <Edit sx={{ mr: 1, fontSize: 18 }} /> Edit Case
                </MenuItem>
                <MenuItem onClick={() => { setSelectedEmployeeId(selectedService?.assignedTo || ''); setAssignDialogOpen(true); handleMenuClose(); }}>
                    <Groups sx={{ mr: 1, fontSize: 18 }} /> Reassign Task
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleDeleteClick(selectedService)} sx={{ color: 'error.main' }}>
                    <Delete sx={{ mr: 1, fontSize: 18 }} /> Delete Permanent
                </MenuItem>
            </Menu>

            {/* Assign Dialog */}
            <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Assign Service Request</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            select
                            label="Select Available Staff"
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        >
                            <MenuItem value="">Unassigned</MenuItem>
                            {employees.map((emp) => (
                                <MenuItem key={emp.id || emp._id} value={emp.id || emp._id}>
                                    {emp.name} ({emp.department})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAssignConfirm} variant="contained" sx={{ bgcolor: '#000000', '&:hover': { bgcolor: '#b71c1c' } }}>
                        Confirm Assignment
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this service case? This action cannot be undone and will remove all associated logs.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Keep It</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete Permanently</Button>
                </DialogActions>
            </Dialog>
        </DashboardLayout>
    )
}

export default AdminServiceManagement
