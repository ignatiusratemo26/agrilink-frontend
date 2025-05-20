import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
  Alert,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Card,
  CardContent,
  CardActions,
  IconButton,
  useTheme,
  alpha,
  Badge
} from '@mui/material';
import { 
  useGetContractRequestsQuery,
  useGetFarmerOffersQuery
} from '../../features/contracts/contractsApi';
import Loader from '../../components/common/Loader';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLocation, useNavigate } from 'react-router-dom';

const Contracts = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL query parameter or default to 0
  const queryParams = new URLSearchParams(location.search);
  const initialTab = parseInt(queryParams.get('tab') || '0', 10);
  
  const [tabValue, setTabValue] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: contractRequests, isLoading: contractsLoading, error: contractsError } = useGetContractRequestsQuery();
  const { data: farmerOffers, isLoading: offersLoading, error: offersError } = useGetFarmerOffersQuery();
  
  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tab', tabValue.toString());
    navigate({ search: params.toString() }, { replace: true });
  }, [tabValue, navigate]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
    const isLoading = contractsLoading || offersLoading;
  const error = contractsError || offersError;
  
  // Filter contract requests based on search term
  const filteredContractRequests = contractRequests?.filter(contract => 
    contract.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Filter farmer offers based on search term
  const filteredFarmerOffers = farmerOffers?.filter(offer => 
    offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.crop_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Get status color based on status
  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    switch(status.toLowerCase()) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  
  if (isLoading) {
    return <Loader message="Loading contracts..." />;
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load contracts data. Please try again later.
        </Alert>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        {/* Header Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.background.paper} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '150px', 
            height: '150px', 
            borderRadius: '0 0 0 150px', 
            background: `${theme.palette.primary.main}10`,
            display: { xs: 'none', md: 'block' }
          }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Contract Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your buying contracts and farming offers in one place
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              sx={{ 
                borderRadius: 2, 
                px: 3,
                boxShadow: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {tabValue === 0 ? 'New Contract Request' : 'New Farmer Offer'}
            </Button>
          </Box>
        </Paper>
        
        {/* Search and Filter Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder={tabValue === 0 ? "Search contract requests..." : "Search farmer offers..."}
                value={searchTerm}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <Button 
                fullWidth
                variant="outlined" 
                startIcon={<FilterListIcon />}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Filter
              </Button>
            </Grid>
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SortIcon />}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Sort
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Tabs and Content */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                py: 2
              }
            }}
          >
            <Tab 
              label="Contract Requests" 
              icon={<ShoppingBasketIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Farmer Offers" 
              icon={<AgricultureIcon />} 
              iconPosition="start"
            />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Contract Requests
                  </Typography>
                  <Badge 
                    badgeContent={filteredContractRequests.length} 
                    color="primary"
                    showZero
                  >
                    <Chip 
                      label="Requests" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Badge>
                </Box>
                
                {filteredContractRequests.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredContractRequests.map((contract) => (
                      <Grid item xs={12} md={6} key={contract.id}>
                        <Card 
                          elevation={0}
                          sx={{ 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                              borderColor: 'transparent'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3, pb: 1, flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" fontWeight="bold">
                                {contract.title || 'Untitled Contract'}
                              </Typography>
                              <Chip 
                                size="small"
                                label={contract.status || 'Active'} 
                                color={getStatusColor(contract.status)}
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />
                            
                            <Stack spacing={1.5} sx={{ mb: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <StorefrontIcon 
                                  fontSize="small" 
                                  sx={{ mr: 1, color: theme.palette.primary.main }}
                                />
                                <Typography variant="body2">
                                  <strong>Quantity:</strong> {contract.quantity_required} {contract.unit}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalOfferIcon 
                                  fontSize="small" 
                                  sx={{ mr: 1, color: theme.palette.secondary.main }}
                                />
                                <Typography variant="body2">
                                  <strong>Price:</strong> KSh {contract.price_per_unit} per {contract.unit}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarMonthIcon 
                                  fontSize="small" 
                                  sx={{ mr: 1, color: theme.palette.error.main }}
                                />
                                <Typography variant="body2">
                                  <strong>Delivery by:</strong> {new Date(contract.delivery_date).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Stack>
                            
                            {contract.description && (
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {contract.description}
                              </Typography>
                            )}
                          </CardContent>
                          
                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button 
                              size="small" 
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              sx={{ 
                                borderRadius: 1.5,
                                textTransform: 'none'
                              }}
                            >
                              View Details
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    <ShoppingBasketIcon sx={{ fontSize: 60, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" paragraph fontWeight="medium">
                      No Contract Requests Found
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 3 }}>
                      {searchTerm ? 
                        "No contracts match your search criteria. Try with different keywords." :
                        "Create a new contract request to connect with farmers and secure your agricultural needs."}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        py: 1
                      }}
                    >
                      Create New Request
                    </Button>
                  </Box>
                )}
              </>
            )}            
            {tabValue === 1 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Farmer Offers
                  </Typography>
                  <Badge 
                    badgeContent={filteredFarmerOffers.length} 
                    color="success"
                    showZero
                  >
                    <Chip 
                      label="Offers" 
                      color="success" 
                      variant="outlined"
                    />
                  </Badge>
                </Box>
                
                {filteredFarmerOffers.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredFarmerOffers.map((offer) => (
                      <Grid item xs={12} md={6} key={offer.id}>
                        <Card 
                          elevation={0}
                          sx={{ 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                              borderColor: 'transparent'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3, pb: 1, flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {offer.title || 'Untitled Offer'}
                                </Typography>
                                <Chip 
                                  size="small"
                                  label={offer.crop_details?.name || 'Unknown Crop'} 
                                  color="primary"
                                  variant="outlined"
                                  sx={{ mt: 0.5, fontWeight: 500 }}
                                />
                              </Box>
                              <Chip 
                                size="small"
                                label={offer.status || 'Active'} 
                                color={getStatusColor(offer.status)}
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />
                            
                            <Stack spacing={1.5} sx={{ mb: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AgricultureIcon 
                                  fontSize="small" 
                                  sx={{ mr: 1, color: theme.palette.success.main }}
                                />
                                <Typography variant="body2">
                                  <strong>Quantity Available:</strong> {offer.quantity_available} {offer.unit}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalOfferIcon 
                                  fontSize="small" 
                                  sx={{ mr: 1, color: theme.palette.secondary.main }}
                                />
                                <Typography variant="body2">
                                  <strong>Price:</strong> KSh {offer.price_per_unit} per {offer.unit}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarMonthIcon 
                                  fontSize="small" 
                                  sx={{ mr: 1, color: theme.palette.error.main }}
                                />
                                <Typography variant="body2">
                                  <strong>Harvest Date:</strong> {new Date(offer.harvest_date).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Stack>
                            
                            {offer.description && (
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                  {offer.description.length > 65 
                                  ? `${offer.description.slice(0, 65)}...` 
                                  : offer.description}

                              </Typography>
                            )}
                          </CardContent>
                          
                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button 
                              size="small" 
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              sx={{ 
                                borderRadius: 1.5,
                                textTransform: 'none'
                              }}
                            >
                              View Details
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    <AgricultureIcon sx={{ fontSize: 60, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" paragraph fontWeight="medium">
                      No Farmer Offers Found
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 3 }}>
                      {searchTerm ? 
                        "No offers match your search criteria. Try with different keywords." :
                        "Create a new farmer offer to showcase your produce to potential buyers."}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<AddIcon />}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        py: 1
                      }}
                    >
                      Create New Offer
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Contracts;