import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const RegisterForm = ({ onSubmit, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      password2: '',
      first_name: '',
      last_name: '',
      user_type: 'farmer',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/(?=.*[a-zA-Z])(?=.*[0-9])/, 'Password must contain at least one letter and one number')
        .required('Password is required'),
      password2: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
      first_name: Yup.string()
        .required('First name is required'),
      last_name: Yup.string()
        .required('Last name is required'),
      user_type: Yup.string()
        .oneOf(['farmer', 'buyer'], 'Invalid user type')
        .required('User type is required'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Box>
      <Typography component="h1" variant="h5" textAlign="center" gutterBottom>
        Create an Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' 
            ? error 
            : error.email
              ? `Email: ${error.email}`
              : 'Registration failed. Please try again.'
          }
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              autoComplete="given-name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.first_name && Boolean(formik.errors.first_name)}
              helperText={formik.touched.first_name && formik.errors.first_name}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              autoComplete="family-name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.last_name && Boolean(formik.errors.last_name)}
              helperText={formik.touched.last_name && formik.errors.last_name}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
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
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="password2"
              autoComplete="new-password"
              value={formik.values.password2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password2 && Boolean(formik.errors.password2)}
              helperText={formik.touched.password2 && formik.errors.password2}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.user_type && Boolean(formik.errors.user_type)}>
              <InputLabel id="user-type-label">I am a</InputLabel>
              <Select
                labelId="user-type-label"
                id="user_type"
                name="user_type"
                value={formik.values.user_type}
                label="I am a"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              >
                <MenuItem value="farmer">Farmer</MenuItem>
                <MenuItem value="buyer">Buyer</MenuItem>
              </Select>
              {formik.touched.user_type && formik.errors.user_type && (
                <FormHelperText>{formik.errors.user_type}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          loading={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              Already have an account? Sign in
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;