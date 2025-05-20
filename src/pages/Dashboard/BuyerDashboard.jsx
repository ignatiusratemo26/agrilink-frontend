import React from 'react';
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
  ListItemAvatar,
  Chip, 
  Alert,
  Stack,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetBuyerProfileQuery } from '../../features/profile/profileApi';
import { useGetOrdersQuery, useGetProductsQuery } from '../../features/marketplace/marketplaceApi';
import Loader from '../../components/common/Loader';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StoreIcon from '@mui/icons-material/Store';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ForumIcon from '@mui/icons-material/Forum';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import FiberNewIcon from '@mui/icons-material/FiberNew';

const BuyerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading, error: profileError } = useGetBuyerProfileQuery();
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  
  const isLoading = profileLoading || ordersLoading || productsLoading;

  if (isLoading) {
    return <Loader />;
  }

  // Filter recent orders (in a real app, the API would do this)
  const recentOrders = orders?.slice(0, 3) || [];
  
  // Filter recommended products (in a real app, this would be based on buyer preferences)
  const recommendedProducts = products?.slice(0, 4) || [];
  
  // Quick action items
  const quickActions = [
    { 
      title: 'Marketplace', 
      icon: <StoreIcon sx={{ fontSize: 28 }} />, 
      color: '#4CAF50', 
      path: '/marketplace',
      description: 'Browse products'
    },
    { 
      title: 'My Orders', 
      icon: <ShoppingBagIcon sx={{ fontSize: 28 }} />, 
      color: '#2196F3', 
      path: '/marketplace/orders',
      description: 'Track purchases'
    },
    { 
      title: 'Contracts', 
      icon: <HandshakeIcon sx={{ fontSize: 28 }} />, 
      color: '#FF9800', 
      path: '/contracts',
      description: 'Manage agreements'
    },
    { 
      title: 'Community', 
      icon: <ForumIcon sx={{ fontSize: 28 }} />, 
      color: '#9C27B0', 
      path: '/community',
      description: 'Join discussions'
    },
  ];

  // Order status colors
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" disableGutters={isMobile}>
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {profileError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load profile. Please try again later.
          </Alert>
        )}
        
        {/* Welcome Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: isMobile ? 3 : 4, 
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
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome back, {profile?.company_name || 'Buyer'}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track your orders, discover new products, and manage your buying activities all from your dashboard.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<ShoppingCartIcon />}
                onClick={() => navigate('/marketplace')}
                sx={{ 
                  borderRadius: 2, 
                  px: 3,
                  boxShadow: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Shop Now
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Quick Actions */}
        <Typography variant="h5" fontWeight="medium" gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Paper
                elevation={0}
                onClick={() => navigate(action.path)}
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                    borderColor: 'transparent'
                  }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: `${action.color}15`,
                    color: action.color,
                    width: 56,
                    height: 56,
                    mb: 1.5
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  {action.title}
                </Typography>
                {!isMobile && (
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Orders Overview */}
          <Grid item xs={12} lg={6}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <CardContent sx={{ p: 0, flexGrow: 1 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 3,
                    pb: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalShippingIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Recent Orders
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${orders?.length || 0} Total`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                
                <Divider />
                
                {recentOrders.length === 0 ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      justifyContent: 'center', 
                      py: 6 
                    }}
                  >
                    <ShoppingBagIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1">You haven't placed any orders yet.</Typography>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => navigate('/marketplace')}
                      sx={{ mt: 2, textTransform: 'none' }}
                    >
                      Browse Products
                    </Button>
                  </Box>
                ) : (
                  <List sx={{ py: 0 }}>
                    {recentOrders.map((order, index) => (
                      <React.Fragment key={order.id}>
                        <ListItem 
                          sx={{ 
                            px: 3, 
                            py: 2,
                            transition: 'background-color 0.2s',
                            '&:hover': { bgcolor: 'action.hover' },
                            cursor: 'pointer'
                          }}
                          onClick={() => navigate(`/marketplace/orders/${order.id}`)}
                          secondaryAction={
                            <IconButton edge="end" size="small">
                              <ArrowForwardIcon fontSize="small" />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar 
                              variant="rounded"
                              sx={{ 
                                bgcolor: `${theme.palette.primary.main}15`,
                                color: theme.palette.primary.main
                              }}
                            >
                              <InventoryIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="medium">
                                Order #{order.id}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                <Typography variant="body2" color="text.primary" fontWeight="medium">
                                  Ksh {order.total_amount?.toLocaleString() || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  • {order.items?.length || 0} items
                                </Typography>
                                <Chip 
                                  label={order.status}
                                  color={getStatusColor(order.status)}
                                  size="small"
                                  sx={{ height: 24, fontSize: '0.75rem' }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < recentOrders.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
              {recentOrders.length > 0 && (
                <>
                  <Divider />
                  <CardActions sx={{ px: 3, py: 1.5 }}>
                    <Button 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/marketplace/orders')}
                      sx={{ textTransform: 'none' }}
                    >
                      View All Orders
                    </Button>
                  </CardActions>
                </>
              )}
            </Card>
          </Grid>
          
          {/* Account Summary */}
          <Grid item xs={12} md={6} lg={3}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ p: 0, flexGrow: 1 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 3,
                    pb: 2
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Business Profile
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => navigate('/profile')}
                    sx={{ 
                      bgcolor: `${theme.palette.primary.main}10`,
                      '&:hover': { bgcolor: `${theme.palette.primary.main}20` }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Divider />
                
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Business Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profile?.company_name || 'Not set'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Business Type
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profile?.business_type || 'Not set'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profile?.address || 'Not set'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Contact
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profile?.phone_number || 'Not set'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ p: 2 }}>
                <Button 
                  fullWidth
                  variant="outlined" 
                  onClick={() => navigate('/profile')}
                  sx={{ textTransform: 'none', fontWeight: 'medium' }}
                >
                  Update Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Activity Stats */}
          <Grid item xs={12} md={6} lg={3}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Your Activity
                </Typography>
                
                <Box sx={{ my: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                          {orders?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Orders Placed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                          0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Contracts
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                          {orders?.filter(o => o.status === 'completed')?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completed Orders
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                          5
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Saved Products
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recommended Products */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  p: 3, 
                  pb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Recommended Products
                  </Typography>
                  <Chip 
                    size="small" 
                    label="New" 
                    color="error" 
                    icon={<FiberNewIcon />}
                    sx={{ ml: 1.5, fontWeight: 'medium', height: 24 }}
                  />
                </Box>
                <Button 
                  endIcon={<ArrowForwardIcon />} 
                  onClick={() => navigate('/marketplace')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              
              <Divider />
              
              {recommendedProducts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body1">
                    No product recommendations available.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {recommendedProducts.map((product) => (
                      <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Card 
                          elevation={0}
                          sx={{ 
                            height: '100%',
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                              borderColor: 'transparent'
                            }
                          }}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              {product.title}
                            </Typography>
                            
                            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                              <Chip 
                                label={product.category || "Vegetable"} 
                                size="small" 
                                sx={{ height: 24, fontSize: '0.75rem' }}
                              />
                              
                              {product.in_stock !== false && (
                                <Chip 
                                  label="In Stock" 
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  sx={{ height: 24, fontSize: '0.75rem' }}
                                />
                              )}
                            </Stack>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {product.description?.length > 40 
                                ? `${product.description.substring(0, 40)}...` 
                                : product.description || "High-quality agricultural product"}
                            </Typography>
                            
                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                              Ksh {product.price_per_unit?.toLocaleString() || 0}
                              <Typography component="span" variant="body2" color="text.secondary">
                                /{product.unit || 'kg'}
                              </Typography>
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ px: 2, pb: 2 }}>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => navigate(`/marketplace/product/${product.id}`)}
                              sx={{ textTransform: 'none' }}
                            >
                              Details
                            </Button>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="primary"
                              startIcon={<ShoppingCartIcon fontSize="small" />}
                              sx={{ ml: 'auto', textTransform: 'none' }}
                            >
                              Add
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BuyerDashboard;