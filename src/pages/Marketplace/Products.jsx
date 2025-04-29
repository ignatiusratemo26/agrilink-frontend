import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  Badge,
  Fab,
  Divider,
  Drawer,
  IconButton, 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../../features/marketplace/marketplaceApi';
import ProductList from '../../components/marketplace/ProductList';
import Loader from '../../components/common/Loader';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import OrderForm from '../../components/marketplace/OrderForm';

const Products = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [tabValue, setTabValue] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { userProfile } = useSelector(state => state.auth);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddToCart = (product) => {
    // Check if the product is already in the cart
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity if already in cart
      setCartItems(
        cartItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      // Add new item with quantity 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    // Show cart
    setCartOpen(true);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };
  
  const handlePlaceOrder = (values) => {
    // Submit order logic
    console.log('Order placed with data:', values);
    
    // Clear cart and close checkout
    setCartItems([]);
    setCheckoutOpen(false);
    
    // Show order success notification or redirect to order confirmation page
    navigate('/marketplace/orders');
  };
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const CategoryTabs = () => (
    <Tabs 
      value={tabValue}
      onChange={handleTabChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ mb: 3 }}
      aria-label="product categories"
    >
      <Tab label="All Products" />
      <Tab label="Cereals & Grains" />
      <Tab label="Fruits" />
      <Tab label="Vegetables" />
      <Tab label="Livestock Products" />
      <Tab label="Organic" />
    </Tabs>
  );
  
  const CartDrawer = () => (
    <Drawer
      anchor="right"
      open={cartOpen}
      onClose={() => setCartOpen(false)}
    >
      <Box sx={{ width: 350, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Shopping Cart</Typography>
          <IconButton onClick={() => setCartOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1">Your cart is empty</Typography>
          </Box>
        ) : (
          <>
            <List>
              {cartItems.map(item => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFromCart(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={item.image || 'https://via.placeholder.com/40'} 
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          ${item.price_per_unit} per {item.unit}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1">Total</Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                ${cartItems.reduce((total, item) => total + (item.price_per_unit * item.quantity), 0).toFixed(2)}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
  
  const CheckoutDrawer = () => (
    <Drawer
      anchor="right"
      open={checkoutOpen}
      onClose={() => setCheckoutOpen(false)}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 500 } }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Checkout</Typography>
          <IconButton onClick={() => setCheckoutOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <OrderForm 
          cartItems={cartItems} 
          onSubmit={handlePlaceOrder} 
          onCancel={() => setCheckoutOpen(false)}
        />
      </Box>
    </Drawer>
  );

  if (userProfile?.user_type === 'farmer') {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">My Products</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/marketplace/create')}
          >
            Add New Product
          </Button>
        </Box>
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Alert severity="error">
            Failed to load products. Please try again later.
          </Alert>
        ) : (
          <ProductList products={products} />
        )}
      </Container>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Marketplace</Typography>
        <Box>
          <Button 
            startIcon={<FilterListIcon />} 
            sx={{ mr: 2 }}
          >
            Filter
          </Button>
          <Badge badgeContent={cartItemsCount} color="primary">
            <Button 
              startIcon={<ShoppingCartIcon />}
              onClick={() => setCartOpen(true)}
              variant={cartItemsCount > 0 ? "contained" : "outlined"}
            >
              Cart
            </Button>
          </Badge>
        </Box>
      </Box>
      
      <Paper sx={{ mb: 3, p: 1 }}>
        <CategoryTabs />
      </Paper>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Alert severity="error">
          Failed to load products. Please try again later.
        </Alert>
      ) : (
        <ProductList 
          products={products} 
          onAddToCart={handleAddToCart}
        />
      )}
      
      <CartDrawer />
      <CheckoutDrawer />
      
      {userProfile?.user_type === 'farmer' && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => navigate('/marketplace/create')}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Products;