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
  Chip,
  IconButton,
  Button,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Grid
} from '@mui/material';
import {
  Check,
  Close,
  Visibility,
  Search,
  Receipt,
  FilterList,
  PendingActions,
  AssignmentTurnedIn,
  ReportProblem
} from '@mui/icons-material';
import { expenseAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const ClaimApprovals = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ status: '', remark: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await expenseAPI.getAll();
      setClaims(res.data || []);
    } catch (error) {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (claim, status) => {
    setSelectedClaim(claim);
    setReviewData({ status, remark: '' });
    setReviewDialog(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedClaim) return;
    try {
      setProcessing(true);
      await expenseAPI.updateStatus(selectedClaim.id, reviewData);
      toast.success(`Claim ${reviewData.status} successfully`);
      setReviewDialog(false);
      fetchClaims();
    } catch (error) {
      toast.error('Failed to update claim');
    } finally {
      setProcessing(false);
    }
  };

  const filteredClaims = claims.filter(c => 
    c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    pending: claims.filter(c => c.status === 'pending').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length
  };

  return (
    <DashboardLayout title="Expense Claim Approvals">
      {/* Mini Stats Bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 4, border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}><PendingActions /></Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{stats.pending}</Typography>
              <Typography variant="caption" color="textSecondary">Awaiting Review</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 4, border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}><AssignmentTurnedIn /></Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{stats.approved}</Typography>
              <Typography variant="caption" color="textSecondary">Processed Successfully</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 4, border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#f44336' }}><ReportProblem /></Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{stats.rejected}</Typography>
              <Typography variant="caption" color="textSecondary">Flagged/Rejected</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 5, border: '1px solid #f0f0f0', overflow: 'hidden' }} elevation={0}>
        <Box sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center', bgcolor: '#fff' }}>
          <TextField
            size="small"
            placeholder="Search by employee or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          />
          <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 3, textTransform: 'none' }}>Filters</Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Claim Details</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}><CircularProgress size={25} /></TableCell></TableRow>
              ) : filteredClaims.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}>No claims found matching filters.</TableCell></TableRow>
              ) : (
                filteredClaims.map((claim) => (
                  <TableRow key={claim.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#696cff', fontSize: '0.8rem' }}>
                          {claim.employeeName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{claim.employeeName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{claim.title}</Typography>
                      <Typography variant="caption" color="textSecondary">{claim.category} • {new Date(claim.date).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>${claim.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={claim.status.toUpperCase()} 
                        size="small" 
                        color={claim.status === 'approved' ? 'success' : claim.status === 'rejected' ? 'error' : 'warning'}
                        sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {claim.status === 'pending' ? (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button 
                            variant="contained" size="small" color="success" onClick={() => handleOpenReview(claim, 'approved')}
                            sx={{ minWidth: 40, p: 0.5, borderRadius: 2 }}
                          ><Check fontSize="small" /></Button>
                          <Button 
                            variant="contained" size="small" color="error" onClick={() => handleOpenReview(claim, 'rejected')}
                            sx={{ minWidth: 40, p: 0.5, borderRadius: 2 }}
                          ><Close fontSize="small" /></Button>
                        </Box>
                      ) : (
                        <IconButton size="small"><Visibility fontSize="small" /></IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {reviewData.status === 'approved' ? 'Approve' : 'Reject'} Claim Request
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Reviewing claim from <strong>{selectedClaim?.employeeName}</strong> for <strong>${selectedClaim?.amount}</strong>.
          </Typography>
          <TextField
            fullWidth label="Decision Remark" multiline rows={3} value={reviewData.remark}
            onChange={(e) => setReviewData(prev => ({ ...prev, remark: e.target.value }))}
            placeholder="Add a reason for this decision..."
            variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setReviewDialog(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button 
            variant="contained" onClick={handleSubmitReview} disabled={processing}
            color={reviewData.status === 'approved' ? 'success' : 'error'}
            sx={{ borderRadius: 3, px: 4, textTransform: 'none' }}
          >
            {processing ? 'Processing...' : `Confirm ${reviewData.status}`}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ClaimApprovals;
