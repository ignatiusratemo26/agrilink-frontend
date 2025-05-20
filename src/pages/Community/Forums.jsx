import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Badge,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  useGetTopicsQuery,
  useGetDiscussionsQuery,
  useCreateDiscussionMutation,
  useGetGroupsQuery
} from '../../features/community/communityApi';
import Loader from '../../components/common/Loader';
import AddIcon from '@mui/icons-material/Add';
import ForumIcon from '@mui/icons-material/Forum';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ComputerIcon from '@mui/icons-material/Computer';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTheme } from '@mui/material/styles';

const Forums = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: topics, isLoading: topicsLoading } = useGetTopicsQuery();
  const { data: groups, isLoading: groupsLoading } = useGetGroupsQuery();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { data: discussions, isLoading: discussionsLoading, error } = useGetDiscussionsQuery(selectedTopic?.id, {
    skip: !selectedTopic
  });
  
  const [createDiscussion] = useCreateDiscussionMutation();
  
  const [newDiscussionOpen, setNewDiscussionOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  
  // Select a topic category
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };
  
  // Open discussion creation dialog
  const handleNewDiscussionOpen = () => {
    setNewDiscussionOpen(true);
  };
  
  // Close discussion creation dialog
  const handleNewDiscussionClose = () => {
    setNewDiscussionOpen(false);
    setNewDiscussion({ title: '', content: '' });
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiscussion({ ...newDiscussion, [name]: value });
  };
  
  // Create new discussion
  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title || !newDiscussion.content) return;
    
    try {
      const discussionData = {
        ...newDiscussion,
        topic: selectedTopic.id
      };
      
      const result = await createDiscussion(discussionData).unwrap();
      navigate(`/community/discussion/${result.id}`);
    } catch (err) {
      console.error('Failed to create discussion:', err);
    }
  };
  
  // Handle sorting menu
  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };
  
  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };
  
  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const isLoading = topicsLoading || (selectedTopic && discussionsLoading);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // Check if the date is today
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if the date is yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show the full date
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Get the appropriate icon for each topic
  const getTopicIcon = (topicName) => {
    if (!topicName) return <ForumIcon />;
    
    const name = topicName.toLowerCase();
    if (name.includes('crop') || name.includes('farm')) return <ForumIcon />;
    if (name.includes('market')) return <StorefrontIcon />;
    if (name.includes('tech')) return <ComputerIcon />;
    if (name.includes('question')) return <HelpOutlineIcon />;
    
    return <ForumIcon />;
  };
    return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Community
          </Typography>
          
          {selectedTopic && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewDiscussionOpen}
              sx={{ 
                borderRadius: 2,
                boxShadow: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                fontWeight: 500
              }}
            >
              New Discussion
            </Button>
          )}
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="community tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 'auto',
                px: 3,
                fontWeight: 500,
              }
            }}
          >
            <Tab 
              icon={<ForumIcon />} 
              label="Topics" 
              iconPosition="start"
            />
            <Tab 
              icon={<GroupIcon />} 
              label="Groups" 
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        {tabValue === 0 ? (
          <Grid container spacing={3}>
            {/* Topic Categories */}
            <Grid item xs={12} md={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%'
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    pl: 1, 
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  Discussion Topics
                </Typography>
                
                <List sx={{ px: 0 }}>
                  {topicsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <Loader />
                    </Box>
                  ) : !topics?.length ? (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <Typography variant="body1">
                        No topics available
                      </Typography>
                    </Box>
                  ) : (
                    topics.map((topic) => (
                      <ListItem 
                        key={topic.id} 
                        button 
                        selected={selectedTopic?.id === topic.id}
                        onClick={() => handleTopicSelect(topic)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          transition: 'all 0.2s',
                          bgcolor: selectedTopic?.id === topic.id ? 
                            `${theme.palette.primary.main}15` : 'transparent',
                          '&:hover': {
                            bgcolor: selectedTopic?.id === topic.id ? 
                              `${theme.palette.primary.main}20` : 
                              `${theme.palette.action.hover}`
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: selectedTopic?.id === topic.id ? 
                                theme.palette.primary.main : 
                                `${theme.palette.primary.main}25`,
                              color: selectedTopic?.id === topic.id ? 
                                'white' : 
                                theme.palette.primary.main
                            }}
                          >
                            {getTopicIcon(topic.name)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={topic.name} 
                          secondary={`${topic.discussion_count || 0} discussions`}
                          primaryTypographyProps={{ 
                            fontWeight: selectedTopic?.id === topic.id ? 600 : 500 
                          }}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>
            </Grid>
              
            {/* Discussions */}
            <Grid item xs={12} md={9}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  minHeight: 400
                }}
              >
                {selectedTopic ? (
                  <>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 3 
                    }}>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {selectedTopic.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedTopic.description || `Discussions related to ${selectedTopic.name}`}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton 
                          onClick={handleSortMenuOpen}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <SortIcon />
                        </IconButton>
                        <Menu
                          anchorEl={sortAnchorEl}
                          open={Boolean(sortAnchorEl)}
                          onClose={handleSortMenuClose}
                          PaperProps={{
                            sx: { borderRadius: 2, boxShadow: 3, minWidth: 180 }
                          }}
                        >
                          <MenuItem onClick={handleSortMenuClose}>
                            <Typography variant="body2">Newest First</Typography>
                          </MenuItem>
                          <MenuItem onClick={handleSortMenuClose}>
                            <Typography variant="body2">Oldest First</Typography>
                          </MenuItem>
                          <MenuItem onClick={handleSortMenuClose}>
                            <Typography variant="body2">Most Active</Typography>
                          </MenuItem>
                        </Menu>
                        
                        <IconButton 
                          onClick={handleFilterMenuOpen}
                          size="small"
                        >
                          <FilterListIcon />
                        </IconButton>
                        <Menu
                          anchorEl={filterAnchorEl}
                          open={Boolean(filterAnchorEl)}
                          onClose={handleFilterMenuClose}
                          PaperProps={{
                            sx: { borderRadius: 2, boxShadow: 3, minWidth: 180 }
                          }}
                        >
                          <MenuItem onClick={handleFilterMenuClose}>
                            <Typography variant="body2">All Discussions</Typography>
                          </MenuItem>
                          <MenuItem onClick={handleFilterMenuClose}>
                            <Typography variant="body2">My Discussions</Typography>
                          </MenuItem>
                          <MenuItem onClick={handleFilterMenuClose}>
                            <Typography variant="body2">Unanswered</Typography>
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    {discussionsLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <Loader />
                      </Box>
                    ) : error ? (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          borderRadius: 2, 
                          boxShadow: 'none',
                          border: `1px solid ${theme.palette.error.light}`
                        }}
                      >
                        Failed to load discussions. Please try again later.
                      </Alert>
                    ) : discussions?.length === 0 ? (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'text.secondary'
                      }}>
                        <ChatBubbleOutlineIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
                        <Typography variant="h6" paragraph fontWeight="medium">
                          No discussions in this topic yet
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 3 }}>
                          Be the first to start a discussion in the {selectedTopic.name} topic.
                          Share your knowledge, ask questions, or start a conversation.
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleNewDiscussionOpen}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 3,
                            py: 1
                          }}
                        >
                          Start First Discussion
                        </Button>
                      </Box>
                    ) : (
                      <Stack spacing={2}>
                        {discussions?.map((discussion) => (
                          <Card 
                            key={discussion.id}
                            elevation={0}
                            sx={{ 
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                borderColor: 'transparent'
                              }
                            }}
                          >
                            <CardActionArea 
                              onClick={() => navigate(`/community/discussion/${discussion.id}`)}
                              sx={{ p: 0 }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'flex-start' 
                                }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                                      {discussion.title}
                                    </Typography>
                                    
                                    {new Date(discussion.created_at) > new Date(Date.now() - 48 * 60 * 60 * 1000) && (
                                      <Chip 
                                        size="small"
                                        icon={<FiberNewIcon />}
                                        label="New"
                                        color="error"
                                        sx={{ height: 24 }}
                                      />
                                    )}
                                  </Box>
                                  
                                  <IconButton size="small">
                                    <MoreVertIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                                
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  mb: 2,
                                  color: 'text.secondary'
                                }}>
                                  <Avatar 
                                    sx={{ 
                                      width: 28, 
                                      height: 28, 
                                      mr: 1,
                                      bgcolor: theme.palette.primary.main,
                                      fontSize: '0.85rem'
                                    }}
                                  >
                                    {discussion.author_name?.charAt(0) || 'U'}
                                  </Avatar>
                                  <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                                    {discussion.author_name || 'Anonymous'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    • {formatDate(discussion.created_at)}
                                  </Typography>
                                </Box>
                                
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary" 
                                  sx={{ 
                                    mb: 2,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {discussion.content?.substring(0, 250)}
                                  {discussion.content?.length > 250 ? '...' : ''}
                                </Typography>
                                
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center' 
                                }}>
                                  <Badge 
                                    badgeContent={discussion.comments_count || 0} 
                                    color="primary"
                                    showZero
                                    overlap="rectangular"
                                    sx={{ 
                                      '& .MuiBadge-badge': { 
                                        fontSize: '0.7rem', 
                                        height: 18, 
                                        minWidth: 18,
                                        fontWeight: 'bold' 
                                      } 
                                    }}
                                  >
                                    <Chip 
                                      icon={<MessageIcon sx={{ fontSize: '1rem !important' }} />}
                                      label="Comments"
                                      size="small"
                                      variant="outlined"
                                      sx={{ height: 28 }}
                                    />
                                  </Badge>
                                  <Typography variant="caption" color="text.secondary">
                                    Last activity: {formatDate(discussion.last_activity || discussion.created_at)}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <ForumIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" gutterBottom fontWeight="medium">
                      Select a Topic
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 3 }}>
                      Choose a topic category from the left to browse discussions
                      or start new conversations with our community members.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              minHeight: 400
            }}
          >
            {groupsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <Loader />
              </Box>
            ) : !groups?.length ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <GroupIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  No Farming Groups Available
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 3 }}>
                  There are currently no farming groups available. Join or create a group to collaborate with other farmers.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    py: 1
                  }}
                >
                  Create Farming Group
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {groups.map((group) => (
                  <Grid item xs={12} sm={6} md={4} key={group.id}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                          borderColor: 'transparent'
                        }
                      }}
                    >
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: theme.palette.primary.main,
                              width: 50,
                              height: 50,
                              mr: 2
                            }}
                          >
                            {group.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {group.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {group.member_count || 0} members
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                          {group.description || `A farming group focused on ${group.name}`}
                        </Typography>
                        
                        <Button 
                          variant="outlined"
                          fullWidth
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500
                          }}
                        >
                          Join Group
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        )}
      </Box>
      
      {/* New Discussion Dialog */}
      <Dialog
        open={newDiscussionOpen}
        onClose={handleNewDiscussionClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            Create New Discussion
          </Typography>
          <Typography variant="body2" color="text.secondary">
            in {selectedTopic?.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Discussion Title"
            placeholder="Enter a descriptive title for your discussion"
            type="text"
            fullWidth
            value={newDiscussion.title}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
            InputProps={{ 
              sx: { borderRadius: 1.5 } 
            }}
          />
          <TextField
            margin="dense"
            name="content"
            label="Discussion Content"
            placeholder="Share your thoughts, questions, or insights..."
            type="text"
            fullWidth
            multiline
            rows={8}
            value={newDiscussion.content}
            onChange={handleInputChange}
            InputProps={{ 
              sx: { borderRadius: 1.5 } 
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleNewDiscussionClose}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateDiscussion}
            variant="contained"
            disabled={!newDiscussion.title || !newDiscussion.content}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3
            }}
          >
            Post Discussion
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Forums;