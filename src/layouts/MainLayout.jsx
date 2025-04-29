import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 4, 
          display: 'flex', 
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;