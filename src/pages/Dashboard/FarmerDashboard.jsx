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
  Alert,
  Avatar,
  useTheme,
  alpha,
  Stack,
  IconButton,
  LinearProgress,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetSoilRecordsQuery } from '../../features/crops/cropsApi';
import { useGetFarmerProfileQuery } from '../../features/profile/profileApi';
import { useGetProductsQuery } from '../../features/marketplace/marketplaceApi';
import Loader from '../../components/common/Loader';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LandscapeIcon from '@mui/icons-material/Landscape';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
import ScienceIcon from '@mui/icons-material/Science';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Normally we'd use the API data, but for the demo we'll use the provided farmer data
  const farmerData = {
    id: 13,
    user: {
      id: 29,
      email: "test1@gmail.com",
      first_name: "Amunga",
      last_name: "Sylvester",
      user_type: "farmer"
    },
    phone_number: "0716176560",
    address: "Kiminini, Eldoret",
    farm_size: 200.0,
    experience_years: 4,
    profile_image: "http://127.0.0.1:8000/media/profiles/farmers/buyer-bg.jpg"
  };
  
  const { data: profile = farmerData, isLoading: profileLoading, error: profileError } = useGetFarmerProfileQuery();
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
        soil_record: soilRecords?.[0] || {
          location_name: "North Field",
          nitrogen: 45,
          phosphorus: 28,
          potassium: 38,
          ph_level: 6.8
        }
      });
    }
  }, [soilRecords]);

  const isLoading = profileLoading || soilLoading || productsLoading;

  if (isLoading) {
    return <Loader />;
  }

  // Filter to user's products (in a real app, the API would do this)
  const myProducts = products?.filter(p => true) || [{
    id: 1,
    title: "Organic Maize",
    price_per_unit: 3500,
    unit: "50kg bag",
    is_organic: true,
    status: "available"
  }, {
    id: 2,
    title: "Fresh Tomatoes",
    price_per_unit: 150,
    unit: "kg",
    is_organic: false,
    status: "available"
  }];
  
  // Filter to recent soil records 
  const recentSoilRecords = soilRecords?.slice(0, 3) || [{
    id: 1,
    location_name: "North Field",
    nitrogen: 45,
    phosphorus: 28,
    potassium: 38,
    ph_level: 6.8,
    created_at: "2025-04-12T14:30:00Z"
  }, {
    id: 2,
    location_name: "South Field",
    nitrogen: 38,
    phosphorus: 32,
    potassium: 42,
    ph_level: 7.2,
    created_at: "2025-04-05T09:15:00Z"
  }];
  
  // Farm statistics for summary cards
  const farmStats = [
    {
      title: "Farm Size",
      value: `${profile.farm_size} acres`,
      icon: <LandscapeIcon />,
      color: theme.palette.success.main
    },
    {
      title: "Experience",
      value: `${profile.experience_years} years`,
      icon: <AgricultureIcon />,
      color: theme.palette.primary.main
    },
    {
      title: "Products",
      value: myProducts.length,
      icon: <InventoryIcon />,
      color: theme.palette.secondary.main
    },
    {
      title: "Soil Records",
      value: recentSoilRecords.length,
      icon: <ScienceIcon />,
      color: theme.palette.warning.main
    }
  ];
  
  return (
    <Box sx={{ pb: 6 }}>
      {/* Profile Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.success.light, 0.2)} 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: { xs: '100%', md: '50%' },
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="${encodeURIComponent(alpha(theme.palette.primary.main, 0.05))}" fill-rule="evenodd"/%3E%3C/svg%3E")',
            backgroundSize: '24px 24px',
            zIndex: 0,
            opacity: 0.6
          }}
        />
        
        <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={profile.profile_image} 
                alt={`${profile.user.first_name} ${profile.user.last_name}`}
                sx={{ 
                  width: { xs: 80, md: 100 }, 
                  height: { xs: 80, md: 100 },
                  border: '4px solid white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Box sx={{ ml: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {profile.user.first_name} {profile.user.last_name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 0.5 }}>
                    {profile.address}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Chip 
                    label="Verified Farmer" 
                    color="success" 
                    size="small" 
                    sx={{ borderRadius: 1 }}
                  />
                  <Chip 
                    label="Organic Producer" 
                    variant="outlined" 
                    size="small" 
                    sx={{ borderRadius: 1 }}
                    color="primary"
                  />
                </Stack>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/profile')}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {profileError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Failed to load profile information. Please try again later.
        </Alert>
      )}
      
      {/* Farm Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {farmStats.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 4, 
                height: '100%',
                border: '1px solid',
                borderColor: alpha(stat.color, 0.1),
                background: alpha(stat.color, 0.05),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 10px 20px ${alpha(stat.color, 0.1)}`
                }
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  backgroundColor: alpha(stat.color, 0.1),
                  color: stat.color,
                  mb: 2
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/recommendations')} 
              sx={{ 
                py: 3,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <PsychologyIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="button">
                Get Crop Recommendations
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/marketplace/create')} 
              sx={{ 
                py: 3,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: `0 4px 14px ${alpha(theme.palette.secondary.main, 0.2)}`
              }}
            >
              <AddIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="button">
                List Product
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/community')} 
              sx={{ 
                py: 3,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <AssessmentIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="button">
                Community Forum
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/learning')} 
              sx={{ 
                py: 3,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="button">
                Learning Resources
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Main Content Area */}
      <Grid container spacing={3}>
        {/* Latest Recommendation */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1),
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                px: 3, 
                py: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: alpha(theme.palette.primary.main, 0.03)
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Latest Crop Recommendation
              </Typography>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              {!lastRecommendation ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center', 
                  py: 6 
                }}>
                  <Box 
                    sx={{ 
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      mb: 2
                    }}
                  >
                    <WarningIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                    No Recommendations Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 320, mx: 'auto' }}>
                    Submit your soil data to get personalized recommendations based on your farm's conditions.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Box 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      borderRadius: 3, 
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                    }}
                  >
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Recommended Crop
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.success.dark, my: 1 }}>
                      {lastRecommendation.crop}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Confidence Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1, mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={lastRecommendation.confidence * 100} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: alpha(theme.palette.success.main, 0.2),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: theme.palette.success.main
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {Math.round(lastRecommendation.confidence * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <LocationOnIcon color="action" sx={{ mt: 0.5, mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Based on soil data from
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {lastRecommendation.soil_record.location_name}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Soil Composition
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`N: ${lastRecommendation.soil_record.nitrogen}`} 
                          size="small" 
                          sx={{ borderRadius: 1 }}
                        />
                        <Chip 
                          label={`P: ${lastRecommendation.soil_record.phosphorus}`} 
                          size="small" 
                          sx={{ borderRadius: 1 }}
                        />
                        <Chip 
                          label={`K: ${lastRecommendation.soil_record.potassium}`} 
                          size="small" 
                          sx={{ borderRadius: 1 }}
                        />
                        <Chip 
                          label={`pH: ${lastRecommendation.soil_record.ph_level}`} 
                          size="small" 
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
            <Divider />
            <CardActions sx={{ px: 3, py: 2 }}>
              <Button 
                size="medium" 
                variant="outlined"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/recommendations')}
                sx={{ borderRadius: 2 }}
              >
                Get New Recommendation
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Recent Soil Records */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1),
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                px: 3, 
                py: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: alpha(theme.palette.warning.main, 0.03)
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Soil Records
              </Typography>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <CardContent sx={{ flexGrow: 1, p: recentSoilRecords.length === 0 ? 3 : 0 }}>
              {recentSoilRecords.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 6 
                }}>
                  <Box 
                    sx={{ 
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      mb: 2
                    }}
                  >
                    <ScienceIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                    No Soil Records
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 320, mx: 'auto' }}>
                    Add soil test data to get started with personalized crop recommendations.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {recentSoilRecords.map((record, index) => (
                    <React.Fragment key={record.id}>
                      <ListItem 
                        sx={{ 
                          px: 3, 
                          py: 2,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.03)
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {record.location_name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Grid container spacing={1}>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="caption" color="text.secondary">
                                    Nitrogen
                                  </Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    {record.nitrogen}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="caption" color="text.secondary">
                                    Phosphorus
                                  </Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    {record.phosphorus}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="caption" color="text.secondary">
                                    Potassium
                                  </Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    {record.potassium}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="caption" color="text.secondary">
                                    pH Level
                                  </Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    {record.ph_level}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          }
                        />
                        <Chip 
                          label={new Date(record.created_at).toLocaleDateString()} 
                          size="small" 
                          variant="outlined" 
                          sx={{ borderRadius: 1 }}
                        />
                      </ListItem>
                      {index < recentSoilRecords.length - 1 && (
                        <Divider component="li" sx={{ ml: 3 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
            <Divider />
            <CardActions sx={{ px: 3, py: 2 }}>
              <Button 
                size="medium" 
                variant="outlined"
                color="warning"
                startIcon={<AddIcon />}
                onClick={() => navigate('/recommendations')}
                sx={{ borderRadius: 2 }}
              >
                Add New Soil Record
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* My Products */}
        <Grid item xs={12}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 4,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1),
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                px: 3, 
                py: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: alpha(theme.palette.secondary.main, 0.03)
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                My Products
              </Typography>
              <Button 
                variant="text" 
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/marketplace')}
                size="small"
              >
                View All
              </Button>
            </Box>
            <Box sx={{ p: 3 }}>
              {myProducts.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 6,
                  maxWidth: 400,
                  mx: 'auto'
                }}>
                  <Box 
                    sx={{ 
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      mb: 2,
                      mx: 'auto'
                    }}
                  >
                    <InventoryIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h6" paragraph>
                    No Products Listed
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start selling your farm products by creating your first listing on our marketplace.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/marketplace/create')}
                    sx={{ borderRadius: 2 }}
                  >
                    List New Product
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {myProducts.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                      <Card 
                        elevation={0}
                        sx={{ 
                          borderRadius: 3, 
                          border: '1px solid',
                          borderColor: alpha(theme.palette.divider, 0.1),
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                            borderColor: theme.palette.primary.main
                          },
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: 140, 
                            bgcolor: theme.palette.grey[100],
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            position: 'relative',
                            backgroundImage: 'url("https://source.unsplash.com/random/400x200/?farm,crop")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          {product.is_organic && (
                            <Chip 
                              label="Organic" 
                              color="success"
                              size="small"
                              sx={{ 
                                position: 'absolute', 
                                top: 10, 
                                right: 10,
                                borderRadius: 1
                              }}
                            />
                          )}
                          <Chip 
                            label={product.status}
                            color={product.status === 'available' ? 'primary' : 'default'}
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 10, 
                              left: 10,
                              borderRadius: 1,
                              textTransform: 'capitalize'
                            }}
                          />
                        </Box>
                        <CardContent sx={{ p: 3, flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            {product.title}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mt: 1
                          }}>
                            <Typography 
                              variant="subtitle1" 
                              color="primary.main" 
                              sx={{ fontWeight: 'bold' }}
                            >
                              Ksh. {product.price_per_unit.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              per {product.unit}
                            </Typography>
                          </Box>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ p: 2 }}>
                          <Button 
                            fullWidth
                            variant="outlined" 
                            size="medium" 
                            onClick={() => navigate(`/marketplace/product/${product.id}`)}
                            sx={{ borderRadius: 2 }}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmerDashboard;