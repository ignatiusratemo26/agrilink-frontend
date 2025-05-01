import React from 'react';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetUserProfileQuery } from '../../features/profile/profileApi';
import Loader from '../../components/common/Loader';
import FarmerIcon from '@mui/icons-material/Agriculture';
import BuyerIcon from '@mui/icons-material/BusinessCenter';

const UserProfile = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useGetUserProfileQuery();
  
  if (isLoading) {
    return <Loader message="Loading profile..." />;
  }
  
  const userType = profile?.user_type || 'farmer';
  
  // Redirect to the specific profile page based on user type
  const handleGoToProfile = () => {
    if (userType === 'farmer') {
      navigate('/profile/farmer');
    } else if (userType === 'buyer') {
      navigate('/profile/buyer');
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Select the profile type you'd like to manage.
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 3, justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={5}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: userType === 'farmer' ? '2px solid' : '1px solid',
                borderColor: userType === 'farmer' ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
              onClick={() => navigate('/profile/farmer')}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FarmerIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Farmer Profile
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your farm details, soil data, and crop information
                </Typography>
                <Button 
                  variant="contained" 
                  disabled={userType !== 'farmer'}
                >
                  {userType === 'farmer' ? 'Go to Profile' : 'Not Available'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={5}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: userType === 'buyer' ? '2px solid' : '1px solid',
                borderColor: userType === 'buyer' ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
              onClick={() => navigate('/profile/buyer')}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <BuyerIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Buyer Profile
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your business details, preferences, and verify your company
                </Typography>
                <Button 
                  variant="contained"
                  disabled={userType !== 'buyer'}
                >
                  {userType === 'buyer' ? 'Go to Profile' : 'Not Available'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Button 
          variant="outlined"
          sx={{ mt: 4 }}
          onClick={handleGoToProfile}
        >
          Go to {userType === 'farmer' ? 'Farmer' : 'Buyer'} Profile
        </Button>
      </Paper>
    </Container>
  );
};

export default UserProfile;