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
  Chip, 
  Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetBuyerProfileQuery } from '../../features/profile/profileApi';
import { useGetOrdersQuery, useGetProductsQuery } from '../../features/marketplace/marketplaceApi';
import Loader from '../../components/common/Loader';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const BuyerDashboard = () => {
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
  const recommendedProducts = products?.slice(0, 6) || [];
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Buyer Dashboard
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
              Welcome back, {profile?.company_name || 'Buyer'}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Here's an overview of your recent orders and recommended products.
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
                onClick={() => navigate('/marketplace')} 
                sx={{ py: 2 }}
              >
                Browse Marketplace
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/marketplace/orders')} 
                sx={{ py: 2 }}
              >
                View My Orders
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/contracts')} 
                sx={{ py: 2 }}
              >
                Create Contract
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
          </Grid>
        </Grid>
        
        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              
              {recentOrders.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <Typography variant="body1">
                    You haven't placed any orders yet.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {recentOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemText
                          primary={`Order #${order.id}`}
                          secondary={`Total: $${order.total_amount} • ${order.items.length} items`}
                        />
                        <Chip 
                          label={order.status} 
                          color={
                            order.status === 'completed' ? 'success' : 
                            order.status === 'processing' ? 'info' : 'default'
                          }
                          size="small" 
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
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/marketplace/orders')}
              >
                View All Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Account Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Account Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Business Name</Typography>
                  <Typography variant="body1">{profile?.company_name || 'Not set'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Business Type</Typography>
                  <Typography variant="body1">{profile?.business_type || 'Not set'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Address</Typography>
                  <Typography variant="body1">{profile?.address || 'Not set'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Contact</Typography>
                  <Typography variant="body1">{profile?.phone_number || 'Not set'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate('/profile')}
              >
                Update Profile
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Recommended Products */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Products
            </Typography>
            
            {recommendedProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1">
                  No product recommendations available.
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={2}>
                  {recommendedProducts.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{product.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${product.price_per_unit} per {product.unit}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            onClick={() => navigate(`/marketplace/product/${product.id}`)}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="small" 
                            color="primary" 
                            startIcon={<ShoppingCartIcon />}
                            sx={{ ml: 'auto' }}
                          >
                            Add to Cart
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/marketplace')}
                  >
                    Explore More Products
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BuyerDashboard;