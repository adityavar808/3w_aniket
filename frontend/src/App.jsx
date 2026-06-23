import React, { useState, useMemo, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomeTab from './pages/HomeTab';
import TasksTab from './pages/TasksTab';
import LeaderboardTab from './pages/LeaderboardTab';
import ChatTab from './pages/ChatTab';

function AppContent() {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('social');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Toast trigger function
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Re-build theme when darkMode changes
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#2563eb', // Blue
        },
        secondary: {
          main: '#10b981', // Emerald
        },
        background: {
          default: darkMode ? '#0b0f19' : '#f3f4f9', // soft light grey bg / dark slate-blue
          paper: darkMode ? '#151c2c' : '#ffffff', // card backgrounds
        },
        text: {
          primary: darkMode ? '#f8fafc' : '#0f172a',
          secondary: darkMode ? '#94a3b8' : '#64748b',
        },
      },
      typography: {
        fontFamily: "'Inter', 'Outfit', 'Roboto', 'sans-serif'",
        h5: {
          fontWeight: 800,
        },
        h6: {
          fontWeight: 700,
        },
        subtitle1: {
          fontWeight: 600,
        },
        body1: {
          lineHeight: 1.6,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '24px',
              textTransform: 'none',
              fontWeight: 600,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.01)',
              border: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
              borderRadius: '16px',
            },
          },
        },
      },
    });
  }, [darkMode]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onShowToast={showToast} />;
      case 'tasks':
        return <TasksTab onShowToast={showToast} />;
      case 'leaderboard':
        return <LeaderboardTab />;
      case 'chat':
        return <ChatTab />;
      case 'social':
      default:
        return (
          <Routes>
            {/* Public Feed Page */}
            <Route path="/" element={<Feed searchQuery={searchQuery} />} />

            {/* Auth Pages (redirects to / if already logged in) */}
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/" replace /> : <Signup />}
            />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: darkMode ? '#020617' : '#e2e8f0', // page background wrapper
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 'sm', // Center the app view to look like a mobile app (max 600px width)
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            pb: '85px', // space for fixed bottom navigation
            overflow: 'hidden',
          }}
        >
          {/* Custom Toast Notification Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 75,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              zIndex: 2000,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              pointerEvents: 'none',
            }}
          >
            {toasts.map((t) => (
              <Box
                key={t.id}
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.95)',
                  color: '#ffffff',
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                  textAlign: 'center',
                  animation: 'slideDownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  pointerEvents: 'auto',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {t.message}
              </Box>
            ))}
            <style>{`
              @keyframes slideDownFade {
                from { transform: translateY(-15px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>
          </Box>

          {/* Header/Navbar */}
          <Navbar
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Main Content Area */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {renderActiveTabContent()}
          </Box>

          {/* Bottom Navigation */}
          <BottomNav activeTab={activeTab} onChangeTab={handleTabChange} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
