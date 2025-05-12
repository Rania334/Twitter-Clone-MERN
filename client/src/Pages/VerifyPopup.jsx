// VerifyPopup Component
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box } from '@mui/material';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const VerifyPopup = ({ open, email, onClose }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      setLoading(true);
      // Verify the code with backend
      const response = await axios.get(`/auth/verify-email?token=${code}`);
      alert('Email verified successfully!');
      onClose(); // Close the popup
      navigate('/home'); // Redirect to home page
    } catch (err) {
      console.error(err);
      alert('Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify your Email</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Box>
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyPopup;
