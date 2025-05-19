import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  TextField,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import InputField from '../common/InputField';
import { format } from 'date-fns';

const UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'tonne', label: 'Tonnes' },
  { value: 'box', label: 'Boxes' },
  { value: 'crate', label: 'Crates' },
  { value: 'bunch', label: 'Bunches' },
  { value: 'sack', label: 'Sacks' },
];

const FarmingOfferForm = ({ onSubmit, isSubmitting, cropData, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      crop: cropData?.id || '',
      title: `${cropData?.name || 'Crop'} Farming Offer`,
      description: '',
      quantity_available: '',  // Changed from quantity to quantity_available
      unit: 'kg',              // Added unit field
      price_per_unit: '',      // Changed from unit_price to price_per_unit
      location: '',
      available_from: null,
      available_until: null,
      harvest_date: null       // Added harvest_date field
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required')
        .min(10, 'Description should be at least 10 characters'),
      quantity_available: Yup.number().required('Quantity is required')
        .positive('Must be a positive number'),
      unit: Yup.string().required('Unit is required'),
      price_per_unit: Yup.number().required('Price per unit is required')
        .positive('Must be a positive number'),
      location: Yup.string().required('Location is required'),
      available_from: Yup.date().required('Start date is required')
        .nullable(),
      available_until: Yup.date().required('End date is required')
        .nullable()
        .when('available_from', (availableFrom, schema) => 
          availableFrom ? schema.min(availableFrom, 'End date must be after start date') : schema),
      harvest_date: Yup.date().required('Harvest date is required')
        .nullable()
    }),
    onSubmit: (values) => {
      // Format dates as ISO strings for API
      const formattedValues = {
        ...values,
        crop: cropData.id,
        available_from: values.available_from ? format(new Date(values.available_from), 'yyyy-MM-dd') : null,
        available_until: values.available_until ? format(new Date(values.available_until), 'yyyy-MM-dd') : null,
        harvest_date: values.harvest_date ? format(new Date(values.harvest_date), 'yyyy-MM-dd') : null
      };
      onSubmit(formattedValues);
    }
  });

  return (
    <>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Create Farming Offer for {cropData?.name}
          </Typography>
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <InputField
                  name="title"
                  label="Offer Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && formik.errors.title}
                  helperText={formik.touched.title && formik.errors.title}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <InputField
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  placeholder="Describe what you're offering, your farming experience, and any special conditions."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && formik.errors.description}
                  helperText={formik.touched.description && formik.errors.description}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  name="quantity_available"
                  label="Available Quantity"
                  type="number"
                  value={formik.values.quantity_available}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.quantity_available && formik.errors.quantity_available}
                  helperText={formik.touched.quantity_available && formik.errors.quantity_available}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth
                  error={formik.touched.unit && Boolean(formik.errors.unit)}
                >
                  <InputLabel id="unit-label">Unit</InputLabel>
                  <Select
                    labelId="unit-label"
                    id="unit"
                    name="unit"
                    value={formik.values.unit}
                    label="Unit"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {UNITS.map((unit) => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.unit && formik.errors.unit && (
                    <FormHelperText>{formik.errors.unit}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  name="price_per_unit"
                  label="Price per Unit"
                  type="number"
                  value={formik.values.price_per_unit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price_per_unit && formik.errors.price_per_unit}
                  helperText={formik.touched.price_per_unit && formik.errors.price_per_unit}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">KSh</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/{formik.values.unit}</InputAdornment>,
                  }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  name="location"
                  label="Location"
                  placeholder="Enter the farm location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.location && formik.errors.location}
                  helperText={formik.touched.location && formik.errors.location}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={formik.touched.available_from && Boolean(formik.errors.available_from)}>
                  <DatePicker
                    label="Available From"
                    value={formik.values.available_from}
                    onChange={(value) => formik.setFieldValue('available_from', value)}
                    disablePast
                    slotProps={{
                      textField: {
                        error: formik.touched.available_from && Boolean(formik.errors.available_from),
                        helperText: formik.touched.available_from && formik.errors.available_from,
                        fullWidth: true
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={formik.touched.available_until && Boolean(formik.errors.available_until)}>
                  <DatePicker
                    label="Available Until"
                    value={formik.values.available_until}
                    onChange={(value) => formik.setFieldValue('available_until', value)}
                    disablePast
                    minDate={formik.values.available_from}
                    slotProps={{
                      textField: {
                        error: formik.touched.available_until && Boolean(formik.errors.available_until),
                        helperText: formik.touched.available_until && formik.errors.available_until,
                        fullWidth: true
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={formik.touched.harvest_date && Boolean(formik.errors.harvest_date)}>
                  <DatePicker
                    label="Harvest Date"
                    value={formik.values.harvest_date}
                    onChange={(value) => formik.setFieldValue('harvest_date', value)}
                    disablePast
                    slotProps={{
                      textField: {
                        error: formik.touched.harvest_date && Boolean(formik.errors.harvest_date),
                        helperText: formik.touched.harvest_date && formik.errors.harvest_date,
                        fullWidth: true
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onCancel} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          loading={isSubmitting}
        >
          Create Offer
        </Button>
      </DialogActions>
    </>
  );
};

export default FarmingOfferForm;