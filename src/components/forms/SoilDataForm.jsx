
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  InputAdornment,
  Button as MuiButton,
  Paper,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import InputField from '../common/InputField';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'GOOGLE_MAPS_API_KEY';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px'
};

// Default center is Kenya
const defaultCenter = {
  lat: 0.0236,
  lng: 37.9062
};

const SoilDataForm = ({ onSubmit, initialValues = {}, isSubmitting }) => {
  const [mapVisible, setMapVisible] = useState(false);
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const formik = useFormik({
    initialValues: {
      location_name: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      ph_level: '',
      rainfall: '',
      temperature: '',
      latitude: initialValues.latitude || '',
      longitude: initialValues.longitude || '',
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
      latitude: Yup.number()
        .required('Latitude is required')
        .min(-90, 'Latitude must be >= -90')
        .max(90, 'Latitude must be <= 90'),
      longitude: Yup.number()
        .required('Longitude is required')
        .min(-180, 'Longitude must be >= -180')
        .max(180, 'Longitude must be <= 180'),
    }),
    onSubmit,
  });

  useEffect(() => {
    // If initialValues have lat/lng, set the marker position
    if (initialValues.latitude && initialValues.longitude) {
      setMarkerPosition({
        lat: parseFloat(initialValues.latitude),
        lng: parseFloat(initialValues.longitude)
      });
      setCenter({
        lat: parseFloat(initialValues.latitude),
        lng: parseFloat(initialValues.longitude)
      });
    }
  }, [initialValues.latitude, initialValues.longitude]);

  // Handle getting user's current location
  const handleGetCurrentLocation = () => {
    setLocationError(null);
    setGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setMarkerPosition({ lat, lng });
          setCenter({ lat, lng });
          
          formik.setFieldValue('latitude', lat);
          formik.setFieldValue('longitude', lng);
          
          setGettingLocation(false);
          setMapVisible(true);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get your location. Please try again or enter coordinates manually.');
          setGettingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      setGettingLocation(false);
    }
  };

  // Handle map click to set marker position
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setMarkerPosition({ lat, lng });
    formik.setFieldValue('latitude', lat);
    formik.setFieldValue('longitude', lng);
  };

  // Toggle map visibility
  const toggleMap = () => {
    setMapVisible(!mapVisible);
  };

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

        {/* Location Fields */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Location Coordinates (Required)
          </Typography>
          <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <MuiButton
              variant="outlined"
              color="primary"
              startIcon={<LocationOnIcon />}
              onClick={toggleMap}
              size="small"
            >
              {mapVisible ? 'Hide Map' : 'Select on Map'}
            </MuiButton>
            <MuiButton
              variant="outlined"
              color="primary"
              startIcon={<MyLocationIcon />}
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              size="small"
            >
              {gettingLocation ? 'Getting Location...' : 'Use My Location'}
            </MuiButton>
          </Box>

          {locationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {locationError}
            </Alert>
          )}

          {mapVisible && (
            <Paper elevation={2} sx={{ mb: 2, overflow: 'hidden', borderRadius: 1 }}>
              <LoadScript googleMapsApiKey={MAP_API_KEY}>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={7}
                  onClick={handleMapClick}
                >
                  {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
              </LoadScript>
            </Paper>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputField
                name="latitude"
                label="Latitude"
                type="number"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.latitude && formik.errors.latitude}
                helperText={formik.touched.latitude && formik.errors.latitude}
                InputProps={{
                  endAdornment: <InputAdornment position="end">°</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputField
                name="longitude"
                label="Longitude"
                type="number"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.longitude && formik.errors.longitude}
                helperText={formik.touched.longitude && formik.errors.longitude}
                InputProps={{
                  endAdornment: <InputAdornment position="end">°</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Soil Data Fields */}
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