import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../../components/forms/ProfileForm';
import { useGetBuyerProfileQuery, useUpdateBuyerProfileMutation } from '../../features/profile/profileApi';
import Loader from '../../components/common/Loader';

const BuyerProfile = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: profile, isLoading, error: fetchError } = useGetBuyerProfileQuery();
  const [updateBuyerProfile, { isLoading: isUpdating, error: updateError }] = useUpdateBuyerProfileMutation();
  
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
      await updateBuyerProfile(formData).unwrap();
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
          Buyer Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Update your business profile to help farmers understand your needs and connect with you for potential partnerships.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <ProfileForm
            initialValues={profile}
            onSubmit={handleUpdateProfile}
            loading={isUpdating}
            error={error}
            userType="buyer"
            showSuccess={showSuccess}
          />
        </Box>
      </Paper>
      
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Procurement Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set your preferences for the types of crops, quality standards, and volumes you typically source.
            </Typography>
            {/* Preferences form would go here in a future version */}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Business Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Verify your business to gain higher trust with potential suppliers and access premium features.
            </Typography>
            {/* Verification form would go here in a future version */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BuyerProfile;