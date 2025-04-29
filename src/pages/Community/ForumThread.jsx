import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  IconButton,
  Alert,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  useGetForumThreadsQuery,
  useGetThreadCommentsQuery,
  useCreateCommentMutation
} from '../../features/community/communityApi';
import Loader from '../../components/common/Loader';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ForumThread = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const threadId = parseInt(id);
  
  const { data: threads } = useGetForumThreadsQuery();
  const thread = threads?.find(t => t.id === threadId);
  
  const { data: comments, isLoading, error } = useGetThreadCommentsQuery(threadId);
  const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation();
  
  const [newComment, setNewComment] = useState('');
  
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await createComment({
        threadId,
        content: newComment
      }).unwrap();
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!thread && !isLoading) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 3 }}>
          Thread not found.
        </Alert>
        <Button
          variant="outlined"
          component={Link}
          to="/community"
          sx={{ mt: 2 }}
        >
          Back to Forums
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      {thread && (
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              to="/community"
              color="inherit"
              underline="hover"
            >
              Forums
            </MuiLink>
            <MuiLink
              component={Link}
              to="/community"
              color="inherit"
              underline="hover"
            >
              {thread.forum_name}
            </MuiLink>
            <Typography color="text.primary">Thread</Typography>
          </Breadcrumbs>
          
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">
                {thread.title}
              </Typography>
              <Box>
                <IconButton size="small">
                  <BookmarkIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Avatar sx={{ mr: 2 }}>
                {thread.author_name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {thread.author_name || 'Anonymous'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted on {formatDate(thread.created_at)}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body1" paragraph>
              {thread.content}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button 
                size="small" 
                startIcon={<ThumbUpIcon />}
                color="primary"
              >
                Like
              </Button>
              <Button 
                size="small" 
                startIcon={<ReplyIcon />}
                variant="outlined"
                onClick={() => document.getElementById('comment-input').focus()}
              >
                Reply
              </Button>
            </Box>
          </Paper>
          
          <Typography variant="h6" gutterBottom>
            {comments?.length || 0} Replies
          </Typography>
          
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Alert severity="error">
              Failed to load comments. Please try again later.
            </Alert>
          ) : comments?.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mb: 3 }}>
              <Typography variant="body1">
                No replies yet. Be the first to respond!
              </Typography>
            </Paper>
          ) : (
            <List>
              {comments?.map((comment) => (
                <ListItem key={comment.id} sx={{ px: 0, py: 1 }}>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar sx={{ mr: 2 }}>
                          {comment.author_name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {comment.author_name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" paragraph>
                        {comment.content}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton size="small">
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <ThumbDownIcon fontSize="small" />
                        </IconButton>
                        <Button 
                          size="small" 
                          startIcon={<ReplyIcon />}
                        >
                          Reply
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
          
          <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Post a Reply
            </Typography>
            <TextField
              id="comment-input"
              fullWidth
              multiline
              rows={4}
              placeholder="Write your reply..."
              value={newComment}
              onChange={handleCommentChange}
              disabled={isSubmitting}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Reply'}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default ForumThread;