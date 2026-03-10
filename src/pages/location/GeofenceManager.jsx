import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Slider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Avatar,
} from '@mui/material';
import {
  LocationOn,
  AddLocation,
  Delete,
  MyLocation,
  Save,
  CorporateFare,
  HomeWork,
  Storefront
} from '@mui/icons-material';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const GeofenceManager = () => {
  const [locations, setLocations] = useState([
    { id: 1, name: 'Main Office - NY', lat: 40.7128, lng: -74.006, radius: 100, active: true },
    { id: 2, name: 'Downtown Branch', lat: 40.7282, lng: -73.9942, radius: 50, active: true }
  ]);

  const [newLoc, setNewLoc] = useState({ name: '', lat: '', lng: '', radius: 100 });

  const handleToggle = (id) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  const handleAdd = () => {
    if (!newLoc.name || !newLoc.lat || !newLoc.lng) return toast.error('Please fill all fields');
    setLocations([...locations, { ...newLoc, id: Date.now(), active: true }]);
    setNewLoc({ name: '', lat: '', lng: '', radius: 100 });
    toast.success('Geofence added');
  };

  return (
    <DashboardLayout title="Geo-fenced Zones">
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
           <Card sx={{ borderRadius: 6, mb: 3 }} elevation={0}>
              <CardContent sx={{ p: 4 }}>
                 <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Configure New Zone</Typography>
                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField 
                        fullWidth label="Location Name" placeholder="e.g. Headquarters"
                        value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField 
                            label="Latitude" type="number" 
                            value={newLoc.lat} onChange={e => setNewLoc({...newLoc, lat: e.target.value})}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                        <TextField 
                            label="Longitude" type="number"
                            value={newLoc.lng} onChange={e => setNewLoc({...newLoc, lng: e.target.value})}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Proximity Radius: {newLoc.radius}m</Typography>
                        <Slider 
                            value={newLoc.radius} min={10} max={1000} step={10}
                            onChange={(e, val) => setNewLoc({...newLoc, radius: val})}
                        />
                    </Box>
                    <Button 
                        variant="contained" startIcon={<AddLocation />} 
                        fullWidth onClick={handleAdd}
                        sx={{ bgcolor: '#000', borderRadius: 3, py: 1.5, textTransform: 'none', fontWeight: 700 }}
                    >
                        Active Geofence Region
                    </Button>
                 </Box>
              </CardContent>
           </Card>
        </Grid>

        <Grid item xs={12} md={7}>
           <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Active Boundaries</Typography>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {locations.map(loc => (
                <Card key={loc.id} sx={{ borderRadius: 5, border: '1px solid #eee' }} elevation={0}>
                    <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: loc.active ? '#00c853' : '#eee', color: loc.active ? '#fff' : '#666' }}>
                                <CorporateFare />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{loc.name}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {loc.lat}, {loc.lng} • Range: {loc.radius}m
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Switch checked={loc.active} onChange={() => handleToggle(loc.id)} />
                            <IconButton size="small" onClick={() => setLocations(locations.filter(l => l.id !== loc.id))}>
                                <Delete color="error" fontSize="small" />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
              ))}
           </Box>

           <Card sx={{ mt: 4, borderRadius: 6, bgcolor: '#f5f5f5', border: '1px dashed #ccc' }} elevation={0}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                 <MyLocation sx={{ fontSize: 40, color: '#ccc', mb: 2 }} />
                 <Typography variant="body2" color="textSecondary">
                    Employees can only check-in when they are physically inside these regions. 
                    Calculations are done using real-time GPS coordinates.
                 </Typography>
              </CardContent>
           </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default GeofenceManager;
