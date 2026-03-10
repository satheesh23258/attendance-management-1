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
  IconButton,
  Divider,
} from '@mui/material';
import {
  AccountBalanceWallet,
  FileDownload,
  Info,
  Payment,
  Timeline,
  Receipt
} from '@mui/icons-material';
import { payrollAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const MyPayroll = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await payrollAPI.getMyHistory();
            setPayrolls(res.data || []);
        } catch (error) {
            toast.error('Failed to load payslips');
        } finally {
            setLoading(false);
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <DashboardLayout title="My Financial Records">
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 6, bgcolor: '#000', color: '#fff', mb: 3 }} elevation={0}>
                        <CardContent sx={{ p: 4 }}>
                            <AccountBalanceWallet sx={{ fontSize: 40, mb: 2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>Payslip Access</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7, mt: 1, mb: 3 }}>
                                View and download your monthly salary statements, including tax breakdowns and approved expense reimbursements.
                            </Typography>
                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>Current Status</Typography>
                                <Chip label="ACTIVE" size="small" sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 800, fontSize: '0.6rem' }} />
                            </Box>
                        </CardContent>
                    </Card>
                    
                    <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 6, border: '1px solid #eee' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Summary</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">YTD Earnings</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>$0.00</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">Total Deductions</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>$0.00</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 6, border: '1px solid #eee' }} elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: '#fafafa' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Net Pay</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="right">Slip</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}>Loading...</TableCell></TableRow>
                                    ) : payrolls.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}>No payslips generated yet.</TableCell></TableRow>
                                    ) : (
                                        payrolls.map(p => (
                                            <TableRow key={p.id} hover>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{months[p.month-1]}</Typography>
                                                    <Typography variant="caption" color="textSecondary">{p.year}</Typography>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 800 }}>${p.netSalary.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={p.status.toUpperCase()} 
                                                        size="small" 
                                                        color={p.status === 'paid' ? 'success' : 'warning'}
                                                        sx={{ fontWeight: 800, fontSize: '0.6rem' }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="primary">
                                                        <FileDownload fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
};

export default MyPayroll;
