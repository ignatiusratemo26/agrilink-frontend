import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h2" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" color="text.secondary" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Box>
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Go Home
          </Button>
          <Button 
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;