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
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useGetCourseByIdQuery,
  useGetCourseLessonsQuery,
  useEnrollInCourseMutation
} from '../../features/learning/learningApi';
import Loader from '../../components/common/Loader';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  
  const { 
    data: course, 
    isLoading: courseLoading, 
    error: courseError 
  } = useGetCourseByIdQuery(id);
  
  const {
    data: lessons,
    isLoading: lessonsLoading,
    error: lessonsError
  } = useGetCourseLessonsQuery(id);

  const [enrollInCourse, { isLoading: isEnrolling }] = useEnrollInCourseMutation();

  const handleEnroll = async () => {
    try {
      await enrollInCourse(id).unwrap();
      // No need to navigate, we're already on the course page
      // Just reload the data
      window.location.reload();
    } catch (err) {
      console.error('Failed to enroll in course:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLessonSelect = (lessonId) => {
    setCurrentLessonId(lessonId);
  };

  const isLoading = courseLoading || lessonsLoading;
  const error = courseError || lessonsError;
  
  const currentLesson = currentLessonId && lessons ? 
    lessons.find(lesson => lesson.id === currentLessonId) : 
    lessons && lessons.length > 0 ? lessons[0] : null;

  // Calculate progress
  const progress = course && course.is_enrolled ? 
    (course.completed_lessons / course.lessons_count) * 100 : 0;

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
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {course.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.students_count || 0} students enrolled
                  </Typography>
                </Box>
              </Box>
              
              {course.is_enrolled ? (
                <Box sx={{ width: '100%', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Your progress: {Math.round(progress)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({course.completed_lessons || 0}/{course.lessons_count || 0} lessons)
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  sx={{ mt: 2 }}
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll in This Course'}
                </Button>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={course.image || `https://source.unsplash.com/random/400x300/?farming,${course.id}`}
                alt={course.title}
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 2,
                  maxHeight: 200,
                  objectFit: 'cover'
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Course Content */}
        {course.is_enrolled ? (
          <Grid container spacing={3}>
            {/* Left sidebar - Lessons list */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                  <Typography variant="h6">Course Content</Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {lessons ? (
                    lessons.map((lesson, index) => (
                      <React.Fragment key={lesson.id}>
                        <ListItem
                          button
                          selected={currentLessonId === lesson.id}
                          onClick={() => handleLessonSelect(lesson.id)}
                        >
                          <ListItemIcon>
                            {lesson.type === 'video' && <PlayCircleFilledIcon />}
                            {lesson.type === 'article' && <ArticleIcon />}
                            {lesson.type === 'quiz' && <QuizIcon />}
                          </ListItemIcon>
                          <ListItemText
                            primary={`${index + 1}. ${lesson.title}`}
                            secondary={`${lesson.duration || '10 min'} • ${lesson.is_completed ? 'Completed' : 'Not completed'}`}
                          />
                        </ListItem>
                        {index < lessons.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No lessons available yet" />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>
            
            {/* Main content area - Lesson */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                {currentLesson ? (
                  <>
                    <Typography variant="h5" gutterBottom>
                      {currentLesson.title}
                    </Typography>
                    
                    {currentLesson.type === 'video' && (
                      <Box sx={{ position: 'relative', pb: '56.25%', height: 0, mb: 3 }}>
                        <Box
                          component="iframe"
                          src={currentLesson.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0,
                            borderRadius: 1,
                          }}
                          allowFullScreen
                        />
                      </Box>
                    )}
                    
                    {currentLesson.type === 'article' && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" paragraph>
                          {currentLesson.content || "This article content will be displayed here. It could include text, images, and other media to help you learn about this topic."}
                        </Typography>
                        
                        <Typography variant="body1" paragraph>
                          Learning about agricultural practices is essential for sustainable farming. Understanding soil health, crop rotation, pest management, and water conservation can significantly improve farm productivity and environmental sustainability.
                        </Typography>
                        
                        <Typography variant="body1" paragraph>
                          Modern techniques like precision agriculture use technology to optimize resource use and increase yields while minimizing environmental impact. These approaches are becoming increasingly important as farmers face challenges from climate change and the need to feed a growing global population.
                        </Typography>
                      </Box>
                    )}
                    
                    {currentLesson.type === 'quiz' && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" paragraph>
                          Test your knowledge with this quiz on the topics covered in this lesson.
                        </Typography>
                        
                        <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Question 1: What is the main benefit of crop rotation?
                          </Typography>
                          <Box sx={{ pl: 2 }}>
                            <Typography variant="body2">A) Reduced pest pressure</Typography>
                            <Typography variant="body2">B) Improved soil fertility</Typography>
                            <Typography variant="body2">C) Prevention of soil erosion</Typography>
                            <Typography variant="body2">D) All of the above</Typography>
                          </Box>
                        </Card>
                        
                        <Box sx={{ textAlign: 'right' }}>
                          <Button variant="contained" color="primary">
                            Submit Quiz
                          </Button>
                        </Box>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="outlined">
                        Previous Lesson
                      </Button>
                      <Button variant="contained" color="primary">
                        Mark as Complete
                      </Button>
                      <Button variant="outlined">
                        Next Lesson
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body1">
                    Select a lesson from the list to start learning.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <>
            {/* Course preview content for non-enrolled users */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Overview" />
                  <Tab label="Curriculum" />
                  <Tab label="Reviews" />
                </Tabs>
              </Box>
              
              <Box hidden={tabValue !== 0}>
                <Typography variant="h6" gutterBottom>
                  What you'll learn
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {['Understand key agricultural principles', 'Apply sustainable farming techniques', 'Optimize crop yields', 'Implement effective soil management'].map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box
                          component="span"
                          sx={{
                            mr: 1,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
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
                  This comprehensive course will guide you through the fundamentals of agricultural practices, focusing on sustainable methods that improve crop yields while preserving environmental resources. Whether you're a beginner or looking to update your knowledge, this course provides practical insights you can apply immediately on your farm.
                </Typography>
                <Typography variant="body1" paragraph>
                  You'll learn from experienced farmers and agricultural experts who share real-world examples and case studies. The course combines theoretical knowledge with practical demonstrations to ensure you can implement what you learn.
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  sx={{ mt: 2 }}
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              </Box>
              
              <Box hidden={tabValue !== 1}>
                <Typography variant="h6" gutterBottom>
                  Course Content
                </Typography>
                
                {lessons && lessons.length > 0 ? (
                  lessons.map((section, index) => (
                    <Accordion key={index}>
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`section${index}-content`}
                        id={`section${index}-header`}
                      >
                        <Typography>Section {index + 1}: {section.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {section.lessons && section.lessons.map((lesson, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                {lesson.type === 'video' ? <PlayCircleFilledIcon color="primary" /> : 
                                 lesson.type === 'quiz' ? <QuizIcon color="secondary" /> : <ArticleIcon />}
                              </ListItemIcon>
                              <ListItemText 
                                primary={lesson.title} 
                                secondary={`${lesson.duration || '10 min'}`} 
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography variant="body1">
                    The curriculum for this course will be available soon.
                  </Typography>
                )}
              </Box>
              
              <Box hidden={tabValue !== 2}>
                <Typography variant="h6" gutterBottom>
                  Student Reviews
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h2" component="span" color="primary.main">
                    4.8
                  </Typography>
                  <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                    out of 5
                  </Typography>
                </Box>
                
                {[
                  { name: "John S.", rating: 5, comment: "Excellent course with practical advice I could apply right away on my farm." },
                  { name: "Maria L.", rating: 4, comment: "Very informative. Could use more examples for small-scale farming." },
                  { name: "Robert T.", rating: 5, comment: "The instructor is knowledgeable and explains concepts clearly." }
                ].map((review, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                        {review.name.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle1">
                        {review.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <Box
                          key={i}
                          component="span"
                          sx={{
                            color: i < review.rating ? 'primary.main' : 'grey.400',
                            mr: 0.5,
                          }}
                        >
                          ★
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="body1">
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};

export default CourseDetail;