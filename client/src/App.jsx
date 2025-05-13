import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from './features/auth/authSlice';

import Login from './Pages/Login';
import Home from './Pages/Home';
import EditProfilePage from './Pages/EditProfilePage';
import UploadForm from './Pages/upload';
import TweetDetails from './Components/TweetDetails/TweetDetails';
import UserProfilePage from './Pages/UserProfilePage';

import LeftSidebar from './Components/Left Sidebar';
import RightSidebar from './Components/Right Sidebar';
import { setUser } from './features/auth/authSlice';
import axios from './utils/axios'; // your Axios instance
import { Box } from '@mui/material';
import './App.css';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { jwtDecode } from 'jwt-decode';

function App() {
  const dispatch = useDispatch();
  // const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(setToken(storedToken));
      const decoded = jwtDecode(storedToken);
      const username = decoded?.username;
  
      if (username) {
        axios.get(`/user/getUser/${username}`)
          .then(res => {
            dispatch(setUser(res.data));
          })
          .catch(err => {
            console.error('Failed to fetch user:', err);
          });
      }
    }
  }, [dispatch]);
  return (
    <Routes>
      {/* Public Route: Login */}
      <Route path="/" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      {/* Protected Routes with Sidebar */}
      <Route path="/*" element={
        <ProtectedRoute>
          <Box sx={{ display: 'flex', height: '100vh' }}>
            <LeftSidebar />
            <Box sx={{ flex: 1, p: 2 }}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/upload" element={<UploadForm />} />
                <Route path="/tweet/:id" element={<TweetDetails />} />
                <Route path="/profile/:username" element={<UserProfilePage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />

                </Routes>
            </Box>
            <RightSidebar />
          </Box>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
