import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Button,
  Alert,
  Dialog,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import CropRecommendationCard from '../../components/recommendations/CropRecommendationCard';
import SimilarCropsCard from '../../components/recommendations/SimilarCropsCard';
import SoilConditionSummary from '../../components/recommendations/SoilConditionSummary';
import LocationWeatherCard from '../../components/recommendations/LocationWeatherCard';
import RecommendationHistoryCard from '../../components/recommendations/RecommendationHistoryCard';
import { useCreateFarmerOfferMutation } from '../../features/contracts/contractsApi';
import FarmingOfferForm from '../../components/forms/FarmingOfferForm';

const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [recommendation, setRecommendation] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  
  const [createFarmerOffer, { isLoading: isCreatingOffer }] = useCreateFarmerOfferMutation();
  
  useEffect(() => {
    if (location.state?.recommendation) {
      setRecommendation(location.state.recommendation);
      if (location.state.soilData) {
        setSoilData(location.state.soilData);
      }
    } else {
      setError('No recommendation data found. Please return to the soil data page.');
    }
  }, [location.state]);

  const handleCreateOffer = (crop) => {
    setSelectedCrop(crop);
    setOfferDialogOpen(true);
  };

  const handleSubmitOffer = async (offerData) => {
    try {
      await createFarmerOffer(offerData).unwrap();
      setOfferDialogOpen(false);
      navigate('/contracts?tab=1');
    } catch (error) {
      console.error('Error creating offer:', error);
      // Don't close dialog, let user fix errors
    }
  };

  const handleCloseDialog = () => {
    setOfferDialogOpen(false);
  };

  if (isLoading) return <Loader />;
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/recommendations/soil-data')}
          sx={{ mt: 2 }}
        >
          Go back to Soil Data
        </Button>
      </Container>
    );
  }
  
  if (!recommendation) return <Loader />;
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crop Recommendations
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
            {recommendation && (
              <CropRecommendationCard 
                recommendation={recommendation}
                soilData={soilData}
                onCreateOffer={handleCreateOffer}
              />
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <SoilConditionSummary soilData={soilData} />
            </Grid>
            <Grid item>
              <LocationWeatherCard 
                location={soilData?.location_name || 'Unknown'} 
                coordinates={{
                  lat: soilData?.latitude,
                  lng: soilData?.longitude
                }}
                temperature={soilData?.temperature}
                rainfall={soilData?.rainfall}
                humidity={soilData?.humidity}
              />
            </Grid>
          </Grid>
        </Grid>
        
        {recommendation?.similar_crops?.length > 0 && (
          <Grid item xs={12}>
            <SimilarCropsCard 
              crops={recommendation.similar_crops} 
              onCropSelect={handleCreateOffer}
            />
          </Grid>
        )}
        
        <Grid item xs={12}>
          <RecommendationHistoryCard />
        </Grid>
      </Grid>
      
      {/* Farming Offer Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={offerDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <FarmingOfferForm
          onSubmit={handleSubmitOffer}
          isSubmitting={isCreatingOffer}
          cropData={selectedCrop}
          onCancel={handleCloseDialog}
        />
      </Dialog>
    </Container>
  );
};

export default Recommendations;