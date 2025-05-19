import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  Alert,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  useGetSoilRecordsQuery,
  useCreateSoilRecordMutation,
  useGetCropRecommendationMutation
} from '../../features/crops/cropsApi';
import SoilDataInput from '../../components/recommendations/SoilDataInput';
import Loader from '../../components/common/Loader';

const SoilData = () => {
  const navigate = useNavigate();
  const { data: soilRecords, isLoading, error } = useGetSoilRecordsQuery();
  const [createSoilRecord, { isLoading: isCreating }] = useCreateSoilRecordMutation();
  const [getRecommendation, { isLoading: isGettingRecommendation }] = useGetCropRecommendationMutation();
  

const handleSubmit = async (data) => {
  try {
    // Make sure humidity is not null
    if (data.humidity === null || data.humidity === undefined || data.humidity === '') {
      data.humidity = 50; // Default humidity value if not provided
    }
    
    // If we're submitting a new record (not a saved one)
    if (!data.id) {
      const savedRecord = await createSoilRecord(data).unwrap();
      data = savedRecord;
    }
    
    // Get recommendation based on soil data
    const recommendation = await getRecommendation(data).unwrap();
    
    // Navigate to recommendations page with the result
    navigate('/recommendations/results', { 
      state: { 
        recommendation,
        soilData: data
      }
    });
  } catch (error) {
    console.error('Error:', error);
    let errorMessage = 'Failed to process recommendation. Please try again.';
    
    if (error.data) {
      // Format the error message from API response
      if (error.data.humidity) {
        errorMessage = `Humidity: ${error.data.humidity}`;
      } else if (error.data.detail) {
        errorMessage = error.data.detail;
      } else if (error.data.error) {
        errorMessage = error.data.error;
      } else if (typeof error.data === 'object') {
        // Convert object errors to readable format
        errorMessage = Object.entries(error.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      }
    }
    
    alert(errorMessage);
  }
};
  
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Soil Data Analysis
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Enter your soil parameters to get personalized crop recommendations. 
          You can use data from soil testing kits or laboratory reports.
        </Typography>
        
        {isLoading ? (
          <Loader message="Loading your saved soil records..." />
        ) : (
          <SoilDataInput
            savedLocations={soilRecords || []}
            onSubmit={handleSubmit}
            loading={isCreating || isGettingRecommendation}
            error={error}
          />
        )}
      </Paper>
    </Container>
  );
};

export default SoilData;