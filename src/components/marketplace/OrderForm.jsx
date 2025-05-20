import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Stack,
  useTheme,
  Chip,
  Avatar,
  useMediaQuery
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { isValidPhone } from '../../utils/validators';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// Import CryptoPayment component
import CryptoPayment from './CryptoPayment';

const OrderForm = ({ 
  cartItems, 
  onSubmit, 
  loading, 
  error,
  onCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price_per_unit * item.quantity);
    }, 0);
  };

  // Get ETH equivalent (simplified conversion for demo)
  const getEthAmount = (amount) => {
    // Simplified conversion rate: 1 ETH = $2000 USD
    return amount / 2000;
  };

  const formik = useFormik({
    initialValues: {
      shipping_address: '',
      shipping_city: '',
      contact_phone: '',
      contact_email: '',
      notes: '',
      payment_method: 'mobile'
    },
    validationSchema: Yup.object({
      shipping_address: Yup.string().required('Shipping address is required'),
      shipping_city: Yup.string().required('City is required'),
      contact_phone: Yup.string()
        .test('is-valid-phone', 'Invalid phone number', isValidPhone)
        .required('Phone number is required'),
      contact_email: Yup.string().email('Invalid email address'),
      payment_method: Yup.string().required('Payment method is required')
    }),
    onSubmit: (values) => {
      // If crypto payment is selected, handle it differently
      if (values.payment_method === 'crypto') {
        setShowCryptoPayment(true);
        return;
      }
      
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        ...values
      };
      onSubmit(orderData);
    }
  });

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    formik.setFieldValue('payment_method', event.target.value);
    setShowCryptoPayment(false); // Reset crypto payment form
  };

  const handleCryptoPaymentComplete = () => {
    // After crypto payment is complete, submit the form with payment info
    const orderData = {
      items: cartItems.map(item => ({
        product: item.id,
        quantity: item.quantity
      })),
      ...formik.values,
      payment_method: 'crypto',
      payment_status: 'completed',
      payment_txn: 'eth_transaction' // This would be the actual transaction hash in production
    };
    onSubmit(orderData);
  };

  const totalAmount = calculateTotal();
  const shippingCost = totalAmount > 5000 ? 0 : 300;
  const finalTotal = totalAmount + shippingCost;
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const ethAmount = getEthAmount(finalTotal);

  // If showing crypto payment, render that instead of the form
  if (showCryptoPayment) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>Complete Your Payment</Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please complete your payment using Ethereum. The payment will be held in escrow until you confirm receipt of the goods.
        </Alert>
        
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            mb: 3
          }}
        >
          <Typography variant="h6" gutterBottom>Order Summary</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">Order Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body1" fontWeight="bold">{formatCurrency(finalTotal)}</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body1">Amount in ETH:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body1" fontWeight="bold">{ethAmount.toFixed(6)} ETH</Typography>
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ mb: 3 }}>
          <CryptoPayment 
            sellerAddress="0x742d35Cc6634C0532925a3b844Bc454e4438f44e" // This should come from the seller's profile
            amountETH={ethAmount}
            onPaymentComplete={handleCryptoPaymentComplete}
          />
        </Box>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setShowCryptoPayment(false)}
          sx={{ mt: 2 }}
        >
          Back to Payment Options
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Complete Your Order
        </Typography>
        <Chip 
          icon={<ShoppingCartIcon />} 
          label={`${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
        />
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {typeof error === 'string' ? error : 'Failed to place order'}
        </Alert>
      )}
      
      {/* Order Process Steps */}
      <Stepper 
        activeStep={1} 
        alternativeLabel={!isMobile}
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{ mb: 4 }}
      >
        <Step completed>
          <StepLabel>Review Cart</StepLabel>
        </Step>
        <Step active>
          <StepLabel>Delivery Details</StepLabel>
        </Step>
        <Step>
          <StepLabel>Confirmation</StepLabel>
        </Step>
      </Stepper>
      
      {/* Main Content */}
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          {/* Left Column - Form Fields */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              {/* Shipping Information Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{ 
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      mr: 1.5
                    }}
                  >
                    <LocationOnIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="medium">
                    Shipping Information
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="shipping_address"
                      name="shipping_address"
                      label="Shipping Address"
                      placeholder="Enter your complete address"
                      value={formik.values.shipping_address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.shipping_address && Boolean(formik.errors.shipping_address)}
                      helperText={formik.touched.shipping_address && formik.errors.shipping_address}
                      disabled={loading}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="shipping_city"
                      name="shipping_city"
                      label="City"
                      placeholder="Enter your city"
                      value={formik.values.shipping_city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.shipping_city && Boolean(formik.errors.shipping_city)}
                      helperText={formik.touched.shipping_city && formik.errors.shipping_city}
                      disabled={loading}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="contact_phone"
                      name="contact_phone"
                      label="Phone Number"
                      placeholder="E.g., +254712345678"
                      value={formik.values.contact_phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.contact_phone && Boolean(formik.errors.contact_phone)}
                      helperText={formik.touched.contact_phone && formik.errors.contact_phone}
                      disabled={loading}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="contact_email"
                      name="contact_email"
                      label="Email (optional)"
                      placeholder="your.email@example.com"
                      value={formik.values.contact_email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.contact_email && Boolean(formik.errors.contact_email)}
                      helperText={formik.touched.contact_email && formik.errors.contact_email}
                      disabled={loading}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                  </Grid>
                </Grid>
              </Paper>
              
              {/* Payment Method Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{ 
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      mr: 1.5
                    }}
                  >
                    <PaymentIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="medium">
                    Payment Method
                  </Typography>
                </Box>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="payment-method-label">Select Payment Method</InputLabel>
                  <Select
                    labelId="payment-method-label"
                    id="payment_method"
                    name="payment_method"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    label="Select Payment Method"
                    disabled={loading}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  >
                    <MenuItem value="mobile">Mobile Money (M-Pesa, Airtel Money)</MenuItem>
                    <MenuItem value="card">Credit/Debit Card</MenuItem>
                    <MenuItem value="cash">Cash on Delivery</MenuItem>
                    <MenuItem value="crypto">Cryptocurrency (Ethereum)</MenuItem>
                  </Select>
                </FormControl>
                
                {paymentMethod === 'mobile' && (
                  <Alert 
                    severity="info"
                    variant="outlined"
                    sx={{ borderRadius: 1.5 }}
                  >
                    You will receive payment instructions on your phone after placing the order.
                  </Alert>
                )}
                
                {paymentMethod === 'card' && (
                  <Alert 
                    severity="info"
                    variant="outlined"
                    sx={{ borderRadius: 1.5 }}
                  >
                    You will be redirected to a secure payment page after submitting your order.
                  </Alert>
                )}
                
                {paymentMethod === 'cash' && (
                  <Alert 
                    severity="info"
                    variant="outlined"
                    sx={{ borderRadius: 1.5 }}
                  >
                    Payment will be collected upon delivery of your items.
                  </Alert>
                )}
                
                {paymentMethod === 'crypto' && (
                  <Alert 
                    severity="info"
                    variant="outlined"
                    sx={{ borderRadius: 1.5 }}
                  >
                    You'll be prompted to complete your payment using Ethereum after submitting your order.
                    Amount: {ethAmount.toFixed(6)} ETH (≈ {formatCurrency(finalTotal)})
                  </Alert>
                )}
              </Paper>
              
              {/* Delivery Notes Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{ 
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      mr: 1.5
                    }}
                  >
                    <LocalShippingIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="medium">
                    Delivery Notes
                  </Typography>
                </Box>
                
                <TextField
                  fullWidth
                  id="notes"
                  name="notes"
                  label="Special Instructions (Optional)"
                  placeholder="Add any delivery instructions or notes for your order"
                  multiline
                  rows={3}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  disabled={loading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />
              </Paper>
            </Stack>
          </Grid>
          
          {/* Right Column - Order Summary */}
          <Grid item xs={12} md={5}>
            <Box 
              component={Paper} 
              elevation={0}
              sx={{ 
                p: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                position: 'sticky',
                top: 20
              }}
            >
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Order Summary
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2} sx={{ mb: 3 }}>
                {cartItems.map((item) => (
                  <Box 
                    key={item.id} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      py: 1
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} {item.unit} × {formatCurrency(item.price_per_unit)}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="bold" sx={{ ml: 2 }}>
                      {formatCurrency(item.price_per_unit * item.quantity)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(totalAmount)}
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Shipping
                </Typography>
                <Typography variant="body1">
                  {totalAmount > 5000 ? 'Free' : formatCurrency(shippingCost)}
                </Typography>
              </Box>
              
              {totalAmount > 5000 && (
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label="Free shipping on orders above KSh 5,000" 
                    color="success"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                  />
                </Box>
              )}
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: 2,
                  py: 2,
                  borderTop: `1px dashed ${theme.palette.divider}`,
                  borderBottom: `1px dashed ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {formatCurrency(finalTotal)}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={loading}
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2,
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  {paymentMethod === 'crypto' ? 'Continue to Payment' : 'Place Order'}
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  onClick={onCancel}
                  disabled={loading}
                  sx={{ 
                    mt: 2, 
                    borderRadius: 2
                  }}
                >
                  Back to Cart
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OrderForm;