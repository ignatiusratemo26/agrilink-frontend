import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Loading indicator component with optional message
 */
const Loader = ({ message = 'Loading...', size = 40, sx = {} }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ py: 3, ...sx }}
    >
      <CircularProgress size={size} color="primary" />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;