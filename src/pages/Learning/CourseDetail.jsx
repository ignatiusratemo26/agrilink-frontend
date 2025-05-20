import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Tab,
  Tabs,
  Breadcrumbs,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetCourseByIdQuery } from '../../features/learning/learningApi';
import Loader from '../../components/common/Loader';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  const { 
    data: course, 
    isLoading, 
    error 
  } = useGetCourseByIdQuery(id);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return <Loader message="Loading course details..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load course details. Please try again later.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/learning')}
          sx={{ mt: 2 }}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Course not found.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/learning')}
          sx={{ mt: 2 }}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        {/* Breadcrumb navigation */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/learning" color="inherit">
            Learning Portal
          </MuiLink>
          <Typography color="text.primary">{course.title}</Typography>
        </Breadcrumbs>

        {/* Course Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 3, 
            borderRadius: 3,
            background: 'linear-gradient(45deg, #f3f9ff 0%, #ffffff 100%)',
            border: '1px solid #e0e0e0'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a3a5f' }}>
                {course.title}
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {course.is_free && (
                  <Chip 
                    label="Free" 
                    color="success" 
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                )}
                {course.is_featured && (
                  <Chip 
                    label="Featured" 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                )}
              </Stack>
              
              <Typography variant="body1" paragraph sx={{ color: '#546e7a' }}>
                {course.description}
              </Typography>
              
              <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={500}>
                    {course.level || 'Beginner'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={500}>
                    {course.duration ? `${Math.round(course.duration / 60)} hrs` : '2 hrs'} • {course.total_lessons || 0} lessons
                  </Typography>
                </Box>
                
                {course.instructor && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight={500}>
                      {course.instructor.first_name} {course.instructor.last_name}
                    </Typography>
                  </Box>
                )}
              </Stack>
              
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.2, 
                  fontWeight: 600, 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {course.is_enrolled ? 'Continue Learning' : course.is_free ? 'Enroll for Free' : 'Enroll Now'}
              </Button>
              
              {!course.is_free && !course.is_enrolled && (
                <Typography variant="h6" color="primary.main" sx={{ mt: 2, fontWeight: 600 }}>
                  KSh {parseFloat(course.price || 0).toLocaleString()}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              {course.instructor && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '1.75rem'
                    }}
                  >
                    {course.instructor.first_name.charAt(0)}
                  </Avatar>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {course.instructor.first_name} {course.instructor.last_name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <VerifiedIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.instructor.user_type === 'expert' ? 'Agricultural Expert' : 'Instructor'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    Expert in sustainable farming practices with years of experience in agricultural education.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Course Content */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="course tabs"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  py: 2,
                }
              }}
            >
              <Tab label="Course Content" />
              <Tab label="Overview" />
              <Tab label="Instructor" />
            </Tabs>
          </Box>
          
          {/* Course Content Tab */}
          <Box hidden={tabValue !== 0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {course.total_lessons || (course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0)} Lessons 
              • {course.modules?.length || 0} Modules
            </Typography>
            
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((module, index) => (
                <Accordion 
                  key={module.id} 
                  defaultExpanded={index === 0}
                  elevation={0}
                  sx={{
                    mb: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px !important',
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                    '&.Mui-expanded': {
                      margin: '0 0 16px 0',
                    }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`module${module.id}-content`}
                    id={`module${module.id}-header`}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      '&.Mui-expanded': {
                        minHeight: 56,
                      }
                    }}
                  >
                    <Box>
                      <Typography fontWeight="600">
                        Module {index + 1}: {module.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {module.lessons?.length || 0} lessons 
                        • {module.lessons?.reduce((total, lesson) => total + (lesson.duration || 0), 0) || 0} minutes
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {module.description && (
                      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {module.description}
                        </Typography>
                      </Box>
                    )}
                    
                    <List disablePadding sx={{ mt: 1 }}>
                      {module.lessons && module.lessons.map((lesson, i) => (
                        <React.Fragment key={lesson.id}>
                          {i > 0 && <Divider component="li" />}
                          <ListItem sx={{ pl: 3, py: 1.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {lesson.video_url ? 
                                <PlayCircleFilledIcon color="primary" /> : 
                                <ArticleIcon color="action" />
                              }
                            </ListItemIcon>
                            <ListItemText 
                              primary={lesson.title} 
                              secondary={`${lesson.duration || 10} min`} 
                              primaryTypographyProps={{ fontWeight: 500 }}
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Alert severity="info">
                The curriculum for this course will be available soon.
              </Alert>
            )}
          </Box>
          
          {/* Overview Tab */}
          <Box hidden={tabValue !== 1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              What you'll learn
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                'Understand core principles and techniques',
                'Apply practical knowledge in real-world scenarios',
                'Develop problem-solving skills',
                'Learn from industry experts'
              ].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box
                      component="span"
                      sx={{
                        mr: 1.5,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        flexShrink: 0
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body1">{item}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              Course Description
            </Typography>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
            <Typography variant="body1" paragraph>
              This course is designed for both beginners and experienced practitioners. You'll learn through 
              video lectures, hands-on exercises, and real-world case studies.
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <List>
                {[
                  'No prior knowledge required',
                  'Basic understanding of agriculture is helpful but not mandatory',
                  'Willingness to apply learned concepts in practice'
                ].map((item, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={`• ${item}`}
                      primaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
          
          {/* Instructor Tab */}
          <Box hidden={tabValue !== 2} sx={{ p: 3 }}>
            {course.instructor ? (
              <>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    mb: 4
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mr: { xs: 0, sm: 3 },
                      mb: { xs: 2, sm: 0 },
                      bgcolor: 'primary.main',
                      fontSize: '2.5rem'
                    }}
                  >
                    {course.instructor.first_name.charAt(0)}
                  </Avatar>
                  
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h5" gutterBottom>
                      {course.instructor.first_name} {course.instructor.last_name}
                    </Typography>
                    
                    <Typography variant="subtitle1" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                      <VerifiedIcon fontSize="small" sx={{ mr: 1 }} />
                      {course.instructor.user_type === 'expert' ? 'Agricultural Expert' : 'Instructor'}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      Specializing in sustainable agricultural practices with over 10 years of experience in 
                      the field. Passionate about educating farmers on modern techniques and environmental stewardship.
                    </Typography>
                    
                    <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                      <Chip label="Sustainable Farming" />
                      <Chip label="Crop Management" />
                      <Chip label="Agricultural Education" />
                    </Stack>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  About the Instructor
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {course.instructor.first_name} has dedicated their career to advancing sustainable agricultural 
                  practices and sharing knowledge with farmers across Kenya. With a background in Agricultural 
                  Sciences and years of field experience, they bring both theoretical knowledge and practical 
                  insights to their courses.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  As a recognized expert in the field, they have helped hundreds of farmers implement effective 
                  techniques that increase yields while preserving environmental resources. Their teaching methodology 
                  focuses on applicable skills that can be immediately implemented on any farm.
                </Typography>
              </>
            ) : (
              <Alert severity="info">
                Information about the instructor will be available soon.
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CourseDetail;