import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Grid
} from '@mui/material';
import {
  NotificationsActive,
  Email,
  PhoneIphone,
  Security,
  Assignment,
  Schedule,
  Vibration
} from '@mui/icons-material';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        emailAlerts: true,
        pushNotifications: true,
        attendanceReminders: true,
        serviceUpdates: true,
        securityBriefs: false,
        vibration: true
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const saveSettings = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
                loading: 'Updating preferences...',
                success: 'Settings saved successfully!',
                error: 'Update failed'
            }
        );
    };

    return (
        <DashboardLayout title="Notification Preferences">
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 6 }} elevation={0}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Communication Channels</Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon><Email color="primary" /></ListItemIcon>
                                    <ListItemText primary="Email Notifications" secondary="Receive periodic summaries and urgent alerts via email." />
                                    <Switch checked={settings.emailAlerts} onChange={() => handleToggle('emailAlerts')} />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><PhoneIphone color="primary" /></ListItemIcon>
                                    <ListItemText primary="Push Notifications" secondary="Real-time alerts on your mobile device even if the app is closed." />
                                    <Switch checked={settings.pushNotifications} onChange={() => handleToggle('pushNotifications')} />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><Vibration color="primary" /></ListItemIcon>
                                    <ListItemText primary="Vibrate on Alert" secondary="Add a physical vibration for incoming notifications." />
                                    <Switch checked={settings.vibration} onChange={() => handleToggle('vibration')} />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 6 }} elevation={0}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Event Subscriptions</Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon><Schedule color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Attendance Reminders" secondary="Notify when it is time to punch in or out." />
                                    <Switch checked={settings.attendanceReminders} onChange={() => handleToggle('attendanceReminders')} />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><Assignment color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Service Updates" secondary="Alerts when a task or service request status changes." />
                                    <Switch checked={settings.serviceUpdates} onChange={() => handleToggle('serviceUpdates')} />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><Security color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Security Logins" secondary="Notify on every successful login session." />
                                    <Switch checked={settings.securityBriefs} onChange={() => handleToggle('securityBriefs')} />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button sx={{ borderRadius: 3, textTransform: 'none' }}>Restore Defaults</Button>
                <Button 
                    variant="contained" onClick={saveSettings}
                    sx={{ bgcolor: '#000', color: '#fff', borderRadius: 3, px: 4, textTransform: 'none', fontWeight: 700 }}
                >
                    Save Changes
                </Button>
            </Box>
        </DashboardLayout>
    );
};

export default NotificationSettings;
