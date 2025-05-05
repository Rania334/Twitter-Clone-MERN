import React, { useState } from 'react';
import { Grid, Box, Typography, Button, TextField, Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { jwtDecode } from 'jwt-decode';
import RegisterPopup from './RegisterPopup';

const Login = () => {
  const [openRegister, setOpenRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password }, { withCredentials: true });
      const token = res.data.accessToken;

      if (!token || typeof token !== 'string') throw new Error('Invalid token');
      const decoded = jwtDecode(token);
      dispatch(setToken(token));
      dispatch(setUser(res.data.user.id));
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left side logo */}
      <Grid item xs={12} md={6} sx={{ bgcolor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: '180px', fontWeight: 'bold' }}>X</Typography>
      </Grid>

      {/* Right side form */}
      <Grid item xs={12} md={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 400, mx: 'auto' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Happening now</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Join today.</Typography>

          <Button variant="outlined" fullWidth sx={{ mt: 3 }} disabled>
            Sign in as Rania (Google)
          </Button>
          <Button variant="outlined" fullWidth sx={{ mt: 1 }} disabled>
            Sign up with Apple
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Login
            </Button>
          </form>

          <Button
            onClick={() => setOpenRegister(true)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, bgcolor: '#1DA1F2' }}
          >
            Create account
          </Button>

          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account?
          </Typography>
          <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
            Sign in
          </Button>
        </Box>
      </Grid>

      <RegisterPopup open={openRegister} onClose={() => setOpenRegister(false)} />
    </Grid>
  );
};

export default Login;
