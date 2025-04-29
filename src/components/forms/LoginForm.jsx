import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  FormControlLabel, 
  Checkbox,
  Alert,
  InputAdornment,
  IconButton 
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginForm = ({ onSubmit, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      <Typography component="h1" variant="h5" textAlign="center" gutterBottom>
        Sign in to AgriLink
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'Invalid email or password'}
        </Alert>
      )}
      
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
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
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <FormControlLabel
          control={
            <Checkbox 
              name="remember" 
              color="primary" 
              checked={formik.values.remember}
              onChange={formik.handleChange}
              disabled={loading}
            />
          }
          label="Remember me"
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          loading={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              Forgot password?
            </Typography>
          </Link>
          
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              Don't have an account? Sign up
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;