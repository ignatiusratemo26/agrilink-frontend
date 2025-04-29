import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardMedia,
  Container,
  Paper,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GrassIcon from '@mui/icons-material/Grass';
import StoreIcon from '@mui/icons-material/Store';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import farmerBg from '../assets/images/farmer-bg.jpg';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Crop Recommendations",
      description: "Get personalized crop recommendations based on your soil data and local climate conditions.",
      icon: <GrassIcon fontSize="large" color="primary" />,
      link: "/recommendations"
    },
    {
      title: "Marketplace",
      description: "Buy and sell agricultural products directly without intermediaries.",
      icon: <StoreIcon fontSize="large" color="primary" />,
      link: "/marketplace"
    },
    {
      title: "Community",
      description: "Connect with other farmers to share knowledge and experiences.",
      icon: <GroupsIcon fontSize="large" color="primary" />,
      link: "/community"
    },
    {
      title: "Learning Resources",
      description: "Access courses and resources to improve your farming techniques.",
      icon: <SchoolIcon fontSize="large" color="primary" />,
      link: "/learning"
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 6,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${farmerBg})`,
          borderRadius: 2,
          height: { xs: '50vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container>
          <Box sx={{ maxWidth: { md: '70%' } }}>
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{ fontWeight: 700, textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}
            >
              Empower Your Farming with Data-Driven Insights
            </Typography>
            <Typography
              variant="h5"
              paragraph
              sx={{ mb: 4, textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}
            >
              AgriLink helps farmers maximize yields by providing personalized crop recommendations, direct market access, and ongoing education.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                variant="contained" 
                size="large" 
                color="primary"
                onClick={() => navigate('/recommendations')}
              >
                Get Crop Recommendations
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                sx={{ color: 'white', borderColor: 'white' }}
                onClick={() => navigate('/marketplace')}
              >
                Visit Marketplace
              </Button>
            </Stack>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 700, mb: 6 }}
        >
          How AgriLink Helps You Succeed
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} md={6} lg={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 6
                  },
                  cursor: 'pointer'
                }}
                onClick={() => navigate(feature.link)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pt: 3
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          bgcolor: 'primary.light', 
          py: 8,
          borderRadius: 2,
          mb: 6
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                Ready to Optimize Your Farm?
              </Typography>
              <Typography variant="body1" paragraph>
                Join thousands of farmers using AgriLink to increase their yields, access better markets, and improve their farming practices.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
              <Button 
                variant="contained" 
                size="large" 
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/register')}
              >
                Get Started Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials would go here in a future version */}
    </Box>
  );
};

export default Home;