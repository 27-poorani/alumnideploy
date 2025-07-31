import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Avatar, Chip, Paper, CircularProgress, Alert, Fade, Grow } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { API_ENDPOINTS } from '../config/api';

const recruiters = [
  
  'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'https://www.arkphire.com/hs-fs/hubfs/Presidio-Logo-Blue-1.png?width=1000&height=192&name=Presidio-Logo-Blue-1.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp6Uvy-j6B7DvvGIoH2lFjKgyofVdv2vj1aQ&s',
  'https://1000logos.net/wp-content/uploads/2021/09/Cognizant-Logo.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/2560px-Accenture.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tata_Consultancy_Services_old_logo.svg/2560px-Tata_Consultancy_Services_old_logo.svg.png',
];

const testimonials = [
  {
    name: 'S. Meena',
    quote: 'VCET gave me the platform and confidence to achieve my dreams. The alumni network is amazing!',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    company: 'Google',
  },
  {
    name: 'R. Arjun',
    quote: 'The placement training and support from seniors helped me land my dream job.',
    photo: 'https://randomuser.me/api/portraits/men/71.jpg',
    company: 'Amazon',
  },
];

const sectionFadeProps = { timeout: 900, in: true, appear: true };

function Home() {
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [highlights, setHighlights] = useState(null);
  const [loadingHighlights, setLoadingHighlights] = useState(false);
  const [errorHighlights, setErrorHighlights] = useState('');

  const [alumniPosts, setAlumniPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorPosts, setErrorPosts] = useState('');

  useEffect(() => {
    const fetchTopStudents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(API_ENDPOINTS.TOP_STUDENTS);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch top students');
        setTopStudents(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchTopStudents();
  }, []);

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoadingHighlights(true);
      setErrorHighlights('');
      try {
        const res = await fetch(API_ENDPOINTS.PLACEMENT_HIGHLIGHTS);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch highlights');
        setHighlights(data);
      } catch (err) {
        setErrorHighlights(err.message);
      }
      setLoadingHighlights(false);
    };
    fetchHighlights();
  }, []);

  useEffect(() => {
    const fetchAlumniPosts = async () => {
      setLoadingPosts(true);
      setErrorPosts('');
      try {
        const res = await fetch(API_ENDPOINTS.ALUMNI_POSTS);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch posts');
        setAlumniPosts(data);
      } catch (err) {
        setErrorPosts(err.message);
      }
      setLoadingPosts(false);
    };
    fetchAlumniPosts();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)', p: 0, position: 'relative', overflow: 'hidden' }}>
      {/* Soft background overlay for extra depth */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 70% 20%, #e3f0ff 0%, #fafcff 70%)', opacity: 0.5 }} />

      {/* Hero Section */}
      <Fade {...sectionFadeProps}>
        <Box sx={{ py: 6, textAlign: 'center', background: '#fff', boxShadow: 1, position: 'relative', zIndex: 1 }}>
          <img src="https://upload.wikimedia.org/wikipedia/ta/d/d0/Vcet_logo.jpg" alt="VCET Logo" style={{ maxWidth: 120, marginBottom: 16, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
          <Typography variant="h2" fontWeight={700} color="primary" gutterBottom>
            Welcome to VCET Alumni & Placement Portal
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Connect, celebrate, and get inspired by the success of Velammal College alumni.
          </Typography>
          <Button variant="contained" size="large" sx={{ mt: 3, transition: 'transform 0.2s', ':hover': { transform: 'scale(1.07)' } }} href="/register">
            Join the Alumni Network
          </Button>
        </Box>
      </Fade>

      {/* Interesting Alumni Posts Section */}
      <Fade {...sectionFadeProps} style={{ transitionDelay: '50ms' }}>
        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2, position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight={600} color="primary" gutterBottom align="center">
            Interesting Alumni Posts
          </Typography>
          {loadingPosts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
          ) : errorPosts ? (
            <Alert severity="error">{errorPosts}</Alert>
          ) : alumniPosts.length === 0 ? (
            <Typography color="text.secondary">No posts yet.</Typography>
          ) : (
            <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
              {alumniPosts.map((post, idx) => (
                <Grow in={true} timeout={600 + idx * 100} key={post._id}>
                  <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                    <Card sx={{ borderRadius: 4, boxShadow: 2, p: 2, background: '#fff', width: 320, minHeight: 120, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar src={post.user?.photo} sx={{ width: 40, height: 40 }} />
                        <Box>
                          <Typography fontWeight={600}>{post.user?.name || 'Alumni'}</Typography>
                          <Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleString()}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1">{post.content}</Typography>
                      {post.attachment && (
                        <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {post.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img src={post.attachment} alt="attachment" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 8 }} />
                          ) : post.attachment.match(/\.pdf$/i) ? (
                            <iframe src={post.attachment} title="PDF" style={{ width: '100%', height: 220, border: 'none', marginBottom: 8 }} />
                          ) : null}
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {(post.attachment.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) && (
                              <Button size="small" variant="outlined" href={post.attachment} target="_blank" rel="noopener noreferrer">View</Button>
                            )}
                            <Button size="small" variant="outlined" href={post.attachment} target="_blank" rel="noopener noreferrer" download>
                              Download
                            </Button>
                            {post.attachment.match(/\.(doc|docx|ppt|pptx|xls|xlsx|txt)$/i) && (
                              <Typography variant="body2" sx={{ ml: 1 }}>{post.attachment.split('/').pop()}</Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          )}
        </Box>
      </Fade>

      {/* Recently Placed Top Students */}
      <Fade {...sectionFadeProps} style={{ transitionDelay: '100ms' }}>
        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2, position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight={600} color="primary" gutterBottom align="center">
            Recently Placed Top Students
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
              {topStudents.map((student, idx) => (
                <Grow in={true} timeout={600 + idx * 200} key={student._id || idx}>
                  <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
                    <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, textAlign: 'center', width: 200, mx: 'auto', transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'translateY(-8px) scale(1.04)', boxShadow: 6 } }}>
                      <Avatar src={student.photo} sx={{ width: 72, height: 72, mx: 'auto', mb: 1, transition: 'transform 0.2s', ':hover': { transform: 'scale(1.12)' } }} />
                      <Typography fontWeight={600}>{student.name}</Typography>
                      <Chip label={student.company} color="primary" size="small" sx={{ my: 1 }} />
                      <Typography variant="body2">Package: <b>{student.package}</b></Typography>
                      <Typography variant="body2">Batch: {student.batch}</Typography>
                    </Card>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          )}
        </Box>
      </Fade>

      {/* Placement Highlights */}
      <Fade {...sectionFadeProps} style={{ transitionDelay: '200ms' }}>
        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2, position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight={600} color="primary" gutterBottom align="center">
            Placement Highlights
          </Typography>
          {loadingHighlights ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
          ) : errorHighlights ? (
            <Alert severity="error">{errorHighlights}</Alert>
          ) : highlights ? (
            <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
              {[{
                icon: <EmojiEventsIcon color="primary" />, value: highlights.totalOffers, label: 'Total Offers'
              }, {
                icon: <BusinessIcon color="primary" />, value: highlights.highestPackage, label: 'Highest Package'
              }, {
                icon: <SchoolIcon color="primary" />, value: highlights.topRecruiters, label: 'Top Recruiters'
              }].map((stat, idx) => (
                <Grow in={true} timeout={600 + idx * 200} key={stat.label}>
                  <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                    <Card sx={{ borderRadius: 4, boxShadow: 2, p: 3, textAlign: 'center', width: 200, transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'translateY(-8px) scale(1.04)', boxShadow: 6 } }}>
                      <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                      <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                      <Typography color="text.secondary">{stat.label}</Typography>
                    </Card>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          ) : null}
        </Box>
      </Fade>

      {/* Top Recruiters */}
      <Fade {...sectionFadeProps} style={{ transitionDelay: '300ms' }}>
        <Box sx={{ mt: 6, px: { xs: 2, md: 8 }, position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight={600} color="primary" gutterBottom align="center">
            Top Recruiters
          </Typography>
          <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 2, maxWidth: 1100, mx: 'auto' }}>
            {recruiters.map((logo, idx) => (
              <Grow in={true} timeout={600 + idx * 100} key={idx}>
                <Grid item xs={6} sm={4} md={3} lg={2} display="flex" justifyContent="center" alignItems="center">
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 80, transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'scale(1.08)', boxShadow: 6 } }}>
                    <img src={logo} alt="Recruiter Logo" style={{ height: 40, width: 'auto', objectFit: 'contain', maxWidth: 100, transition: 'transform 0.2s' }} />
                  </Paper>
                </Grid>
              </Grow>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* Alumni Testimonials */}
      <Fade {...sectionFadeProps} style={{ transitionDelay: '400ms' }}>
        <Box sx={{ mt: 6, px: { xs: 2, md: 8 }, pb: 8, position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight={600} color="primary" gutterBottom align="center">
            Alumni Testimonials
          </Typography>
          <Grid container spacing={3}>
            {testimonials.map((alum, idx) => (
              <Grow in={true} timeout={600 + idx * 200} key={idx}>
                <Grid item xs={12} md={6} display="flex" justifyContent="center">
                  <Card sx={{ borderRadius: 4, boxShadow: 2, p: 3, textAlign: 'center', background: '#f5faff', width: 350, transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'translateY(-8px) scale(1.03)', boxShadow: 6 } }}>
                    <Avatar src={alum.photo} sx={{ width: 64, height: 64, mx: 'auto', mb: 1, transition: 'transform 0.2s', ':hover': { transform: 'scale(1.12)' } }} />
                    <Typography fontWeight={600}>{alum.name}</Typography>
                    <Chip label={alum.company} color="primary" size="small" sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      <FormatQuoteIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontStyle="italic">{alum.quote}</Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
        </Box>
      </Fade>
    </Box>
  );
}

export default Home; 