import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../../components/forms/ProfileForm';
import { useGetFarmerProfileQuery, useUpdateFarmerProfileMutation } from '../../features/profile/profileApi';
import Loader from '../../components/common/Loader';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: profile, isLoading, error: fetchError } = useGetFarmerProfileQuery();
  const [updateFarmerProfile, { isLoading: isUpdating, error: updateError }] = useUpdateFarmerProfileMutation();
  
  useEffect(() => {
    // Reset success message after 5 seconds
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
    
    return () => clearTimeout(timer);
  }, [showSuccess]);
  
  const handleUpdateProfile = async (formData) => {
    try {
      await updateFarmerProfile(formData).unwrap();
      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };
  
  if (isLoading) {
    return <Loader message="Loading profile..." />;
  }
  
  const error = fetchError || updateError;
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Farmer Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Update your profile information to help us provide better recommendations and connect you with potential buyers.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <ProfileForm
            initialValues={profile}
            onSubmit={handleUpdateProfile}
            loading={isUpdating}
            error={error}
            userType="farmer"
            showSuccess={showSuccess}
          />
        </Box>
      </Paper>
      
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your account settings, change password, and update notification preferences.
            </Typography>
            {/* Account settings form would go here in a future version */}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Privacy Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Control who can see your profile and farm information on the platform.
            </Typography>
            {/* Privacy settings form would go here in a future version */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FarmerProfile;