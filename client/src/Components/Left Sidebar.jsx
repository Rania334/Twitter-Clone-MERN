import React, { useState } from 'react';
import {
  Box, Avatar, Typography, Button, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem
} from '@mui/material';
import {
  Home, Search, NotificationsNone, MailOutline,
  BookmarkBorder, ListAlt, PersonOutline, MoreHoriz
} from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const user = useSelector((state) => state.auth.user);

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
    { label: 'Home', icon: <Home />, path: '/' },
    { label: 'Explore', icon: <Search />, path: '/explore' },
    { label: 'Notifications', icon: <NotificationsNone />, path: '/notifications' },
    { label: 'Messages', icon: <MailOutline />, path: '/messages' },
    { label: 'Bookmarks', icon: <BookmarkBorder />, path: '/bookmarks' },
    { label: 'Lists', icon: <ListAlt />, path: '/lists' },
    { label: 'Profile', icon: <PersonOutline />, path: `/profile/${user?.username}` },
    { label: 'More', icon: <MoreHoriz />, path: '#' },
  ];

  return (
    <Box
      sx={{
        width: { xs: 64,sm: 64, md: 180 },
        px: { xs: 0, sm: 0, md: 0,lg:18 },
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'fixed',
      }}
    >
      <Box>
        <Box sx={{ mb: 2, mt: 1, display: 'flex', justifyContent: 'center' }}>
          <XIcon sx={{ fontSize: 32 }} />
        </Box>

        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{ borderRadius: '50px', justifyContent: { xs: 'center',sm: 'center', md: 'flex-start' } }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ display: { xs:'none', sm: 'none', md: 'block' }, ml: 2 }}
                  primaryTypographyProps={{ fontSize: 18, fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: 'black',
            borderRadius: '50px',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: 16,
            py: 1.5,
            mt: 2,
            minWidth: { xs: 48,sm: 48, md: 'auto' },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Typography sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>Post</Typography>
          <XIcon sx={{ display: { xs: 'block',sm: 'block', md: 'none' } }} />
        </Button>
      </Box>

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
              justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' },
            }}
          >
            <Avatar src={user.profilePic || ''} sx={{ width: 40, height: 40, mr: { sm: 0, xs: 0 } }} />
            <Box sx={{ display: { xs: 'none',sm: 'none', md: 'block' } }}>
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
