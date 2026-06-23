import React, { useState, useContext } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Link, Alert } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ForumIcon from '@mui/icons-material/Forum';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await signup(username, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
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
              Join SocialPulse
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Create an account to start sharing today
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              startIcon={<PersonAddIcon />}
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
              {submitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/login" 
                sx={{ 
                  color: '#6366f1', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                Log In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;
