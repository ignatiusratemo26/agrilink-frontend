import React, { useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, Chip, Divider, TextField,
  Avatar, Alert, Backdrop, CircularProgress, List, ListItem,
  ListItemText, ListItemAvatar, Card, CardMedia, useTheme, useMediaQuery,
  Stack, Table, TableBody, TableRow, TableCell
} from '@mui/material';
import {
  Place as PlaceIcon,
  LocalOffer as LocalOfferIcon,
  Event as EventIcon,
  Inventory as InventoryIcon,
  Grass as GrassIcon,
  ShoppingCart as ShoppingCartIcon,
  HourglassEmpty as ExpiryIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useCreateOrderMutation
} from '../../features/marketplace/marketplaceApi';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const { data: allProducts = [], isLoading: isLoadingRelated } = useGetProductsQuery();
  const relatedProducts = allProducts
    .filter(p => p.crop === product?.crop && p.id !== parseInt(id))
    .slice(0, 5);
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) return <Loader />;
  if (error) return <Alert severity="error">Failed to load product details.</Alert>;
  if (!product) return <Alert severity="warning">Product not found.</Alert>;

  // ─────────────────────────────────────────────────────────
  // Derived Values
  const images = product.images || [];
  const primaryImage = product.images?.find(img => img.is_primary)?.image ||
                       product.images?.[0]?.image ||
                       'https://via.placeholder.com/500x300?text=Product+Image';
                       
  const selectedImage = images[selectedImageIndex]?.image || primaryImage;

  const sellerName = product.seller?.first_name && product.seller?.last_name
    ? `${product.seller.first_name} ${product.seller.last_name}`
    : 'Unknown Seller';

  const cropName = product.crop_details?.name || "Unknown Crop";

  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > parseFloat(product.quantity_available)) {
      setQuantity(parseFloat(product.quantity_available));
    } else {
      setQuantity(value);
    }
  };

  const handleBuyNow = async () => {
    try {
      const orderData = {
        items: [{ product: product.id, quantity }],
        shipping_address: "Default address",
        shipping_city: "Default city",
        contact_phone: "12345678"
      };
      await createOrder(orderData).unwrap();
      navigate('/marketplace/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product.unit} of ${product.title} to cart`);
  };

  const totalPrice = (parseFloat(product.price_per_unit) * quantity).toFixed(2);

  // ─────────────────────────────────────────────────────────
  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', px: { xs: 2, sm: 3 } }}>
      <Backdrop open={isOrdering} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="primary" />
      </Backdrop>

      <Box sx={{ mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/marketplace')}
          sx={{ mb: 2 }}
        >
          &larr; Back to Marketplace
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left: Main Product Section */}
        <Grid item xs={12} md={8}>
          <Card 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Grid container spacing={3}>
              {/* Product Title - Full Width on Mobile */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="h4" gutterBottom>{product.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip 
                        icon={<GrassIcon />} 
                        label={cropName} 
                        color="primary" 
                        variant="outlined" 
                        size="small" 
                      />
                      
                      {product.is_organic && (
                        <Chip label="Organic" color="success" size="small" />
                      )}
                      
                      {product.is_featured && (
                        <Chip label="Featured" color="secondary" size="small" />
                      )}
                      
                      {product.average_rating && (
                        <Chip 
                          icon={<StarIcon />} 
                          label={`${product.average_rating}`} 
                          color="warning" 
                          size="small" 
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <LocalOfferIcon sx={{ mr: 1 }} />
                    {formatCurrency(product.price_per_unit)} / {product.unit}
                  </Typography>
                </Box>
              </Grid>

              {/* Main Image */}
              <Grid item xs={12} md={7}>
                <Card 
                  sx={{ 
                    borderRadius: 2, 
                    height: 350, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    mb: 2
                  }}
                >
                  <CardMedia
                    component="img"
                    image={selectedImage}
                    alt={product.title}
                    sx={{ 
                      maxHeight: '100%',
                      objectFit: 'contain',
                      p: 2
                    }}
                  />
                </Card>
                
                {/* Thumbnail Row */}
                {images.length > 1 && (
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    sx={{ 
                      overflowX: 'auto',
                      pb: 1
                    }}
                  >
                    {images.map((img, index) => (
                      <Card
                        key={img.id}
                        onClick={() => setSelectedImageIndex(index)}
                        sx={{
                          width: 80,
                          height: 80,
                          cursor: 'pointer',
                          opacity: selectedImageIndex === index ? 1 : 0.6,
                          border: selectedImageIndex === index ? `2px solid ${theme.palette.primary.main}` : 'none',
                          transition: 'all 0.2s',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={img.image}
                          alt={`${product.title} - ${index}`}
                          sx={{ 
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            p: 1
                          }}
                        />
                      </Card>
                    ))}
                  </Stack>
                )}
              </Grid>

              {/* Product Info */}
              <Grid item xs={12} md={5}>
                <Card sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                  {/* Seller Info */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3, 
                    pb: 2, 
                    borderBottom: `1px solid ${theme.palette.divider}` 
                  }}>
                    <Avatar 
                      sx={{ 
                        mr: 2, 
                        bgcolor: theme.palette.primary.main,
                        width: 50,
                        height: 50
                      }}
                    >
                      {product.seller?.first_name?.charAt(0) || 'S'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{sellerName}</Typography>
                      <Typography variant="body2" color="text.secondary">Farmer</Typography>
                    </Box>
                  </Box>
                  
                  {/* Product Details */}
                  <Box sx={{ mb: 3 }}>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PlaceIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">Location:</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ border: 0, py: 1 }}>
                            <Typography variant="body2">
                              {product.location || 'Not specified'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <InventoryIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">Available:</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ border: 0, py: 1 }}>
                            <Typography variant="body2">
                              {product.quantity_available} {product.unit}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EventIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">Harvested:</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ border: 0, py: 1 }}>
                            <Typography variant="body2">
                              {formatDate(product.harvest_date)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ExpiryIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">Expires:</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ border: 0, py: 1 }}>
                            <Typography variant="body2">
                              {formatDate(product.expiry_date)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ border: 0, pl: 0, py: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ShippingIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">Status:</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ border: 0, py: 1 }}>
                            <Chip 
                              label={product.status || 'Available'} 
                              color={product.status === 'available' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>

                  {/* Purchase Box */}
                  <Box sx={{ 
                    mt: 'auto',
                    pt: 2, 
                    borderTop: `1px solid ${theme.palette.divider}`
                  }}>
                    <Typography variant="subtitle1" gutterBottom>Order Quantity</Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <TextField
                        type="number"
                        size="small"
                        value={quantity}
                        onChange={handleQuantityChange}
                        inputProps={{ 
                          min: 1, 
                          max: product.quantity_available,
                          step: 'any'
                        }}
                        sx={{ width: 100 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        {product.unit}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">Total Price</Typography>
                      <Typography variant="h5" color="primary">
                        {formatCurrency(totalPrice)}
                      </Typography>
                    </Box>

                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={2}
                      sx={{ mt: 2 }}
                    >
                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<ShoppingCartIcon />} 
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>Product Description</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" paragraph>
                    {product.description}
                  </Typography>
                  
                  {/* Crop Details */}
                  {product.crop_details && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>About {cropName}</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" paragraph>
                        {product.crop_details.description}
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Growing Season</Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {product.crop_details.growing_season}
                          </Typography>
                          
                          <Typography variant="subtitle2">Growing Time</Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {product.crop_details.growing_time} months
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Temperature Range</Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {product.crop_details.min_temperature}°C - {product.crop_details.max_temperature}°C
                          </Typography>
                          
                          <Typography variant="subtitle2">Average Yield</Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {product.crop_details.average_yield} tons/acre
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Right: Related Products */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Similar Products</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {isLoadingRelated ? (
              <Loader size={30} />
            ) : relatedProducts.length > 0 ? (
              <List sx={{ p: 0 }}>
                {relatedProducts.slice(0, 5).map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem 
                      button 
                      onClick={() => navigate(`/marketplace/product/${item.id}`)}
                      sx={{ 
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          variant="rounded" 
                          src={item.images?.[0]?.image}
                          sx={{ width: 60, height: 60, mr: 1 }}
                        >
                          {item.title.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={item.title}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {formatCurrency(item.price_per_unit)} / {item.unit}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {item.seller?.first_name} {item.seller?.last_name}
                            </Typography>
                          </>
                        }
                        primaryTypographyProps={{
                          variant: 'subtitle2',
                          fontWeight: 'bold'
                        }}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                No similar products found
              </Typography>
            )}
            
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/marketplace')}
            >
              Browse All Products
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetail;