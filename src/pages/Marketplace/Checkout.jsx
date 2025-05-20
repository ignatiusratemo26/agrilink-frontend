import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { 
  selectCartItems, 
  selectCartTotalAmount,
  clearCart
} from '../../features/cart/cartSlice';
import { useCreateOrderMutation } from '../../features/marketplace/marketplaceApi';
import { formatCurrency } from '../../utils/formatters';
import OrderForm from '../../components/marketplace/OrderForm';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [cryptoPaymentInfo, setCryptoPaymentInfo] = useState(null);
  
  // Redirect to marketplace if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/marketplace');
    }
  }, [cartItems, navigate]);
  
  const handlePlaceOrder = async (formData) => {
    try {
      // Check if this is a crypto payment with transaction details
      const paymentDetails = formData.payment_method === 'crypto' && formData.txHash 
        ? {
            payment_transaction: formData.txHash,
            payment_contract: formData.contractAddress,
            payment_amount_crypto: formData.amount
          }
        : {};
      
      // Format data for API
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        ...formData,
        ...paymentDetails
      };
      
      // Submit the order
      const result = await createOrder(orderData).unwrap();
      
      // Clear the cart
      dispatch(clearCart());
      
      // Navigate to orders page
      navigate('/marketplace/orders');
      
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <Container>
        <Alert severity="info">
          Your cart is empty. Please add items to your cart before checkout.
        </Alert>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/marketplace')}
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/marketplace/cart')}
          sx={{ mb: 3 }}
        >
          Back to Cart
        </Button>
        
        <OrderForm
          cartItems={cartItems}
          onSubmit={handlePlaceOrder}
          loading={isLoading}
          error={error}
          onCancel={() => navigate('/marketplace/cart')}
          cryptoPaymentInfo={cryptoPaymentInfo}
          onCryptoPaymentComplete={setCryptoPaymentInfo}
        />
      </Box>
    </Container>
  );
};

export default Checkout;