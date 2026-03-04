import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  InputBase
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  AccessTime,
  LocationOn,
  Assignment,
  Assessment,
  Notifications,
  Settings,
  AccountCircle,
  Logout,
  ChevronLeft,
  Security,
  ArrowBack,
  Search as SearchIcon
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { Collapse, Button } from '@mui/material'

const drawerWidth = 240

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const themeColor = user?.role === 'employee'
    ? '#2f80ed'
    : user?.role === 'admin'
      ? '#000000'
      : user?.role === 'hr'
        ? '#f2c94c'
        : undefined

  const themeTextColor = user?.role === 'hr' ? 'black' : 'white'
  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleProfileMenuClose()
  }

  const handleProfile = () => {
    navigate('/profile')
    handleProfileMenuClose()
  }

  const handleSettings = () => {
    navigate('/settings')
    handleProfileMenuClose()
  }

  const getMenuItems = () => {
    const roleMap = user?.role?.toLowerCase()

    const items = [
      {
        text: 'Dashboard',
        icon: <Dashboard />,
        path: roleMap === 'admin' ? '/dashboard/admin' : roleMap === 'hr' ? '/dashboard/hr' : roleMap === 'employee' ? '/dashboard/employee' : '/'
      }
    ]

    // If user has hybrid access (employee granted HR), expose hybrid dashboard
    if (user?.hybrid) {
      items.push({ text: 'Hybrid Dashboard', icon: <Dashboard />, path: '/dashboard/hybrid' })
    }
    
    // Exact mapping from QuickActions for Admin
    if (roleMap === 'admin') {
      items.push(
        { text: 'Manage Employees', icon: <People />, path: '/admin/manage-employees' },
        { text: 'Manage Hybrid Permissions', icon: <Security />, path: '/admin/manage-permissions' },
        { text: 'View Services', icon: <Assignment />, path: '/admin/services' },
        { text: 'View Reports', icon: <Assessment />, path: '/admin/system-reports' },
        { text: 'Live Tracking', icon: <LocationOn />, path: '/location/tracking' }
      )
    }

    // Exact mapping from QuickActions for HR
    if (roleMap === 'hr' || user?.hybrid) {
      items.push(
        { text: 'Employee Records', icon: <People />, path: '/hr/employee-records' },
        { text: 'Attendance Reports', icon: <Assignment />, path: '/hr/attendance-reports' },
        { text: 'Attendance Management', icon: <AccessTime />, path: '/hr/attendance-management' },
        { text: 'Performance Reviews', icon: <Assessment />, path: '/hr/performance' },
        { text: 'Live Tracking', icon: <LocationOn />, path: '/location/tracking' },
        { text: 'Leave Application', icon: <LocationOn />, path: '/hr/leave-application' } // Changed icon slightly? using generic
      )
    }

    // Exact mapping from QuickActions for Employee
    if (roleMap === 'employee') {
      items.push(
        { text: 'Attendance History', icon: <AccessTime />, path: '/employee/attendance' },
        { text: 'My Location', icon: <LocationOn />, path: '/employee/location' },
        { text: 'My Services', icon: <Assignment />, path: '/employee/services' },
        { text: 'My Profile', icon: <AccountCircle />, path: '/employee/profile' },
        { text: 'Leave Application', icon: <AccessTime />, path: '/employee/leave-application' }
      )
    }

    items.push(
      { text: 'Notifications', icon: <Notifications />, path: '/notifications' }
    )

    return items
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f9', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: open ? `${drawerWidth}px` : 0,
          transition: 'width 0.3s, margin 0.3s',
          backgroundColor: '#FFFFFF',
          color: '#333333',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, display: open ? 'none' : 'block' }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Employee Management System
          </Typography>

          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={() => navigate('/notifications')} sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              sx={{ p: 0.5, border: '1px solid #e0e0e0' }}
            >
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{ width: 32, height: 32 }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              sx: { mt: 1.5, minWidth: 150, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
            }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#282a3c',
            color: '#c2c4d1',
            borderRight: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, bgcolor: '#232536' }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#c2c4d1', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%', p: 1 }}>
            <ArrowBack sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#c2c4d1' }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
        
        {/* Search Bar matching ref image */}
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: 'rgba(255,255,255,0.05)', 
            borderRadius: 8, 
            px: 2, 
            py: 0.5, 
            border: '1px solid rgba(255,255,255,0.1)' 
          }}>
            <InputBase 
              placeholder="Search" 
              sx={{ color: '#fff', flex: 1, fontSize: '0.9rem' }} 
            />
            <SearchIcon sx={{ color: '#a1a3b1', fontSize: 20 }} />
          </Box>
        </Box>
        
        {/* User Card */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Avatar src={user?.avatar} sx={{ width: 40, height: 40, bgcolor: '#696cff' }}>
            <AccountCircle />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#a1a3b1', textTransform: 'capitalize' }}>
              {user?.role || 'Role'}
            </Typography>
          </Box>
        </Box>

        <List sx={{ px: 1, py: 2 }}>
          {getMenuItems().map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '8px',
                    color: isSelected ? '#ffffff' : '#c2c4d1',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.02)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isSelected ? '#ffffff' : '#c2c4d1',
                    minWidth: 40,
                    bgcolor: isSelected ? '#7367f0' : 'transparent',
                    p: isSelected ? 0.6 : 0,
                    borderRadius: isSelected ? 1.5 : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isSelected ? 32 : 'auto',
                    height: isSelected ? 32 : 'auto',
                    mr: isSelected ? 1.5 : 2,
                    boxShadow: isSelected ? '0 2px 6px rgba(115, 103, 240, 0.4)' : 'none'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem', 
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#ffffff' : '#c2c4d1'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
          transition: 'width 0.3s'
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>
    </Box>
  )
}

export default MainLayout
