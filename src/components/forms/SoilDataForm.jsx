import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import InputField from '../common/InputField';

const SoilDataForm = ({ onSubmit, initialValues = {}, isSubmitting }) => {
  const formik = useFormik({
    initialValues: {
      location_name: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      ph_level: '',
      rainfall: '',
      temperature: '',
      ...initialValues,
    },
    validationSchema: Yup.object({
      location_name: Yup.string().required('Location name is required'),
      nitrogen: Yup.number().required('Nitrogen is required').min(0).max(140),
      phosphorus: Yup.number()
        .required('Phosphorus is required')
        .min(0)
        .max(100),
      potassium: Yup.number().required('Potassium is required').min(0).max(800),
      ph_level: Yup.number()
        .required('pH level is required')
        .min(3.5)
        .max(10),
      rainfall: Yup.number().required('Rainfall is required').min(0),
      temperature: Yup.number().required('Temperature is required'),
    }),
    onSubmit,
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Enter Soil Data
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputField
            name="location_name"
            label="Location Name"
            value={formik.values.location_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location_name && formik.errors.location_name}
            helperText={formik.touched.location_name && formik.errors.location_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="nitrogen"
            label="Nitrogen (ppm)"
            type="number"
            value={formik.values.nitrogen}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nitrogen && formik.errors.nitrogen}
            helperText={formik.touched.nitrogen && formik.errors.nitrogen}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="phosphorus"
            label="Phosphorus (ppm)"
            type="number"
            value={formik.values.phosphorus}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phosphorus && formik.errors.phosphorus}
            helperText={formik.touched.phosphorus && formik.errors.phosphorus}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="potassium"
            label="Potassium (ppm)"
            type="number"
            value={formik.values.potassium}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.potassium && formik.errors.potassium}
            helperText={formik.touched.potassium && formik.errors.potassium}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="ph_level"
            label="pH Level"
            type="number"
            value={formik.values.ph_level}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.ph_level && formik.errors.ph_level}
            helperText={formik.touched.ph_level && formik.errors.ph_level}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="rainfall"
            label="Rainfall (mm)"
            type="number"
            value={formik.values.rainfall}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.rainfall && formik.errors.rainfall}
            helperText={formik.touched.rainfall && formik.errors.rainfall}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="temperature"
            label="Temperature (°C)"
            type="number"
            value={formik.values.temperature}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.temperature && formik.errors.temperature}
            helperText={formik.touched.temperature && formik.errors.temperature}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
          loading={isSubmitting}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default SoilDataForm;