import axios from 'axios';
import { getAccessToken, getRefreshToken, storeTokens, isTokenExpired } from '../utils/tokenHelpers';

// Create axios instance with defaults
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Don't add token for auth endpoints
    if (config.url.includes('token') || config.url.includes('register')) {
      return config;
    }
    
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh the token
      const refreshToken = getRefreshToken();
      if (refreshToken && isTokenExpired()) {
        try {
          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}/api/token/refresh/`,
            { refresh: refreshToken }
          );
          
          // Store the new token
          const { access } = response.data;
          storeTokens(access, refreshToken);
          
          // Update the header and retry
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, user needs to login again
          window.dispatchEvent(new CustomEvent('auth:logout'));
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;