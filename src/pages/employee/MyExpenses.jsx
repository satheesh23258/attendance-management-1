import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
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
  MenuItem,
  CircularProgress,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Add,
  ReceiptLong,
  Pending,
  CheckCircle,
  Cancel,
  Visibility,
  CloudUpload,
  AccountBalanceWallet,
  TrendingDown,
  Info
} from '@mui/icons-material';
import { expenseAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Travel',
    date: new Date().toISOString().split('T')[0],
    receiptUrl: '',
    remark: ''
  });

  const categories = ['Travel', 'Food', 'Internet', 'Office Supplies', 'Other'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseAPI.getMyExpenses();
      setExpenses(res.data || []);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) {
      return toast.error('Please fill all required fields');
    }

    try {
      setSubmitting(true);
      await expenseAPI.submit(formData);
      toast.success('Expense submitted successfully');
      setOpenDialog(false);
      setFormData({
        title: '',
        amount: '',
        category: 'Travel',
        date: new Date().toISOString().split('T')[0],
        receiptUrl: '',
        remark: ''
      });
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit expense');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  const totals = {
    pending: expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0),
    approved: expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0),
    total: expenses.reduce((sum, e) => sum + e.amount, 0)
  };

  return (
    <DashboardLayout title="My Expense Claims">
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, bgcolor: '#fff' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(47, 128, 237, 0.1)', color: '#2f80ed', width: 56, height: 56 }}>
                <AccountBalanceWallet />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Claimed
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>${totals.total.toLocaleString()}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, bgcolor: '#fff' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(0, 200, 83, 0.1)', color: '#00c853', width: 56, height: 56 }}>
                <CheckCircle />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Approved
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#00c853' }}>${totals.approved.toLocaleString()}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, bgcolor: '#fff' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', width: 56, height: 56 }}>
                <Pending />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Pending Claims
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#ff9800' }}>${totals.pending.toLocaleString()}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 4 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Claim Requests</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ 
              borderRadius: 3, 
              bgcolor: '#000', 
              '&:hover': { bgcolor: '#222' },
              textTransform: 'none',
              px: 3
            }}
          >
            New Claim
          </Button>
        </Box>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#fafafa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Title & Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Remark</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                      <CircularProgress size={30} />
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Loading claims...</Typography>
                    </TableCell>
                  </TableRow>
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                      <ReceiptLong sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                      <Typography variant="body1" color="textSecondary">No expense claims found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id} hover>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{expense.title}</Typography>
                        <Chip label={expense.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>${expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={expense.status.toUpperCase()} 
                          size="small" 
                          color={getStatusColor(expense.status)}
                          sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">
                          {expense.remark || '---'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* New Claim Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem' }}>Create New Expense Claim</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide accurate details and attach your digital receipt URL for verification.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Expense Title" name="title" value={formData.title} onChange={handleInputChange} required 
                variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth label="Amount ($)" name="amount" type="number" value={formData.amount} onChange={handleInputChange} required 
                variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth select label="Category" name="category" value={formData.category} onChange={handleInputChange} 
                variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              >
                {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth type="date" label="Expense Date" name="date" value={formData.date} onChange={handleInputChange} required 
                InputLabelProps={{ shrink: true }} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Receipt URL (Image/PDF)" name="receiptUrl" value={formData.receiptUrl} onChange={handleInputChange} 
                placeholder="https://..." variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{ startAdornment: <CloudUpload sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Optional Remarks" name="remark" value={formData.remark} onChange={handleInputChange} multiline rows={3}
                variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary', textTransform: 'none' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={submitting}
            sx={{ bgcolor: '#000', borderRadius: 3, px: 4, textTransform: 'none', '&:hover': { bgcolor: '#222' } }}
          >
            {submitting ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default MyExpenses;
