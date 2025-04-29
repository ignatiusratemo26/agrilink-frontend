import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip, 
  Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetSoilRecordsQuery } from '../../features/crops/cropsApi';
import { useGetFarmerProfileQuery } from '../../features/profile/profileApi';
import { useGetProductsQuery } from '../../features/marketplace/marketplaceApi';
import Loader from '../../components/common/Loader';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading, error: profileError } = useGetFarmerProfileQuery();
  const { data: soilRecords, isLoading: soilLoading } = useGetSoilRecordsQuery();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  
  // For demo - Latest recommendation
  const [lastRecommendation, setLastRecommendation] = useState(null);

  useEffect(() => {
    // In a real app, you'd fetch the last recommendation from API
    // For now, we'll simulate having a recommendation
    if (soilRecords && soilRecords.length > 0) {
      setLastRecommendation({
        date: new Date().toLocaleDateString(),
        crop: "Maize",
        confidence: 0.87,
        soil_record: soilRecords[0]
      });
    }
  }, [soilRecords]);

  const isLoading = profileLoading || soilLoading || productsLoading;

  if (isLoading) {
    return <Loader />;
  }

  // Filter to user's products (in a real app, the API would do this)
  const myProducts = products?.filter(p => true) || [];
  
  // Filter to recent soil records 
  const recentSoilRecords = soilRecords?.slice(0, 3) || [];
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Farmer Dashboard
      </Typography>
      
      {profileError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load profile information. Please try again later.
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5">
              Welcome back, {profile?.first_name || 'Farmer'}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Here's an overview of your farming activities and recommendations.
            </Typography>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/recommendations')} 
                sx={{ py: 2 }}
              >
                Get Crop Recommendations
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/marketplace/create')} 
                sx={{ py: 2 }}
              >
                List Product for Sale
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/community')} 
                sx={{ py: 2 }}
              >
                Join Community Forum
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/learning')} 
                sx={{ py: 2 }}
              >
                Learning Resources
              </Button>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Latest Recommendation */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Latest Crop Recommendation
              </Typography>
              
              {!lastRecommendation ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center', 
                  py: 6 
                }}>
                  <WarningIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="body1" align="center">
                    You haven't received any crop recommendations yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    Submit your soil data to get personalized recommendations.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Recommended Crop</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {lastRecommendation.crop}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Confidence Score</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {Math.round(lastRecommendation.confidence * 100)}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Based on soil data from</Typography>
                      <Typography variant="body1">
                        {lastRecommendation.soil_record.location_name}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
            <Divider />
            <CardActions>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/recommendations')}
              >
                Get New Recommendation
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Recent Soil Records */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Recent Soil Records
              </Typography>
              
              {recentSoilRecords.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <Typography variant="body1">
                    You haven't added any soil records yet.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {recentSoilRecords.map((record) => (
                    <React.Fragment key={record.id}>
                      <ListItem>
                        <ListItemText
                          primary={record.location_name}
                          secondary={`N: ${record.nitrogen}, P: ${record.phosphorus}, K: ${record.potassium}, pH: ${record.ph_level}`}
                        />
                        <Chip 
                          label={new Date(record.created_at).toLocaleDateString()} 
                          size="small" 
                          variant="outlined" 
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
            <Divider />
            <CardActions>
              <Button 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/recommendations')}
              >
                Add New Soil Record
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* My Products */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              My Products
            </Typography>
            
            {myProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" paragraph>
                  You haven't listed any products for sale yet.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/marketplace/create')}
                >
                  List New Product
                </Button>
              </Box>
            ) : (
              <>
                <Grid container spacing={2}>
                  {myProducts.slice(0, 3).map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{product.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.price_per_unit} per {product.unit}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" onClick={() => navigate(`/marketplace/product/${product.id}`)}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {myProducts.length > 3 && (
                  <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/marketplace')}
                    >
                      View All Products
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmerDashboard;