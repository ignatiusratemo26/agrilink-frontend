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
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  useGetForumsQuery,
  useGetForumThreadsQuery,
  useCreateThreadMutation
} from '../../features/community/communityApi';
import Loader from '../../components/common/Loader';
import AddIcon from '@mui/icons-material/Add';
import ForumIcon from '@mui/icons-material/Forum';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Forums = () => {
  const navigate = useNavigate();
  const { data: forums, isLoading: forumsLoading } = useGetForumsQuery();
  const [selectedForum, setSelectedForum] = useState(null);
  const { data: threads, isLoading: threadsLoading, error } = useGetForumThreadsQuery(selectedForum?.id, {
    skip: !selectedForum
  });
  
  const [createThread] = useCreateThreadMutation();
  
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  
  // Select a forum category
  const handleForumSelect = (forum) => {
    setSelectedForum(forum);
  };
  
  // Open thread creation dialog
  const handleNewThreadOpen = () => {
    setNewThreadOpen(true);
  };
  
  // Close thread creation dialog
  const handleNewThreadClose = () => {
    setNewThreadOpen(false);
    setNewThread({ title: '', content: '' });
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewThread({ ...newThread, [name]: value });
  };
  
  // Create new thread
  const handleCreateThread = async () => {
    if (!newThread.title || !newThread.content) return;
    
    try {
      const threadData = {
        ...newThread,
        forum: selectedForum.id
      };
      
      const result = await createThread(threadData).unwrap();
      navigate(`/community/thread/${result.id}`);
    } catch (err) {
      console.error('Failed to create thread:', err);
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
  
  const isLoading = forumsLoading || (selectedForum && threadsLoading);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Community Forums</Typography>
          {selectedForum && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewThreadOpen}
            >
              New Thread
            </Button>
          )}
        </Box>
        
        <Grid container spacing={3}>
          {/* Forum Categories */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ pl: 1 }}>
                Categories
              </Typography>
              <List>
                {forumsLoading ? (
                  <ListItem>
                    <Loader />
                  </ListItem>
                ) : (
                  forums?.map((forum) => (
                    <ListItem 
                      key={forum.id} 
                      button 
                      selected={selectedForum?.id === forum.id}
                      onClick={() => handleForumSelect(forum)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        bgcolor: selectedForum?.id === forum.id ? 'action.selected' : 'transparent'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <ForumIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={forum.name} 
                        secondary={`${forum.thread_count || 0} threads`} 
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
          
          {/* Threads */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              {selectedForum ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {selectedForum.name}
                    </Typography>
                    <Box>
                      <IconButton onClick={handleSortMenuOpen}>
                        <SortIcon />
                      </IconButton>
                      <Menu
                        anchorEl={sortAnchorEl}
                        open={Boolean(sortAnchorEl)}
                        onClose={handleSortMenuClose}
                      >
                        <MenuItem onClick={handleSortMenuClose}>Newest First</MenuItem>
                        <MenuItem onClick={handleSortMenuClose}>Oldest First</MenuItem>
                        <MenuItem onClick={handleSortMenuClose}>Most Active</MenuItem>
                      </Menu>
                      
                      <IconButton onClick={handleFilterMenuOpen}>
                        <FilterListIcon />
                      </IconButton>
                      <Menu
                        anchorEl={filterAnchorEl}
                        open={Boolean(filterAnchorEl)}
                        onClose={handleFilterMenuClose}
                      >
                        <MenuItem onClick={handleFilterMenuClose}>All Threads</MenuItem>
                        <MenuItem onClick={handleFilterMenuClose}>My Threads</MenuItem>
                        <MenuItem onClick={handleFilterMenuClose}>Unanswered</MenuItem>
                      </Menu>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {threadsLoading ? (
                    <Loader />
                  ) : error ? (
                    <Alert severity="error">
                      Failed to load threads. Please try again later.
                    </Alert>
                  ) : threads?.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" paragraph>
                        No threads in this forum yet.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleNewThreadOpen}
                      >
                        Create First Thread
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {threads?.map((thread) => (
                        <React.Fragment key={thread.id}>
                          <ListItem
                            alignItems="flex-start"
                            sx={{ p: 0, mb: 2 }}
                          >
                            <Card sx={{ width: '100%' }}>
                              <CardActionArea onClick={() => navigate(`/community/thread/${thread.id}`)}>
                                <CardContent>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" gutterBottom>
                                      {thread.title}
                                    </Typography>
                                    <IconButton size="small">
                                      <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                                        {thread.author_name?.charAt(0) || 'U'}
                                      </Avatar>
                                      <Typography variant="body2" color="text.secondary">
                                        {thread.author_name || 'Anonymous'}
                                      </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(thread.created_at)}
                                    </Typography>
                                  </Box>
                                  
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {thread.content?.substring(0, 150)}
                                    {thread.content?.length > 150 ? '...' : ''}
                                  </Typography>
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Chip 
                                      label={`${thread.replies_count || 0} replies`}
                                      size="small"
                                      color={thread.replies_count ? 'primary' : 'default'}
                                      variant="outlined"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      Last activity: {formatDate(thread.last_activity || thread.created_at)}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <ForumIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Select a Category
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Choose a forum category from the left to view discussions.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* New Thread Dialog */}
      <Dialog
        open={newThreadOpen}
        onClose={handleNewThreadClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Thread in {selectedForum?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Thread Title"
            type="text"
            fullWidth
            value={newThread.title}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            name="content"
            label="Thread Content"
            type="text"
            fullWidth
            multiline
            rows={6}
            value={newThread.content}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewThreadClose}>Cancel</Button>
          <Button 
            onClick={handleCreateThread}
            variant="contained"
            disabled={!newThread.title || !newThread.content}
          >
            Post Thread
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Forums;