import React, { useState, useContext } from 'react';
import { Card, CardHeader, CardContent, CardMedia, CardActions, Collapse, Avatar, IconButton, Typography, Box, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import { AuthContext } from '../context/AuthContext';
import CommentSection from './CommentSection';
import { getUserProfileDetails } from './Navbar';
import api from '../services/api';

// Relative time formatter
export const getRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;

  if (diffMs < 0) return 'Just now';

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}h ago`; // simplified short notation or full notation

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hours ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} days ago`;

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const PostCard = ({ post, onPostUpdated }) => {
  const { user } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  const [following, setFollowing] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like posts!');
      return;
    }

    try {
      const res = await api.put(`/api/posts/${post._id}/like`);
      onPostUpdated(res.data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const isLiked = user && post.likes.includes(user.username);
  const profile = getUserProfileDetails(post.username);

  return (
    <Card
      sx={{
        width: '100%',
        mb: 3,
        bgcolor: 'background.paper',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      {/* Post Header */}
      <CardHeader
        avatar={
          <Avatar
            src={profile.avatar}
            sx={{
              width: 44,
              height: 44,
              border: '1px solid #cbd5e1',
            }}
          />
        }
        action={
          <Button
            variant={following ? 'outlined' : 'contained'}
            size="small"
            onClick={() => setFollowing(!following)}
            sx={{
              textTransform: 'none',
              borderRadius: '20px',
              px: 2.2,
              py: 0.5,
              fontWeight: 700,
              fontSize: '12px',
              boxShadow: 'none',
              bgcolor: following ? 'transparent' : '#2563eb',
              color: following ? '#2563eb' : '#ffffff',
              border: following ? '1px solid #2563eb' : 'none',
              mt: 0.5,
              mr: 0.5,
              '&:hover': {
                bgcolor: following ? 'rgba(37, 99, 235, 0.05)' : '#1d4ed8',
                boxShadow: 'none',
              },
            }}
          >
            {following ? 'Following' : 'Follow'}
          </Button>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: 'text.primary', fontSize: '15px', fontFamily: "'Inter', sans-serif" }}
            >
              {profile.name}
            </Typography>

            {/* Render Badge if present */}
            {profile.badge && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: profile.badge === 'Platinum' ? '#e0f2fe' : '#ffedd5', // blue or orange
                  border: profile.badge === 'Platinum' ? '1px solid #bae6fd' : '1px solid #fed7aa',
                  borderRadius: '12px',
                  px: 0.8,
                  py: 0.1,
                  gap: 0.5,
                  ml: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#ffffff',
                    borderRadius: '50%',
                    width: 12,
                    height: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: profile.badge === 'Platinum' ? '1px solid #0284c7' : '1px solid #ea580c',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '7px',
                      fontWeight: 800,
                      color: profile.badge === 'Platinum' ? '#0284c7' : '#ea580c',
                    }}
                  >
                    {profile.badgeNum}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: profile.badge === 'Platinum' ? '#0284c7' : '#b45309', // medal/circle
                    borderRadius: '50%',
                    width: 8,
                    height: 8,
                  }}
                />
                <Typography
                  sx={{
                    color: profile.badge === 'Platinum' ? '#0369a1' : '#b45309',
                    fontSize: '8px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  {profile.badge}
                </Typography>
              </Box>
            )}
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.2 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '12px' }}
            >
              @{post.username}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontSize: '11px', mt: 0.2 }}
            >
              {getRelativeTime(post.createdAt)}
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />

      {/* Post Text */}
      {post.text && (
        <CardContent sx={{ pt: 0.5, pb: 1.5, px: 3 }}>
          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
              fontSize: '14.5px',
              lineHeight: 1.5,
            }}
          >
            {post.text}
          </Typography>
        </CardContent>
      )}

      {/* Post Image */}
      {post.image && (
        <CardMedia
          component="img"
          image={post.image.startsWith('http') ? post.image : `/uploads/${post.image}`}
          alt="Post content"
          sx={{
            maxHeight: 380,
            width: '100%',
            objectFit: 'cover',
            background: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            borderBottom: '1px solid #f1f5f9',
          }}
        />
      )}

      {/* Post Action Buttons */}
      <CardActions
        disableSpacing
        sx={{
          justifyContent: 'space-around',
          px: 2,
          py: 0.8,
          borderTop: '1px solid #f8fafc',
        }}
      >
        {/* Like Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <IconButton
            onClick={handleLike}
            sx={{
              color: isLiked ? '#ef4444' : '#64748b',
              p: 1,
              '&:hover': {
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.04)',
              },
            }}
          >
            {isLiked ? <FavoriteIcon sx={{ fontSize: '20px' }} /> : <FavoriteBorderIcon sx={{ fontSize: '20px' }} />}
          </IconButton>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '13px' }}
          >
            {post.likes.length}
          </Typography>
        </Box>

        {/* Comment Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <IconButton
            onClick={handleExpandClick}
            sx={{
              color: expanded ? '#2563eb' : '#64748b',
              p: 1,
              '&:hover': {
                color: '#2563eb',
                background: 'rgba(37, 99, 235, 0.04)',
              },
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: '20px' }} />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '13px' }}
          >
            {post.comments.length}
          </Typography>
        </Box>

        {/* Share Button (Mocked) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <IconButton
            sx={{
              color: '#64748b',
              p: 1,
              '&:hover': {
                color: '#2563eb',
                background: 'rgba(37, 99, 235, 0.04)',
              },
            }}
          >
            <ShareIcon sx={{ fontSize: '20px' }} />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '13px' }}
          >
            0
          </Typography>
        </Box>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0, px: 2.5, pb: 2 }}>
          <CommentSection post={post} onCommentAdded={onPostUpdated} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostCard;
