import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Grid,
  Rating,
  Tooltip
} from '@mui/material';
import Card from '../common/Card';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { formatSoilParameter } from '../../utils/formatters';

// Helper function to rate soil conditions on a 5-star scale
const getSoilRating = (soilData) => {
  if (!soilData) return 0;
  
  // Calculate a simple rating based on balanced NPK values
  const n = parseFloat(soilData.nitrogen) || 0;
  const p = parseFloat(soilData.phosphorus) || 0;
  const k = parseFloat(soilData.potassium) || 0;
  const ph = parseFloat(soilData.ph_level) || 0;
  
  // Ideal ranges
  // N: 20-40, P: 20-40, K: 30-60, pH: 6.0-7.5
  const nScore = n > 0 && n < 150 ? Math.min(5, Math.max(1, 5 - Math.abs(n - 30) / 10)) : 1;
  const pScore = p > 0 && p < 100 ? Math.min(5, Math.max(1, 5 - Math.abs(p - 30) / 10)) : 1;
  const kScore = k > 0 && k < 200 ? Math.min(5, Math.max(1, 5 - Math.abs(k - 45) / 15)) : 1;
  const phScore = ph >= 4 && ph <= 10 ? Math.min(5, Math.max(1, 5 - Math.abs(ph - 6.5) * 2)) : 1;
  
  // Average the scores
  return (nScore + pScore + kScore + phScore) / 4;
};

// Get soil quality text description based on rating
const getSoilQualityText = (rating) => {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 3.5) return "Good";
  if (rating >= 2.5) return "Moderate";
  if (rating >= 1.5) return "Poor";
  return "Very Poor";
};

const SoilConditionSummary = ({ soilData }) => {
  if (!soilData) return null;
  
  const soilRating = getSoilRating(soilData);
  const qualityText = getSoilQualityText(soilRating);
  
  return (
    <Card
      elevation={2}
      title="Soil Condition Summary"
      icon={<AssessmentIcon />}
      sx={{ height: '100%' }}
      headerProps={{
        titleTypographyProps: { variant: 'h6' },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="subtitle1">Overall Quality:</Typography>
          </Grid>
          <Grid item>
            <Tooltip title={`${soilRating.toFixed(1)} out of 5`}>
              <Box>
                <Rating 
                  value={soilRating} 
                  precision={0.5} 
                  readOnly 
                  size="small"
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item>
            <Typography 
              variant="subtitle1" 
              color={
                soilRating >= 4 ? "success.main" : 
                soilRating >= 3 ? "primary.main" : 
                soilRating >= 2 ? "warning.main" : "error.main"
              }
            >
              {qualityText}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Nitrogen (N):
          </Typography>
          <Typography variant="body1">
            {formatSoilParameter('nitrogen', soilData.nitrogen)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Phosphorus (P):
          </Typography>
          <Typography variant="body1">
            {formatSoilParameter('phosphorus', soilData.phosphorus)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Potassium (K):
          </Typography>
          <Typography variant="body1">
            {formatSoilParameter('potassium', soilData.potassium)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            pH Level:
          </Typography>
          <Typography variant="body1">
            {formatSoilParameter('ph_level', soilData.ph_level)}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default SoilConditionSummary;