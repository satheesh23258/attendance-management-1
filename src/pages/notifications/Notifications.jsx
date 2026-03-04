import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Notifications,
  MarkEmailRead,
  Delete,
  Search,
  FilterList,
  Assignment,
  AccessTime,
  Person,
  Info,
  Circle,
  CheckCircle,
  Warning,
  DateRange,
  WorkHistory
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { notificationAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, read, unread
  const [importanceFilter, setImportanceFilter] = useState('all'); // all, normal, high, urgent
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getAll();
      setNotifications(res.data);
      setFilteredNotifications(res.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    let filtered = notifications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(n =>
        statusFilter === 'read' ? n.isRead : !n.isRead
      );
    }

    // Importance filter
    if (importanceFilter !== 'all') {
      filtered = filtered.filter(n => (n.importance || 'normal') === importanceFilter);
    }

    setFilteredNotifications(filtered);
  }, [searchTerm, typeFilter, statusFilter, importanceFilter, notifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id || n._id === id ? { ...n, isRead: true } : n));
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to mark read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to mark all read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'attendance': return <AccessTime color="primary" />;
      case 'service': return <Assignment color="secondary" />;
      case 'leave': return <DateRange color="warning" />;
      case 'system': return <Warning color="error" />;
      case 'user': return <Person color="info" />;
      default: return <Info color="disabled" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DashboardLayout title="Notification Center">
      <Card sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <Avatar sx={{ bgcolor: '#f4f7f9', color: '#000' }}>
                <Notifications />
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" fontWeight="bold">Your Notifications</Typography>
              <Typography variant="body2" color="text.secondary">
                You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<MarkEmailRead />}
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || loading}
            sx={{ borderRadius: 2 }}
          >
            Mark All Read
          </Button>
        </Box>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="attendance">Attendance</MenuItem>
                <MenuItem value="leave">Leave</MenuItem>
                <MenuItem value="service">Service</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="all">Any Status</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="read">Read</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Priority</InputLabel>
              <Select value={importanceFilter} onChange={(e) => setImportanceFilter(e.target.value)} label="Priority">
                <MenuItem value="all">Any Priority</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, minHeight: 400 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography color="text.secondary">Loading notifications...</Typography>
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height={300}>
            <MarkEmailRead sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No notifications found</Typography>
            <Typography variant="body2" color="text.secondary">You're all caught up!</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredNotifications.map((notif, index) => {
              const id = notif._id || notif.id;
              const isUnread = !notif.isRead;
              const importanceColor = 
                notif.importance === 'urgent' ? 'error' : 
                notif.importance === 'high' ? 'warning' : 'default';

              return (
                <React.Fragment key={id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      py: 2.5,
                      px: 3,
                      bgcolor: isUnread ? 'rgba(0, 200, 83, 0.04)' : 'transparent',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 56, mt: 0.5 }}>
                      <Badge color="error" variant="dot" invisible={!isUnread}>
                        <Avatar sx={{ bgcolor: isUnread ? '#fff' : '#f4f7f9', border: '1px solid #eee' }}>
                          {getIcon(notif.type)}
                        </Avatar>
                      </Badge>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography variant="subtitle1" fontWeight={isUnread ? 700 : 500}>
                            {notif.title}
                          </Typography>
                          {notif.importance && notif.importance !== 'normal' && (
                            <Chip size="small" label={notif.importance.toUpperCase()} color={importanceColor} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} />
                          )}
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                            {(notif.createdAt ? new Date(notif.createdAt) : new Date()).toLocaleString(undefined, {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color={isUnread ? 'text.primary' : 'text.secondary'} sx={{ pr: 6 }}>
                          {notif.message}
                        </Typography>
                      }
                    />
                    
                    <Box display="flex" flexDirection="column" gap={1}>
                      {isUnread && (
                        <Tooltip title="Mark as Read">
                          <IconButton size="small" onClick={() => handleMarkAsRead(id)} sx={{ color: '#00c853' }}>
                            <Circle sx={{ fontSize: 12 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(id)} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default NotificationsPage;
