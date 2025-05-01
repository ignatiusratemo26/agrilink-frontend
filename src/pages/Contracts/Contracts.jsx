import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { 
  useGetContractRequestsQuery,
  useGetFarmerOffersQuery
} from '../../features/contracts/contractsApi';
import Loader from '../../components/common/Loader';
import AddIcon from '@mui/icons-material/Add';

const Contracts = () => {
  const [tabValue, setTabValue] = useState(0);
  const { data: contractRequests, isLoading: contractsLoading, error: contractsError } = useGetContractRequestsQuery();
  const { data: farmerOffers, isLoading: offersLoading, error: offersError } = useGetFarmerOffersQuery();
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const isLoading = contractsLoading || offersLoading;
  const error = contractsError || offersError;
  
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Contract Management</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
          >
            {tabValue === 0 ? 'New Contract Request' : 'New Farmer Offer'}
          </Button>
        </Box>
        
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Contract Requests" />
            <Tab label="Farmer Offers" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Contract Requests
                </Typography>
                
                {contractRequests && contractRequests.length > 0 ? (
                  <Grid container spacing={2}>
                    {contractRequests.map((contract) => (
                      <Grid item xs={12} md={6} key={contract.id}>
                        <Paper sx={{ p: 2, borderRadius: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {contract.title || 'Untitled Contract'}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              Quantity: {contract.quantity_required} {contract.unit}
                            </Typography>
                            <Typography variant="body2">
                              Price: ${contract.price_per_unit} per {contract.unit}
                            </Typography>
                            <Typography variant="body2">
                              Delivery Date: {new Date(contract.delivery_date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Button size="small" variant="outlined">
                            View Details
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1">
                      No contract requests found. Create a new contract request to get started.
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {tabValue === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Farmer Offers
                </Typography>
                
                {farmerOffers && farmerOffers.length > 0 ? (
                  <Grid container spacing={2}>
                    {farmerOffers.map((offer) => (
                      <Grid item xs={12} md={6} key={offer.id}>
                        <Paper sx={{ p: 2, borderRadius: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {offer.title || 'Untitled Offer'}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              Crop: {offer.crop?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="body2">
                              Quantity Available: {offer.quantity_available} {offer.unit}
                            </Typography>
                            <Typography variant="body2">
                              Price: ${offer.price_per_unit} per {offer.unit}
                            </Typography>
                            <Typography variant="body2">
                              Harvest Date: {new Date(offer.harvest_date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Button size="small" variant="outlined">
                            View Details
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1">
                      No farmer offers found. Create a new offer to get started.
                    </Typography>
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