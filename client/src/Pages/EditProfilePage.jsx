import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Avatar, Typography
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const { token, user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profilePic: '',
    wallpaper: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/user/getUser/${user.username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          name: res.data.name || '',
          bio: res.data.bio || '',
          profilePic: res.data.profilePic || '',
          wallpaper: res.data.wallpaper || '',
        });
      } catch (err) {
        console.error('Failed to load user data', err);
      }
    };

    fetchProfile();
  }, [user.username, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/user/update', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated!');
      navigate(`/profile/${res.data.user.username}`);
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" mb={2}>Edit Profile</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth margin="normal"
          label="Name" name="name"
          value={formData.name} onChange={handleChange}
        />
        <TextField
          fullWidth multiline rows={3}
          margin="normal"
          label="Bio" name="bio"
          value={formData.bio} onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal"
          label="Profile Picture URL" name="profilePic"
          value={formData.profilePic} onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal"
          label="Wallpaper URL" name="wallpaper"
          value={formData.wallpaper} onChange={handleChange}
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditProfilePage;
