import React, { useState, useContext } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Link, Alert } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginIcon from '@mui/icons-material/Login';
import ForumIcon from '@mui/icons-material/Forum';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await login(emailOrUsername, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, mb: 4 }}>
      <Card sx={{ 
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        borderRadius: '12px',
        color: 'text.primary',
        p: 2
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <ForumIcon sx={{ 
              color: '#0f172a', 
              fontSize: 40,
              mb: 1
            }} />
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 1, color: 'text.primary' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Connect with the world on SocialPulse
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username or Email"
              variant="outlined"
              fullWidth
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              disabled={submitting}
              InputLabelProps={{ style: { color: '#64748b' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  backgroundColor: '#f8fafc',
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#cbd5e1' },
                  '&.Mui-focused fieldset': { borderColor: '#0f172a' },
                }
              }}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              InputLabelProps={{ style: { color: '#64748b' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  backgroundColor: '#f8fafc',
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#cbd5e1' },
                  '&.Mui-focused fieldset': { borderColor: '#0f172a' },
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              startIcon={<LoginIcon />}
              sx={{
                mt: 1,
                py: 1.2,
                background: '#0f172a',
                color: '#ffffff',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                '&:hover': {
                  background: '#1e293b',
                },
                '&.Mui-disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8'
                }
              }}
            >
              {submitting ? 'Logging in...' : 'Log In'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/signup" 
                sx={{ 
                  color: '#6366f1', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
