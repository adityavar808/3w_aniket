import React, { useState, useContext } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import SendIcon from '@mui/icons-material/Send';
import api from '../services/api';

const CommentSection = ({ post, onCommentAdded }) => {
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/api/posts/${post._id}/comment`, { text: commentText });
      onCommentAdded(res.data);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
      {/* Comments List */}
      {post.comments && post.comments.length > 0 ? (
        <List sx={{ maxHeight: 250, overflowY: 'auto', mb: 2, pr: 0.5 }}>
          {post.comments.map((comment, index) => (
            <React.Fragment key={comment._id || index}>
              <ListItem alignItems="flex-start" sx={{ px: 1, py: 1 }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#0f172a', fontSize: '0.875rem', fontWeight: 600 }}>
                    {comment.username.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {comment.username}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, whiteSpace: 'pre-wrap' }}>
                      {comment.text}
                    </Typography>
                  }
                />
              </ListItem>
              {index < post.comments.length - 1 && (
                <Divider component="li" sx={{ borderColor: '#f1f5f9' }} />
              )}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontStyle: 'italic', textAlign: 'center' }}>
          No comments yet. Be the first to comment!
        </Typography>
      )}

      {/* Add Comment Form */}
      {user ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            variant="outlined"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={submitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor: '#f8fafc',
                color: 'text.primary',
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0f172a',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !commentText.trim()}
            sx={{
              borderRadius: '50%',
              minWidth: 40,
              width: 40,
              height: 40,
              p: 0,
              background: '#0f172a',
              '&:hover': {
                background: '#1e293b',
              },
              '&.Mui-disabled': {
                background: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            <SendIcon sx={{ fontSize: 18, color: 'white' }} />
          </Button>
        </Box>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 1 }}>
          Please log in to add a comment.
        </Typography>
      )}
    </Box>
  );
};

export default CommentSection;
