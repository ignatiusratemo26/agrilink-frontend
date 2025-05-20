import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
  IconButton,
  Divider,
  TextField,
  Alert,
  Card,
  CardMedia,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectCartItems, 
  selectCartTotalAmount, 
  updateQuantity, 
  removeFromCart 
} from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/formatters';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleIncrementQuantity = (item) => {
    const newQuantity = Math.min(item.quantity + 1, 100); // Assuming max allowed is 100
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
  };

  const handleDecrementQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
    }
  };

  const handleCheckout = () => {
    navigate('/marketplace/checkout');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/marketplace')}
          sx={{ mb: 3 }}
        >
          Back to Marketplace
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ShoppingCartIcon sx={{ mr: 1, fontSize: 30, color: theme.palette.primary.main }} />
          <Typography variant="h4" fontWeight="bold">Your Cart</Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              p: 5, 
              textAlign: 'center',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/marketplace')}
              sx={{ mt: 2 }}
            >
              Browse Products
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Paper 
                elevation={0} 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                {isMobile ? (
                  // Mobile view as cards
                  <Box>
                    {cartItems.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          p: 2,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '&:last-child': { borderBottom: 'none' }
                        }}
                      >
                        <Box sx={{ display: 'flex', mb: 2 }}>
                          <Box
                            sx={{
                              width: 70,
                              height: 70,
                              mr: 2,
                              borderRadius: 1,
                              overflow: 'hidden',
                              flexShrink: 0
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={item.image || 'https://via.placeholder.com/70'}
                              alt={item.title}
                              sx={{ height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {item.title}
                              </Typography>
                              <IconButton 
                                size="small"
                                onClick={() => handleRemoveItem(item.id)}
                                sx={{ color: theme.palette.error.main }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(item.price_per_unit)} per {item.unit}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDecrementQuantity(item)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(
                                item.id, 
                                Math.max(1, parseInt(e.target.value) || 1)
                              )}
                              inputProps={{ 
                                min: 1, 
                                style: { textAlign: 'center', width: '30px' } 
                              }}
                              sx={{ mx: 1 }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => handleIncrementQuantity(item)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {item.unit}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {formatCurrency(item.price_per_unit * item.quantity)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  // Desktop view as table
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell width="50%">Product</TableCell>
                          <TableCell width="20%">Price</TableCell>
                          <TableCell width="20%">Quantity</TableCell>
                          <TableCell width="10%">Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    mr: 2,
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    flexShrink: 0
                                  }}
                                >
                                  <CardMedia
                                    component="img"
                                    image={item.image || 'https://via.placeholder.com/60'}
                                    alt={item.title}
                                    sx={{ height: '100%', objectFit: 'cover' }}
                                  />
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle1" fontWeight="medium">
                                    {item.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Seller: {item.seller?.first_name} {item.seller?.last_name}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatCurrency(item.price_per_unit)} per {item.unit}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDecrementQuantity(item)}
                                  disabled={item.quantity <= 1}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <TextField
                                  size="small"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(
                                    item.id, 
                                    Math.max(1, parseInt(e.target.value) || 1)
                                  )}
                                  inputProps={{ 
                                    min: 1, 
                                    style: { textAlign: 'center', width: '40px' } 
                                  }}
                                  sx={{ mx: 1 }}
                                />
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleIncrementQuantity(item)}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  {item.unit}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body1" fontWeight="bold">
                                  {formatCurrency(item.price_per_unit * item.quantity)}
                                </Typography>
                                <IconButton 
                                  size="small"
                                  onClick={() => handleRemoveItem(item.id)}
                                  sx={{ color: theme.palette.error.main }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'sticky',
                  top: 20
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">
                      Subtotal ({cartItems.length} items)
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatCurrency(totalAmount)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">
                      Shipping
                    </Typography>
                    <Typography variant="body1">
                      {totalAmount >= 5000 ? 'Free' : formatCurrency(300)}
                    </Typography>
                  </Box>
                  
                  {totalAmount >= 5000 && (
                    <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                      You've qualified for free shipping!
                    </Alert>
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(totalAmount + (totalAmount >= 5000 ? 0 : 300))}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  endIcon={<NavigateNextIcon />}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/marketplace')}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Continue Shopping
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Cart;