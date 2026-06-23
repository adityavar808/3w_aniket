import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, LinearProgress } from '@mui/material';
import WalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import StarsIcon from '@mui/icons-material/Stars';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShareIcon from '@mui/icons-material/Share';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const HomeTab = ({ onShowToast }) => {
  const handleAction = (msg) => {
    if (onShowToast) onShowToast(msg);
  };

  return (
    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Wallet Card with Gradient Background */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.08)',
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WalletIcon sx={{ fontSize: '24px', color: '#93c5fd' }} />
              <Typography variant="subtitle2" sx={{ color: '#93c5fd', fontWeight: 600 }}>
                My Balance
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700 }}>
              Verified
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
            ₹3,528.00
          </Typography>
          <Typography variant="body2" sx={{ color: '#93c5fd', mb: 3 }}>
            Total Earnings Redeemed
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.06)', p: 1.5, borderRadius: '16px' }}>
                <Typography sx={{ color: '#bfdbfe', fontSize: '11px', fontWeight: 600 }}>Current Balance</Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 700, mt: 0.5 }}>₹0.00</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.06)', p: 1.5, borderRadius: '16px' }}>
                <Typography sx={{ color: '#bfdbfe', fontSize: '11px', fontWeight: 600 }}>Redeemable</Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 700, mt: 0.5 }}>₹0.00</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#eab308', mb: 1 }}>
                <StarsIcon />
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: 'text.primary' }}>Stars Earned</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>50</Typography>
              <Typography variant="caption" color="text.secondary">Next badge at 100 Stars</Typography>
              <LinearProgress variant="determinate" value={50} sx={{ mt: 1, height: 6, borderRadius: '3px', bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#eab308' } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981', mb: 1 }}>
                <TrendingUpIcon />
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: 'text.primary' }}>Promotions</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>4 Active</Typography>
              <Typography variant="caption" color="text.secondary">₹12.50 earned today</Typography>
              <LinearProgress variant="determinate" value={75} sx={{ mt: 1, height: 6, borderRadius: '3px', bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => handleAction('Redemption initiated! You need at least ₹100.00 to withdraw.')}
          sx={{
            py: 1.5,
            borderRadius: '16px',
            bgcolor: '#2563eb',
            '&:hover': { bgcolor: '#1d4ed8' },
            fontWeight: 700,
          }}
        >
          Withdraw Cash
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleAction('Referral link copied to clipboard!')}
          startIcon={<ShareIcon />}
          sx={{
            py: 1.5,
            borderRadius: '16px',
            borderColor: '#cbd5e1',
            color: 'text.secondary',
            '&:hover': { borderColor: 'text.primary', bgcolor: 'rgba(0,0,0,0.02)' },
            fontWeight: 700,
          }}
        >
          Share & Earn
        </Button>
      </Box>

      {/* Promotions & Banner Section */}
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 1 }}>
        Hot Offers
      </Typography>

      <Box
        onClick={() => handleAction('Redirecting to Promotion: Watch Video and Earn!')}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderRadius: '20px',
          bgcolor: '#fef3c7',
          border: '1px solid #fde68a',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': { transform: 'translateY(-2px)' },
        }}
      >
        <Box>
          <Typography sx={{ color: '#92400e', fontWeight: 800, fontSize: '14px' }}>
            Watch Video Ads (Earn +5 Stars)
          </Typography>
          <Typography sx={{ color: '#b45309', fontSize: '11px', mt: 0.5 }}>
            Double payouts active for the next 2 hours!
          </Typography>
        </Box>
        <ArrowForwardIosIcon sx={{ fontSize: '14px', color: '#b45309' }} />
      </Box>

      <Box
        onClick={() => handleAction('Redirecting to Promotion: Surveys!')}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderRadius: '20px',
          bgcolor: '#dbeafe',
          border: '1px solid #bfdbfe',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': { transform: 'translateY(-2px)' },
        }}
      >
        <Box>
          <Typography sx={{ color: '#1e40af', fontWeight: 800, fontSize: '14px' }}>
            Take Quick Survey (Earn up to ₹25.00)
          </Typography>
          <Typography sx={{ color: '#1d4ed8', fontSize: '11px', mt: 0.5 }}>
            Takes only 3 minutes to complete.
          </Typography>
        </Box>
        <ArrowForwardIosIcon sx={{ fontSize: '14px', color: '#1d4ed8' }} />
      </Box>
    </Box>
  );
};

export default HomeTab;
