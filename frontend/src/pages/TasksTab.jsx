import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarsIcon from '@mui/icons-material/Stars';

const initialTasks = [
  { id: 1, title: 'Write a post', desc: 'Share your thoughts on the Social feed', reward: '10 Stars', progress: 0, target: 1, claimed: false },
  { id: 2, title: 'Like 3 posts', desc: 'Spread some love on your feed', reward: '5 Stars', progress: 1, target: 3, claimed: false },
  { id: 3, title: 'Comment on a post', desc: 'Share your feedback or start a convo', reward: '5 Stars', progress: 0, target: 1, claimed: false },
  { id: 4, title: 'Follow 2 creators', desc: 'Connect with new creators on Social', reward: '8 Stars', progress: 1, target: 2, claimed: false },
  { id: 5, title: 'Daily Check-in', desc: 'Log in today to claim your bonus', reward: '2 Stars', progress: 1, target: 1, claimed: false }
];

const TasksTab = ({ onShowToast }) => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleClaim = (taskId, title, reward) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, claimed: true } : t))
    );
    if (onShowToast) {
      onShowToast(`Claimed ${reward} for completing "${title}"! 🌟`);
    }
  };

  const handleInteract = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId && t.progress < t.target) {
          const newProgress = t.progress + 1;
          if (newProgress === t.target) {
            onShowToast(`Task "${t.title}" is ready to claim! 🎉`);
          }
          return { ...t, progress: newProgress };
        }
        return t;
      })
    );
  };

  return (
    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Top Banner */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
          Daily Tasks
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete tasks to earn Stars and unlock premium badges!
        </Typography>
      </Box>

      {/* Task List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tasks.map((task) => {
          const isCompleted = task.progress >= task.target;
          const percentage = Math.min((task.progress / task.target) * 100, 100);

          return (
            <Card
              key={task.id}
              sx={{
                borderRadius: '16px',
                border: isCompleted && !task.claimed ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                bgcolor: isCompleted && !task.claimed ? '#f0fdf4' : 'background.paper',
                boxShadow: 'none',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-1px)' },
              }}
            >
              <CardContent sx={{ p: '16px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '15px' }}>
                      {task.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
                      {task.desc}
                    </Typography>
                  </Box>

                  {/* Reward Pill */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '12px',
                      px: 1.2,
                      py: 0.3,
                      gap: 0.5,
                    }}
                  >
                    <StarsIcon sx={{ color: '#eab308', fontSize: '14px' }} />
                    <Typography sx={{ color: '#b45309', fontSize: '10px', fontWeight: 800 }}>
                      {task.reward}
                    </Typography>
                  </Box>
                </Box>

                {/* Progress bar and controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 600 }}>
                        Progress
                      </Typography>
                      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 700 }}>
                        {task.progress}/{task.target}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: '3px',
                        bgcolor: isCompleted && !task.claimed ? '#dcfce7' : '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: isCompleted ? '#22c55e' : '#2563eb',
                        },
                      }}
                    />
                  </Box>

                  {/* Button trigger */}
                  {task.claimed ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#16a34a', gap: 0.5, px: 2 }}>
                      <CheckCircleIcon sx={{ fontSize: '16px' }} />
                      <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>Claimed</Typography>
                    </Box>
                  ) : isCompleted ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleClaim(task.id, task.title, task.reward)}
                      sx={{
                        bgcolor: '#22c55e',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '11px',
                        py: 0.5,
                        px: 2,
                        '&:hover': { bgcolor: '#16a34a' },
                      }}
                    >
                      Claim
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleInteract(task.id)}
                      sx={{
                        borderColor: '#cbd5e1',
                        color: 'text.secondary',
                        fontWeight: 700,
                        fontSize: '11px',
                        py: 0.5,
                        px: 2,
                        '&:hover': { borderColor: 'text.primary', bgcolor: 'rgba(0,0,0,0.02)' },
                      }}
                    >
                      Do it
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default TasksTab;
