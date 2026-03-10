import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Avatar
} from '@mui/material';
import {
  Face,
  Videocam,
  CheckCircle,
  ReportProblem,
  Fingerprint
} from '@mui/icons-material';

const BiometricVerify = ({ onVerified, open, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, scanning, success, error
  const videoRef = useRef(null);

  useEffect(() => {
    if (open && status === 'idle') {
      startScan();
    }
  }, [open]);

  const startScan = () => {
    setScanning(true);
    setStatus('scanning');
    
    // Simulate AI Face Detection logic
    setTimeout(() => {
        // Mock successful detection
        setStatus('success');
        setScanning(false);
        setTimeout(() => {
            onVerified();
        }, 1500);
    }, 3000);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 8, p: 2, textAlign: 'center' } }}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: '300px' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>AI Biometric Identity Check</Typography>
        
        <Box sx={{ 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            border: `4px solid ${status === 'success' ? '#4caf50' : status === 'scanning' ? '#2f80ed' : '#eee'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#f5f5f5'
        }}>
            {status === 'scanning' ? (
                <>
                    <CircularProgress size={190} thickness={1} sx={{ position: 'absolute', color: '#2f80ed' }} />
                    <Face sx={{ fontSize: 100, color: '#2f80ed', opacity: 0.5 }} />
                    <Box className="scan-line" sx={{ 
                        position: 'absolute', 
                        width: '100%', 
                        height: '2px', 
                        bgcolor: '#2f80ed',
                        top: 0,
                        animation: 'scan 2s linear infinite'
                    }} />
                </>
            ) : status === 'success' ? (
                <CheckCircle sx={{ fontSize: 80, color: '#4caf50' }} />
            ) : (
                <Fingerprint sx={{ fontSize: 80, color: '#ccc' }} />
            )}
        </Box>

        <Box>
            <Typography sx={{ fontWeight: 700 }}>
                {status === 'scanning' ? 'Scanning face...' : status === 'success' ? 'Identity Verified!' : 'Align your face'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
                {status === 'scanning' ? 'Detecting facial anchors for security' : 'Encrypted biometric handshake in progress'}
            </Typography>
        </Box>

        <style>
            {`
                @keyframes scan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
            `}
        </style>
      </DialogContent>
    </Dialog>
  );
};

export default BiometricVerify;
