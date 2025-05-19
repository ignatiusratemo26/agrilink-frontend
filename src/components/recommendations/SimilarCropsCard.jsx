import React from 'react';
import {
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Card as MuiCard,
  CardContent,
  CardMedia,
  CardActionArea
} from '@mui/material';
import Card from '../common/Card';

const SimilarCropsCard = ({ crops = [], onCropSelect }) => {
  if (!crops || crops.length === 0) return null;

  return (
    <Card
      elevation={2}
      title="Similar Crops You Could Consider"
      sx={{ height: '100%', mb: 3 }}
      headerProps={{
        titleTypographyProps: { variant: 'h6' },
      }}
    >
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" paragraph color="text.secondary">
          These crops also match well with your soil conditions and could be considered as alternatives.
        </Typography>

        <Grid container spacing={2}>
          {crops.map((crop) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={crop.id}>
              <MuiCard 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => onCropSelect && onCropSelect(crop)}
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={crop.image || 'https://via.placeholder.com/300x140?text=Crop'}
                    alt={crop.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" component="h3" gutterBottom fontWeight="bold">
                      {crop.name}
                    </Typography>
                    
                    {crop.confidence_score && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          size="small" 
                          label={`${Math.round(crop.confidence_score * 100)}% match`} 
                          color={crop.confidence_score > 0.6 ? "success" : "primary"}
                          sx={{ fontWeight: 'medium' }}
                        />
                      </Box>
                    )}
                    
                    <Typography variant="body2" color="text.secondary" sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {crop.description || 'No description available.'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </MuiCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
};

export default SimilarCropsCard;