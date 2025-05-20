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
  useGetDiscussionsQuery,
  useGetDiscussionCommentsQuery,
  useCreateCommentMutation
} from '../../features/community/communityApi';
import Loader from '../../components/common/Loader';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DiscussionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch the discussion
  const { data: discussionsData, isLoading: discussionLoading } = useGetDiscussionsQuery({ id });
  const discussion = discussionsData?.find(d => d.id === parseInt(id)) || null;
  
  // Fetch comments for the discussion
  const { data: comments, isLoading: commentsLoading, error } = useGetDiscussionCommentsQuery(id);
  
  // Comment creation state
  const [newComment, setNewComment] = useState('');
  const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation();
  
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await createComment({
        content: newComment,
        discussion: parseInt(id)
      }).unwrap();
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isLoading = discussionLoading || commentsLoading;
  
  if (isLoading) {
    return <Loader />;
  }
  
  if (!discussion) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Discussion not found. It may have been removed or doesn't exist.
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/community')}
            sx={{ mt: 2 }}
          >
            Back to Discussions
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        {/* Breadcrumb navigation */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/community" color="inherit">
            Community
          </MuiLink>
          <MuiLink 
            component={Link} 
            to="/community" 
            state={{ topicId: discussion.topic }}
            color="inherit"
          >
            {discussion.topic_name || 'Topic'}
          </MuiLink>
          <Typography color="text.primary">Discussion</Typography>
        </Breadcrumbs>
        
        {/* Discussion Header */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              {discussion.title}
            </Typography>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ mr: 2 }}>
              {discussion.author_name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {discussion.author_name || 'Anonymous'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posted on {formatDate(discussion.created_at)}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
            {discussion.content}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Box>
              <IconButton color="primary">
                <ThumbUpIcon />
              </IconButton>
              <IconButton>
                <ThumbDownIcon />
              </IconButton>
              <IconButton>
                <BookmarkIcon />
              </IconButton>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ReplyIcon />}
              onClick={() => document.getElementById('comment-input').focus()}
            >
              Reply
            </Button>
          </Box>
        </Paper>
        
        {/* Comments Section */}
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {comments?.length || 0} Comments
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to load comments. Please try again later.
            </Alert>
          ) : comments?.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ my: 3, textAlign: 'center' }}>
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            <List>
              {comments?.map((comment) => (
                <ListItem key={comment.id} sx={{ px: 0, py: 2, display: 'block' }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      {comment.author_name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {comment.author_name || 'Anonymous'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.created_at)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
                        {comment.content}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <IconButton size="small">
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" sx={{ mx: 1 }}>
                          {comment.upvotes || 0}
                        </Typography>
                        <IconButton size="small">
                          <ThumbDownIcon fontSize="small" />
                        </IconButton>
                        <Button size="small" startIcon={<ReplyIcon fontSize="small" />} sx={{ ml: 1 }}>
                          Reply
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                </ListItem>
              ))}
            </List>
          )}
          
          {/* Comment Form */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Leave a Comment
            </Typography>
            <TextField
              id="comment-input"
              label="Write your comment"
              multiline
              rows={4}
              fullWidth
              value={newComment}
              onChange={handleCommentChange}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        </Paper>
        
        {/* Related Discussions */}
        <Box sx={{ mt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/community')}
          >
            Back to Discussions
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DiscussionDetail;
