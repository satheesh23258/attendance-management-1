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
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Paper
} from '@mui/material';
import {
  Payments,
  FileDownload,
  SettingsSuggest,
  CheckCircle,
  AccountBalance,
  Receipt,
  Search,
  FilterList,
  Visibility
} from '@mui/icons-material';
import { payrollAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genDialog, setGenDialog] = useState(false);
  const [genData, setGenData] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await payrollAPI.getAll();
      setPayrolls(res.data || []);
    } catch (error) {
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setSubmitting(true);
      await payrollAPI.generate(genData);
      toast.success('Payroll generation started');
      setGenDialog(false);
      fetchPayrolls();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Generation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const markAsPaid = async (id, txId) => {
    try {
      await payrollAPI.updateStatus(id, { status: 'paid', transactionId: txId || `TXN${Date.now()}` });
      toast.success('Status updated to Paid');
      fetchPayrolls();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const months = [
    { v: 1, n: 'January' }, { v: 2, n: 'February' }, { v: 3, n: 'March' },
    { v: 4, n: 'April' }, { v: 5, n: 'May' }, { v: 6, n: 'June' },
    { v: 7, n: 'July' }, { v: 8, n: 'August' }, { v: 9, n: 'September' },
    { v: 10, n: 'October' }, { v: 11, n: 'November' }, { v: 12, n: 'December' }
  ];

  return (
    <DashboardLayout title="Financial & Payroll Hub">
      <Grid container spacing={3} sx={{ mb: 4 }}>
         <Grid item xs={12} md={8}>
            <Box sx={{ p: 4, bgcolor: '#000', color: '#fff', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Payroll Automation</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8, mb: 3, maxWidth: '500px' }}>
                        Streamline your company's finances. Automatically calculate net salaries based on base pay, attendance, and approved claims.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                            variant="contained" startIcon={<SettingsSuggest />} 
                            onClick={() => setGenDialog(true)}
                            sx={{ bgcolor: '#fff', color: '#000', borderRadius: 3, px: 3, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#eee' } }}
                        >
                            Generate Current Month
                        </Button>
                        <Button 
                            variant="outlined" startIcon={<FileDownload />} 
                            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', borderRadius: 3, px: 3, textTransform: 'none' }}
                        >
                            Export Reports
                        </Button>
                    </Box>
                </Box>
                <Payments sx={{ position: 'absolute', right: -40, bottom: -40, fontSize: 240, opacity: 0.1, color: '#fff' }} />
            </Box>
         </Grid>
         <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 6, border: '1px solid #eee' }} elevation={0}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', mx: 'auto', mb: 2 }}>
                        <CheckCircle sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>$142,500</Typography>
                    <Typography color="textSecondary" variant="body2">Total Disbursed (Annual)</Typography>
                </CardContent>
            </Card>
         </Grid>
      </Grid>

      <Card sx={{ borderRadius: 6, border: '1px solid #f0f0f0', overflow: 'hidden' }} elevation={0}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Detailed Disbursement Records</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField size="small" placeholder="Search employee..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 3, textTransform: 'none' }}>Filters</Button>
            </Box>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Base Salary</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Reimbursements</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Net Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 10 }}><CircularProgress size={30} /></TableCell></TableRow>
              ) : payrolls.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 10 }}>No records found.</TableCell></TableRow>
              ) : (
                payrolls.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#696cff' }}>{p.employeeName.charAt(0)}</Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.employeeName}</Typography>
                        </Box>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2">{months.find(m => m.v === p.month).n}, {p.year}</Typography>
                    </TableCell>
                    <TableCell>${p.baseSalary.toLocaleString()}</TableCell>
                    <TableCell>
                        <Typography variant="body2" sx={{ color: p.expenses > 0 ? '#4caf50' : 'inherit', fontWeight: p.expenses > 0 ? 600 : 400 }}>
                            +${p.expenses.toLocaleString()}
                        </Typography>
                    </TableCell>
                    <TableCell><Typography sx={{ fontWeight: 800, color: '#000' }}>${p.netSalary.toLocaleString()}</Typography></TableCell>
                    <TableCell>
                        <Chip 
                            label={p.status.toUpperCase()} 
                            size="small" 
                            color={p.status === 'paid' ? 'success' : 'warning'} 
                            sx={{ fontWeight: 800, fontSize: '0.65rem' }} 
                        />
                    </TableCell>
                    <TableCell align="right">
                        {p.status !== 'paid' ? (
                          <Button 
                            variant="contained" size="small" onClick={() => markAsPaid(p.id)}
                            sx={{ bgcolor: '#000', borderRadius: 2, textTransform: 'none', px: 2 }}
                          >
                            Execute Payment
                          </Button>
                        ) : (
                          <IconButton><Visibility fontSize="small" /></IconButton>
                        )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Generation Dialog */}
      <Dialog open={genDialog} onClose={() => setGenDialog(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Payroll Generation</DialogTitle>
        <DialogContent>
            <Typography variant="body2" sx={{ mb: 3 }}>
                This will create draft payroll entries for all active employees for the selected period.
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField 
                        select fullWidth label="Month" value={genData.month} 
                        onChange={(e) => setGenData({...genData, month: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    >
                        {months.map(m => <MenuItem key={m.v} value={m.v}>{m.n}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        type="number" fullWidth label="Year" value={genData.year}
                        onChange={(e) => setGenData({...genData, year: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setGenDialog(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button 
                variant="contained" onClick={handleGenerate} disabled={submitting}
                sx={{ bgcolor: '#000', color: '#fff', borderRadius: 3, px: 4, textTransform: 'none' }}
            >
                {submitting ? 'Processing...' : 'Generate Now'}
            </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default PayrollManagement;
