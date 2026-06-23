import React from 'react';
import { Box, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ClipboardIcon from '@mui/icons-material/AssignmentOutlined';
import PublicIcon from '@mui/icons-material/Public';
import LeaderboardIcon from '@mui/icons-material/LeaderboardOutlined';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

const tabs = [
  { id: 'home', label: 'Home', Icon: HomeOutlinedIcon },
  { id: 'tasks', label: 'Tasks', Icon: ClipboardIcon },
  { id: 'social', label: 'Social', Icon: PublicIcon },
  { id: 'leaderboard', label: 'Leader Board', Icon: LeaderboardIcon },
  { id: 'chat', label: 'Chat', Icon: ChatIcon },
];

const BottomNav = ({ activeTab = 'social', onChangeTab }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 'sm', // Align with feed container
        bgcolor: '#2563eb', // Vibrant royal blue
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        py: 1,
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1100,
        height: '76px',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Box
            key={tab.id}
            onClick={() => onChangeTab && onChangeTab(tab.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              flex: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            {/* Icon Wrapper (capsule background for active tab) */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#2563eb' : '#93c5fd', // White icon bg with blue icon, or light blue icon
                borderRadius: '24px',
                px: 2.5,
                py: 0.5,
                transition: 'all 0.2s ease',
                mb: 0.5,
              }}
            >
              <tab.Icon sx={{ fontSize: '24px' }} />
            </Box>

            {/* Label */}
            <Typography
              variant="caption"
              sx={{
                color: isActive ? '#ffffff' : '#93c5fd',
                fontWeight: isActive ? 600 : 500,
                fontSize: '11px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {tab.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default BottomNav;
