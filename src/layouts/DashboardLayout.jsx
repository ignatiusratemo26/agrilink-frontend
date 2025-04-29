import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  useMediaQuery,
  useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GrassIcon from '@mui/icons-material/Grass';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ForumIcon from '@mui/icons-material/Forum';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

const navItems = [
  { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { name: 'Crop Recommendations', icon: <GrassIcon />, path: '/recommendations' },
  { name: 'Marketplace', icon: <ShoppingBasketIcon />, path: '/marketplace' },
  { name: 'Contracts', icon: <HandshakeIcon />, path: '/contracts' },
  { name: 'Community', icon: <ForumIcon />, path: '/community' },
  { name: 'Learning', icon: <SchoolIcon />, path: '/learning' },
  { name: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 'none',
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="primary.main" sx={{ flexGrow: 1 }}>
            AgriLink
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton component={RouterLink} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider />
          {!isMobile && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                © {new Date().getFullYear()} AgriLink
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;