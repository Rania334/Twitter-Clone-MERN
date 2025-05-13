import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  InputLabel,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../utils/axios';
import VerifyPopup from './VerifyPopup';

const RegisterPopup = ({ open, onClose }) => {
  const [showVerification, setShowVerification] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);
  const [wallpaperPreview, setWallpaperPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ mode: 'onBlur' }); // Validate on field blur

  const onSubmit = async (data) => {
    setServerError('');
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (data.profilePic?.[0]) formData.append('profilePic', data.profilePic[0]);
    if (data.wallpaper?.[0]) formData.append('wallpaper', data.wallpaper[0]);

    try {
      setLoading(true);
      await axios.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmailToVerify(data.email);
      setShowVerification(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setValue('profilePic', e.target.files);
    if (file) setProfilePreview(URL.createObjectURL(file));
  };

  const handleWallpaperChange = (e) => {
    const file = e.target.files[0];
    setValue('wallpaper', e.target.files);
    if (file) setWallpaperPreview(URL.createObjectURL(file));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 10,
          backgroundColor: '#fefefe',
          px: 2,
          py: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', textAlign: 'center' }}>
        Create your account
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12, color: 'grey.600' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ mb: 2 }} />

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          sx={{ px: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {serverError && (
            <Typography
              variant="body2"
              sx={{ color: 'error.main', textAlign: 'center', fontWeight: 500 }}
            >
              {serverError}
            </Typography>
          )}

          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
            onBlur={() => trigger('name')}
          />

          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
            onBlur={() => trigger('username')}
          />

          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Invalid email format',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            onBlur={() => trigger('email')}
          />

          <TextField
            label="Password"
            fullWidth
            type="password"
            variant="outlined"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            onBlur={() => trigger('password')}
          />

          <Box>
            <InputLabel shrink sx={{ fontWeight: 500 }}>
              Profile Picture
            </InputLabel>
            <input type="file" accept="image/*" onChange={handleProfilePicChange} />
            {profilePreview && (
              <Box mt={1} display="flex" justifyContent="center">
                <Avatar src={profilePreview} sx={{ width: 64, height: 64 }} />
              </Box>
            )}
          </Box>

          <Box>
            <InputLabel shrink sx={{ fontWeight: 500 }}>
              Wallpaper (Background Image)
            </InputLabel>
            <input type="file" accept="image/*" onChange={handleWallpaperChange} />
            {wallpaperPreview && (
              <Box
                mt={1}
                sx={{
                  height: 100,
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundImage: `url(${wallpaperPreview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, fontWeight: 600, borderRadius: 2, py: 1.2, boxShadow: 3 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </DialogContent>

      <VerifyPopup
        open={showVerification}
        email={emailToVerify}
        onClose={() => {
          setShowVerification(false);
          onClose();
        }}
      />
    </Dialog>
  );
};

export default RegisterPopup;
