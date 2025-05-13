import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const VerifyPopup = ({ open, email, onClose }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!code.trim()) {
      alert('Please enter the verification code.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/auth/verify-email', {
        verificationKey: code,
        email,
      });

      if (response.status === 200) {
        alert('Email verified successfully!');
        onClose();
        navigate('/home');
      } else {
        alert('Verification failed. Please check the code and try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          px: 4,
          py: 6,
          width: '100%',
          maxWidth: 500,
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center' }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <Typography fontSize={32} fontWeight="bold">X</Typography>
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          We sent you a code
        </Typography>

        <Typography variant="body2" color="textSecondary" mb={3}>
          Enter it below to verify <strong>{email}</strong>.
        </Typography>

        <TextField
          fullWidth
          label="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />

        <Box mt={1} mb={3}>
          <Link href="#" underline="hover" variant="body2">
            Didn’t receive email?
          </Link>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleVerify}
          disabled={!code.trim() || loading}
          sx={{ height: 45 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyPopup;
