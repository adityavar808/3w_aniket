import React, { useContext } from 'react';
import { Box, Typography, TextField, IconButton, Avatar, Badge, Button } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

// Helper for avatars and names
export const getUserProfileDetails = (username) => {
  if (!username) return { name: 'Guest', badge: '', avatar: '' };
  
  const profiles = {
    'shethbhjt': { name: 'Priya Sheth', badge: 'Bronze', badgeNum: '1', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya' },
    'jaiswamyn0': { name: 'Deepmala Jaiswal', badge: '', badgeNum: '', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Deepmala&backgroundColor=00acc1' },
    'fariha3yw3': { name: 'Fariha Saleem', badge: 'Bronze', badgeNum: '1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fariha' },
    'k5abq': { name: 'K Gamers', badge: '', badgeNum: '', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=K5' },
    'ideash3cnb': { name: 'Kishun Kumar Jha', badge: 'Platinum', badgeNum: '4', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Kishun' },
    'senapaokl0': { name: 'Suman Senapati', badge: '', badgeNum: '', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suman' },
    'uyiosase73': { name: 'Uyiosa Ogieobadan', badge: 'Bronze', badgeNum: '1', avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Uyiosa' }
  };
  
  return profiles[username.toLowerCase()] || {
    name: username.charAt(0).toUpperCase() + username.slice(1),
    badge: 'Bronze',
    badgeNum: '1',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
  };
};

const Navbar = ({ darkMode, onToggleDarkMode, searchQuery, onSearchChange }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profile = user ? getUserProfileDetails(user.username) : null;

  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #e2e8f0', px: 2, pt: 1.5, pb: 1 }}>
      {/* Top Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        {/* Brand Title */}
        <Typography
          variant="h5"
          onClick={() => navigate('/')}
          sx={{
            fontWeight: 800,
            fontSize: '26px',
            color: 'text.primary',
            fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer',
            letterSpacing: '-0.5px',
          }}
        >
          Social
        </Typography>

        {/* Action Widgets */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Star/Points Pill */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              px: 1.2,
              py: 0.3,
              gap: 0.5,
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            }}
          >
            <Typography sx={{ color: '#ef4444', fontWeight: 700, fontSize: '14px' }}>50</Typography>
            <Box
              sx={{
                bgcolor: '#facc15',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StarIcon sx={{ color: '#ffffff', fontSize: '13px' }} />
            </Box>
          </Box>

          {/* Rupees Balance Pill */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f0fdf4', // Soft light green
              border: '1px solid #bbf7d0', // Green border
              borderRadius: '20px',
              px: 1.5,
              py: 0.3,
            }}
          >
            <Typography sx={{ color: '#16a34a', fontWeight: 600, fontSize: '14px' }}>
              ₹0.00
            </Typography>
          </Box>

          {/* Notification Bell */}
          <IconButton size="small" sx={{ color: '#64748b' }}>
            <Badge badgeContent={1} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '10px', height: 16, minWidth: 16 } }}>
              <NotificationsIcon sx={{ fontSize: '24px' }} />
            </Badge>
          </IconButton>

          {/* User Avatar with Green 20% Ring */}
          {user ? (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              {/* Green ring outer container */}
              <Box
                sx={{
                  borderRadius: '50%',
                  border: '2.5px solid #22c55e', // Green ring
                  p: '1.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  src={profile?.avatar}
                  sx={{
                    width: 32,
                    height: 32,
                    border: '1px solid #e2e8f0',
                  }}
                />
              </Box>
              {/* 20% Badge Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  bgcolor: '#22c55e',
                  borderRadius: '10px',
                  px: 0.5,
                  py: 0.1,
                  border: '1px solid #ffffff',
                }}
              >
                <Typography sx={{ color: '#ffffff', fontSize: '8px', fontWeight: 700 }}>20%</Typography>
              </Box>
            </Box>
          ) : (
            <Avatar sx={{ width: 34, height: 34 }} />
          )}

          {/* Simple Logout if logged in */}
          {user && (
            <IconButton onClick={handleLogout} size="small" title="Logout" sx={{ color: '#ef4444' }}>
              <LogoutIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Search Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Search Input Box */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search promotions, users, posts..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              bgcolor: '#f1f5f9',
              fontSize: '14px',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'transparent' },
              '&.Mui-focused fieldset': { borderColor: 'transparent' },
            },
          }}
        />

        {/* Blue Search Action Button */}
        <IconButton
          sx={{
            bgcolor: '#2563eb',
            color: '#ffffff',
            borderRadius: '12px',
            p: 1.2,
            '&:hover': { bgcolor: '#1d4ed8' },
          }}
        >
          <SearchIcon sx={{ fontSize: '20px' }} />
        </IconButton>

        {/* Theme switcher */}
        <IconButton onClick={onToggleDarkMode} sx={{ color: 'text.secondary' }}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        {/* User avatar next to search */}
        {user ? (
          <Avatar
            src={profile?.avatar}
            sx={{
              width: 38,
              height: 38,
              border: '1px solid #cbd5e1',
            }}
          />
        ) : (
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            size="small"
            startIcon={<LoginIcon />}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontSize: '12px',
              borderColor: '#cbd5e1',
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            Log In
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
