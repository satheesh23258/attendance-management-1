import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  HistoryEdu,
  Search,
  FilterAlt,
  Fingerprint,
  Info,
  Terminal,
  SecurityUpdateGood
} from '@mui/icons-material';
import { auditAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ module: '', action: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const modules = ['Attendance', 'Leave', 'Expenses', 'Employee', 'System', 'Auth'];

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditAPI.getLogs(filter);
      setLogs(res.data || []);
    } catch (error) {
      toast.error('Failed to fetch system logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('REJECT') || action.includes('DELETE')) return 'error';
    if (action.includes('APPROVE') || action.includes('CREATE')) return 'success';
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'info';
    return 'default';
  };

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="System Audit Logs">
      {/* Header Info */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
         <Avatar sx={{ bgcolor: '#000', color: '#fff' }}><Terminal /></Avatar>
         <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Immutability Check</Typography>
            <Typography variant="body2" color="textSecondary">Every administrative action is tracked for transparency and security.</Typography>
         </Box>
      </Box>

      {/* Filters Bar */}
      <Card sx={{ mb: 3, borderRadius: 4, border: '1px solid #eee' }} elevation={0}>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
           <TextField
             size="small"
             placeholder="Search by user or action..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             sx={{ flex: 1, minWidth: '200px', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
             InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
           />
           
           <TextField
             select
             size="small"
             label="Module"
             value={filter.module}
             onChange={(e) => setFilter({...filter, module: e.target.value})}
             sx={{ width: '150px', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
           >
              <MenuItem value="">All Modules</MenuItem>
              {modules.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
           </TextField>

           <IconButton onClick={fetchLogs} color="primary" sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
              <SecurityUpdateGood />
           </IconButton>
        </CardContent>
      </Card>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Action & Module</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Performed By</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10 }}><CircularProgress size={30} /></TableCell></TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10 }}>No activity logs found.</TableCell></TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                       <Chip 
                         label={log.action} 
                         size="small" 
                         color={getActionColor(log.action)}
                         sx={{ fontWeight: 800, fontSize: '0.65rem', borderRadius: 1.5 }}
                       />
                       <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>@{log.module}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: log.userRole === 'admin' ? '#000' : '#1976d2' }}>
                           {log.userName.charAt(0)}
                        </Avatar>
                        <Box>
                           <Typography variant="body2" sx={{ fontWeight: 600 }}>{log.userName}</Typography>
                           <Typography variant="caption" sx={{ color: 'text.secondary' }}>{log.userRole}</Typography>
                        </Box>
                     </Box>
                  </TableCell>
                  <TableCell>
                     <Tooltip title={JSON.stringify(log.details, null, 2)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                           <Info fontSize="small" color="action" />
                           <Typography variant="body2" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {Object.keys(log.details || {}).join(', ')}
                           </Typography>
                        </Box>
                     </Tooltip>
                  </TableCell>
                  <TableCell>
                     <Typography variant="body2">{new Date(log.timestamp).toLocaleDateString()}</Typography>
                     <Typography variant="caption" color="textSecondary">{new Date(log.timestamp).toLocaleTimeString()}</Typography>
                  </TableCell>
                  <TableCell align="right">
                     <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 0.5, borderRadius: 1 }}>
                        {log.ipAddress || 'unknown'}
                     </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardLayout>
  );
};

export default AuditLogs;
