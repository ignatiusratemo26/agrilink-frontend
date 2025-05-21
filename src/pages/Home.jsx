import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardContent,
  Container,
  Paper,
  Stack,
  useTheme,
  alpha,
  Divider,
  Avatar,
  useMediaQuery,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GrassIcon from '@mui/icons-material/Grass';
import StoreIcon from '@mui/icons-material/Store';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpeedIcon from '@mui/icons-material/Speed';
import InsightsIcon from '@mui/icons-material/Insights';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import farmerBg from '../assets/images/farmer-bg.webp';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

const features = [
  {
    title: "Smart Crop Recommendations",
    description: "Get AI-powered crop suggestions based on your soil data, local climate conditions, and historical yield patterns. Our algorithms analyze multiple factors to optimize your planting decisions.",
    icon: <GrassIcon fontSize="large" style={{ color: '#4CAF50' }} />,
    link: "/recommendations",
    color: alpha('#4CAF50', 0.1)
  },
  {
    title: "Digital Marketplace",
    description: "Buy and sell agricultural products directly without intermediaries. Connect with buyers and sellers across the region, negotiate fair prices, and expand your market reach significantly.",
    icon: <StoreIcon fontSize="large" style={{ color: '#2196F3' }} />,
    link: "/marketplace",
    color: alpha('#2196F3', 0.1)
  },
  {
    title: "Farmer Community",
    description: "Connect with other farmers to share knowledge, experiences, and best practices. Ask questions, participate in discussions, and learn from agricultural experts in our supportive community.",
    icon: <GroupsIcon fontSize="large" style={{ color: '#FF9800' }} />,
    link: "/community",
    color: alpha('#FF9800', 0.1)
  },
  {
    title: "Learning Resources",
    description: "Access courses and resources to improve your farming techniques. Our educational content covers everything from soil management to financial planning for successful agricultural enterprises.",
    icon: <SchoolIcon fontSize="large" style={{ color: '#9C27B0' }} />,
    link: "/learning",
    color: alpha('#9C27B0', 0.1)
  }
];

  const benefits = [
    { 
      title: "Increased Crop Yields", 
      description: "Average 35% increase in yields through optimized farming practices",
      icon: <InsightsIcon fontSize="large" style={{ color: '#fff' }} />
    },
    { 
      title: "Reduce Resource Waste", 
      description: "Optimize water and fertilizer usage based on actual crop needs",
      icon: <SpeedIcon fontSize="large" style={{ color: '#fff' }} />
    },
    { 
      title: "Higher Quality Produce", 
      description: "Better farming practices lead to higher grade agricultural products",
      icon: <VerifiedUserIcon fontSize="large" style={{ color: '#fff' }} />
    }
  ];

  return (
    <Box>
      {/* Hero Section - Modern gradient overlay with subtle pattern */}
      <Box
        sx={{
          position: 'relative',
          color: '#fff',
          mb: { xs: 8, md: 12 },
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(21, 101, 47, 0.8) 100%), url(${farmerBg})`,
          height: { xs: '85vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
          // Add subtle pattern overlay
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.05" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            zIndex: 1,
          }
        }}
      >
        {/* Decorative circles */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '10%', 
            right: '5%', 
            width: '300px', 
            height: '300px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0) 70%)',
            zIndex: 0
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: '10%', 
            left: '5%', 
            width: '200px', 
            height: '200px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0) 70%)',
            zIndex: 0
          }} 
        />
        
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={7}>
              <Box sx={{ position: 'relative' }}>
                <Chip 
                  label="Agriculture Innovation Platform" 
                  color="success" 
                  variant="filled"
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600, 
                    borderRadius: '100px',
                    backgroundColor: '#4CAF50',
                    px: 2,
                    py: 2.5,
                    '& .MuiChip-label': { px: 1 }
                  }} 
                />
                
                <Typography 
                  variant="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800, 
                    textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    lineHeight: 1.2,
                    mb: 3
                  }}
                >
                  Farm Smarter <Box component="span" sx={{ color: '#8AE065' }}>with</Box> Data-Driven Insights
                </Typography>
                
                <Typography
                  variant="h5"
                  paragraph
                  sx={{ 
                    mb: 4, 
                    textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
                    opacity: 0.9,
                    maxWidth: '700px',
                    lineHeight: 1.5,
                    fontWeight: 400
                  }}
                >
                  AgriLink helps farmers increase yields with AI-powered crop recommendations, 
                  direct market access, and a supportive community of agricultural experts.
                </Typography>
                
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ mt: 5 }}
                >
                  <Button 
                    variant="contained" 
                    size="large" 
                    color="primary"
                    onClick={() => navigate('/recommendations')}
                    sx={{ 
                      py: 1.5, 
                      px: 4, 
                      borderRadius: '50px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      backgroundColor: '#4CAF50',
                      '&:hover': {
                        backgroundColor: '#3d8b40',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Get Crop Recommendations
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      py: 1.5, 
                      px: 4, 
                      borderRadius: '50px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => navigate('/marketplace')}
                  >
                    Visit Marketplace
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Quick Stats Bar */}
      <Container maxWidth="xl" sx={{ mb: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
            py: { xs: 2, md: 0 },
            mx: { xs: 2, md: 4 }
          }}
        >
          <Grid container>
            {['10,000+ Farmers', '35% Higher Yields', '24/7 Expert Support', '100+ Crop Varieties'].map((stat, index) => (
              <Grid 
                key={index} 
                item 
                xs={12} 
                sm={6} 
                md={3}
                sx={{
                  py: 3,
                  mx: 2,
                 
                  display: 'flex',
                  justifyContent: 'center',
                  borderRight: { 
                    xs: 'none',

                    md: index !== 3 ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none' 
                  },
                  borderBottom: { 
                    xs: index !== 3 ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none', 
                    md: 'none' 
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  textAlign="center"
                  color="text.primary"
                >
                  {stat}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Features Section - Cards with subtle green accents */}
      <Container sx={{ mb: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h5" 
            component="span" 
            sx={{ 
              color: '#4CAF50',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: '0.9rem'
            }}
          >
            Key Features
          </Typography>
          <Typography 
            variant="h2" 
            component="h2"
            sx={{ 
              fontWeight: 700, 
              mt: 1,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            How AgriLink Powers Your Farm
          </Typography>
          <Divider 
            sx={{ 
              width: '80px', 
              margin: '0 auto', 
              borderBottomWidth: 4, 
              borderColor: '#4CAF50',
              mb: 3
            }} 
          />
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              fontSize: '1.1rem'
            }}
          >
            Our platform combines AI technology with agricultural expertise to help you optimize every aspect of your farming operation.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} lg={3}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 4,
                  p: 3,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.8),
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 30px rgba(0,0,0,0.08)',
                    borderColor: 'transparent'
                  },
                  cursor: 'pointer'
                }}
                onClick={() => navigate(feature.link)}
              >
                <Box
                  sx={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: feature.color,
                    mb: 3
                  }}
                >
                  {feature.icon}
                </Box>

                {/* Decorative elements */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: `radial-gradient(circle at top right, ${feature.color} 0%, rgba(255,255,255,0) 70%)`,
                    opacity: 0.7,
                    zIndex: 0
                  }}
                />

                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ fontWeight: 600, zIndex: 1 }}
                >
                  {feature.title}
                </Typography>

                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ zIndex: 1, mb: 2 }}
                >
                  {feature.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', pt: 2 }}>
                  <Typography 
                    variant="button" 
                    sx={{ 
                      fontWeight: 600, 
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Learn More 
                    <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section - Green gradient background */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
          py: { xs: 8, md: 12 },
          color: 'white',
          mb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: '-15%',
            right: '-5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
          }}
        />

        <Container>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, position: 'relative', zIndex: 2 }}>
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              The AgriLink Advantage
            </Typography>
            <Typography 
              variant="h6"
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto',
                opacity: 0.9,
                fontWeight: 400
              }}
            >
              Join thousands of farmers who are transforming their operations with our platform
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item key={index} xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      mb: 3
                    }}
                  >
                    {benefit.icon}
                  </Avatar>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {benefit.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonial Section */}
      <Container sx={{ mb: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h5" 
            component="span" 
            sx={{ 
              color: '#4CAF50',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: '0.9rem'
            }}
          >
            Success Stories
          </Typography>
          <Typography 
            variant="h2" 
            component="h2"
            sx={{ 
              fontWeight: 700, 
              mt: 1,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            What Our Farmers Say
          </Typography>
          <Divider 
            sx={{ 
              width: '80px', 
              margin: '0 auto', 
              borderBottomWidth: 4, 
              borderColor: '#4CAF50',
              mb: 3
            }} 
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f9f9f9 0%, #f3f7f3 100%)',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.8),
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle at top right, rgba(76,175,80,0.1) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="John Doe"
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}
                />
                <Typography variant="h6" fontWeight="bold">
                  John Murefu
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Maize Farmer, Nairobi
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <EmojiNatureIcon sx={{ color: '#4CAF50' }} />
                  <EmojiNatureIcon sx={{ color: '#4CAF50', mx: 0.5 }} />
                  <EmojiNatureIcon sx={{ color: '#4CAF50' }} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontStyle: 'italic', 
                  mb: 3,
                  color: 'text.primary',
                  lineHeight: 1.6
                }}
              >
                "Since using AgriLink's crop recommendation system, my maize yield has increased by 40%. 
                The soil analysis and climate data insights helped me make better decisions about when to plant 
                and how to care for my crops. I've also found reliable buyers through the marketplace, 
                which has increased my profits significantly."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label="40% increased yield" 
                  color="success" 
                  variant="outlined"
                  sx={{ mr: 1, fontWeight: 600 }} 
                />
                <Chip 
                  label="25% higher profits" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }} 
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Call to Action - Modern floating design */}
      <Container sx={{ mb: 10, position: 'relative' }}>
        <Paper
          elevation={0}
          sx={{ 
            borderRadius: 5,
            py: { xs: 6, md: 8 },
            px: { xs: 3, md: 6 },
            background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          {/* Decorative elements */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: '10%',
              right: '5%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          
          <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                Ready to Transform Your Farm?
              </Typography>
              <Typography 
                variant="h6" 
                paragraph
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 400,
                  mb: { xs: 3, md: 1 }
                }}
              >
                Join thousands of farmers using AgriLink to increase their yields, access better markets, and improve their farming practices.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button 
                variant="contained" 
                size="large" 
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/register')}
                sx={{ 
                  py: 1.75, 
                  px: 4, 
                  borderRadius: '50px',
                  backgroundColor: 'white',
                  color: '#2E7D32',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Get Started Now
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;