import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Badge,
  Container,
  Tooltip,
  Chip,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import GrassIcon from '@mui/icons-material/Grass';
import SchoolIcon from '@mui/icons-material/School';
import ForumIcon from '@mui/icons-material/Forum';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { checkTokenValidity } from '../../features/auth/authSlice';
import PaidIcon from '@mui/icons-material/Paid';


const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, userProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Verify authentication status when component loads
  useEffect(() => {
    dispatch(checkTokenValidity());
    // console.log("Auth status in Navbar:", isAuthenticated);
  }, [dispatch]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    handleMenuClose();
    // Redirect to home page with a slight delay to allow state update
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Define menu items for authenticated users
  const authenticatedMenuItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'Marketplace', icon: <ShoppingBasketIcon />, link: '/marketplace' },
    { text: 'Crop Recommendations', icon: <GrassIcon />, link: '/recommendations' },
    { text: 'Learning', icon: <SchoolIcon />, link: '/learning' },
    { text: 'Community', icon: <ForumIcon />, link: '/community' },
    { text: 'Contracts', icon: <HandshakeIcon />, link: '/contracts' },
    { text: 'Pricing', icon: <PaidIcon />, link: '/pricing' },
  ];

  // Get active route for highlighting
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0 }, py: 1 }}>
          {isMobile && isAuthenticated && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              size="large"
              sx={{ 
                mr: 1,
                color: theme.palette.primary.main
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{ 
              flexGrow: { xs: 1, md: isAuthenticated ? 0 : 1 },
              textDecoration: 'none', 
              color: theme.palette.primary.main,
              fontWeight: 700,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              mr: 4
            }}
          >
            {/* <GrassIcon sx={{ mr: 1, fontSize: '2rem' }} /> */}
            Agrilink
          </Typography>
          
          {!isMobile && isAuthenticated && (
            <Box sx={{ 
              display: 'flex', 
              flexGrow: 1, 
              gap: 0.5,
              ml: 2,
              '& .MuiButton-root': {
                px: 2,
                py: 1,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 500,
                transition: 'all 0.2s ease-in-out',
              },
            }}>
              {authenticatedMenuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.link}
                  color={isActiveRoute(item.link) ? "primary" : "inherit"}
                  startIcon={item.icon}
                  sx={{
                    background: isActiveRoute(item.link) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    fontWeight: isActiveRoute(item.link) ? 600 : 500,
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/pricing"
                  color="inherit"
                  startIcon={<PaidIcon />}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Pricing
                </Button>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                startIcon={<LoginIcon />}
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none'
                }}
              >
                Sign Up
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* {!isMobile && (
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )} */}
              
              <Box 
                onClick={handleMenuOpen}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  borderRadius: '24px',
                  py: 0.5,
                  px: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {userProfile?.first_name?.charAt(0) || <AccountCircleIcon />}
                </Avatar>
                
                {/* {!isMobile && (
                  <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {userProfile?.first_name || 'User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {userProfile?.user_type || 'Buyer'}
                    </Typography>
                  </Box>
                )} */}
              </Box>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { 
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: theme.shadows[3]
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name || ''}` : 'User Profile'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {userProfile?.email || 'user@example.com'}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={userProfile?.user_type || 'User'}
                    color="primary" 
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Box> */}
                
                {/* <Divider /> */}
                
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>My Profile</ListItemText>
                </MenuItem>
                
                <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{ 
          sx: { 
            width: '80%', 
            maxWidth: 280,
            borderRadius: '0 16px 16px 0'
          } 
        }}
      >
        <Box
          sx={{ width: '100%' }}
          role="presentation"
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              backgroundColor: theme.palette.primary.main,
              color: 'white'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              <GrassIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              AgriLink
            </Typography>
            <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {userProfile && (
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: 'white'
                }}
              >
                {userProfile?.first_name?.charAt(0) || <AccountCircleIcon />}
              </Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name || ''}` : 'User Profile'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userProfile?.email || 'user@example.com'}
                </Typography>
              </Box>
            </Box>
          )}
          
          <List component="nav" sx={{ pt: 0 }}>
            {authenticatedMenuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={RouterLink}
                to={item.link}
                onClick={toggleDrawer(false)}
                selected={isActiveRoute(item.link)}
                sx={{
                  borderLeft: isActiveRoute(item.link) ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                  pl: 2,
                  py: 1.5,
                  backgroundColor: isActiveRoute(item.link) ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActiveRoute(item.link) ? theme.palette.primary.main : 'inherit',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActiveRoute(item.link) ? 600 : 500,
                    color: isActiveRoute(item.link) ? theme.palette.primary.main : 'inherit'
                  }} 
                />
              </ListItem>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <ListItem
              button
              onClick={() => {
                toggleDrawer(false)();
                handleLogout();
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ 
                  color: theme.palette.error.main,
                  fontWeight: 500
                }} 
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;