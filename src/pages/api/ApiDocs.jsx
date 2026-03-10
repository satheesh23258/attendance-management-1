import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material';
import {
  Code,
  Terminal,
  Http,
  Security,
  Layers,
  SettingsInputComponent
} from '@mui/icons-material';
import DashboardLayout from '../../components/DashboardLayout';

const ApiDocs = () => {
    const endpoints = [
        { method: 'GET', path: '/api/attendance/history', desc: 'Retreive all attendance records for the current user.' },
        { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user and receive JWT access token.' },
        { method: 'POST', path: '/api/expenses/submit', desc: 'Submit a new financial reimbursement claim.' },
        { method: 'GET', path: '/api/employees/all', desc: 'Fetch the directory of all active employees (HR/Admin only).' }
    ];

    return (
        <DashboardLayout title="Developer API Portal">
            <Box sx={{ p: 4, bgcolor: '#000', color: '#fff', borderRadius: 6, mb: 4, position: 'relative', overflow: 'hidden' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Build with our SDK</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: '600px' }}>
                    Connect your external applications to the Attendance Management System. Our RESTful API supports secure identity management and real-time syncing.
                </Typography>
                <Code sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 160, opacity: 0.1 }} />
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Core Endpoints</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {endpoints.map((ep, i) => (
                            <Card key={i} sx={{ borderRadius: 4, border: '1px solid #eee' }} elevation={0}>
                                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip 
                                        label={ep.method} 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: ep.method === 'GET' ? '#4caf50' : '#2f80ed', 
                                            color: '#fff', 
                                            fontWeight: 900, 
                                            borderRadius: 1 
                                        }} 
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{ep.path}</Typography>
                                        <Typography variant="caption" color="textSecondary">{ep.desc}</Typography>
                                    </Box>
                                    <Terminal sx={{ color: '#ccc' }} />
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 6, bgcolor: '#fbfbfb', border: '1px solid #eee' }} elevation={0}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Authentication</Typography>
                            <Box sx={{ p: 2, bgcolor: '#fff', border: '1px solid #eee', borderRadius: 3, mb: 3 }}>
                                <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem' }}>
                                    Authorization: Bearer {'<token>'}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                All requests must include a valid JWT in the Authorization header. Admin endpoints require elevated roles.
                            </Typography>
                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Security sx={{ fontSize: 16, color: '#00c853' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>OAuth 2.0 Compliant</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
};

export default ApiDocs;
