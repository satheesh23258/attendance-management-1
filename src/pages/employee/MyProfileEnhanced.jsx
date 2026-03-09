import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Divider,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material'
import {
  Badge,
  Description,
  AccountBalanceWallet,
  Translate,
  GpsFixed,
  TrendingUp,
  Devices,
  Download,
  Upload,
  Warning,
  CheckCircle,
  Stars,
  Receipt,
  Map,
  Work,
  AccountCircle
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import { employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

const MyProfileEnhanced = () => {
  const { user } = useAuth()
  const [tabValue, setTabValue] = useState(0)
  const [employeeData, setEmployeeData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const { data } = await employeeAPI.getMe()
        setEmployeeData(data)
      } catch (error) {
        // Fallback to demo data if API fails or doesn't exist yet
        setEmployeeData({
          ...user,
          documents: [
            { id: 1, type: 'Passport', status: 'active', expiryDate: '2028-12-01' },
            { id: 2, type: 'PAN Card', status: 'active' },
            { id: 3, type: 'Work Contract', status: 'active', fileUrl: '#' }
          ],
          assets: [
            { id: 1, name: 'MacBook Pro 16"', serialNumber: 'SN982347', assignedDate: '2023-01-15' },
            { id: 2, name: 'Dell Monitor 27"', serialNumber: 'DELL-4422', assignedDate: '2023-01-15' }
          ],
          payroll: [
            { month: '2024-02', netSalary: 5200, status: 'paid' },
            { month: '2024-01', netSalary: 5200, status: 'paid' },
            { month: '2023-12', netSalary: 5200, status: 'paid' }
          ],
          performance: [
            { period: 'Q1 2024', overallRating: 4.5, kpis: [{ title: 'Code Quality', achievement: 'Excellent' }] }
          ],
          officeLocation: { lat: 40.7128, lng: -74.006, radius: 100 }
        })
      } finally {
        setLoading(false)
      }
    }
    fetchEmployeeData()
  }, [user])

  const [openDocDialog, setOpenDocDialog] = useState(false)
  const [docFile, setDocFile] = useState(null)
  const [docType, setDocType] = useState('Passport')
  const [expiryDate, setExpiryDate] = useState('')

  const [openExpenseDialog, setOpenExpenseDialog] = useState(false)
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    category: 'Travel',
    date: new Date().toISOString().split('T')[0],
    remark: ''
  })
  const [receiptFile, setReceiptFile] = useState(null)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleUploadDoc = async () => {
    if (!docFile) return toast.error('Please select a file')
    const formData = new FormData()
    formData.append('document', docFile)
    formData.append('type', docType)
    if (expiryDate) formData.append('expiryDate', expiryDate)

    try {
      setLoading(true)
      await employeeAPI.uploadDocument(employeeData.id, formData)
      toast.success('Document uploaded successfully')
      setOpenDocDialog(false)
      // Refresh data
      const { data } = await employeeAPI.getMe()
      setEmployeeData(data)
    } catch (e) {
      toast.error('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitExpense = async () => {
    if (!expenseData.title || !expenseData.amount) return toast.error('Title and amount required')
    const formData = new FormData()
    Object.keys(expenseData).forEach(key => formData.append(key, expenseData[key]))
    if (receiptFile) formData.append('receipt', receiptFile)

    try {
      setLoading(true)
      await employeeAPI.submitExpense(formData)
      toast.success('Expense claim submitted')
      setOpenExpenseDialog(false)
      // Refresh
      const { data } = await employeeAPI.getMe()
      setEmployeeData(data)
    } catch (e) {
      toast.error('Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPayslip = (month) => {
    window.open(`/api/employees/${employeeData.id}/payroll/${month}/payslip`, '_blank')
  }

  if (loading) return <LinearProgress color="primary" />

  return (
    <DashboardLayout title="My Enhanced Profile">
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <Grid container spacing={3}>
          {/* Header Card */}
          <Grid item xs={12}>
            <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 4, borderRadius: 4 }}>
              <Avatar 
                src={employeeData?.avatar} 
                sx={{ width: 120, height: 120, fontSize: '3rem', border: '4px solid #00c853' }}
              >
                {employeeData?.name ? employeeData.name[0] : 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" fontWeight="bold">{employeeData?.name}</Typography>
                <Typography variant="h6" color="text.secondary">{employeeData?.department} | {employeeData?.role}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Chip icon={<Work />} label={`ID: ${employeeData?.employeeId}`} size="small" />
                  <Chip icon={<Map />} label={employeeData?.isRemote ? "Remote" : "Office Based"} color="primary" variant="outlined" size="small" />
                </Box>
              </Box>
              <Button variant="contained" startIcon={<Download />}>Download Resume</Button>
            </Paper>
          </Grid>

          {/* Navigation Tabs */}
          <Grid item xs={12}>
            <Paper sx={{ borderRadius: 4 }}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ px: 2, pt: 1 }}>
                <Tab icon={<AccountCircle />} label="Overview" iconPosition="start" />
                <Tab icon={<Description />} label="Documents" iconPosition="start" />
                <Tab icon={<AccountBalanceWallet />} label="Payroll & Expenses" iconPosition="start" />
                <Tab icon={<TrendingUp />} label="Performance" iconPosition="start" />
                <Tab icon={<Devices />} label="Assets" iconPosition="start" />
              </Tabs>
              <Divider />
              
              <Box sx={{ p: 4 }}>
                {/* Tab 0: Overview & Geo-fence */}
                {tabValue === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>Work Location (Geo-fence)</Typography>
                      <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <GpsFixed color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">Office Boundary Locking</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Your office location is set to: {employeeData?.officeLocation?.lat}, {employeeData?.officeLocation?.lng}.
                            Attendance marking is restricted within a {employeeData?.officeLocation?.radius}m radius.
                          </Typography>
                          <Button variant="text" size="small" sx={{ mt: 1 }}>View on Map</Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                       <Typography variant="h6" gutterBottom>Personal Details</Typography>
                       <List size="small">
                          <ListItem><ListItemText primary="Email" secondary={employeeData?.email} /></ListItem>
                          <ListItem><ListItemText primary="Phone" secondary={employeeData?.phone} /></ListItem>
                       </List>
                    </Grid>
                  </Grid>
                )}

                {/* Tab 1: Documents (E-Dossier) */}
                {tabValue === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6">Employee E-Dossier</Typography>
                      <Button variant="outlined" startIcon={<Upload />} size="small" onClick={() => setOpenDocDialog(true)}>Upload New</Button>
                    </Box>
                    <Grid container spacing={2}>
                      {employeeData?.documents?.map((doc, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Description color="primary" sx={{ fontSize: 40 }} />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography fontWeight="bold">{doc.type}</Typography>
                                {doc.expiryDate && (
                                  <Typography variant="caption" color={new Date(doc.expiryDate) < new Date() ? "error" : "text.secondary"}>
                                    Expires: {doc.expiryDate}
                                  </Typography>
                                )}
                              </Box>
                              <IconButton size="small"><Download /></IconButton>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Tab 2: Payroll & Expenses */}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Payslips History</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell>Net Salary</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {employeeData?.payroll?.map((p, i) => (
                            <TableRow key={i}>
                              <TableCell>{p.month}</TableCell>
                              <TableCell>${p.netSalary}</TableCell>
                              <TableCell><Chip label={p.status} color="success" size="small" variant="outlined" /></TableCell>
                              <TableCell align="right">
                                <Button size="small" startIcon={<Download />} onClick={() => handleDownloadPayslip(p.month)}>PDF</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                       <Typography variant="h6">Recent Expenses</Typography>
                       <Button startIcon={<Receipt />} variant="outlined" size="small" onClick={() => setOpenExpenseDialog(true)}>Submit Claim</Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary">No pending expense claims.</Typography>
                  </Box>
                )}

                {/* Tab 3: Performance */}
                {tabValue === 3 && (
                   <Box>
                      {employeeData?.performance?.map((perf, i) => (
                        <Card key={i} sx={{ mb: 3, borderRadius: 3, bgcolor: '#f1f8e9' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6">{perf.period} Review</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Stars sx={{ color: '#fbc02d', mr: 1 }} />
                                <Typography fontWeight="bold" variant="h5">{perf.overallRating}/5</Typography>
                              </Box>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                              {perf.kpis?.map((kpi, j) => (
                                <Grid item xs={12} md={6} key={j}>
                                  <Typography variant="subtitle2" color="text.secondary">{kpi.title}</Typography>
                                  <Typography variant="body1">{kpi.achievement}</Typography>
                                </Grid>
                              ))}
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                   </Box>
                )}

                {/* Tab 4: Assets */}
                {tabValue === 4 && (
                   <Box>
                    <Grid container spacing={3}>
                      {employeeData?.assets?.map((asset, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                             <Devices color="secondary" />
                             <Box>
                                <Typography fontWeight="bold">{asset.name}</Typography>
                                <Typography variant="caption" color="text.secondary">S/N: {asset.serialNumber} | Assigned: {asset.assignedDate}</Typography>
                             </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                   </Box>
                )}

              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Upload Document Dialog */}
      <Dialog open={openDocDialog} onClose={() => setOpenDocDialog(false)}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Document Type</InputLabel>
              <Select value={docType} label="Document Type" onChange={(e) => setDocType(e.target.value)}>
                <MenuItem value="Passport">Passport</MenuItem>
                <MenuItem value="PAN">PAN Card</MenuItem>
                <MenuItem value="Aadhar">Aadhar Card</MenuItem>
                <MenuItem value="Contract">Work Contract</MenuItem>
                <MenuItem value="NDA">NDA</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Expiry Date (if any)"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
            <Button variant="outlined" component="label">
              Select File
              <input type="file" hidden onChange={(e) => setDocFile(e.target.files[0])} />
            </Button>
            {docFile && <Typography variant="caption">Selected: {docFile.name}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDocDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUploadDoc} disabled={loading}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Expense Dialog */}
      <Dialog open={openExpenseDialog} onClose={() => setOpenExpenseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Expense Claim</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Expense Title"
              value={expenseData.title}
              onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
              placeholder="e.g., Client Lunch, Team Travel"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="number"
                label="Amount"
                value={expenseData.amount}
                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={expenseData.category}
                  label="Category"
                  onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                >
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Internet">Internet</MenuItem>
                  <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={expenseData.date}
              onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
            />
            <TextField
              label="Remark/Description"
              multiline
              rows={2}
              fullWidth
              value={expenseData.remark}
              onChange={(e) => setExpenseData({ ...expenseData, remark: e.target.value })}
            />
            <Button variant="outlined" component="label" startIcon={<Upload />}>
              Upload Receipt
              <input type="file" hidden onChange={(e) => setReceiptFile(e.target.files[0])} />
            </Button>
            {receiptFile && <Typography variant="caption">Receipt: {receiptFile.name}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExpenseDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitExpense} disabled={loading}>
            Submit Claim
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}

export default MyProfileEnhanced
