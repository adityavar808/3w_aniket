import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, Avatar, Card, CardContent } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import { getUserProfileDetails } from '../components/Navbar';

const initialThreads = [
  {
    username: 'shethbhjt',
    lastMessage: 'Hey! Did you check out my latest status?',
    time: '2m ago',
    unread: true,
    messages: [
      { sender: 'them', text: 'Hey there! How are you?', time: '10:30 AM' },
      { sender: 'me', text: 'Hey Priya! I am good, how about you?', time: '10:32 AM' },
      { sender: 'them', text: 'Hey! Did you check out my latest status?', time: '10:33 AM' }
    ],
    replies: [
      "Awesome! Let me know if you like my post. 😊",
      "I am currently working on a Bronze badge promotion, hope it goes well!",
      "Talk to you later, need to check tasks!"
    ]
  },
  {
    username: 'ideash3cnb',
    lastMessage: 'Yeah, the withdrawal took only 5 minutes!',
    time: '1h ago',
    unread: false,
    messages: [
      { sender: 'them', text: 'Check out my earnings post! I redeemed ₹3528.00!', time: 'Yesterday' },
      { sender: 'me', text: 'Wow, that is great! Did it go directly to your bank?', time: 'Yesterday' },
      { sender: 'them', text: 'Yeah, the withdrawal took only 5 minutes!', time: 'Yesterday' }
    ],
    replies: [
      "Exactly! You should complete the daily tasks, they pay really well.",
      "MERN stack is so fast for transactions. Cheers!",
      "I am aiming for the top of the Leader Board this week!"
    ]
  },
  {
    username: 'fariha3yw3',
    lastMessage: 'Wishing you a blessed day as well!',
    time: '3h ago',
    unread: false,
    messages: [
      { sender: 'them', text: 'Wishing you a blessed day as well!', time: 'Yesterday' }
    ],
    replies: [
      "Thank you! Hope you have a productive day ahead.",
      "Did you complete the daily check-in task?"
    ]
  }
];

const ChatTab = () => {
  const [threads, setThreads] = useState(initialThreads);
  const [activeUsername, setActiveUsername] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeThread = threads.find(t => t.username === activeUsername);

  // Scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages, isTyping]);

  const handleThreadSelect = (username) => {
    setActiveUsername(username);
    // Mark as read
    setThreads(prev =>
      prev.map(t => (t.username === username ? { ...t, unread: false } : t))
    );
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeString = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const userMessage = { sender: 'me', text: inputText, time: timeString };

    // Update messages
    setThreads(prev =>
      prev.map(t => {
        if (t.username === activeUsername) {
          return {
            ...t,
            lastMessage: inputText,
            time: 'Just now',
            messages: [...t.messages, userMessage]
          };
        }
        return t;
      })
    );

    setInputText('');

    // Trigger simulated reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyPool = activeThread.replies;
      const randomReplyText = replyPool[Math.floor(Math.random() * replyPool.length)] || "Nice! 👍";
      
      const botMessage = {
        sender: 'them',
        text: randomReplyText,
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev =>
        prev.map(t => {
          if (t.username === activeUsername) {
            return {
              ...t,
              lastMessage: randomReplyText,
              time: 'Just now',
              messages: [...t.messages, botMessage]
            };
          }
          return t;
        })
      );
    }, 1800);
  };

  if (activeUsername && activeThread) {
    const profile = getUserProfileDetails(activeUsername);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 165px)', bgcolor: 'background.default' }}>
        {/* Chat Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            bgcolor: 'background.paper',
            borderBottom: '1px solid #e2e8f0',
            gap: 1
          }}
        >
          <IconButton size="small" onClick={() => setActiveUsername(null)} sx={{ color: 'text.secondary' }}>
            <ArrowBackIcon />
          </IconButton>
          
          <Box sx={{ position: 'relative' }}>
            <Avatar src={profile.avatar} sx={{ width: 38, height: 38, border: '1px solid #cbd5e1' }} />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                bgcolor: '#22c55e',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }}
            />
          </Box>

          <Box sx={{ ml: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {profile.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>
              Online
            </Typography>
          </Box>
        </Box>

        {/* Message Log */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {activeThread.messages.map((msg, index) => {
            const isMe = msg.sender === 'me';
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '75%',
                    bgcolor: isMe ? '#2563eb' : 'background.paper',
                    color: isMe ? '#ffffff' : 'text.primary',
                    border: isMe ? 'none' : '1px solid #e2e8f0',
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    p: 1.5,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                >
                  <Typography sx={{ fontSize: '13.5px', lineHeight: 1.4 }}>
                    {msg.text}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                    <Typography sx={{ fontSize: '9px', opacity: 0.7, color: 'inherit' }}>
                      {msg.time}
                    </Typography>
                    {isMe && <CheckIcon sx={{ fontSize: '10px', opacity: 0.8 }} />}
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px 16px 16px 4px',
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <Box sx={{ display: 'flex', gap: 0.4 }}>
                  <Box className="dot" sx={{ width: 6, height: 6, bgcolor: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                  <Box className="dot" sx={{ width: 6, height: 6, bgcolor: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                  <Box className="dot" sx={{ width: 6, height: 6, bgcolor: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                </Box>
                <style>{`
                  @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                  }
                `}</style>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Bar */}
        <Box
          component="form"
          onSubmit={handleSend}
          sx={{
            p: 1.5,
            bgcolor: 'background.paper',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                bgcolor: '#f1f5f9',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'transparent' },
              }
            }}
          />
          <IconButton
            type="submit"
            disabled={!inputText.trim() || isTyping}
            sx={{
              bgcolor: '#2563eb',
              color: '#ffffff',
              '&:hover': { bgcolor: '#1d4ed8' },
              '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' }
            }}
          >
            <SendIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
          Messages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chat with other users in real time
        </Typography>
      </Box>

      {/* Threads list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {threads.map((thread) => {
          const profile = getUserProfileDetails(thread.username);
          return (
            <Card
              key={thread.username}
              onClick={() => handleThreadSelect(thread.username)}
              sx={{
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                bgcolor: thread.unread ? 'rgba(37, 99, 235, 0.03)' : 'background.paper',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  borderColor: '#cbd5e1'
                }
              }}
            >
              <CardContent sx={{ p: '12px 16px !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden', width: '80%' }}>
                  {/* Avatar wrapper with online status */}
                  <Box sx={{ position: 'relative' }}>
                    <Avatar src={profile.avatar} sx={{ width: 42, height: 42, border: '1px solid #cbd5e1' }} />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 11,
                        height: 11,
                        bgcolor: '#22c55e',
                        borderRadius: '50%',
                        border: '2px solid #ffffff'
                      }}
                    />
                  </Box>

                  {/* Name and last message snippet */}
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '14px', color: 'text.primary' }}>
                      {profile.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: thread.unread ? 'text.primary' : 'text.secondary',
                        fontWeight: thread.unread ? 700 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mt: 0.3
                      }}
                    >
                      {thread.lastMessage}
                    </Typography>
                  </Box>
                </Box>

                {/* Date and unread dot */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.8 }}>
                  <Typography sx={{ fontSize: '10px', color: 'text.secondary', fontWeight: 500 }}>
                    {thread.time}
                  </Typography>
                  {thread.unread && (
                    <Box sx={{ width: 8, height: 8, bgcolor: '#2563eb', borderRadius: '50%' }} />
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

export default ChatTab;
