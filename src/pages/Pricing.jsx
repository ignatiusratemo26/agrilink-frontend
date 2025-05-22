import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormGroup,
  FormControlLabel,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
  Tabs,
  Tab
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import GrassIcon from '@mui/icons-material/Grass';
import StoreIcon from '@mui/icons-material/Store';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StorageIcon from '@mui/icons-material/Storage';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [annual, setAnnual] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderFeatureIcon = (included) => {
    return included ? 
      <CheckCircleIcon fontSize="small" color="success" /> : 
      <CancelIcon fontSize="small" color="disabled" />;
  };

  // Pricing tiers for farmers
  const farmerTiers = [
    {
      title: "Basic",
      description: "Get started with essential tools",
      price: annual ? "Free" : "Free",
      color: theme.palette.grey[700],
      buttonText: "Get Started",
      buttonVariant: "outlined",
      features: [
        { title: "Basic soil analysis", included: true },
        { title: "Up to 3 product listings", included: true },
        { title: "Community forum access", included: true },
        { title: "Basic learning resources", included: true },
        { title: "Basic crop recommendations", included: true },
        { title: "Advanced AI insights", included: false },
        { title: "Priority marketplace positioning", included: false },
        { title: "Unlimited product listings", included: false },
        { title: "Premium learning courses", included: false },
      ]
    },
    {
      title: "Growth",
      description: "Ideal for growing farms",
      price: annual ? "Ksh 2,400/yr" : "Ksh 250/mo",
      originalPrice: annual ? "Ksh 3,000/yr" : "",
      color: theme.palette.primary.main,
      popular: true,
      buttonText: "Subscribe",
      buttonVariant: "contained",
      features: [
        { title: "Advanced soil analysis", included: true },
        { title: "Up to 10 product listings", included: true },
        { title: "Community forum access", included: true },
        { title: "5 premium learning courses", included: true },
        { title: "Advanced crop recommendations", included: true },
        { title: "Climate insights & forecasts", included: true },
        { title: "Priority marketplace positioning", included: false },
        { title: "Unlimited product listings", included: false },
        { title: "Sales analytics dashboard", included: true },
      ]
    },
    {
      title: "Professional",
      description: "For commercial farmers",
      price: annual ? "Ksh 7,200/yr" : "Ksh 800/mo",
      originalPrice: annual ? "Ksh 9,600/yr" : "",
      color: theme.palette.success.main,
      buttonText: "Subscribe",
      buttonVariant: "contained",
      features: [
        { title: "Advanced soil analysis", included: true },
        { title: "Unlimited product listings", included: true },
        { title: "Community forum access", included: true },
        { title: "All premium learning courses", included: true },
        { title: "Advanced crop recommendations", included: true },
        { title: "Climate insights & forecasts", included: true },
        { title: "Priority marketplace positioning", included: true },
        { title: "Dedicated account manager", included: true },
        { title: "Advanced sales analytics", included: true },
      ]
    }
  ];

  // Pricing for business services
  const businessTiers = [
    {
      title: "AgriData",
      description: "Ethical agricultural data",
      price: "Starting at Ksh 50,000",
      icon: <StorageIcon fontSize="large" sx={{ color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
      features: [
        "Anonymized & aggregated farm data",
        "Regional crop performance insights",
        "Soil health trends across regions",
        "Market pricing analytics",
        "Climate impact datasets"
      ]
    },
    {
      title: "AI as a Service",
      description: "Advanced agricultural AI",
      price: "Starting at Ksh 25,000/mo",
      icon: <PsychologyIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
      features: [
        "Custom crop recommendation APIs",
        "High-accuracy yield forecasting",
        "Soil testing integration",
        "Dedicated technical support",
        "Custom AI model development"
      ]
    },
    {
      title: "Learning Platform",
      description: "Agricultural education",
      price: "Ksh 400 - 2,000 per course",
      icon: <SchoolIcon fontSize="large" sx={{ color: theme.palette.warning.main }} />,
      color: theme.palette.warning.main,
      features: [
        "Practical farming courses",
        "Mobile-friendly video content",
        "Downloadable resources",
        "Expert-led instruction",
        "Official certification available"
      ]
    },
    {
      title: "Web3 Escrow",
      description: "Secure blockchain payments",
      price: "2-3% transaction fee",
      icon: <AccountBalanceWalletIcon fontSize="large" sx={{ color: theme.palette.info.main }} />,
      color: theme.palette.info.main,
      features: [
        "Secure cryptocurrency payments",
        "Smart contract escrow system",
        "Lower fees than traditional banking",
        "Instant settlement options",
        "Transparent transaction history"
      ]
    }
  ];

  // Marketplace transaction fees
  const transactionTiers = [
    {
      title: "Standard",
      description: "For most transactions",
      fee: "5% per transaction",
      minValue: "0",
      maxValue: "Ksh 10,000",
      color: theme.palette.primary.main
    },
    {
      title: "Medium Volume",
      description: "For larger transactions",
      fee: "3.5% per transaction",
      minValue: "Ksh 10,001",
      maxValue: "Ksh 50,000",
      color: theme.palette.success.main
    },
    {
      title: "High Volume",
      description: "For bulk purchases",
      fee: "2% per transaction",
      minValue: "Ksh 50,001",
      maxValue: "+",
      color: theme.palette.secondary.main
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header Section */}
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography 
          variant="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.success.main} 90%)`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Pricing Plans
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            maxWidth: 700, 
            mx: 'auto', 
            mb: 3,
            color: 'text.secondary',
            fontWeight: 400
          }}
        >
          Multiple revenue streams, one ecosystem. Choose the plan that best fits your agricultural journey.
        </Typography>
        
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          centered
          sx={{ 
            mb: 4, 
            '& .MuiTab-root': { 
              minWidth: { xs: 'auto', md: 150 },
              px: { xs: 2, md: 4 }
            } 
          }}
        >
          <Tab 
            icon={<GrassIcon />} 
            label="Farmer Plans" 
            iconPosition="start" 
          />
          <Tab 
            icon={<StoreIcon />} 
            label="Transaction Fees" 
            iconPosition="start" 
          />
          <Tab 
            icon={<SchoolIcon />} 
            label="Business Services" 
            iconPosition="start" 
          />
        </Tabs>
      </Box>

      {/* Farmer Subscription Plans */}
      {selectedTab === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <FormGroup>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={annual}
                    onChange={() => setAnnual(!annual)}
                  />
                } 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1">
                      {annual ? 'Annual (Save 20%)' : 'Monthly'}
                    </Typography>
                    {annual && (
                      <Chip 
                        label="20% OFF" 
                        size="small" 
                        color="success"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
              />
            </FormGroup>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {farmerTiers.map((tier, index) => (
              <Grid 
                item 
                xs={12} 
                md={4} 
                key={tier.title}
              >
                <Card 
                  elevation={tier.popular ? 8 : 2}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    borderRadius: 4,
                    border: tier.popular ? `2px solid ${tier.color}` : 'none',
                    overflow: 'visible',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  {tier.popular && (
                    <Chip 
                      label="MOST POPULAR" 
                      color="primary"
                      sx={{ 
                        position: 'absolute',
                        top: -15,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 'bold',
                        px: 2
                      }}
                    />
                  )}
                  <CardHeader
                    title={tier.title}
                    subheader={tier.description}
                    titleTypographyProps={{ align: 'center', fontWeight: 'bold', variant: 'h5' }}
                    subheaderTypographyProps={{ align: 'center' }}
                    sx={{
                      backgroundColor: alpha(tier.color, 0.1),
                      borderBottom: `1px solid ${alpha(tier.color, 0.2)}`
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      {tier.originalPrice && (
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            textDecoration: 'line-through', 
                            color: 'text.secondary',
                            display: 'inline-block',
                            mr: 1
                          }}
                        >
                          {tier.originalPrice}
                        </Typography>
                      )}
                      <Typography 
                        variant="h4" 
                        color="text.primary" 
                        sx={{ 
                          fontWeight: 'bold', 
                          display: 'inline-block',
                          color: tier.color
                        }}
                      >
                        {tier.price}
                      </Typography>
                    </Box>

                    <List dense>
                      {tier.features.map((feature) => (
                        <ListItem key={feature.title} disableGutters>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {renderFeatureIcon(feature.included)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature.title} 
                            primaryTypographyProps={{ 
                              fontWeight: feature.included ? 500 : 400,
                              color: feature.included ? 'text.primary' : 'text.secondary',
                            }} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={tier.buttonVariant}
                      color={tier.buttonVariant === 'contained' ? 'primary' : 'inherit'}
                      sx={{ 
                        py: 1.5, 
                        fontSize: '1rem',
                        backgroundColor: tier.buttonVariant === 'contained' ? tier.color : 'transparent',
                        borderColor: tier.color,
                        color: tier.buttonVariant === 'contained' ? '#fff' : tier.color,
                        '&:hover': {
                          backgroundColor: tier.buttonVariant === 'contained' ? alpha(tier.color, 0.9) : alpha(tier.color, 0.1),
                          borderColor: tier.color
                        }
                      }}
                    >
                      {tier.buttonText}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Marketplace Transaction Fees */}
      {selectedTab === 1 && (
        <Box>
          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom
            sx={{ mb: 4, fontWeight: 600 }}
          >
            Marketplace Transaction Fee Structure
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {transactionTiers.map((tier) => (
              <Grid item xs={12} md={4} key={tier.title}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                    },
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: alpha(tier.color, 0.1),
                      py: 3,
                      textAlign: 'center',
                      borderBottom: `1px solid ${alpha(tier.color, 0.2)}`
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold">{tier.title}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">{tier.description}</Typography>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        color: tier.color
                      }}
                    >
                      {tier.fee}
                    </Typography>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Transaction Value</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {tier.minValue} - {tier.maxValue}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ bgcolor: alpha(tier.color, 0.05), p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Example: Ksh 20,000 sale
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        = Ksh {(parseFloat(tier.fee) * 20000 / 100).toLocaleString()} fee
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6, p: 4, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>Additional Benefits</Typography>
            <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 800, mx: 'auto' }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography>No hidden transaction fees</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography>Transparent pricing structure</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography>Secure payment processing</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography>Volume discounts available</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}

      {/* Business Services */}
      {selectedTab === 2 && (
        <Box>
          <Grid container spacing={4}>
            {businessTiers.map((tier) => (
              <Grid item xs={12} md={6} key={tier.title}>
                <Card 
                  sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: 4
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: alpha(tier.color, 0.1),
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: { xs: '100%', sm: '30%' },
                      minWidth: { sm: 200 }
                    }}
                  >
                    {tier.icon}
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mt: 2,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: tier.color
                      }}
                    >
                      {tier.title}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ textAlign: 'center', mt: 1 }}>
                      {tier.description}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3, width: { xs: '100%', sm: '70%' } }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {tier.price}
                    </Typography>
                    
                    <List dense>
                      {tier.features.map((feature, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon fontSize="small" sx={{ color: tier.color }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>

                    <Button 
                      variant="outlined" 
                      sx={{ 
                        mt: 2, 
                        borderColor: tier.color, 
                        color: tier.color,
                        '&:hover': {
                          borderColor: tier.color,
                          backgroundColor: alpha(tier.color, 0.1)
                        }
                      }}
                    >
                      Request Info
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* FAQ Section */}
      <Box sx={{ mt: 12, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
          Have questions about our pricing? Find answers to common questions below, or contact us for more information.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ textAlign: 'left', p: 3, height: '100%', borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                How do farmer subscriptions work?
              </Typography>
              <Typography variant="body2">
                Farmer subscriptions are available in monthly or annual plans. Annual plans provide a 20% discount. 
                You can upgrade, downgrade, or cancel your subscription at any time from your account settings.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ textAlign: 'left', p: 3, height: '100%', borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Are there any hidden fees?
              </Typography>
              <Typography variant="body2">
                No. We're transparent about our pricing. For marketplace transactions, we only charge the percentage 
                listed above. For subscription plans, the price shown is what you'll pay, with no hidden costs.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ textAlign: 'left', p: 3, height: '100%', borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                How do I pay for services?
              </Typography>
              <Typography variant="body2">
                We accept mobile money (M-Pesa), bank transfers, and cryptocurrency payments. For subscriptions, 
                you can set up recurring payments through any of these methods.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ textAlign: 'left', p: 3, height: '100%', borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                What happens to my data?
              </Typography>
              <Typography variant="body2">
                We take data privacy seriously. Your personal information is never sold. For our AgriData service, 
                we only use anonymized and aggregated data, and farmers are compensated through platform benefits 
                and improved services.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          mt: 8, 
          textAlign: 'center', 
          p: 6, 
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.success.main, 0.9)} 100%)`,
          color: '#fff',
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Ready to transform your farming business?
        </Typography>
        <Typography 
          variant="h6" 
          paragraph 
          sx={{ 
            maxWidth: 700, 
            mx: 'auto', 
            mb: 4,
            opacity: 0.9
          }}
        >
          Join thousands of farmers already using AgriLink to increase yields, 
          access better markets, and build more sustainable farming practices.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/register')}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem',
              backgroundColor: '#fff',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha('#fff', 0.9)
              }
            }}
          >
            Get Started Free
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/contact')}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem',
              borderColor: '#fff',
              color: '#fff',
              '&:hover': {
                borderColor: '#fff',
                backgroundColor: alpha('#fff', 0.1)
              }
            }}
          >
            Contact Sales
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Pricing;