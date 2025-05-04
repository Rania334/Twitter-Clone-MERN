// Layout.js or Layout.jsx
import { Box, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar'; // create if not already
import RightSidebar from './RightSidebar';

const Layout = () => {
  const isMediumUp = useMediaQuery('(min-width:900px)');

  return (
    <Box display="flex" minHeight="100vh">
      {/* Left Sidebar */}
      <Box
        sx={{
          width: { xs: 60, sm: 80, md: 250 },
          px: 2,
          py: 2,
          borderRight: '1px solid #ddd',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 10,
        }}
      >
        <LeftSidebar />
      </Box>

      {/* Main Center Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 60, sm: 80, md: 250 },
          marginRight: { md: isMediumUp ? 300 : 0 },
          px: 2,
          pt: 3,
          width: '100%',
        }}
      >
        <Outlet /> {/* Your page content will be rendered here */}
      </Box>

      {/* Right Sidebar (only on medium+ screens) */}
      {isMediumUp && (
        <Box
          sx={{
            width: 300,
            px: 2,
            py: 2,
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: '#fff',
            borderLeft: '1px solid #ddd',
          }}
        >
          <RightSidebar />
        </Box>
      )}
    </Box>
  );
};

export default Layout;
