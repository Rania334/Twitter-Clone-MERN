import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Avatar, Typography, Divider, IconButton, Stack
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const EditProfilePage = () => {
    const { token, user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        profilePic: '',
        wallpaper: '',
    });

    const [previewProfilePic, setPreviewProfilePic] = useState('');
    const [previewWallpaper, setPreviewWallpaper] = useState('');

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

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        const newFormData = { ...formData, [`${type}File`]: file };
        setFormData(newFormData);

        // Set preview images
        if (type === 'profilePic' && file) {
            setPreviewProfilePic(URL.createObjectURL(file));
        }
        if (type === 'wallpaper' && file) {
            setPreviewWallpaper(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("bio", formData.bio);
            if (formData.profilePicFile) form.append("profilePic", formData.profilePicFile);
            if (formData.wallpaperFile) form.append("wallpaper", formData.wallpaperFile);

            const res = await axios.put('/user/update', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
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
            {/* Wallpaper Preview Section */}
            <Box
                sx={{
                    width: '100%',
                    height: 200,
                    backgroundImage: `url(${previewWallpaper || formData.wallpaper})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                }}
            >
                <IconButton
                    onClick={() => navigate(`/profile/${user.username}`)}
                    sx={{ position: 'absolute', right: 12, top: 12, color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Wallpaper Upload Icon */}
                <Box component="label" sx={{ position: 'absolute', bottom: 12, right: 12, zIndex: 2 }}>
                    <PhotoCameraIcon sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 1, p: 0.5 }} />
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleFileChange(e, 'wallpaper')}
                    />
                </Box>
            </Box>

            {/* Profile Picture Upload Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: -6 }}>
                <label htmlFor="profilePic-input">
                    <Avatar
                        sx={{ width: 120, height: 120, border: '3px solid white' }}
                        src={previewProfilePic || formData.profilePic}
                    >
                        {!previewProfilePic && <PhotoCameraIcon sx={{ fontSize: 32, color: 'gray' }} />}
                    </Avatar>
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        id="profilePic-input"
                        onChange={(e) => handleFileChange(e, 'profilePic')}
                    />
                </label>
            </Box>

            {/* Profile Edit Form */}
            <form onSubmit={handleSubmit}>
                <Typography variant="h5" mb={2} textAlign="center">Edit Profile</Typography>
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

                <Button variant="contained" type="submit" sx={{ mt: 2, width: '100%' }}>
                    Save Changes
                </Button>
            </form>
        </Box>
    );
};

export default EditProfilePage;
