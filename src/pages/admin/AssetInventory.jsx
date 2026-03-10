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
  InputAdornment
} from '@mui/material';
import {
  Inventory,
  Add,
  QrCode2,
  LaptopMac,
  Smartphone,
  CheckCircle,
  Construction,
  Search,
  AssignmentTurnedIn
} from '@mui/icons-material';
import { assetAPI, employeeAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const AssetInventory = () => {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Laptop',
    serialNumber: '',
    model: '',
    status: 'available',
    condition: 'new'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assetRes, empRes] = await Promise.all([
        assetAPI.getAll(),
        employeeAPI.getAll()
      ]);
      setAssets(assetRes.data || []);
      setEmployees(empRes.data?.data || empRes.data || []);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
        await assetAPI.add(formData);
        toast.success('Asset added to inventory');
        setOpenAdd(false);
        fetchData();
    } catch (error) {
        toast.error('Failed to add asset');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
        case 'available': return 'success';
        case 'assigned': return 'info';
        case 'maintenance': return 'warning';
        case 'retired': return 'error';
        default: return 'default';
    }
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Asset & Inventory Management">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
           <Card sx={{ borderRadius: 6, border: '1px solid #eee' }} elevation={0}>
              <CardContent sx={{ textAlign: 'center' }}>
                 <Typography variant="h4" sx={{ fontWeight: 800 }}>{assets.length}</Typography>
                 <Typography variant="caption" color="textSecondary">Total Assets Tracked</Typography>
              </CardContent>
           </Card>
        </Grid>
        <Grid item xs={12} md={3}>
           <Card sx={{ borderRadius: 6, border: '1px solid #eee' }} elevation={0}>
              <CardContent sx={{ textAlign: 'center' }}>
                 <Typography variant="h4" sx={{ fontWeight: 800, color: '#4caf50' }}>{assets.filter(a => a.status === 'available').length}</Typography>
                 <Typography variant="caption" color="textSecondary">Available for Assignment</Typography>
              </CardContent>
           </Card>
        </Grid>
        <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: '#000', color: '#fff', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, height: '100%' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Procurement Ready</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>Expand your inventory or track lifecycle events.</Typography>
                </Box>
                <Button 
                    variant="contained" startIcon={<Add />} onClick={() => setOpenAdd(true)}
                    sx={{ bgcolor: '#fff', color: '#000', borderRadius: 3, fontWeight: 700, textTransform: 'none', px: 3, '&:hover': { bgcolor: '#eee' } }}
                >
                    Add Asset
                </Button>
            </Box>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 6, border: '1px solid #f0f0f0', overflow: 'hidden' }} elevation={0}>
        <Box sx={{ p: 3, display: 'flex', gap: 2, bgcolor: '#fff' }}>
           <TextField 
                placeholder="Search by name or serial..." fullWidth size="small"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
           />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Asset Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SN / Model</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Condition</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">QR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}><CircularProgress size={30} /></TableCell></TableRow>
              ) : filteredAssets.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}>No assets found.</TableCell></TableRow>
              ) : (
                filteredAssets.map(asset => (
                  <TableRow key={asset.id} hover>
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#f5f5f5', color: '#666' }}>
                                {asset.category === 'Laptop' ? <LaptopMac fontSize="small" /> : <Smartphone fontSize="small" />}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{asset.name}</Typography>
                                <Typography variant="caption" color="textSecondary">{asset.category}</Typography>
                            </Box>
                        </Box>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{asset.serialNumber}</Typography>
                        <Typography variant="caption" color="textSecondary">{asset.model}</Typography>
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={asset.status.toUpperCase()} 
                            size="small" variant="outlined"
                            color={getStatusColor(asset.status)}
                            sx={{ fontWeight: 800, fontSize: '0.6rem' }}
                        />
                    </TableCell>
                    <TableCell>
                        <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>{asset.condition}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{asset.assignedTo?.name || '---'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                        <IconButton size="small"><QrCode2 fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Asset Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Register New Asset</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                    <TextField 
                        fullWidth label="Asset Name" value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        select fullWidth label="Category" value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    >
                        {['Laptop', 'Mobile', 'Tablet', 'Furniture', 'Vehicle', 'Other'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        select fullWidth label="Condition" value={formData.condition}
                        onChange={(e) => setFormData({...formData, condition: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    >
                        {['new', 'good', 'fair', 'damaged'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        fullWidth label="Serial Number" value={formData.serialNumber}
                        onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        fullWidth label="Model / Spec" value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAdd(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button 
                variant="contained" onClick={handleAdd}
                sx={{ bgcolor: '#000', color: '#fff', borderRadius: 3, px: 4, textTransform: 'none' }}
            >
                Register Asset
            </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AssetInventory;
