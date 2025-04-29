import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} AgriLink. All rights reserved.
      </Typography>
      <Typography variant="body2">
        <Link href="/terms" color="inherit" underline="hover">
          Terms of Service
        </Link>{' '}
        |{' '}
        <Link href="/privacy" color="inherit" underline="hover">
          Privacy Policy
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;