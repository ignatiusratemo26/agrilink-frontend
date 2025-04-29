import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Chip, 
  Divider,
  TextField,
  Avatar,
  Rating,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Alert,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductByIdQuery,
  useCreateOrderMutation 
} from '../../features/marketplace/marketplaceApi';
import Loader from '../../components/common/Loader';
import PlaceIcon from '@mui/icons-material/Place';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventIcon from '@mui/icons-material/Event';
import InventoryIcon from '@mui/icons-material/Inventory';
import GrassIcon from '@mui/icons-material/Grass';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();
  
  const [quantity, setQuantity] = useState(1);
  
  // Related or similar products would normally come from an endpoint
  // We'll simulate that with mock data
  const relatedProducts = [
    { id: 101, title: "Organic Tomatoes", seller: "Green Farms", price: 3.99 },
    { id: 102, title: "Fresh Lettuce", seller: "Valley Produce", price: 2.49 },
    { id: 103, title: "Red Onions", seller: "Harper's Farm", price: 1.99 }
  ];
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (product && value > product.quantity_available) {
      setQuantity(product.quantity_available);
    } else {
      setQuantity(value);
    }
  };
  
  const handleBuyNow = async () => {
    try {
      const orderData = {
        items: [
          {
            product: product.id,
            quantity: quantity
          }
        ],
        shipping_address: "Default address",  // This would come from user profile
        shipping_city: "Default city",
        contact_phone: "12345678"  // This would come from user profile
      };
      
      await createOrder(orderData).unwrap();
      navigate('/marketplace/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };
  
  const handleAddToCart = () => {
    // In a real app, this would dispatch to a cart state/store
    console.log(`Added ${quantity} ${product.unit} of ${product.title} to cart`);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load product details. Please try again later.
      </Alert>
    );
  }

  if (!product) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Product not found.
      </Alert>
    );
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <Box>
      <Backdrop open={isOrdering} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="primary" />
      </Backdrop>
      
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="text" 
          onClick={() => navigate('/marketplace')}
          >
            &larr; Back to Marketplace
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {/* Product Image and Details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Product Image */}
              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    height: 300,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'background.default'
                  }}
                >
                  <Box 
                    component="img"
                    src={product.image || 'https://via.placeholder.com/500x300?text=Product+Image'}
                    alt={product.title}
                    sx={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Paper>
              </Grid>
              
              {/* Product Info */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {product.title}
                    </Typography>
                    {product.organic && (
                      <Chip 
                        label="Organic" 
                        color="success" 
                        size="small" 
                        sx={{ fontWeight: 'bold' }} 
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                    <LocalOfferIcon sx={{ fontSize: 20, verticalAlign: 'text-top', mr: 0.5 }} />
                    ${product.price_per_unit} / {product.unit}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <PlaceIcon sx={{ fontSize: 18, verticalAlign: 'text-top', mr: 0.5, color: 'text.secondary' }} />
                      {product.location || 'Location not specified'}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <InventoryIcon sx={{ fontSize: 18, verticalAlign: 'text-top', mr: 0.5, color: 'text.secondary' }} />
                      {product.quantity_available} {product.unit} available
                    </Typography>
                    
                    {product.harvest_date && (
                      <Typography variant="body1">
                        <EventIcon sx={{ fontSize: 18, verticalAlign: 'text-top', mr: 0.5, color: 'text.secondary' }} />
                        Harvested: {formatDate(product.harvest_date)}
                      </Typography>
                    )}
                  </Box>
                  
                  {product.seller_name && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>Seller</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                          {product.seller_name.charAt(0)}
                        </Avatar>
                        <Typography>{product.seller_name}</Typography>
                      </Box>
                    </Box>
                  )}
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Quantity</Typography>
                    <TextField
                      type="number"
                      size="small"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{ min: 1, max: product.quantity_available }}
                      sx={{ width: 100, mr: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {product.unit}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </Button>
                  </Box>
                </Box>
              </Grid>
              
              {/* Product Description */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2, mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Product Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {product.description}
                  </Typography>
                  {product.cultivation_method && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        <GrassIcon sx={{ fontSize: 18, verticalAlign: 'text-top', mr: 0.5 }} />
                        Cultivation Method
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {product.cultivation_method}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Related Products */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Similar Products
              </Typography>
              <List>
                {relatedProducts.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem 
                      button 
                      onClick={() => navigate(`/marketplace/product/${item.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar variant="rounded">
                          {item.title.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={item.title} 
                        secondary={`${item.seller} • $${item.price}`} 
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default ProductDetail;