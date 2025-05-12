import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputLabel,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../utils/axios';
import VerifyPopup from './VerifyPopup';

const RegisterPopup = ({ open, onClose }) => {
  const [showVerification, setShowVerification] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState('');

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (data.profilePic[0]) formData.append('profilePic', data.profilePic[0]);
    if (data.wallpaper[0]) formData.append('wallpaper', data.wallpaper[0]);

    try {
      setLoading(true);
      // Sending registration data to the backend
      await axios.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmailToVerify(data.email); // Store email to send it for verification
      setShowVerification(true); // Show verification popup
    } catch (err) {
      console.error(err);
      alert('Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Create your account
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <TextField
            fullWidth
            label="Name"
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Username"
            {...register('username')}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              }
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            required
          />

          <Box mt={2}>
            <InputLabel>Profile Picture</InputLabel>
            <input type="file" {...register('profilePic')} accept="image/*" />
          </Box>

          <Box mt={2}>
            <InputLabel>Wallpaper (Background Image)</InputLabel>
            <input type="file" name="wallpaper" accept="image/*" onChange={(e) => setValue('wallpaper', e.target.files)} />
          </Box>

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>
        </form>
      </DialogContent>
      <VerifyPopup
        open={showVerification}
        email={emailToVerify}
        onClose={() => {
          setShowVerification(false);
          onClose(); // Close parent dialog if needed
        }}
      />
    </Dialog>
  );
};

export default RegisterPopup;
