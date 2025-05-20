import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider, useDispatch } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme/theme';
import router from './router';
import store from './store';
import { checkTokenValidity } from './features/auth/authSlice';
import { fetchUserProfile } from './features/profile/profileSlice';

const AppContent = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check token validity on app startup
    dispatch(checkTokenValidity());
    
    // If there's a token, also try to fetch user profile
    const token = localStorage.getItem('access_token');
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);
  
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <RouterProvider router={router} />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;