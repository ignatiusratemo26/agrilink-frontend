import React from 'react';
import { 
  Typography, 
  Box, 
  Chip, 
  Button,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ 
  product, 
  onAddToCart,
  showDetails = true,
  elevation = 1
}) => {
  const navigate = useNavigate();
  const { 
    id, 
    title, 
    description, 
    price_per_unit, 
    unit, 
    quantity_available, 
    image, 
    seller_name, 
    organic,
    rating 
  } = product;

  const handleClick = () => {
    if (showDetails) {
      navigate(`/marketplace/product/${id}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Card
      title={title}
      subheader={seller_name ? `Seller: ${seller_name}` : null}
      image={image || 'https://via.placeholder.com/300x200?text=Product'}
      elevation={elevation}
      onClick={showDetails ? handleClick : undefined}
      sx={{
        position: 'relative',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': showDetails ? {
          transform: 'translateY(-5px)',
        } : {},
      }}
      headerProps={{
        action: organic ? (
          <Chip 
            label="Organic" 
            color="success" 
            size="small" 
            sx={{ fontWeight: 'bold' }} 
          />
        ) : null,
      }}
      actions={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="body1" fontWeight="bold" color="primary">
            <LocalOfferIcon sx={{ fontSize: 16, verticalAlign: 'text-top', mr: 0.5 }} />
            {formatCurrency(price_per_unit)} / {unit}
          </Typography>
          {onAddToCart && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              startIcon={<AddShoppingCartIcon />}
              sx={{ ml: 1 }}
            >
              Add
            </Button>
          )}
        </Box>
      }
    >
      <Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
          }}
        >
          {description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Available:</strong> {quantity_available} {unit}
          </Typography>
          {rating && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={rating} readOnly size="small" precision={0.5} />
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default ProductCard;