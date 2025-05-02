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
    temperature: ''
  });

  // Handle selection of a saved location
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
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
      onSubmit(selectedLocation);
    } else {
      onSubmit(formData);
    }
  };

  // Step back to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    if (activeStep === 1) {
      setSelectedLocation(null);
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
      temperature: ''
    });
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
                              borderStyle: location.id === selectedLocation?.id ? 'solid' : 'none'
                            },
                            border: location.id === selectedLocation?.id ? 2 : 0,
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
                                {selectedLocation 
                                  ? `${selectedLocation.latitude || 'N/A'}, ${selectedLocation.longitude || 'N/A'}`
                                  : `${formData.latitude || 'N/A'}, ${formData.longitude || 'N/A'}`}
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
                    onClick={() => setActiveStep(1)}
                  >
                    Enter New Soil Data
                  </Button>
                  
                  {selectedLocation && (
                    <Button 
                      sx={{ ml: 1 }} 
                      variant="outlined" 
                      color="primary"
                      onClick={() => setActiveStep(2)}
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
            Enter Soil Data
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
                {selectedLocation ? selectedLocation.location_name : formData.location_name}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Nitrogen (N):
                  </Typography>
                  <Typography variant="body1">
                    {selectedLocation ? selectedLocation.nitrogen : formData.nitrogen} ppm
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Phosphorus (P):
                  </Typography>
                  <Typography variant="body1">
                    {selectedLocation ? selectedLocation.phosphorus : formData.phosphorus} ppm
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Potassium (K):
                  </Typography>
                  <Typography variant="body1">
                    {selectedLocation ? selectedLocation.potassium : formData.potassium} ppm
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    pH Level:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLocation ? selectedLocation.ph_level : formData.ph_level}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Rainfall:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLocation ? selectedLocation.rainfall : formData.rainfall} mm
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Temperature:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLocation ? selectedLocation.temperature : formData.temperature} °C
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