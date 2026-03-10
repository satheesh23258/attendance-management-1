import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Switch,
  FormControlLabel,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Tooltip
} from '@mui/material'
import {
  Send,
  Cancel,
  CheckCircle,
  Schedule,
  Person,
  Event,
  Description,
  Analytics,
  Policy,
  Notifications,
  AccountBalance,
  AttachFile,
  Phone,
  ArrowForward,
  ArrowBack,
  Search
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { leaveAPI, notificationAPI } from '../../services/api'
import DashboardLayout from '../../components/DashboardLayout'

const LeaveApplication = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  // Leave Balance - Currently hardcoded as backend doesn't provide this yet
  const [leaveBalance, setLeaveBalance] = useState({
    annual: { total: 15, used: 5, remaining: 10 },
    sick: { total: 10, used: 2, remaining: 8 },
    personal: { total: 5, used: 1, remaining: 4 },
    maternity: { total: 90, used: 0, remaining: 90 },
    paternity: { total: 30, used: 0, remaining: 30 },
    emergency: { total: 5, used: 0, remaining: 5 }
  })

  const [notifications, setNotifications] = useState([])



  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaveRequests()
    fetchNotifications()
  }, [user, activeTab])

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getAll()
      setNotifications(res.data.data || res.data || [])
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    }
  }

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true)
      // Different API calls based on role and tab
      let response
      if (isEmployee && activeTab === 1) {
        response = await leaveAPI.getMyLeaves()
      } else if ((isHR || isAdmin) && (activeTab === 2 || (!isEmployee && activeTab === 0))) {
        // Adjust tab index logic based on what tabs are shown
        response = await leaveAPI.getAll()
      }

      if (response) {
        const data = response.data.data || response.data || []
        setLeaveRequests(data)
      } else if (isEmployee && activeTab === 0) {
        // Apply tab - no fetch needed
      }
    } catch (error) {
      console.error('Error fetching leaves:', error)
      toast.error('Failed to load leave requests')
    } finally {
      setLoading(false)
    }
  }



  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    reason: '',
    days: 0,
    isHalfDay: false,
    emergencyContact: '',
    attachment: null
  })

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [bulkActionDialog, setBulkActionDialog] = useState(false)
  const [selectedRequests, setSelectedRequests] = useState([])
  const [rejectionDialog, setRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionRequestId, setRejectionRequestId] = useState(null)
  const [approvalComments, setApprovalComments] = useState('')

  // HR-specific state
  const [showPendingOnly, setShowPendingOnly] = useState(true)
  const [sortBy, setSortBy] = useState('appliedDate')
  const [sortOrder, setSortOrder] = useState('desc')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all')
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' })

  const currentPath = window.location.pathname
  const isHR = !!(user?.role === 'hr' || (user?.hybridPermissions && user.hybridPermissions.roles?.includes('hr')) || currentPath.includes('/hr/'))
  const isAdmin = !!(user?.role === 'admin' || currentPath.includes('/admin/'))
  const isEmployee = !!(user?.role === 'employee' || (user?.hybridPermissions && user.hybridPermissions.roles?.includes('employee')) || currentPath.includes('/employee/'))

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateDays = () => {
    if (formData.startDate && (formData.endDate || formData.leaveType === 'permission')) {
      const start = new Date(formData.startDate)

      if (formData.leaveType === 'permission') {
        // For permissions, it's just 1 day but we track hours
        setFormData(prev => ({ ...prev, days: 0, endDate: prev.startDate }))
        return
      }

      const end = new Date(formData.endDate)

      // Validate that end date is not before start date
      if (end < start) {
        toast.error('End date cannot be before start date')
        setFormData(prev => ({ ...prev, days: 0 }))
        return
      }

      // Calculate difference in days (inclusive)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      // Apply half day logic
      const actualDays = formData.isHalfDay ? diffDays - 0.5 : diffDays

      setFormData(prev => ({
        ...prev,
        days: actualDays
      }))
    } else {
      // Reset days if dates are not complete
      setFormData(prev => ({
        ...prev,
        days: 0
      }))
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        attachment: file
      }))
    }
  }

  const removeAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachment: null
    }))
  }

  const handleSubmit = async () => {
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const leaveData = {
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.leaveType === 'permission' ? formData.startDate : formData.endDate,
        startTime: formData.leaveType === 'permission' ? formData.startTime : null,
        endTime: formData.leaveType === 'permission' ? formData.endTime : null,
        reason: formData.reason,
        days: formData.days,
        emergencyContact: formData.emergencyContact
      }

      await leaveAPI.apply(leaveData)
      toast.success('Leave application submitted successfully!')
      fetchLeaveRequests() // Refresh list
      setActiveTab(1) // Switch to My Requests
    } catch (error) {
      toast.error('Failed to submit leave application')
      console.error(error)
    }

  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setOpenDialog(true)
  }

  const handleApprove = async (requestId) => {
    try {
      await leaveAPI.updateStatus(requestId, { status: 'approved' })
      toast.success('Leave request approved!')
      fetchLeaveRequests()
    } catch (error) {
      toast.error('Failed to approve request')
    }
  }

  const handleReject = async (requestId, rejectionReason = '') => {
    try {
      await leaveAPI.updateStatus(requestId, { status: 'rejected', rejectionReason })
      toast.success('Leave request rejected!')
      fetchLeaveRequests()
    } catch (error) {
      toast.error('Failed to reject request')
    }
  }

  const handleBulkApprove = (requestIds) => {
    setLeaveRequests(prev =>
      prev.map(req =>
        requestIds.includes(req.id)
          ? { ...req, status: 'approved', approvedBy: user?.name, approvedDate: new Date().toISOString().split('T')[0] }
          : req
      )
    )
    toast.success(`${requestIds.length} leave requests approved!`)
  }

  const handleBulkReject = (requestIds, reason) => {
    setLeaveRequests(prev =>
      prev.map(req =>
        requestIds.includes(req.id)
          ? { ...req, status: 'rejected', approvedBy: user?.name, approvedDate: new Date().toISOString().split('T')[0], rejectionReason: reason }
          : req
      )
    )
    toast.success(`${requestIds.length} leave requests rejected!`)
  }

  const handleRequestChanges = (requestId, newStatus, reason = '') => {
    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, status: newStatus, lastModified: new Date().toISOString().split('T')[0], modifiedBy: user?.name, ...(reason && { rejectionReason: reason }) }
          : req
      )
    )
    toast.success(`Leave request ${newStatus}!`)
  }

  // HR-specific helper functions
  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    )
  }

  const handleSelectAllRequests = () => {
    const filteredRequests = getFilteredRequests()
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([])
    } else {
      setSelectedRequests(filteredRequests.map(req => req.id))
    }
  }

  const getFilteredRequests = () => {
    let filtered = leaveRequests

    // Apply filters
    if (showPendingOnly) {
      filtered = filtered.filter(req => req.status === 'pending')
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(req => req.department === departmentFilter)
    }

    if (leaveTypeFilter !== 'all') {
      filtered = filtered.filter(req => req.leaveType === leaveTypeFilter)
    }

    if (dateRangeFilter.start && dateRangeFilter.end) {
      filtered = filtered.filter(req =>
        req.startDate >= dateRangeFilter.start && req.startDate <= dateRangeFilter.end
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'appliedDate' || sortBy === 'startDate') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }

  const openRejectionDialog = (requestId) => {
    setRejectionRequestId(requestId)
    setRejectionDialog(true)
  }

  const confirmRejection = () => {
    if (rejectionRequestId) {
      handleReject(rejectionRequestId, rejectionReason)
    } else if (selectedRequests.length > 0) {
      handleBulkReject(selectedRequests, rejectionReason)
    }
    setRejectionDialog(false)
    setRejectionReason('')
    setRejectionRequestId(null)
    setSelectedRequests([])
  }

  const confirmBulkApproval = () => {
    handleBulkApprove(selectedRequests)
    setBulkActionDialog(false)
    setSelectedRequests([])
  }

  const getPendingRequestsCount = () => {
    return leaveRequests.filter(req => req.status === 'pending').length
  }

  const getTodayRequestsCount = () => {
    const today = new Date().toISOString().split('T')[0]
    return leaveRequests.filter(req => req.appliedDate === today).length
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return '#4caf50'
      case 'pending': return '#00c853'
      case 'rejected': return '#f44336'
      case 'cancelled': return '#9e9e9e'
      default: return '#000000'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <CheckCircle />
      case 'pending': return <Schedule />
      case 'rejected': return <Cancel />
      case 'cancelled': return <Cancel />
      default: return <Event />
    }
  }

  return (
    <DashboardLayout title="Leave Portal & Management">
      {/* Enhanced Header */}
      {/* Enhanced Header */}
      <Box sx={{
        background: isEmployee
          ? '#00c853'
          : isAdmin
            ? '#00c853'
            : '#00c853',
        color: 'white',
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
              Leave {isEmployee && activeTab === 0 ? 'Application' : 'Management'}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {isEmployee && activeTab === 0
                ? 'Submit and track your leave requests'
                : 'Review and manage organizational leave applications'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isHR && activeTab === 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`${getTodayRequestsCount()} Today`}
                color="info"
                variant="filled"
                size="small"
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ backgroundColor: 'white', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="scrollable">
          {/* Employee tabs */}
          {isEmployee && (
            <>
              <Tab label="Leave Application" icon={<Send />} />
              <Tab label="My Requests" icon={<Description />} />
            </>
          )}

          {/* HR/Admin tabs - Only All Requests */}
          {(isHR || isAdmin) && (
            <Tab label="All Requests" icon={<Person />} />
          )}
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Debug Information */}
        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
          <Typography variant="body2">
            Debug Info: activeTab={activeTab}, isEmployee={String(isEmployee)}, isHR={String(isHR)}, isAdmin={String(isAdmin)}, userRole={user?.role || 'undefined'}
          </Typography>
          <Typography variant="body2">
            Leave Requests Count: {leaveRequests.length}
          </Typography>
        </Box>

        {/* Tab Content */}
        {/* Employee Tab 0: Leave Application */}
        {isEmployee && activeTab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Apply for Leave
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Leave Type</InputLabel>
                    <Select
                      value={formData.leaveType}
                      onChange={(e) => handleInputChange('leaveType', e.target.value)}
                      label="Leave Type"
                    >
                      <MenuItem value="annual">Annual Leave</MenuItem>
                      <MenuItem value="sick">Sick Leave</MenuItem>
                      <MenuItem value="personal">Personal Leave</MenuItem>
                      <MenuItem value="permission">Permission (Short duration)</MenuItem>
                      <MenuItem value="maternity">Maternity Leave</MenuItem>
                      <MenuItem value="paternity">Paternity Leave</MenuItem>
                      <MenuItem value="emergency">Emergency Leave</MenuItem>
                      <MenuItem value="bereavement">Bereavement Leave</MenuItem>
                      <MenuItem value="compensatory">Compensatory Off</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(e) => {
                      handleInputChange('startDate', e.target.value)
                      calculateDays()
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {formData.leaveType === 'permission' ? (
                  <>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Start Time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        type="time"
                        label="End Time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        value={formData.endDate}
                        onChange={(e) => {
                          handleInputChange('endDate', e.target.value)
                          calculateDays()
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Number of Days"
                          value={formData.days}
                          InputProps={{ readOnly: true }}
                          helperText="Automatically calculated"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.isHalfDay}
                              onChange={(e) => {
                                handleInputChange('isHalfDay', e.target.checked)
                                calculateDays()
                              }}
                              size="small"
                            />
                          }
                          label="Half Day"
                        />
                      </Box>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Contact person for urgent matters"
                    InputProps={{
                      startAdornment: <Phone sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Detailed Reason for Leave"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    placeholder="Please provide a clear and detailed reason for your leave request (e.g. medical emergency, family event, personal errands)..."
                    helperText="Providing a detailed reason helps HR process your request faster"
                    sx={{
                      backgroundColor: 'rgba(255, 193, 7, 0.05)',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 193, 7, 0.3)' },
                        '&:hover fieldset': { borderColor: '#000000' },
                        '&.Mui-focused fieldset': { borderColor: '#000000' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#b28900' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ border: '2px dashed #ccc', borderRadius: 1, p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Attach Supporting Documents (Optional)
                    </Typography>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      id="file-upload"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {formData.attachment ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                          <AttachFile sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {formData.attachment.name}
                          </Typography>
                          <Button
                            size="small"
                            variant="text"
                            color="error"
                            onClick={removeAttachment}
                          >
                            Remove
                          </Button>
                        </Box>
                      ) : (
                        <label htmlFor="file-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<Description />}
                          >
                            Choose File
                          </Button>
                        </label>
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Send />}
                    onClick={handleSubmit}
                  >
                    Submit Leave Application
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Employee Tab 1: My Requests - Always show for testing */}
        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  My Leave Requests History
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Debug: User Role = {user?.role || 'undefined'}, Total Requests = {leaveRequests.length}
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      label="Filter by Status"
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                    }}
                  />
                </Box>
              </Box>

              {/* Status Summary Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
                  <Card sx={{ backgroundColor: '#fff3e0', border: '2px solid #00c853' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Schedule sx={{ fontSize: 40, color: '#00c853', mb: 1 }} />
                      <Typography variant="h6" color="#ff9800">
                        PENDING
                      </Typography>
                      <Typography variant="body2">
                        {leaveRequests.filter(r => r.status === 'pending').length} requests
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ backgroundColor: '#ffebee', border: '2px solid #00c853' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Cancel sx={{ fontSize: 40, color: '#00c853', mb: 1 }} />
                      <Typography variant="h6" color="#f44336">
                        REJECTED
                      </Typography>
                      <Typography variant="body2">
                        {leaveRequests.filter(r => r.status === 'rejected').length} requests
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ backgroundColor: '#e3f2fd', border: '2px solid #00c853' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Event sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                      <Typography variant="h6" color="#2196f3">
                        TOTAL DAYS
                      </Typography>
                      <Typography variant="body2">
                        {leaveRequests.reduce((total, r) => total + r.days, 0)} days
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Leave Requests Table */}
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Application ID</TableCell>
                      <TableCell>Leave Type</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Applied Date</TableCell>
                      <TableCell>Processed By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveRequests
                      .filter(request => {
                        const matchesStatus = filterStatus === 'all' || request.status === filterStatus
                        const matchesSearch = searchTerm === '' ||
                          request.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.appliedDate.includes(searchTerm)
                        return matchesStatus && matchesSearch
                      })
                      .map((request) => (
                        <TableRow key={request.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              #{request.id.toString().padStart(4, '0')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={request.leaveType}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {request.leaveType?.toLowerCase() === 'permission'
                                ? 'Permission'
                                : `${request.days} days`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {request.startDate}
                              {request.leaveType?.toLowerCase() === 'permission' && request.startTime && (
                                <> ({request.startTime} - {request.endTime})</>
                              )}
                              {request.leaveType?.toLowerCase() !== 'permission' && ` to ${request.endDate}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                              {request.reason.length > 50
                                ? `${request.reason.substring(0, 50)}...`
                                : request.reason
                              }
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={(request.status || 'pending').toUpperCase()}
                              size="small"
                              icon={getStatusIcon(request.status)}
                              sx={{
                                backgroundColor: getStatusColor(request.status),
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                            {request.rejectionReason && request.status?.toLowerCase() === 'rejected' && (
                              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
                                Reason: {request.rejectionReason}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {request.appliedDate}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {request.approvedBy || 'Pending'}
                            </Typography>
                            {request.approvedDate && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {request.approvedDate}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleViewDetails(request)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {leaveRequests.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No leave requests found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You haven't applied for any leave yet. Click on the "Leave Application" tab to submit your first request.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}


        {/* HR/Admin Tab 0: All Requests */}
        {(isHR || isAdmin) && activeTab === 0 && (
          <Box>
            {/* HR Control Panel */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  HR Approval Dashboard
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showPendingOnly}
                          onChange={(e) => setShowPendingOnly(e.target.checked)}
                          size="small"
                        />
                      }
                      label="Show Pending Only"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        label="Department"
                      >
                        <MenuItem value="all">All Departments</MenuItem>
                        <MenuItem value="Engineering">Engineering</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Leave Type</InputLabel>
                      <Select
                        value={leaveTypeFilter}
                        onChange={(e) => setLeaveTypeFilter(e.target.value)}
                        label="Leave Type"
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="annual">Annual Leave</MenuItem>
                        <MenuItem value="sick">Sick Leave</MenuItem>
                        <MenuItem value="personal">Personal Leave</MenuItem>
                        <MenuItem value="emergency">Emergency Leave</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Sort By</InputLabel>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Sort By"
                      >
                        <MenuItem value="appliedDate">Applied Date</MenuItem>
                        <MenuItem value="startDate">Start Date</MenuItem>
                        <MenuItem value="employeeName">Employee Name</MenuItem>
                        <MenuItem value="leaveType">Leave Type</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Order</InputLabel>
                      <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Order"
                      >
                        <MenuItem value="desc">Newest First</MenuItem>
                        <MenuItem value="asc">Oldest First</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      size="small"
                      type="date"
                      label="From Date"
                      value={dateRangeFilter.start}
                      onChange={(e) => setDateRangeFilter(prev => ({ ...prev, start: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      size="small"
                      type="date"
                      label="To Date"
                      value={dateRangeFilter.end}
                      onChange={(e) => setDateRangeFilter(prev => ({ ...prev, end: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                {/* Bulk Actions */}
                {selectedRequests.length > 0 && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {selectedRequests.length} requests selected
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => setBulkActionDialog(true)}
                      >
                        Approve Selected
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => openRejectionDialog(null)}
                      >
                        Reject Selected
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedRequests([])}
                      >
                        Clear Selection
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Requests Table */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Leave Requests ({getFilteredRequests().length})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {getPendingRequestsCount()} pending | {leaveRequests.filter(r => r.status === 'approved').length} approved | {leaveRequests.filter(r => r.status === 'rejected').length} rejected
                    </Typography>
                  </Box>
                </Box>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedRequests.length === getFilteredRequests().length && getFilteredRequests().length > 0}
                            onChange={handleSelectAllRequests}
                            style={{ cursor: 'pointer' }}
                          />
                        </TableCell>
                        <TableCell>Employee</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Leave Type</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Applied Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFilteredRequests().map((request) => (
                        <TableRow key={request.id} hover>
                          <TableCell padding="checkbox">
                            <input
                              type="checkbox"
                              checked={selectedRequests.includes(request.id)}
                              onChange={() => handleSelectRequest(request.id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, fontSize: 12 }}>
                                {request.employeeName.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {request.employeeName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {request.employeeId}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>
                            <Chip
                              label={request.leaveType}
                              size="small"
                              variant="outlined"
                              color={request.leaveType === 'emergency' ? 'error' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {request.leaveType?.toLowerCase() === 'permission' ? 'Permission' : `${request.days} days`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.startDate}
                              {request.leaveType?.toLowerCase() === 'permission' && request.startTime && (
                                <> ({request.startTime} - {request.endTime})</>
                              )}
                              {request.leaveType?.toLowerCase() !== 'permission' && ` to ${request.endDate}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={request.reason} arrow placement="top">
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 300,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  lineHeight: 1.2,
                                  cursor: 'help'
                                }}
                              >
                                {request.reason}
                              </Typography>
                            </Tooltip>
                            {request.emergencyContact && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                📞 {request.emergencyContact}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{request.appliedDate}</TableCell>
                          <TableCell>
                            <Chip
                              label={request.status}
                              size="small"
                              icon={getStatusIcon(request.status)}
                              sx={{
                                backgroundColor: getStatusColor(request.status),
                                color: 'white'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {request.status === 'pending' && (
                                <>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleApprove(request.id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => openRejectionDialog(request.id)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {request.status === 'approved' && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="warning"
                                  onClick={() => handleRequestChanges(request.id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              )}
                              {request.status === 'rejected' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="info"
                                  onClick={() => handleRequestChanges(request.id, 'pending')}
                                >
                                  Reconsider
                                </Button>
                              )}
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => handleViewDetails(request)}
                              >
                                View
                              </Button>
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
        )}

      </Box>

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Leave Request Details
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Employee Information
                </Typography>
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="body2"><strong>Name:</strong> {selectedRequest.employeeName}</Typography>
                  <Typography variant="body2"><strong>ID:</strong> {selectedRequest.employeeId}</Typography>
                  <Typography variant="body2"><strong>Department:</strong> {selectedRequest.department}</Typography>
                  <Typography variant="body2"><strong>Emergency Contact:</strong> {selectedRequest.emergencyContact || 'Not provided'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Leave Details
                </Typography>
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="body2"><strong>Type:</strong> {selectedRequest.leaveType}</Typography>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {selectedRequest.leaveType?.toLowerCase() === 'permission'
                      ? `${selectedRequest.startTime} - ${selectedRequest.endTime}`
                      : `${selectedRequest.days} days`}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Period:</strong> {selectedRequest.startDate}
                    {selectedRequest.leaveType?.toLowerCase() !== 'permission' && ` to ${selectedRequest.endDate}`}
                  </Typography>
                  {selectedRequest.attachment && (
                    <Typography variant="body2"><strong>Attachment:</strong> 📎 {selectedRequest.attachment}</Typography>
                  )}
                </Box>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: '#b28900', fontWeight: 'bold' }}>
                  Employee Justification
                </Typography>
                <Box sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 193, 7, 0.05)',
                  borderLeft: '4px solid #000000',
                  borderRadius: '0 4px 4px 0'
                }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {selectedRequest.reason || 'No reason provided'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Application Status
                </Typography>
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}><strong>Applied:</strong> {selectedRequest.appliedDate}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2"><strong>Status:</strong></Typography>
                    <Chip
                      label={(selectedRequest.status || 'pending').toUpperCase()}
                      size="small"
                      icon={getStatusIcon(selectedRequest.status)}
                      sx={{
                        backgroundColor: getStatusColor(selectedRequest.status),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Typography variant="body2"><strong>Processed by:</strong> {selectedRequest.approvedBy || 'Pending'}</Typography>
                  {selectedRequest.approvedDate && (
                    <Typography variant="body2"><strong>Processed Date:</strong> {selectedRequest.approvedDate}</Typography>
                  )}
                  {selectedRequest.rejectionReason && (
                    <Typography variant="body2" color="error"><strong>Rejection Reason:</strong> {selectedRequest.rejectionReason}</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Approval Dialog */}
      <Dialog open={bulkActionDialog} onClose={() => setBulkActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Bulk Approval Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to approve {selectedRequests.length} leave requests?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Approval Comments (Optional)"
            value={approvalComments}
            onChange={(e) => setApprovalComments(e.target.value)}
            placeholder="Add any comments for the approval..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>
            Cancel
          </Button>
          <Button onClick={confirmBulkApproval} variant="contained" color="success">
            Approve All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog} onClose={() => setRejectionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Rejection Reason
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Please provide a reason for rejection{rejectionRequestId ? '' : ` for ${selectedRequests.length} requests`}:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter detailed reason for rejection..."
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectionDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmRejection}
            variant="contained"
            color="error"
            disabled={!rejectionReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onClose={() => setShowNotifications(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Notifications
        </DialogTitle>
        <DialogContent>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} divider>
                <ListItemText
                  primary={notification.title}
                  secondary={notification.message}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <Chip
                  label={notification.type}
                  size="small"
                  color={notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'info'}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNotifications(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}

export default LeaveApplication
