import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { API_ENDPOINTS } from '../config/api';

function Details() {
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
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch details');
        setProfile(data.user);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)' }}>
      <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 6, boxShadow: 6, p: 3, background: '#fff' }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar src={profile?.photo} sx={{ width: 80, height: 80, bgcolor: 'primary.main', mb: 2 }}>
              {!profile?.photo && <PersonIcon sx={{ fontSize: 50 }} />}
            </Avatar>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
              Alumni Details
            </Typography>
          </Box>
          {loading ? (
            <Typography align="center">Loading...</Typography>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          ) : profile ? (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}><b>Name:</b> <span style={{ fontWeight: 400 }}>{profile.name}</span></Grid>
              <Grid item xs={12} sm={6}><b>Email:</b> <span style={{ fontWeight: 400 }}>{profile.email}</span></Grid>
              <Grid item xs={12} sm={6}><b>Batch:</b> <span style={{ fontWeight: 400 }}>{profile.batch || '-'}</span></Grid>
              <Grid item xs={12} sm={6}><b>Company:</b> <span style={{ fontWeight: 400 }}>{profile.company || '-'}</span></Grid>
              <Grid item xs={12} sm={6}><b>Salary:</b> <span style={{ fontWeight: 400 }}>{profile.salary || '-'}</span></Grid>
              <Grid item xs={12} sm={6}><b>Designation:</b> <span style={{ fontWeight: 400 }}>{profile.designation || '-'}</span></Grid>
              <Grid item xs={12} sm={6}><b>Location:</b> <span style={{ fontWeight: 400 }}>{profile.location || '-'}</span></Grid>
              <Grid item xs={12} sm={6}><b>Phone:</b> <span style={{ fontWeight: 400 }}>{profile.phone || '-'}</span></Grid>
              <Grid item xs={12}><b>LinkedIn:</b> {profile.linkedin ? <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', wordBreak: 'break-all' }}>{profile.linkedin}</a> : '-'}</Grid>
            </Grid>
          ) : (
            <Typography align="center">No details found.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Details; 