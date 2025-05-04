import React, { useEffect, useState } from 'react';
import axios from '../utils/axios'; // your Axios instance
import {
  Box, Avatar, Typography, Button, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem
} from '@mui/material';
import {
  Home, Search, NotificationsNone, MailOutline,
  BookmarkBorder, ListAlt, PersonOutline, MoreHoriz
} from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Decode token and get username
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const username = decoded?.username;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/getUser/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', icon: <Home /> },
    { label: 'Explore', icon: <Search /> },
    { label: 'Notifications', icon: <NotificationsNone /> },
    { label: 'Messages', icon: <MailOutline /> },
    { label: 'Bookmarks', icon: <BookmarkBorder /> },
    { label: 'Lists', icon: <ListAlt /> },
    { label: 'Profile', icon: <PersonOutline /> },
    { label: 'More', icon: <MoreHoriz /> },
  ];

  return (
    <Box sx={{ width: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', px: 21, py: 1, position: 'fixed' }}>
      <Box>
        <Box sx={{ mb: 2, mt: 1 }}>
          <XIcon sx={{ fontSize: 32 }} />
        </Box>

        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton sx={{ borderRadius: '50px', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 18, fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: 'black', borderRadius: '50px', textTransform: 'none', fontWeight: 'bold', fontSize: 16, py: 1.5, mt: 2 }}
        >
          Post
        </Button>
      </Box>

      {/* Avatar with Dropdown */}
      {user && (
        <>
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
              mb: 1,
              p: 1,
              borderRadius: '50px',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)', cursor: 'pointer' },
            }}
          >
            <Avatar src={user.profilePic || ''} sx={{ width: 40, height: 40, mr: 1 }} />
            <Box>
              <Typography variant="body1" fontWeight="bold">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">@{user.username}</Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                borderRadius: 2,
                mt: 1,
                minWidth: 150,
              },
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default LeftSidebar;
