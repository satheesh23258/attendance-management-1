import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  SupportAgent,
  Add,
  BugReport,
  Dns,
  Person,
  Schedule,
  CheckCircleOutline,
  KeyboardArrowRight,
  HelpOutline
} from '@mui/icons-material';
import { ticketAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const SupportCenter = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNew, setOpenNew] = useState(false);
  const [formData, setFormData] = useState({ subject: '', category: 'IT', priority: 'medium', description: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketAPI.getMyTickets();
      setTickets(res.data || []);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
        await ticketAPI.create(formData);
        toast.success('Support ticket created');
        setOpenNew(false);
        fetchTickets();
    } catch (error) {
        toast.error('Submission failed');
    }
  };

  return (
    <DashboardLayout title="Support & Helpdesk">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
           <Card sx={{ borderRadius: 6, bgcolor: '#000', color: '#fff', mb: 3 }} elevation={0}>
              <CardContent sx={{ p: 4 }}>
                 <SupportAgent sx={{ fontSize: 48, mb: 2 }} />
                 <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>How can we help?</Typography>
                 <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                    Encountered a technical glitch or have an HR query? Create a ticket and our team will get back to you.
                 </Typography>
                 <Button 
                    fullWidth variant="contained" startIcon={<Add />} 
                    onClick={() => setOpenNew(true)}
                    sx={{ bgcolor: '#fff', color: '#000', borderRadius:3, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#eee' }, textTransform: 'none' }}
                 >
                    Create New Ticket
                 </Button>
              </CardContent>
           </Card>

           <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 6, border: '1px solid #eee' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Quick Resources</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                 {['Company Handbook', 'IT Security Policy', 'Insurance Details'].map(item => (
                    <Button key={item} fullWidth sx={{ justifyContent: 'space-between', color: '#333', textTransform: 'none' }} endIcon={<KeyboardArrowRight />}>
                        {item}
                    </Button>
                 ))}
              </Box>
           </Box>
        </Grid>

        <Grid item xs={12} md={8}>
           <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Your Support History</Typography>
           
           {loading ? (
             <Typography>Loading history...</Typography>
           ) : tickets.length === 0 ? (
             <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fafafa', borderRadius: 6, border: '1px dashed #ccc' }}>
                <HelpOutline sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                <Typography color="textSecondary">No active or past tickets found.</Typography>
             </Box>
           ) : (
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tickets.map(ticket => (
                  <Card key={ticket.id} sx={{ borderRadius: 5, border: '1px solid #eee', '&:hover': { borderColor: '#000' } }} elevation={0}>
                    <CardContent sx={{ p: 3 }}>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                             <Chip label={ticket.category} size="small" variant="outlined" sx={{ borderRadius: 1.5 }} />
                             <Chip 
                                label={ticket.status.toUpperCase()} 
                                size="small" 
                                color={ticket.status === 'resolved' ? 'success' : 'warning'} 
                                sx={{ fontWeight: 800, fontSize: '0.6rem' }} 
                             />
                          </Box>
                          <Typography variant="caption" color="textSecondary">Modified: {new Date(ticket.updatedAt).toLocaleDateString()}</Typography>
                       </Box>
                       <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>{ticket.subject}</Typography>
                       <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>{ticket.description}</Typography>
                       <Divider sx={{ mb: 2 }} />
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Avatar sx={{ width: 24, height: 24, bgcolor: '#eee' }}><Person sx={{ fontSize: 16, color: '#666' }} /></Avatar>
                             <Typography variant="caption">Assigned: {ticket.assignedTo || 'Unassigned'}</Typography>
                          </Box>
                          <Button size="small" sx={{ textTransform: 'none' }}>View Details</Button>
                       </Box>
                    </CardContent>
                  </Card>
                ))}
             </Box>
           )}
        </Grid>
      </Grid>

      {/* New Ticket Dialog */}
      <Dialog open={openNew} onClose={() => setOpenNew(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Describe your issue</DialogTitle>
        <DialogContent>
           <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                 <TextField 
                    fullWidth label="Subject" required value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                 />
              </Grid>
              <Grid item xs={6}>
                 <TextField 
                    select fullWidth label="Category" value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                 >
                    {['IT', 'HR', 'Admin', 'Maintenance', 'Other'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                 </TextField>
              </Grid>
              <Grid item xs={6}>
                 <TextField 
                    select fullWidth label="Priority" value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                 >
                    {['low', 'medium', 'high', 'critical'].map(p => <MenuItem key={p} value={p}>{p.toUpperCase()}</MenuItem>)}
                 </TextField>
              </Grid>
              <Grid item xs={12}>
                 <TextField 
                    fullWidth multiline rows={4} label="How can we help?" value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                 />
              </Grid>
           </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
           <Button onClick={() => setOpenNew(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
           <Button 
                variant="contained" onClick={handleCreate}
                sx={{ bgcolor: '#000', color: '#fff', borderRadius: 3, px: 4, textTransform: 'none' }}
           >
                Submit Ticket
           </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default SupportCenter;
