import React from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Container
} from '@mui/material'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import MainLayout from '../layouts/MainLayout'

const DashboardLayout = ({ children, title }) => {
  const location = useLocation()
  const { colors } = useTheme()

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x)
    
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.875rem' }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1
          
          return isLast ? (
            <Typography key={name} color="text.primary" sx={{ fontWeight: 500 }}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
          ) : (
            <MuiLink
              component={Link}
              to={routeTo}
              underline="hover"
              color="inherit"
              key={name}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </MuiLink>
          )
        })}
      </Breadcrumbs>
    )
  }

  return (
    <MainLayout>
      <Box sx={{ flex: 1, backgroundColor: colors.background.default }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Top Breadcrumbs specific to dashboard pages */}
          <Box sx={{ mb: 3 }}>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 0.5 }}>
                {title}
              </Typography>
            )}
            {generateBreadcrumbs()}
          </Box>
          {children || <Outlet />}
        </Container>
      </Box>
    </MainLayout>
  )
}

export default DashboardLayout
