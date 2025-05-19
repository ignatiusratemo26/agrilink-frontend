import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert
} from '@mui/material';
import Button from '../common/Button';
import SoilDataForm from '../forms/SoilDataForm';

const SoilDataInput = ({ 
  onSubmit, 
  loading, 
  error,
  savedLocations = [],
  showSavedLocations = true 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    location_name: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph_level: '',
    rainfall: '',
    temperature: '',
    humidity: '',
    latitude: '',
    longitude: ''
  });

  // Handle selection of a saved location
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // Set formData from the selected location to pre-fill the form
    setFormData({
      id: location.id,
      location_name: location.location_name,
      nitrogen: location.nitrogen,
      phosphorus: location.phosphorus,
      potassium: location.potassium,
      ph_level: location.ph_level,
      rainfall: location.rainfall,
      temperature: location.temperature,
      humidity: location.humidity || '',
      latitude: location.latitude || '',
      longitude: location.longitude || ''
    });
    // Now advance to Step 1 so they can view/edit the data
    setActiveStep(1);
  };

  // Handle submission of a new soil data form
  const handleFormSubmit = (values) => {
    setFormData(values);
    setActiveStep(2);
  };

  // Handle final submission
  const handleSubmit = () => {
    if (selectedLocation) {
      // Use the formData which might have been edited by the user
      const dataToSubmit = {
        ...formData,
        id: selectedLocation.id // Preserve the ID
      };
      onSubmit(dataToSubmit);
    } else {
      // This is new data
      onSubmit(formData);
    }
  };

  // Step back to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    if (activeStep === 1 && selectedLocation) {
      // Don't reset the selected location when going back from the form
      // This allows the user to edit and continue
    }
  };

  // Reset the whole process
  const handleReset = () => {
    setActiveStep(0);
    setSelectedLocation(null);
    setFormData({
      location_name: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      ph_level: '',
      rainfall: '',
      temperature: '',
      humidity: '',
      latitude: '',
      longitude: ''
    });
  };

  // This should actually go to Step 2
  const handleContinueWithSelected = () => {
    setActiveStep(2);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Get Crop Recommendations
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
        </Alert>
      )}

      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>
            Choose Soil Data Source
          </StepLabel>
          <StepContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                You can either select one of your previously saved locations or enter new soil data.
              </Typography>
              
              {showSavedLocations && savedLocations.length > 0 && (
                <Box sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Saved Locations:
                  </Typography>
                  <Grid container spacing={2}>
                    {savedLocations.map((location) => (
                      <Grid item key={location.id} xs={12} sm={6} md={4}>
                        <Paper 
                          elevation={2}
                          sx={{ 
                            p: 2, 
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            '&:hover': { 
                              boxShadow: 6,
                              borderColor: 'primary.main',
                              borderStyle: selectedLocation?.id === location.id ? 'solid' : 'none'
                            },
                            border: selectedLocation?.id === location.id ? 2 : 0,
                            borderColor: 'primary.main'
                          }}
                          onClick={() => handleLocationSelect(location)}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {location.location_name}
                          </Typography>
                          <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                Location Coordinates:
                              </Typography>
                              <Typography variant="body1">
                                {location.latitude ? `${location.latitude}, ${location.longitude}` : 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Nitrogen
                              </Typography>
                              <Typography variant="body2">
                                {location.nitrogen} ppm
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Phosphorus
                              </Typography>
                              <Typography variant="body2">
                                {location.phosphorus} ppm
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Potassium
                              </Typography>
                              <Typography variant="body2">
                                {location.potassium} ppm
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                pH
                              </Typography>
                              <Typography variant="body2">
                                {location.ph_level}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Box /> {/* Empty box for alignment */}
                <Box>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                      // Clear any selected location when creating new
                      setSelectedLocation(null);
                      setFormData({
                        location_name: '',
                        nitrogen: '',
                        phosphorus: '',
                        potassium: '',
                        ph_level: '',
                        rainfall: '',
                        temperature: '',
                        humidity: '',
                        latitude: '',
                        longitude: ''
                      });
                      setActiveStep(1);
                    }}
                  >
                    Enter New Soil Data
                  </Button>
                  
                  {selectedLocation && (
                    <Button 
                      sx={{ ml: 1 }} 
                      variant="outlined" 
                      color="primary"
                      onClick={handleContinueWithSelected}
                    >
                      Continue with Selected
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel>
            {selectedLocation ? "Edit Soil Data" : "Enter Soil Data"}
          </StepLabel>
          <StepContent>
            <SoilDataForm
              onSubmit={handleFormSubmit}
              isSubmitting={loading}
              initialValues={formData}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleBack}
              >
                Back
              </Button>
            </Box>
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel>
            Confirm and Submit
          </StepLabel>
          <StepContent>
            <Typography variant="body1" paragraph>
              Please review your soil data before submitting.
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {formData.location_name}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Location Coordinates:
                  </Typography>
                  <Typography variant="body1">
                    {formData.latitude ? `${formData.latitude}, ${formData.longitude}` : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Nitrogen (N):
                  </Typography>
                  <Typography variant="body1">
                    {formData.nitrogen} ppm
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Phosphorus (P):
                  </Typography>
                  <Typography variant="body1">
                    {formData.phosphorus} ppm
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Potassium (K):
                  </Typography>
                  <Typography variant="body1">
                    {formData.potassium} ppm
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    pH Level:
                  </Typography>
                  <Typography variant="body1">
                    {formData.ph_level}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Rainfall:
                  </Typography>
                  <Typography variant="body1">
                    {formData.rainfall} mm
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Temperature:
                  </Typography>
                  <Typography variant="body1">
                    {formData.temperature} °C
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Humidity:
                  </Typography>
                  <Typography variant="body1">
                    {formData.humidity || 'N/A'} %
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleBack}
              >
                Back
              </Button>
              <Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleReset}
                  sx={{ mr: 1 }}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Get Recommendations
                </Button>
              </Box>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
};

export default SoilDataInput;