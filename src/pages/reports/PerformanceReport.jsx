import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import {
  Star,
  Speed,
  AssignmentTurnedIn,
  TrendingDown,
  EmojiEvents
} from '@mui/icons-material';
import DashboardLayout from '../../components/DashboardLayout';
import { employeeAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PerformanceReport = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await employeeAPI.getAll();
            setEmployees(res.data?.data || res.data || []);
        } catch (err) {
            toast.error('Failed to load performance metrics');
        } finally {
            setLoading(false);
        }
    };

    const getPerformanceStatus = (score) => {
        if (score >= 4.5) return { label: 'Top Performer', color: 'success' };
        if (score >= 3.5) return { label: 'Good', color: 'primary' };
        if (score >= 2.5) return { label: 'Average', color: 'warning' };
        return { label: 'Needs Improvement', color: 'error' };
    };

    return (
        <DashboardLayout title="Performance Metrics">
            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 6, bgcolor: '#000', color: '#fff' }} elevation={0}>
                        <CardContent sx={{ p: 4 }}>
                            <EmojiEvents sx={{ fontSize: 48, color: '#ffd700', mb: 2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Yearly Review Cycle</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                                Tracking KPIs, project completion rates, and peer feedback across all departments. Next review cycle begins in 45 days.
                            </Typography>
                            <Button variant="contained" sx={{ bgcolor: '#fff', color: '#000', borderRadius: 3, fontWeight: 700 }}>Initialize Q3 Review</Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Card sx={{ borderRadius: 6, textAlign: 'center', p: 2 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>92%</Typography>
                                <Typography variant="caption" color="textSecondary">Task Completion Rate</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card sx={{ borderRadius: 6, textAlign: 'center', p: 2 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#00c853' }}>4.8</Typography>
                                <Typography variant="caption" color="textSecondary">Avg. Feedback Score</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                           <Card sx={{ borderRadius: 6, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                               <Speed sx={{ color: '#00c853' }} />
                               <Box sx={{ flexGrow: 1 }}>
                                   <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Overall Efficiency</Typography>
                                   <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: '#00c853' } }} />
                               </Box>
                           </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Card sx={{ borderRadius: 6 }} elevation={0}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>KPI Achievement</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} align="center">Calculating metrics...</TableCell></TableRow>
                            ) : (
                                employees.map((emp, i) => {
                                    const mockScore = (4 + Math.random() * 1).toFixed(1);
                                    const status = getPerformanceStatus(mockScore);
                                    return (
                                        <TableRow key={emp.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar src={emp.avatar}>{emp.name.charAt(0)}</Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{emp.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{emp.department}</TableCell>
                                            <TableCell>
                                                <Box sx={{ width: '100px' }}>
                                                    <Typography variant="caption">{80 + i*2}%</Typography>
                                                    <LinearProgress variant="determinate" value={80 + i*2} sx={{ height: 4, borderRadius: 2 }} />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{mockScore}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={status.label} size="small" color={status.color} sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </DashboardLayout>
    );
};

export default PerformanceReport;
