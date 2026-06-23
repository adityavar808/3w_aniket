import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Container, Box, Typography, CircularProgress, Alert, Paper, Button, Fab } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api from '../services/api';

const filterPills = [
  { id: 'all', label: 'All Post' },
  { id: 'foryou', label: 'For You' },
  { id: 'liked', label: 'Most Liked' },
  { id: 'commented', label: 'Most Commented' },
  { id: 'shared', label: 'Most Shared' },
];

const Feed = ({ searchQuery }) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const createPostRef = useRef(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/posts');
      setPosts(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch posts. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  // Scroll to top and focus post input when clicking FAB
  const handleFABClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  // Process posts: filter by search query & apply active category filter
  const processedPosts = useMemo(() => {
    let result = [...posts];

    // 1. Search Query Filter
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (post) =>
          (post.text && post.text.toLowerCase().includes(query)) ||
          (post.username && post.username.toLowerCase().includes(query))
      );
    }

    // 2. Active Category Filter
    switch (activeFilter) {
      case 'liked':
        result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
      case 'commented':
        result.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        break;
      case 'foryou':
        // Show shuffled/alternate list as simple mock for personalized feed
        result = result.sort(() => 0.5 - Math.random());
        break;
      case 'shared':
        // Simple alternate sorting for "shared"
        result.reverse();
        break;
      case 'all':
      default:
        // Default sorted by date (handled by server, but enforce here just in case)
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [posts, searchQuery, activeFilter]);

  return (
    <Container sx={{ py: 2.5, px: 2, position: 'relative' }}>
      {/* Post Creation Box */}
      <Box ref={createPostRef}>
        {user ? (
          <CreatePost onPostCreated={handlePostCreated} />
        ) : (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              Join the Conversation!
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Log in or sign up to share your thoughts, photos, like, and comment on posts.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  borderColor: '#cbd5e1',
                  color: 'text.secondary',
                  px: 3,
                  '&:hover': { borderColor: 'text.primary', background: 'rgba(0,0,0,0.02)' },
                }}
              >
                Log In
              </Button>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                sx={{ bgcolor: '#2563eb', color: '#ffffff', px: 3, '&:hover': { bgcolor: '#1d4ed8' } }}
              >
                Sign Up
              </Button>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Filter Horizontal Row */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1.5,
          mb: 1,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {filterPills.map((pill) => {
          const isActive = pill.id === activeFilter;
          return (
            <Box
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              sx={{
                bgcolor: isActive ? '#2563eb' : 'background.paper',
                color: isActive ? '#ffffff' : 'text.secondary',
                border: isActive ? '1px solid #2563eb' : '1px solid #cbd5e1',
                borderRadius: '20px',
                px: 2.2,
                py: 0.8,
                fontSize: '13px',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                  borderColor: '#2563eb',
                  bgcolor: isActive ? '#2563eb' : 'rgba(37, 99, 235, 0.04)',
                },
              }}
            >
              {pill.label}
            </Box>
          );
        })}
      </Box>

      {/* Loading & Error States */}
      {loading && processedPosts.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={30} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: '12px', mb: 3 }}>
          {error}
        </Alert>
      ) : processedPosts.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">No posts found.</Typography>
        </Paper>
      ) : (
        /* Render Posts */
        <Box>
          {processedPosts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
          ))}
        </Box>
      )}

      {/* Floating Action Button (FAB) */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleFABClick}
        sx={{
          position: 'fixed',
          bottom: 96, // just above BottomNav
          right: 'calc(50% - 280px)', // Align relative to centered container (max-width 600px, so 300px offset minus half FAB width)
          '@media (max-width: 600px)': {
            right: 16,
          },
          bgcolor: '#2563eb',
          color: '#ffffff',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            bgcolor: '#1d4ed8',
          },
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Feed;
