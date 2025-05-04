import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import UploadForm from './Pages/upload';
// import { useDispatch } from 'react-redux';
// import { setToken } from './features/auth/authSlice';
// import TweetDetails from './Pages/TweetDetails';
import TweetDetails from './Components/TweetDetails/TweetDetails';
// import LeftSidebar from './Components/Left Sidebar';
// import RightSidebar from './Components/Right Sidebar';
import UserProfilePage from './Pages/UserProfilePage';
import { Box } from '@mui/material';
import './App.css'



function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {

  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     dispatch(setToken(token)); // Pass token directly, not in an object
  //   }
  // }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* <LeftSidebar /> */}
      <Box sx={{ flex: 1, p: 2, ml: '0px' }}>


      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/home" element={<Home />} /> */}
        {/* <Route path="/upload" element={<UploadForm />} /> */}
        {/* <Route path="/tweet/:id" element={<TweetDetails />} /> New route */}
        {/* <Route path="/userPro" element={<UserProfilePage />} /> */}

      </Routes>
      </Box>
      {/* <RightSidebar /> */}

    </Box>
  );
}

export default App;
