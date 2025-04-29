import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/forms/RegisterForm';
import { useRegisterMutation } from '../../features/auth/authApi';

const Register = () => {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setError(null);
      
      await registerUser(values).unwrap();
      
      // Show success message and redirect to login
      navigate('/login', { 
        state: { 
          registrationSuccess: true, 
          email: values.email 
        } 
      });
    } catch (err) {
      console.error('Registration error:', err);
      if (err.data) {
        setError(err.data);
      } else {
        setError('Registration failed. Please try again later.');
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <RegisterForm 
        onSubmit={handleSubmit} 
        loading={isLoading} 
        error={error} 
      />
    </Box>
  );
};

export default Register;