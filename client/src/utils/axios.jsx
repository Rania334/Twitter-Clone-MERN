// src/utils/axios.js
/* eslint-env browser */
import axios from 'axios';
import { store } from '../app/store';
import { setToken, logout } from '../features/auth/authSlice';

const instance = axios.create({
  baseURL: 'https://mern-backend-o9nj.onrender.com/api',
  withCredentials: true, // send cookies like refresh token
});

// Automatically attach access token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Handle 403 errors and try refresh token
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('Access token expired. Attempting to refresh...');

      try {
        const res = await instance.post('/auth/refresh-token');
        const newAccessToken = res.data.accessToken;

        if (newAccessToken) {
          // Save new token
          localStorage.setItem('token', newAccessToken);
          store.dispatch(setToken(newAccessToken));

          // Retry the original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } else {
          throw new Error('No accessToken in refresh response');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
