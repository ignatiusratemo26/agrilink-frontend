import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Paper,
  Tabs,
  Tab,
  Alert,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../features/marketplace/marketplaceApi';
import OrderList from '../../components/marketplace/OrderList';
import Loader from '../../components/common/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Orders = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [tabValue, setTabValue] = React.useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Filter orders based on status
  const getFilteredOrders = () => {
    if (!orders) return [];
    
    switch (tabValue) {
      case 0: // All
        return orders;
      case 1: // Pending
        return orders.filter(order => order.status === 'pending');
      case 2: // Processing
        return orders.filter(order => order.status === 'processing');
      case 3: // Completed
        return orders.filter(order => order.status === 'completed');
      case 4: // Cancelled
        return orders.filter(order => order.status === 'cancelled');
      default:
        return orders;
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">My Orders</Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/marketplace')}
          >
            Back to Marketplace
          </Button>
        </Box>
        
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Orders" />
            <Tab label="Pending" />
            <Tab label="Processing" />
            <Tab label="Completed" />
            <Tab label="Cancelled" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {isLoading ? (
              <Loader message="Loading your orders..." />
            ) : error ? (
              <Alert severity="error">
                Failed to load orders. Please try again later.
              </Alert>
            ) : (
              <>
                {orders?.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" gutterBottom>
                      You haven't placed any orders yet
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Visit our marketplace to discover and purchase agricultural products.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate('/marketplace')}
                    >
                      Browse Products
                    </Button>
                  </Box>
                ) : (
                  <OrderList orders={getFilteredOrders()} />
                )}
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Orders;