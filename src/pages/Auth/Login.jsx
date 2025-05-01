import React, { useState } from 'react';
import { Box, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Submitting login with:", values);
      const result = await login(values);
      console.log("Login result:", result);
      
      if (result.success) {
        // a small delay before navigation to ensure state is updated
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
      } else {
        setError(result.error || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <LoginForm 
        onSubmit={handleSubmit} 
        loading={loading} 
        error={error} 
      />
    </Box>
  );
};

export default Login;