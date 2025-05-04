import React from 'react';
import { Box, Typography, Button, Avatar, Divider, Container, Stack, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import XLogo from '../assets/logo.png'; // Add your logo here

export default function Landing() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white' }}>
      {/* Left Side Logo */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={XLogo} alt="X Logo" style={{ width: '200px' }} />
      </Box>

      {/* Right Side Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xs">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Happening now
          </Typography>
          <Typography variant="h5" fontWeight="medium" sx={{ mt: 2, mb: 3 }}>
            Join today.
          </Typography>

          {/* Google sign in */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Avatar sx={{ width: 24, height: 24 }}>R</Avatar>}
            sx={{ mb: 2, textTransform: 'none' }}
          >
            Sign in as Rania
          </Button>

          {/* Apple sign in */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AppleIcon />}
            sx={{ mb: 2, textTransform: 'none' }}
          >
            Sign up with Apple
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          {/* Create Account */}
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 2, textTransform: 'none', fontWeight: 'bold' }}
          >
            Create account
          </Button>

          <Typography sx={{ fontSize: '12px', color: 'gray', mb: 3 }}>
            By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
          </Typography>

          {/* Sign in link */}
          <Typography variant="body2">
            Already have an account?
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1, textTransform: 'none' }}
          >
            Sign in
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
