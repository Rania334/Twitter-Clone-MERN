import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box } from '@mui/material';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const VerifyPopup = ({ open, email, onClose }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!code) {
      alert('Please enter the verification code.');
      return;
    }

    try {
      setLoading(true);
      // Send the verification code and email to the backend for validation
      const response = await axios.post('/auth/verify-email', { verificationKey: code, email });
      console.log(response);
      console.log(response.data);
      console.log(response.data.success);
      

      if (response.status === 200) {
        alert('Email verified successfully!');
        onClose(); // Close the verification popup
        navigate('/home'); // Redirect to home page
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify your Email</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
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
