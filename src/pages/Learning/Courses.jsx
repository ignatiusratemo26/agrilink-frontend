import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Paper,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  Tab,
  Tabs,
  Alert
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

const Courses = () => {
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
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Learning Portal
        </Typography>
        <Typography variant="body1" paragraph>
          Enhance your agricultural knowledge with our expert-curated courses and resources.
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
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
          <Grid container spacing={3}>
            {getFilteredCourses().length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
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
                </Paper>
              </Grid>
            ) : (
              getFilteredCourses().map((course) => (
                <Grid item key={course.id} xs={12} md={4}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={course.image || `https://source.unsplash.com/random/300x200/?farming,${course.id}`}
                      alt={course.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography gutterBottom variant="h6" component="h2">
                          {course.title}
                        </Typography>
                        <IconButton size="small">
                          {course.is_bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden' }}>
                        {course.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.level || 'Beginner'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.duration || '2 hours'} • {course.lessons_count || 4} lessons
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      {course.is_enrolled ? (
                        <Button 
                          fullWidth
                          size="small" 
                          variant="contained"
                          onClick={() => navigate(`/learning/course/${course.id}`)}
                        >
                          Continue Learning
                        </Button>
                      ) : (
                        <Button 
                          fullWidth
                          size="small" 
                          onClick={() => handleEnroll(course.id)}
                          disabled={isEnrolling}
                        >
                          Enroll Now
                        </Button>
                      )}
                    </CardActions>
                    {course.is_featured && (
                      <Chip 
                        label="Featured" 
                        color="primary" 
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 10, 
                          right: 10,
                          fontWeight: 'bold'
                        }} 
                      />
                    )}
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Courses;