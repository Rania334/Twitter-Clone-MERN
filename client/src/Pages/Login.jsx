import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/auth/authSlice'; // ✅ Updated import
import { setUser } from '../features/auth/authSlice'; // ✅ Updated import
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
      const res = await axios.post(
        '/auth/login',
        { email, password },
        { withCredentials: true }
      );
      console.log(res.data);
      const token = res.data.accessToken;

      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token received from server');
      }


      try {
        if (!token || typeof token !== 'string') {
          throw new Error('Invalid token');
        }

        const decoded = jwtDecode(token);
        console.log(decoded.username);
      } catch (err) {
        console.error('Failed to decode JWT:', err.message);
        alert('Invalid token received. Please try logging in again.');
        return;
      }


      const user = res.data.user.id;
      // console.log(res.data)


      // ✅ Save token to Redux and localStorage
      dispatch(setToken(token)); // Updated action name
      dispatch(setUser(user));


      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ width: 300, mx: 'auto', mt: 10 }}>
      <Typography variant="h5">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" fullWidth type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
      <Button
        onClick={() => setOpenRegister(true)}
        fullWidth
        variant="text"
        sx={{ mt: 1 }}
      >
        Don't have an account? Sign up
      </Button>

      <RegisterPopup open={openRegister} onClose={() => setOpenRegister(false)} />
    </Box>
  );
};

export default Login;
