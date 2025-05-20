import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  Tab,
  Tabs,
  Alert,
  IconButton,
  LinearProgress,
  alpha,
  Badge,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  useGetCoursesQuery,
  useEnrollInCourseMutation
} from '../../features/learning/learningApi';
import Loader from '../../components/common/Loader';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { useTheme } from '@mui/material/styles';

const Courses = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: courses, isLoading, error } = useGetCoursesQuery();
  const [enrollInCourse, { isLoading: isEnrolling }] = useEnrollInCourseMutation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId).unwrap();
      navigate(`/learning/course/${courseId}`);
    } catch (err) {
      console.error('Failed to enroll in course:', err);
    }
  };
  
  // Filter and sort courses based on the active tab and search term
  const getFilteredCourses = () => {
    if (!courses) return [];
    
    let filtered = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tab filter
    switch (tabValue) {
      case 0: // All courses
        return filtered;
      case 1: // My courses (enrolled)
        return filtered.filter(course => course.is_enrolled);
      case 2: // Featured courses
        return filtered.filter(course => course.is_featured);
      case 3: // New courses
        return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return filtered;
    }
  };
  
  // Get a random progress value for demo purposes
  const getRandomProgress = (courseId) => {
    // Use course ID as seed for consistent random values
    return (courseId * 13) % 100;
  };
  
  // Get a consistent color based on course level
  const getLevelColor = (level) => {
    if (!level) return theme.palette.info.main;
    
    const levelLower = level.toLowerCase();
    if (levelLower.includes('beginner')) return theme.palette.info.main;
    if (levelLower.includes('intermediate')) return theme.palette.warning.main;
    if (levelLower.includes('advanced')) return theme.palette.error.main;
    return theme.palette.info.main;
  };
  
  // Format date to display how recent a course is
  const formatRecency = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return 'New';
    if (diffDays < 30) return 'Recent';
    return '';
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Learning Portal
        </Typography>
        <Typography variant="body1" paragraph>
          Enhance your agricultural knowledge with our expert-curated courses and resources.
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label="All Courses" />
                  <Tab label="My Courses" />
                  <Tab label="Featured" />
                  <Tab label="New" />
                </Tabs>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {isLoading ? (
          <Loader message="Loading courses..." />
        ) : error ? (
          <Alert severity="error">
            Failed to load courses. Please try again later.
          </Alert>
        ) : (
          <Paper 
            elevation={0} 
            variant="outlined" 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              bgcolor: 'background.paper'
            }}
          >
            <List disablePadding>
              {getFilteredCourses().length === 0 ? (
                <ListItem sx={{ py: 4, justifyContent: 'center' }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      No courses found
                    </Typography>
                    <Typography variant="body1">
                      {searchTerm 
                        ? "Try adjusting your search terms." 
                        : tabValue === 1 
                          ? "You haven't enrolled in any courses yet." 
                          : "Check back soon for new content!"}
                    </Typography>
                  </Box>
                </ListItem>
              ) : (
                getFilteredCourses().map((course, index) => (
                  <React.Fragment key={course.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        py: 2, 
                        px: 3,
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                      onClick={() => navigate(`/learning/course/${course.id}`)}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {course.title}
                            </Typography>
                            
                            {course.is_featured && (
                              <Chip 
                                label="Featured" 
                                color="primary" 
                                size="small"
                                sx={{ ml: 1, fontWeight: 'medium', height: 20 }} 
                              />
                            )}
                            
                            {formatRecency(course.created_at) && (
                              <Chip 
                                label={formatRecency(course.created_at)}
                                color="secondary"
                                size="small"
                                icon={<NewReleasesIcon sx={{ fontSize: '0.8rem !important' }} />}
                                sx={{ ml: 1, fontWeight: 'medium', height: 20 }} 
                              />
                            )}
                          </Box>
                          
                          <Box>
                            <Tooltip title={course.is_bookmarked ? "Remove bookmark" : "Add bookmark"}>
                              <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                // Handle bookmark toggle
                              }}>
                                {course.is_bookmarked ? 
                                  <BookmarkIcon color="primary" fontSize="small" /> : 
                                  <BookmarkBorderIcon fontSize="small" />
                                }
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          {course.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 1 }}>
                          <Chip
                            size="small"
                            icon={<SchoolIcon sx={{ fontSize: '0.8rem !important' }} />}
                            label={course.level || 'Beginner'}
                            sx={{ 
                              bgcolor: alpha(getLevelColor(course.level), 0.1),
                              color: getLevelColor(course.level),
                              height: 24,
                              '& .MuiChip-icon': { color: 'inherit' }
                            }}
                          />
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
                            <Typography variant="body2" color="text.secondary">
                              {course.duration || '2 hours'}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary">
                            {course.lessons_count || 4} lessons
                          </Typography>
                        </Box>
                        
                        {course.is_enrolled && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Box sx={{ flexGrow: 1, mr: 2 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={getRandomProgress(course.id)} 
                                sx={{ 
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="primary" fontWeight="medium">
                              {getRandomProgress(course.id)}% Complete
                            </Typography>
                          </Box>
                        )}
                        
                        {/* Enroll button commented out as requested
                        {!course.is_enrolled && (
                          <Button 
                            size="small" 
                            variant="outlined"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnroll(course.id);
                            }}
                            disabled={isEnrolling}
                            sx={{ mt: 1 }}
                          >
                            Enroll Now
                          </Button>
                        )}
                        */}
                      </Box>
                      
                      <ListItemSecondaryAction>
                        <IconButton edge="end" sx={{ mt: 2 }}>
                          <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Courses;