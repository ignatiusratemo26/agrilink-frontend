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
  Paper
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { isValidPhone } from '../../utils/validators';

const OrderForm = ({ 
  cartItems, 
  onSubmit, 
  loading, 
  error,
  onCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price_per_unit * item.quantity);
    }, 0);
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
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Complete Your Order
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'Failed to place order'}
        </Alert>
      )}
      
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Shipping Information
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="shipping_address"
              name="shipping_address"
              label="Shipping Address"
              value={formik.values.shipping_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.shipping_address && Boolean(formik.errors.shipping_address)}
              helperText={formik.touched.shipping_address && formik.errors.shipping_address}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="shipping_city"
              name="shipping_city"
              label="City"
              value={formik.values.shipping_city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.shipping_city && Boolean(formik.errors.shipping_city)}
              helperText={formik.touched.shipping_city && formik.errors.shipping_city}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="contact_phone"
              name="contact_phone"
              label="Phone Number"
              value={formik.values.contact_phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contact_phone && Boolean(formik.errors.contact_phone)}
              helperText={formik.touched.contact_phone && formik.errors.contact_phone}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="contact_email"
              name="contact_email"
              label="Email (optional)"
              value={formik.values.contact_email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contact_email && Boolean(formik.errors.contact_email)}
              helperText={formik.touched.contact_email && formik.errors.contact_email}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Payment Method
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="payment-method-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-label"
                id="payment_method"
                name="payment_method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                label="Payment Method"
                disabled={loading}
              >
                <MenuItem value="mobile">Mobile Money</MenuItem>
                <MenuItem value="card">Credit/Debit Card</MenuItem>
                <MenuItem value="cash">Cash on Delivery</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {paymentMethod === 'mobile' && (
            <Grid item xs={12}>
              <Alert severity="info">
                You will receive payment instructions on your phone after placing the order.
              </Alert>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="notes"
              name="notes"
              label="Order Notes (Optional)"
              multiline
              rows={3}
              value={formik.values.notes}
              onChange={formik.handleChange}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Order Summary
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.title} ({item.quantity} {item.unit})
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(item.price_per_unit * item.quantity)}
                  </Typography>
                </Box>
              ))}
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  {formatCurrency(calculateTotal())}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            loading={loading}
          >
            Place Order
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderForm;