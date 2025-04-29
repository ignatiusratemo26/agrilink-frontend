import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDate, formatCurrency } from '../../utils/formatters';

const OrderStatus = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
    case 'processing':
      return <Chip icon={<LocalShippingIcon />} label="Processing" color="info" size="small" />;
    case 'completed':
      return <Chip icon={<CheckCircleIcon />} label="Completed" color="success" size="small" />;
    case 'cancelled':
      return <Chip icon={<CancelIcon />} label="Cancelled" color="error" size="small" />;
    default:
      return <Chip label={status} size="small" />;
  }
};

// Row component for desktop view
const OrderRow = ({ order }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>#{order.id}</TableCell>
        <TableCell>{formatDate(order.created_at)}</TableCell>
        <TableCell>{formatCurrency(order.total_amount)}</TableCell>
        <TableCell>
          <OrderStatus status={order.status} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography>
              
              <Table size="small" aria-label="order items">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.product_title}
                      </TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell>{formatCurrency(item.price_per_unit)}</TableCell>
                      <TableCell>
                        {formatCurrency(item.quantity * item.price_per_unit)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Shipping Address:
                </Typography>
                <Typography variant="body2">
                  {order.shipping_address}, {order.shipping_city}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Card component for mobile view
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1">Order #{order.id}</Typography>
          <OrderStatus status={order.status} />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {formatDate(order.created_at)}
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 1 }}>
          {formatCurrency(order.total_amount)}
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </Typography>
          
          <Box 
            onClick={() => setExpanded(!expanded)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              color: 'primary.main'
            }}
          >
            <Typography variant="body2" sx={{ mr: 0.5 }}>
              {expanded ? 'Show Less' : 'Show Details'}
            </Typography>
            {expanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </Box>
        </Box>
        
        {expanded && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            
            {order.items.map((item, index) => (
              <Box key={item.id} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    {item.product_title}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(item.quantity * item.price_per_unit)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {item.quantity} {item.unit} x {formatCurrency(item.price_per_unit)}
                </Typography>
                {index < order.items.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Shipping Address:
              </Typography>
              <Typography variant="body2">
                {order.shipping_address}, {order.shipping_city}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const OrderList = ({ orders = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1">
          No orders found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {isMobile ? (
        <Box>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default OrderList;