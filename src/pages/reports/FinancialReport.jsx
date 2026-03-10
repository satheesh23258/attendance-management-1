import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  GetApp,
  FilterList,
  ShowChart,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import DashboardLayout from '../../components/DashboardLayout';
import { payrollAPI } from '../../services/api';
import toast from 'react-hot-toast';

const FinancialReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ year: new Date().getFullYear(), month: 'all' });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await payrollAPI.getAll(filters);
      setData(res.data || []);
    } catch (err) {
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const totalDisbursed = data.reduce((sum, item) => sum + (item.netSalary || 0), 0);
  const totalExpenses = data.reduce((sum, item) => sum + (item.expenses || 0), 0);

  return (
    <DashboardLayout title="Financial Analytics & Reports">
       <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
             <Card sx={{ borderRadius: 6, bgcolor: '#00c853', color: '#fff' }}>
                <CardContent sx={{ p: 3 }}>
                   <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Disbursed</Typography>
                   <Typography variant="h4" sx={{ fontWeight: 800 }}>${totalDisbursed.toLocaleString()}</Typography>
                   <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ fontSize: 16 }} />
                      <Typography variant="caption">+12% from last month</Typography>
                   </Box>
                </CardContent>
             </Card>
          </Grid>
          <Grid item xs={12} md={4}>
             <Card sx={{ borderRadius: 6, bgcolor: '#000', color: '#fff' }}>
                <CardContent sx={{ p: 3 }}>
                   <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Reimbursements</Typography>
                   <Typography variant="h4" sx={{ fontWeight: 800 }}>${totalExpenses.toLocaleString()}</Typography>
                   <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalance sx={{ fontSize: 16 }} />
                      <Typography variant="caption">Approved expense claims</Typography>
                   </Box>
                </CardContent>
             </Card>
          </Grid>
          <Grid item xs={12} md={4}>
             <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 6, border: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="subtitle2" color="textSecondary">Fiscal Year Status</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>On Track</Typography>
                <Typography variant="caption" color="textSecondary">Next audit in 14 days</Typography>
             </Box>
          </Grid>
       </Grid>

       <Card sx={{ borderRadius: 6, mb: 4 }} elevation={0}>
          <Box sx={{ p: 3, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Typography variant="h6" sx={{ fontWeight: 800 }}>Detailed Breakdown</Typography>
             <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                   <InputLabel>Year</InputLabel>
                   <Select value={filters.year} label="Year" onChange={e => setFilters({...filters, year: e.target.value})}>
                      {[2023, 2024, 2025, 2026].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                   </Select>
                </FormControl>
                <Button variant="contained" startIcon={<GetApp />} sx={{ bgcolor: '#000', borderRadius: 3, textTransform: 'none' }}>Download PDF</Button>
             </Box>
          </Box>
          <TableContainer>
             <Table>
                <TableHead sx={{ bgcolor: '#fafafa' }}>
                   <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Base Salary</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Taxes/Ded.</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Expenses</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Net Pay</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                   {loading ? (
                      <TableRow><TableCell colSpan={7} align="center">Loading report...</TableCell></TableRow>
                   ) : data.length === 0 ? (
                      <TableRow><TableCell colSpan={7} align="center">No financial data for this period.</TableCell></TableRow>
                   ) : (
                      data.map(item => (
                         <TableRow key={item.id}>
                            <TableCell sx={{ fontWeight: 600 }}>{item.employeeName}</TableCell>
                            <TableCell>{item.month}/{item.year}</TableCell>
                            <TableCell>${item.baseSalary.toLocaleString()}</TableCell>
                            <TableCell color="error">-${item.deductions.toLocaleString()}</TableCell>
                            <TableCell color="success">+${item.expenses.toLocaleString()}</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>${item.netSalary.toLocaleString()}</TableCell>
                            <TableCell>
                               <Chip label={item.status} size="small" color={item.status === 'paid' ? 'success' : 'warning'} sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                            </TableCell>
                         </TableRow>
                      ))
                   )}
                </TableBody>
             </Table>
          </TableContainer>
       </Card>
    </DashboardLayout>
  );
};

export default FinancialReport;
