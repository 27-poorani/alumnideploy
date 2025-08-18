import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Alert, CircularProgress, Paper, Divider, IconButton, Tooltip, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SchoolIcon from '@mui/icons-material/School';
import { API_ENDPOINTS } from '../config/api';
import SideNav from '../components/SideNav';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(API_ENDPOINTS.ALUMNI_DASHBOARD, {
          headers: { 'x-auth-token': token },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch profile');
        setProfile(data.user);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  return (
    <SideNav title="My Profile">
      <Card
        sx={{
          maxWidth: 900,
          width: '100%',
          borderRadius: 7,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          p: 4,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          mt: 4,
          mx: 'auto',
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar 
              src={profile?.photo} 
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: 'primary.main', 
                mb: 2, 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: '4px solid white'
              }}
            >
              {!profile?.photo && <PersonIcon sx={{ fontSize: 70 }} />}
            </Avatar>
            <Typography variant="h3" fontWeight={800} color="primary" gutterBottom align="center" sx={{ letterSpacing: 1 }}>
              {profile?.name || 'Alumni Profile'}
            </Typography>
            {profile?.email && (
              <Typography variant="body1" color="text.secondary" align="center">
                {profile.email}
              </Typography>
            )}
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          ) : profile ? (
            <Paper elevation={3} sx={{ borderRadius: 4, p: 3, mb: 4, background: 'rgba(255,255,255,0.95)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700} color="primary">
                  Profile Information
                </Typography>
                <Tooltip title="Edit Profile">
                  <IconButton 
                    color="primary" 
                    sx={{ 
                      background: 'rgba(25, 118, 210, 0.08)', 
                      '&:hover': { background: 'rgba(25, 118, 210, 0.15)' } 
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SchoolIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Batch</Typography>
                      <Typography variant="body1" fontWeight={500}>{profile.batch || 'Not specified'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <WorkIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Company</Typography>
                      <Typography variant="body1" fontWeight={500}>{profile.company || 'Not specified'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box component="span" sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>🏆</Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Designation</Typography>
                      <Typography variant="body1" fontWeight={500}>{profile.designation || 'Not specified'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LocationOnIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Location</Typography>
                      <Typography variant="body1" fontWeight={500}>{profile.location || 'Not specified'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PhoneIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1" fontWeight={500}>{profile.phone || 'Not specified'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LinkedInIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">LinkedIn</Typography>
                      {profile.linkedin ? (
                        <Typography 
                          variant="body1" 
                          component="a" 
                          href={profile.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          sx={{ 
                            color: 'primary.main', 
                            fontWeight: 500,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {profile.linkedin}
                        </Typography>
                      ) : (
                        <Typography variant="body1" fontWeight={500}>Not specified</Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button 
                  variant="contained" 
                  startIcon={<EditIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.2s',
                    ':hover': { 
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)'
                    }
                  }}
                >
                  Update Profile
                </Button>
              </Box>
            </Paper>
          ) : (
            <Typography align="center">No profile data found.</Typography>
          )}
        </CardContent>
      </Card>
    </SideNav>
  );
}

export default Profile;