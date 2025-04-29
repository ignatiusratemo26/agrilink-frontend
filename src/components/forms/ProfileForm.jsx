import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  Alert,
  InputAdornment,
  Avatar,
  Badge
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import { isValidPhone } from '../../utils/validators';

const ProfileForm = ({ 
  onSubmit, 
  loading, 
  error, 
  initialValues, 
  userType = 'farmer',
  showSuccess = false
}) => {
  const [previewUrl, setPreviewUrl] = useState(initialValues?.profile_image || '');
  const [selectedImage, setSelectedImage] = useState(null);
  
  const validationSchema = userType === 'farmer'
    ? Yup.object({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        phone_number: Yup.string()
          .test('is-valid-phone', 'Invalid phone number', value => !value || isValidPhone(value))
          .required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        farm_size: Yup.number()
          .positive('Farm size must be positive')
          .required('Farm size is required'),
        experience_years: Yup.number()
          .positive('Experience must be positive')
          .integer('Experience must be a whole number')
      })
    : Yup.object({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        phone_number: Yup.string()
          .test('is-valid-phone', 'Invalid phone number', value => !value || isValidPhone(value))
          .required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        company_name: Yup.string().required('Company name is required'),
        business_type: Yup.string().required('Business type is required'),
      });

  const formik = useFormik({
    initialValues: {
      first_name: initialValues?.user?.first_name || initialValues?.first_name || '',
      last_name: initialValues?.user?.last_name || initialValues?.last_name || '',
      phone_number: initialValues?.phone_number || '',
      address: initialValues?.address || '',
      ...(userType === 'farmer' 
        ? {
            farm_size: initialValues?.farm_size || '',
            experience_years: initialValues?.experience_years || '',
          } 
        : {
            company_name: initialValues?.company_name || '',
            business_type: initialValues?.business_type || '',
          }
      )
    },
    validationSchema,
    onSubmit: values => {
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      
      if (selectedImage) {
        formData.append('profile_image', selectedImage);
      }
      
      onSubmit(formData);
    },
    enableReinitialize: true
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'Failed to update profile'}
        </Alert>
      )}
      
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully
        </Alert>
      )}

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 3 
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <label htmlFor="profile-image">
              <input
                accept="image/*"
                id="profile-image"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                disabled={loading}
              />
              <IconButton 
                component="span" 
                sx={{ 
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <PhotoCamera />
              </IconButton>
            </label>
          }
        >
          <Avatar 
            src={previewUrl} 
            sx={{ 
              width: 100, 
              height: 100, 
              border: '2px solid',
              borderColor: 'primary.main' 
            }} 
          />
        </Badge>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Click the camera icon to change profile image
        </Typography>
      </Box>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="first_name"
              name="first_name"
              label="First Name"
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
              fullWidth
              id="last_name"
              name="last_name"
              label="Last Name"
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
              fullWidth
              id="phone_number"
              name="phone_number"
              label="Phone Number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
              helperText={formik.touched.phone_number && formik.errors.phone_number}
              disabled={loading}
              InputProps={{
                startAdornment: <InputAdornment position="start">+</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="address"
              name="address"
              label="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              disabled={loading}
            />
          </Grid>
          
          {userType === 'farmer' ? (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="farm_size"
                  name="farm_size"
                  label="Farm Size (acres)"
                  type="number"
                  value={formik.values.farm_size}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.farm_size && Boolean(formik.errors.farm_size)}
                  helperText={formik.touched.farm_size && formik.errors.farm_size}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="experience_years"
                  name="experience_years"
                  label="Experience (years)"
                  type="number"
                  value={formik.values.experience_years}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.experience_years && Boolean(formik.errors.experience_years)}
                  helperText={formik.touched.experience_years && formik.errors.experience_years}
                  disabled={loading}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="company_name"
                  name="company_name"
                  label="Company Name"
                  value={formik.values.company_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                  helperText={formik.touched.company_name && formik.errors.company_name}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="business_type"
                  name="business_type"
                  label="Business Type"
                  value={formik.values.business_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.business_type && Boolean(formik.errors.business_type)}
                  helperText={formik.touched.business_type && formik.errors.business_type}
                  disabled={loading}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            loading={loading}
          >
            Save Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileForm;