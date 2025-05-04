// src/utils/axios.js
import axios from 'axios';
import {store} from '../app/store'; // adjust path as needed
import { setToken, logout } from '../features/auth/authSlice';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Token expired, try refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await instance.post('/auth/refresh-token'); // calls backend
        const newAccessToken = res.data.accessToken;

        // Update localStorage and Redux
        localStorage.setItem('token', newAccessToken);
        store.dispatch(setToken({ token: newAccessToken }));

        // Update header & retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Attach access token for every request
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
