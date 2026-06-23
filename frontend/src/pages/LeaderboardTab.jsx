import React from 'react';
import { Box, Typography, Avatar, Card, CardContent } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import { getUserProfileDetails } from '../components/Navbar';

const leaders = [
  { rank: 1, username: 'ideash3cnb', stars: 850 },
  { rank: 2, username: 'shethbhjt', stars: 620 },
  { rank: 3, username: 'fariha3yw3', stars: 450 },
  { rank: 4, username: 'uyiosase73', stars: 380 },
  { rank: 5, username: 'senapaokl0', stars: 290 },
  { rank: 6, username: 'k5abq', stars: 210 },
  { rank: 7, username: 'jaiswamyn0', stars: 180 },
];

const LeaderboardTab = () => {
  const topThree = [leaders[1], leaders[0], leaders[2]]; // Order: 2nd, 1st, 3rd for podium layout

  return (
    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            Leader Board
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Global ranking based on Stars earned
          </Typography>
        </Box>
        <EmojiEventsIcon sx={{ color: '#eab308', fontSize: '32px' }} />
      </Box>

      {/* Podium Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          pt: 4,
          pb: 1,
          px: 1,
          bgcolor: 'background.paper',
          border: '1px solid #e2e8f0',
          borderRadius: '24px',
          mb: 1,
        }}
      >
        {topThree.map((leader, index) => {
          const profile = getUserProfileDetails(leader.username);
          const isFirst = leader.rank === 1;
          const isSecond = leader.rank === 2;
          const height = isFirst ? 140 : isSecond ? 100 : 80;
          const color = isFirst ? '#fef3c7' : isSecond ? '#f1f5f9' : '#ffedd5'; // gold, silver, bronze bg
          const iconColor = isFirst ? '#eab308' : isSecond ? '#64748b' : '#b45309';

          return (
            <Box
              key={leader.username}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                position: 'relative',
              }}
            >
              {/* Crown for 1st Place */}
              {isFirst && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    fontSize: '24px',
                    transform: 'rotate(-5deg)',
                    zIndex: 2,
                  }}
                >
                  👑
                </Box>
              )}

              {/* Avatar */}
              <Avatar
                src={profile.avatar}
                sx={{
                  width: isFirst ? 60 : 48,
                  height: isFirst ? 60 : 48,
                  border: `3px solid ${iconColor}`,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  mb: 1,
                }}
              />

              {/* Display Name */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 800,
                  fontSize: isFirst ? '13px' : '11px',
                  textAlign: 'center',
                  color: 'text.primary',
                  maxWidth: '85px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {profile.name}
              </Typography>

              {/* Stars */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2, mb: 1.5 }}>
                <StarIcon sx={{ color: '#eab308', fontSize: isFirst ? '12px' : '10px' }} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: isFirst ? '12px' : '10px',
                    color: 'text.secondary',
                  }}
                >
                  {leader.stars}
                </Typography>
              </Box>

              {/* Pedestal block */}
              <Box
                sx={{
                  width: '100%',
                  height: height,
                  bgcolor: color,
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${isFirst ? '#fde68a' : isSecond ? '#e2e8f0' : '#fed7aa'}`,
                  borderBottom: 'none',
                }}
              >
                <Typography
                  sx={{
                    fontSize: isFirst ? '28px' : '20px',
                    fontWeight: 900,
                    color: iconColor,
                  }}
                >
                  {leader.rank}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Rank List below Podium */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {leaders.slice(3).map((leader) => {
          const profile = getUserProfileDetails(leader.username);
          return (
            <Card key={leader.username} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
              <CardContent sx={{ p: '12px 16px !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {/* Rank number */}
                  <Typography sx={{ fontWeight: 800, fontSize: '15px', color: 'text.secondary', minWidth: '20px' }}>
                    {leader.rank}
                  </Typography>

                  {/* Avatar */}
                  <Avatar src={profile.avatar} sx={{ width: 36, height: 36, border: '1px solid #cbd5e1' }} />

                  {/* Name and Handle */}
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '13.5px', color: 'text.primary' }}>
                      {profile.name}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                      @{leader.username}
                    </Typography>
                  </Box>
                </Box>

                {/* Stars and Badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Badge */}
                  {profile.badge && (
                    <Box
                      sx={{
                        bgcolor: '#ffedd5',
                        border: '1px solid #fed7aa',
                        borderRadius: '8px',
                        px: 0.8,
                        py: 0.1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.3,
                      }}
                    >
                      <Box sx={{ bgcolor: '#b45309', borderRadius: '50%', width: 6, height: 6 }} />
                      <Typography sx={{ color: '#b45309', fontSize: '8px', fontWeight: 800 }}>
                        {profile.badge}
                      </Typography>
                    </Box>
                  )}

                  {/* Stars */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <StarIcon sx={{ color: '#eab308', fontSize: '16px' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '13.5px', color: 'text.primary' }}>
                      {leader.stars}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default LeaderboardTab;
