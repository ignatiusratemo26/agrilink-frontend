import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import { useGetAllCropsQuery } from '../../features/crops/cropsApi';
import Loader from '../common/Loader';

const ProductForm = ({ onSubmit, loading, error, initialValues }) => {
  const { data: crops, isLoading: loadingCrops } = useGetAllCropsQuery();
  const [availableCrops, setAvailableCrops] = useState([]);

  useEffect(() => {
    if (crops) {
      setAvailableCrops(crops);
    }
  }, [crops]);

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      crop: initialValues?.crop || '',
      price_per_unit: initialValues?.price_per_unit || '',
      unit: initialValues?.unit || 'kg',
      quantity_available: initialValues?.quantity_available || '',
      harvest_date: initialValues?.harvest_date 
        ? new Date(initialValues.harvest_date).toISOString().split('T')[0] 
        : '',
      organic: initialValues?.organic || false
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Title is required'),
      description: Yup.string()
        .max(500, 'Must be 500 characters or less')
        .required('Description is required'),
      crop: Yup.number().required('Crop is required'),
      price_per_unit: Yup.number()
        .positive('Price must be positive')
        .required('Price is required'),
      unit: Yup.string().required('Unit is required'),
      quantity_available: Yup.number()
        .positive('Quantity must be positive')
        .required('Quantity is required'),
      harvest_date: Yup.date().required('Harvest date is required'),
      organic: Yup.boolean()
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true
  });

  if (loadingCrops) {
    return <Loader message="Loading crop data..." />;
  }

  const unitOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'ton', label: 'Tons' },
    { value: 'piece', label: 'Pieces' },
    { value: 'dozen', label: 'Dozen' }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {initialValues ? 'Edit Product' : 'Add New Product'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'Failed to save product'}
        </Alert>
      )}
      
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Product Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl 
              fullWidth 
              error={formik.touched.crop && Boolean(formik.errors.crop)}
              disabled={loading}
            >
              <InputLabel id="crop-label">Crop</InputLabel>
              <Select
                labelId="crop-label"
                id="crop"
                name="crop"
                value={formik.values.crop}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Crop"
              >
                {availableCrops?.map(crop => (
                  <MenuItem key={crop.id} value={crop.id}>
                    {crop.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.crop && formik.errors.crop && (
                <FormHelperText>{formik.errors.crop}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="price_per_unit"
              name="price_per_unit"
              label="Price per Unit"
              type="number"
              value={formik.values.price_per_unit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price_per_unit && Boolean(formik.errors.price_per_unit)}
              helperText={formik.touched.price_per_unit && formik.errors.price_per_unit}
              disabled={loading}
              InputProps={{
                startAdornment: <InputAdornment position="start">Ksh </InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              error={formik.touched.unit && Boolean(formik.errors.unit)}
              disabled={loading}
            >
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select
                labelId="unit-label"
                id="unit"
                name="unit"
                value={formik.values.unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Unit"
              >
                {unitOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.unit && formik.errors.unit && (
                <FormHelperText>{formik.errors.unit}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="quantity_available"
              name="quantity_available"
              label="Quantity Available"
              type="number"
              value={formik.values.quantity_available}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.quantity_available && Boolean(formik.errors.quantity_available)}
              helperText={formik.touched.quantity_available && formik.errors.quantity_available}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="harvest_date"
              name="harvest_date"
              label="Harvest Date"
              type="date"
              value={formik.values.harvest_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.harvest_date && Boolean(formik.errors.harvest_date)}
              helperText={formik.touched.harvest_date && formik.errors.harvest_date}
              disabled={loading}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputField
                type="checkbox"
                name="organic"
                label="Organic Product"
                checked={formik.values.organic}
                onChange={formik.handleChange}
                disabled={loading}
              />
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            loading={loading}
          >
            {initialValues ? 'Update Product' : 'Create Product'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductForm;