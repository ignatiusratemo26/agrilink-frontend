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