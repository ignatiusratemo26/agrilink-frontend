import React from 'react';
import { Button as MuiButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Custom button component built on Material UI Button
 */
const Button = ({
  children,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      endIcon={endIcon}
      type={type}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;