// Components/MainLayout.jsx
import React from 'react';
import { Box } from '@mui/material';
import LeftSidebar from './Left Sidebar';
import RightSidebar from './Right Sidebar';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <LeftSidebar />
      <Box sx={{ flex: 1, p: 2, ml: '260px' }}>
        {children}
      </Box>
      <RightSidebar />
    </Box>
  );
};

export default MainLayout;
