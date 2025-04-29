import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        // This would connect to your password reset endpoint
        // For now, we'll simulate a successful submission
        setTimeout(() => {
          setSubmitted(true);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to process your request. Please try again.');
        setLoading(false);
      }
    },
  });

  return (
    <Box>
      <Typography component="h1" variant="h5" textAlign="center" gutterBottom>
        Reset Your Password
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {submitted ? (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            If an account exists with that email address, we've sent password reset instructions.
          </Alert>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Return to Login
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
          
          <Button
            startIcon={<ArrowBackIcon />}
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ mt: 1 }}
          >
            Back to Login
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ForgotPassword;