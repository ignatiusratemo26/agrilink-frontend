import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Button,
  Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CropRecommendationCard from '../../components/recommendations/CropRecommendationCard';
import Loader from '../../components/common/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import { useCreateFarmerOfferMutation } from '../../features/contracts/contractsApi';

const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendation, setRecommendation] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [createFarmerOffer, { isLoading: isCreatingOffer }] = useCreateFarmerOfferMutation();
  
  useEffect(() => {
    if (!location.state?.recommendation) {
      setError('No recommendation data found. Please submit soil data first.');
    } else {
      setRecommendation(location.state.recommendation);
      setSoilData(location.state.soilData);
      setIsLoading(false);
    }
  }, [location.state]);
  
  const handleCreateOffer = async (crop) => {
    try {
      // In a real app, we'd open a form to enter more details
      // For this demo, we'll just create a basic offer
      const offerData = {
        crop: crop.id,
        title: `${crop.name} Supply`,
        quantity_available: 100,
        unit: 'kg',
        price_per_unit: 45.00,
        harvest_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      };
      
      await createFarmerOffer(offerData).unwrap();
      navigate('/contracts');
    } catch (err) {
      console.error('Failed to create offer:', err);
    }
  };
  
  const handleExport = () => {
    // In a real app, this would generate and download a PDF report
    alert('This feature would generate a PDF report with the recommendation details.');
  };
  
  if (isLoading) {
    return <Loader message="Processing your soil data..." />;
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/recommendations')}
        >
          Enter Soil Data
        </Button>
      </Container>
    );
  }
  
  if (!recommendation) {
    return <Loader />;
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Crop Recommendations</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/recommendations')}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export Report
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body1" paragraph>
          Based on your soil data, here's our recommendation for the best crops to plant:
        </Typography>
        
        <Grid container spacing={3}>
          {/* Primary recommendation */}
          <Grid item xs={12} md={6}>
            <CropRecommendationCard
              recommendation={recommendation}
              soilData={soilData}
              onCreateOffer={handleCreateOffer}
            />
          </Grid>
          
          {/* Alternative recommendations would go here in a real app */}
          {recommendation.alternative_crops && recommendation.alternative_crops.length > 0 && (
            recommendation.alternative_crops.map((altCrop, index) => (
              <Grid item xs={12} md={6} key={index}>
                <CropRecommendationCard
                  recommendation={{
                    ...recommendation,
                    recommended_crop: altCrop,
                    confidence_score: recommendation.alternative_scores[index] || 0.65
                  }}
                  soilData={soilData}
                  onCreateOffer={handleCreateOffer}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Next Steps
        </Typography>
        <Typography variant="body1" paragraph>
          Based on your soil analysis, we've identified optimal crops for your conditions. 
          You can create a farming offer to connect with potential buyers or explore our marketplace 
          for seeds and agricultural inputs to start implementing these recommendations.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/marketplace')}
          >
            Visit Marketplace
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate('/learning')}
          >
            Learning Resources
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Recommendations;