import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Delete,
  EventNote,
  Groups,
  MoreVert,
  WbSunny,
  NightsStay,
  Schedule
} from '@mui/icons-material';
import { shiftAPI, employeeAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const ShiftRoster = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openAssign, setOpenAssign] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    title: 'Regular Shift',
    color: '#6366f1'
  });

  const colors = [
    { label: 'Indigo', hex: '#6366f1' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Rose', hex: '#f43f5e' },
    { label: 'Amber', hex: '#f59e0b' },
    { label: 'Violet', hex: '#8b5cf6' }
  ];

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Logic for 7-day window
      const start = new Date(currentDate);
      const end = new Date(currentDate);
      end.setDate(end.getDate() + 6);
      
      const [shiftsRes, empRes] = await Promise.all([
        shiftAPI.getAll({ start: start.toISOString(), end: end.toISOString() }),
        employeeAPI.getAll()
      ]);
      
      setShifts(shiftsRes.data || []);
      setEmployees(empRes.data?.data || empRes.data || []);
    } catch (error) {
      toast.error('Failed to load roster');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    try {
        setSubmitting(true);
        const emp = employees.find(e => e.id === formData.employeeId);
        await shiftAPI.assign({ ...formData, employeeName: emp?.name || 'Unknown' });
        toast.success('Shift assigned');
        setOpenAssign(false);
        fetchData();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to assign shift');
    } finally {
        setSubmitting(false);
    }
  };

  const deleteShift = async (id) => {
    try {
        await shiftAPI.remove(id);
        toast.success('Shift removed');
        fetchData();
    } catch (error) {
        toast.error('Failed to remove shift');
    }
  };

  // Generate 7 days labels
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <DashboardLayout title="Employee Shift Roster">
      {/* Control Bar */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', bgcolor: '#fff', borderRadius: 3, border: '1px solid #eee', p: 0.5 }}>
                <IconButton size="small" onClick={() => {
                    const d = new Date(currentDate);
                    d.setDate(d.getDate() - 7);
                    setCurrentDate(d);
                }}><ChevronLeft /></IconButton>
                <Box sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                </Box>
                <IconButton size="small" onClick={() => {
                    const d = new Date(currentDate);
                    d.setDate(d.getDate() + 7);
                    setCurrentDate(d);
                }}><ChevronRight /></IconButton>
            </Box>
            <Button variant="outlined" sx={{ borderRadius: 3, textTransform: 'none' }} onClick={() => setCurrentDate(new Date())}>Today</Button>
         </Box>

         <Button 
            variant="contained" startIcon={<Add />} 
            onClick={() => setOpenAssign(true)}
            sx={{ bgcolor: '#000', color: '#fff', borderRadius: 3, px: 3, textTransform: 'none', fontWeight: 700 }}
         >
            Assign Shift
         </Button>
      </Box>

      {/* Roster Grid */}
      <Card sx={{ borderRadius: 6, border: '1px solid #eee', overflow: 'hidden' }} elevation={0}>
         <Box sx={{ display: 'grid', gridTemplateColumns: '200px repeat(7, 1fr)', bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
            <Box sx={{ p: 2, borderRight: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Groups fontSize="small" color="action" />
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Resources</Typography>
            </Box>
            {days.map(d => (
                <Box key={d.toISOString()} sx={{ p: 2, textAlign: 'center', borderRight: '1px solid #eee' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: d.getDay() === 0 ? 'error.main' : 'text.secondary' }}>
                        {d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>{d.getDate()}</Typography>
                </Box>
            ))}
         </Box>

         <Box sx={{ minHeight: '400px', bgcolor: '#fff' }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={30} /></Box>
            ) : employees.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="textSecondary">No employees to display.</Typography></Box>
            ) : (
                employees.map(emp => (
                    <Box key={emp.id} sx={{ display: 'grid', gridTemplateColumns: '200px repeat(7, 1fr)', borderBottom: '1px solid #f9f9f9' }}>
                        <Box sx={{ p: 2, borderRight: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#f0f0f0', color: '#333', fontSize: '0.8rem' }}>{emp.name.charAt(0)}</Avatar>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>{emp.name}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.6 }}>{emp.role}</Typography>
                            </Box>
                        </Box>
                        {days.map(d => {
                            const dateStr = d.toISOString().split('T')[0];
                            const employeeShifts = shifts.filter(s => s.employeeId === emp.id && new Date(s.date).toISOString().split('T')[0] === dateStr);
                            
                            return (
                                <Box key={dateStr} sx={{ p: 1, borderRight: '1px solid #eee', minHeight: '80px', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    {employeeShifts.map(s => (
                                        <Tooltip key={s.id} title={`${s.title}: ${s.startTime} - ${s.endTime}`}>
                                            <Box 
                                                sx={{ 
                                                    p: 1, 
                                                    bgcolor: s.color || '#6366f1', 
                                                    color: '#fff', 
                                                    borderRadius: 2, 
                                                    fontSize: '0.65rem',
                                                    position: 'relative',
                                                    '&:hover .delete-btn': { opacity: 1 }
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.6rem' }}>{s.startTime}-{s.endTime}</Typography>
                                                <Typography sx={{ opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</Typography>
                                                <IconButton 
                                                    className="delete-btn"
                                                    size="small" 
                                                    onClick={() => deleteShift(s.id)}
                                                    sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', p: 0.2, opacity: 0, transition: '0.2s' }}
                                                >
                                                    <Delete sx={{ fontSize: 10 }} />
                                                </IconButton>
                                            </Box>
                                        </Tooltip>
                                    ))}
                                </Box>
                            );
                        })}
                    </Box>
                ))
            )}
         </Box>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Assign Shift</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                    <TextField 
                        select fullWidth label="Select Employee" value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    >
                        {employees.map(e => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        type="date" fullWidth label="Date" value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        type="time" fullWidth label="From" value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        type="time" fullWidth label="To" value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        select fullWidth label="Accent Color" value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    >
                        {colors.map(c => (
                            <MenuItem key={c.hex} value={c.hex}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c.hex }} />
                                    {c.label}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAssign(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button 
                variant="contained" onClick={handleAssign} disabled={submitting}
                sx={{ bgcolor: '#000', color: '#fff', borderRadius: 3, px: 4, textTransform: 'none' }}
            >
                {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ShiftRoster;
