import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material'
import {
  Person,
  Settings,
  Logout,
  AdminPanelSettings,
  People,
  Badge
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const UserProfile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    handleMenuClose()
    navigate('/profile')
  }

  const handleSettings = () => {
    handleMenuClose()
    navigate('/settings')
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
    navigate('/')
  }

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <AdminPanelSettings />
      case 'hr':
        return <People />
      case 'employee':
        return <Person />
      default:
        return <Person />
    }
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '#000000' // Red
      case 'hr':
        return '#f57c00' // Yellow/Orange
      case 'employee':
        return '#00c853' // Blue
      case 'hybrid':
        return '#000000' // Purple
      default:
        return '#64748b' // Gray
    }
  }

  const getRoleLabel = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrator'
      case 'hr':
        return 'HR Manager'
      case 'employee':
        return 'Employee'
      case 'hybrid':
        return 'Hybrid User'
      default:
        return 'User'
    }
  }

  if (!user) return null

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton
        onClick={handleMenuOpen}
        size="small"
        sx={{
          padding: 1,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: getRoleColor(user.role),
            border: '2px solid #ffffff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {getRoleIcon(user.role)}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 240,
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            '& .MuiAvatar-root': {
              ml: -0.5,
              mr: 1
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: getRoleColor(user.role)
              }}
            >
              {getRoleIcon(user.role)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#000000' }}>
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Chip
                  label={getRoleLabel(user.role)}
                  size="small"
                  sx={{
                    backgroundColor: getRoleColor(user.role),
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    height: 20
                  }}
                />
                {user.role === 'hybrid' && (
                  <Badge
                    badgeContent="HYBRID"
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.6rem',
                        height: 16,
                        minWidth: 16
                      }
                    }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Menu Items */}
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default UserProfile
