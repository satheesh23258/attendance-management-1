import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  IconButton,
  MenuItem
} from '@mui/material'
import {
  ArrowBack,
  Save,
  Refresh,
  Settings,
  Security,
  Notifications,
  Storage,
  Language,
  Email,
  Phone,
  Business
} from '@mui/icons-material'

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'Employee Management System',
    companyLogo: '/logo.png',
    timezone: 'UTC-5',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',

    // Security Settings
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireTwoFactor: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    digestFrequency: 'daily',

    // System Settings
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'INFO',
    backupFrequency: 'daily',
    retentionDays: 90,

    // Email Settings
    smtpHost: 'smtp.company.com',
    smtpPort: 587,
    smtpUsername: 'noreply@company.com',
    smtpPassword: '••••••••',
    emailFrom: 'noreply@company.com',

    // Company Settings
    companyName: 'Tech Company Inc.',
    companyAddress: '123 Business St, New York, NY 10001',
    companyPhone: '+1 (555) 123-4567',
    companyEmail: 'info@company.com',
    companyWebsite: 'https://company.com'
  })

  const [showSaveAlert, setShowSaveAlert] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleBack = () => {
    window.history.back()
  }

  const handleSave = () => {
    // Simulate saving settings
    setShowSaveAlert(true)
    setTimeout(() => setShowSaveAlert(false), 3000)
  }

  const handleReset = () => {
    setShowResetDialog(true)
  }

  const confirmReset = () => {
    // Reset to default values
    setSettings({
      systemName: 'Employee Management System',
      companyLogo: '/logo.png',
      timezone: 'UTC-5',
      language: 'English',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12-hour',
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireTwoFactor: true,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      digestFrequency: 'daily',
      maintenanceMode: false,
      debugMode: false,
      logLevel: 'INFO',
      backupFrequency: 'daily',
      retentionDays: 90,
      smtpHost: 'smtp.company.com',
      smtpPort: 587,
      smtpUsername: 'noreply@company.com',
      smtpPassword: '••••••••',
      emailFrom: 'noreply@company.com',
      companyName: 'Tech Company Inc.',
      companyAddress: '123 Business St, New York, NY 10001',
      companyPhone: '+1 (555) 123-4567',
      companyEmail: 'info@company.com',
      companyWebsite: 'https://company.com'
    })
    setShowResetDialog(false)
    setShowSaveAlert(true)
  }

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleSimpleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        background: '#00c853',
        color: 'white',
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={handleBack}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              System Settings
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Configure global system parameters and security
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Refresh />}
            onClick={handleReset}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{
              bgcolor: 'white',
              color: '#000000',
              fontWeight: 600,
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {showSaveAlert && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        {/* General Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Settings />
              General Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="System Name"
                  value={settings.systemName}
                  onChange={(e) => handleSimpleChange('systemName', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSimpleChange('timezone', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Language"
                  value={settings.language}
                  onChange={(e) => handleSimpleChange('language', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date Format"
                  value={settings.dateFormat}
                  onChange={(e) => handleSimpleChange('dateFormat', e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security />
              Security Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSimpleChange('sessionTimeout', parseInt(e.target.value))}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password Min Length"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleSimpleChange('passwordMinLength', parseInt(e.target.value))}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Login Attempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSimpleChange('maxLoginAttempts', parseInt(e.target.value))}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lockout Duration (minutes)"
                  type="number"
                  value={settings.lockoutDuration}
                  onChange={(e) => handleSimpleChange('lockoutDuration', parseInt(e.target.value))}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.requireTwoFactor}
                      onChange={(e) => handleSimpleChange('requireTwoFactor', e.target.checked)}
                    />
                  }
                  label="Require Two-Factor Authentication"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Notifications />
              Notification Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSimpleChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSimpleChange('smsNotifications', e.target.checked)}
                    />
                  }
                  label="SMS Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSimpleChange('pushNotifications', e.target.checked)}
                    />
                  }
                  label="Push Notifications"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Digest Frequency"
                  value={settings.digestFrequency}
                  onChange={(e) => handleSimpleChange('digestFrequency', e.target.value)}
                  margin="normal"
                  select
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Storage />
              System Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSimpleChange('maintenanceMode', e.target.checked)}
                    />
                  }
                  label="Maintenance Mode"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.debugMode}
                      onChange={(e) => handleSimpleChange('debugMode', e.target.checked)}
                    />
                  }
                  label="Debug Mode"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Log Level"
                  value={settings.logLevel}
                  onChange={(e) => handleSimpleChange('logLevel', e.target.value)}
                  margin="normal"
                  select
                >
                  <MenuItem value="DEBUG">DEBUG</MenuItem>
                  <MenuItem value="INFO">INFO</MenuItem>
                  <MenuItem value="WARNING">WARNING</MenuItem>
                  <MenuItem value="ERROR">ERROR</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Backup Frequency"
                  value={settings.backupFrequency}
                  onChange={(e) => handleSimpleChange('backupFrequency', e.target.value)}
                  margin="normal"
                  select
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Log Retention Days"
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) => handleSimpleChange('retentionDays', parseInt(e.target.value))}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email />
              Email Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP Host"
                  value={settings.smtpHost}
                  onChange={(e) => handleSimpleChange('smtpHost', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP Port"
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => handleSimpleChange('smtpPort', parseInt(e.target.value))}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP Username"
                  value={settings.smtpUsername}
                  onChange={(e) => handleSimpleChange('smtpUsername', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP Password"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => handleSimpleChange('smtpPassword', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="From Email"
                  value={settings.emailFrom}
                  onChange={(e) => handleSimpleChange('emailFrom', e.target.value)}
                  margin="normal"
                  type="email"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Company Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business />
              Company Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={settings.companyName}
                  onChange={(e) => handleSimpleChange('companyName', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Phone"
                  value={settings.companyPhone}
                  onChange={(e) => handleSimpleChange('companyPhone', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Address"
                  value={settings.companyAddress}
                  onChange={(e) => handleSimpleChange('companyAddress', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Email"
                  value={settings.companyEmail}
                  onChange={(e) => handleSimpleChange('companyEmail', e.target.value)}
                  margin="normal"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Website"
                  value={settings.companyWebsite}
                  onChange={(e) => handleSimpleChange('companyWebsite', e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleReset}
              >
                Reset to Defaults
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save All Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings to their default values? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={confirmReset} color="error">
            Reset All Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SystemSettings
