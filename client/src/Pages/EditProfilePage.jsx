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
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData(prev => ({ ...prev, profilePicFile: e.target.files[0] }))}
                    style={{ marginTop: '16px' }}
                />
                <Typography variant="caption">Profile Picture</Typography>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData(prev => ({ ...prev, wallpaperFile: e.target.files[0] }))}
                    style={{ marginTop: '16px' }}
                />
                <Typography variant="caption">Wallpaper</Typography>

                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                    Save Changes
                </Button>
            </form>
        </Box>
    );
};

export default EditProfilePage;
