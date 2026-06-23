import React, { useState, useRef, useContext } from 'react';
import { Card, CardContent, TextField, Button, Box, Avatar, IconButton, Typography } from '@mui/material';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from '../context/AuthContext';
import { getUserProfileDetails } from './Navbar';
import api from '../services/api';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('all'); // all or promotions
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojis = ['😂', '👍', '❤️', '🔥', '✨', '🚀', '🌃', '🌸', '🎉', '😊', '🙌', '👀'];

  const fileInputRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }

      setError('');
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imageFile) {
      setError('Please write some text or select an image');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      if (text.trim()) {
        formData.append('text', text);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onPostCreated(res.data);
      // Reset form
      setText('');
      handleRemoveImage();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create post. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;
  const profile = getUserProfileDetails(user.username);

  return (
    <Card
      sx={{
        width: '100%',
        mb: 3,
        bgcolor: 'background.paper',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        borderRadius: '20px',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Header Row: Title & Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '18px',
              fontFamily: "'Outfit', sans-serif",
              color: 'text.primary',
            }}
          >
            Create Post
          </Typography>

          {/* Sub-tab pills */}
          <Box sx={{ display: 'flex', bgcolor: '#f1f5f9', borderRadius: '24px', p: 0.4 }}>
            <Box
              onClick={() => setActiveSubTab('all')}
              sx={{
                bgcolor: activeSubTab === 'all' ? '#2563eb' : 'transparent',
                color: activeSubTab === 'all' ? '#ffffff' : '#64748b',
                px: 2,
                py: 0.6,
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              All Posts
            </Box>
            <Box
              onClick={() => setActiveSubTab('promotions')}
              sx={{
                bgcolor: activeSubTab === 'promotions' ? '#2563eb' : 'transparent',
                color: activeSubTab === 'promotions' ? '#ffffff' : '#64748b',
                px: 2,
                py: 0.6,
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Promotions
            </Box>
          </Box>
        </Box>

        {/* Text Input Row with Avatar */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            src={profile.avatar}
            sx={{
              width: 40,
              height: 40,
              border: '1px solid #cbd5e1',
            }}
          />
          <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={submitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  fontSize: '15px',
                  backgroundColor: 'transparent',
                  p: 0.5,
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
                mb: 1,
              }}
            />

            {/* Error Message */}
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {error}
              </Typography>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <Box
                sx={{
                  position: 'relative',
                  mb: 2,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  maxHeight: '220px',
                  display: 'flex',
                  justifyContent: 'center',
                  bgcolor: '#f8fafc',
                }}
              >
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain' }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                  size="small"
                >
                  <CloseIcon sx={{ fontSize: '18px' }} />
                </IconButton>
              </Box>
            )}

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, bgcolor: '#f1f5f9', p: 1.5, borderRadius: '12px', mb: 2 }}>
                {emojis.map((emoji) => (
                  <Box
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    sx={{
                      fontSize: '22px',
                      cursor: 'pointer',
                      p: 0.5,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: '#cbd5e1' },
                      transition: 'background 0.2s',
                    }}
                  >
                    {emoji}
                  </Box>
                ))}
              </Box>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '8px 0 16px 0' }} />

            {/* Actions Footer Row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Left Action Buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {/* Hidden File Input */}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="create-post-photo-upload"
                  type="file"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  disabled={submitting}
                />
                <label htmlFor="create-post-photo-upload">
                  <IconButton
                    component="span"
                    disabled={submitting}
                    sx={{ color: '#2563eb', p: 0.8 }}
                  >
                    <PhotoCameraOutlinedIcon sx={{ fontSize: '22px' }} />
                  </IconButton>
                </label>

                {/* Smiley/Emoji Selector Mock */}
                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} sx={{ color: '#2563eb', p: 0.8 }}>
                  <SentimentSatisfiedAltOutlinedIcon sx={{ fontSize: '22px' }} />
                </IconButton>

                {/* List Option Mock */}
                <IconButton sx={{ color: '#2563eb', p: 0.8 }}>
                  <FormatListBulletedOutlinedIcon sx={{ fontSize: '22px' }} />
                </IconButton>

                {/* Megaphone Promote */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    color: '#2563eb',
                    pl: 1,
                    py: 0.5,
                    pr: 1.5,
                    borderRadius: '16px',
                    '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.05)' },
                  }}
                >
                  <CampaignOutlinedIcon sx={{ fontSize: '22px' }} />
                  <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Promote</Typography>
                </Box>
              </Box>

              {/* Right Post Button */}
              <Button
                type="submit"
                disabled={submitting || (!text.trim() && !imageFile)}
                startIcon={<SendIcon sx={{ fontSize: '16px !important' }} />}
                sx={{
                  bgcolor: text.trim() || imageFile ? '#cbd5e1' : '#f1f5f9', // light grey as in mockup
                  color: text.trim() || imageFile ? '#334155' : '#94a3b8',
                  borderRadius: '24px',
                  px: 3,
                  py: 0.8,
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: 'none',
                  border: 'none',
                  '&:hover': {
                    bgcolor: text.trim() || imageFile ? '#cbd5e1' : '#f1f5f9',
                    boxShadow: 'none',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#cbd5e1',
                    color: '#94a3b8',
                    opacity: 0.7,
                  },
                }}
              >
                {submitting ? 'Posting...' : 'Post'}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
