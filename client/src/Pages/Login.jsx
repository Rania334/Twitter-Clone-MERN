import React, { useState } from 'react';
import { Box, Button, Typography, Divider, Link } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import LoginPopup from './LoginPopup';
import RegisterPopup from './RegisterPopup';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const styleBtn = {
    bgcolor: 'background.paper',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    color: 'rgba(0, 0, 0, 0.78)',
    my: 1,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      height: '100vh',
      width: '100vw',
    }}>
      {/* Left side logo */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 4, md: 0 },
        }}
      >
        <XIcon sx={{ fontSize: { xs: 100, sm: 200, md: 300, lg: 350 } }} />
      </Box>

      {/* Right side content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 500, p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Happening now
          </Typography>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Join today.
          </Typography>

          <Box sx={{ width: '100%' }}>
            <Button variant="outlined" fullWidth sx={styleBtn}>
              <GoogleIcon sx={{ pr: 1 }} />
              Sign in with Google
            </Button>

            <Button variant="outlined" fullWidth sx={styleBtn}>
              <AppleIcon sx={{ pr: 1 }} />
              Sign in with Apple
            </Button>

            <Divider>or</Divider>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                borderRadius: 5,
                textTransform: 'none',
                backgroundColor: '#1d9bf0',
              }}
              onClick={() => setOpenRegister(true)}
            >
              Create account
            </Button>

            <Typography sx={{ mt: 2, fontSize: '.8rem', color: 'gray' }}>
              By signing up, you agree to the{' '}
              <Link href="#" underline="hover" sx={{ color: '#1d9bf0' }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" underline="hover" sx={{ color: '#1d9bf0' }}>
                Privacy Policy
              </Link>
              , including{' '}
              <Link href="#" underline="hover" sx={{ color: '#1d9bf0' }}>
                Cookie Use
              </Link>
              .
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 4 }}>
              Already have an account?
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 1, borderRadius: 5, textTransform: 'none' }}
              onClick={() => setOpenLogin(true)}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Popups */}
      <LoginPopup open={openLogin} onClose={() => setOpenLogin(false)} />
      <RegisterPopup open={openRegister} onClose={() => setOpenRegister(false)} />
    </Box>
  );
};

export default LoginPage;
