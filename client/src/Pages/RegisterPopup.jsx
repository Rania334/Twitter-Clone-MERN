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

const RegisterPopup = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset ,setValue} = useForm();

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
      await axios.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Registration successful!');
      reset();
      onClose();
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
            {...register('name')}
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
            {...register('email')}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password')}
            margin="normal"
            required
          />

          <Box mt={2}>
            <InputLabel>Profile Picture</InputLabel>
            <input type="file" {...register('profilePic')} accept="image/*" />
          </Box>

          <Box mt={2}>
            <InputLabel>Wallpaper (Background Image)</InputLabel>
            <input type="file" name="wallpaper" accept="image/*" onChange={(e) => setValue('wallpaper', e.target.files)}/>

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
    </Dialog>
  );
};

export default RegisterPopup;
