import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Avatar, Chip, Paper, CircularProgress, Alert, Fade, Grow, Tabs, Tab, useTheme } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import EventIcon from '@mui/icons-material/Event';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from 'react-router-dom';

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

const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science' },
  { code: 'ECE', name: 'Electronics & Comm.' },
  { code: 'IT', name: 'Information Tech.' },
  { code: 'CIVIL', name: 'Civil' },
  { code: 'MECH', name: 'Mechanical' },
  { code: 'EEE', name: 'Electrical & Electronics' },
];

function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [highlights, setHighlights] = useState(null);
  const [loadingHighlights, setLoadingHighlights] = useState(false);
  const [errorHighlights, setErrorHighlights] = useState('');

  const [alumniPosts, setAlumniPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorPosts, setErrorPosts] = useState('');

  const [featuredMentorships, setFeaturedMentorships] = useState([]);
  const [loadingMentorships, setLoadingMentorships] = useState(false);
  const [errorMentorships, setErrorMentorships] = useState('');

  const [featuredAchievements, setFeaturedAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const [errorAchievements, setErrorAchievements] = useState('');

  const [publicEvents, setPublicEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState('');

  const [selectedDept, setSelectedDept] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [topAlumni, setTopAlumni] = useState([]);
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [errorAlumni, setErrorAlumni] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Fetch batches for a department (mocked for now)
  const fetchBatches = (dept) => {
    // You can replace this with a backend call if available
    // For now, we mock 2018-2023 for all departments
    setBatches(['2018', '2019', '2020', '2021', '2022', '2023']);
    setSelectedBatch(null);
    setTopAlumni([]);
  };

  // Fetch top alumni for department and batch
  const fetchTopAlumni = async (dept, batch) => {
    setLoadingAlumni(true);
    setErrorAlumni('');
    setTopAlumni([]);
    try {
      const res = await fetch(`/api/topstudents/by-department-batch?department=${dept}&batch=${batch}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch top alumni');
      setTopAlumni(data);
    } catch (err) {
      setErrorAlumni(err.message);
    }
    setLoadingAlumni(false);
  };

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

  useEffect(() => {
    const fetchFeaturedMentorships = async () => {
      setLoadingMentorships(true);
      setErrorMentorships('');
      try {
        const res = await fetch('/api/mentorship/featured');
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch mentorships');
        setFeaturedMentorships(data);
      } catch (err) {
        setErrorMentorships(err.message);
      }
      setLoadingMentorships(false);
    };
    fetchFeaturedMentorships();
  }, []);

  useEffect(() => {
    const fetchFeaturedAchievements = async () => {
      setLoadingAchievements(true);
      setErrorAchievements('');
      try {
        const res = await fetch(API_ENDPOINTS.ACHIEVEMENTS_FEATURED);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch achievements');
        setFeaturedAchievements(data);
      } catch (err) {
        setErrorAchievements(err.message);
      }
      setLoadingAchievements(false);
    };
    fetchFeaturedAchievements();
  }, []);

  useEffect(() => {
    const fetchPublicEvents = async () => {
      setLoadingEvents(true);
      setErrorEvents('');
      try {
        const res = await fetch(API_ENDPOINTS.NETWORKING_EVENTS);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch events');
        setPublicEvents(data);
      } catch (err) {
        setErrorEvents(err.message);
      }
      setLoadingEvents(false);
    };
    fetchPublicEvents();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)', p: 0, position: 'relative', overflow: 'hidden' }}>
      {/* Soft background overlay for extra depth */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 70% 20%, #e3f0ff 0%, #fafcff 70%)', opacity: 0.5 }} />

      {/* Hero Section with Modern Design */}
      <Fade {...sectionFadeProps}>
        <Box 
          sx={{ 
            py: 8, 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
            position: 'relative', 
            zIndex: 1,
            overflow: 'hidden',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          {/* Decorative elements */}
          <Box 
            sx={{ 
              position: 'absolute', 
              top: -100, 
              right: -100, 
              width: 300, 
              height: 300, 
              borderRadius: '50%', 
              background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: -50, 
              left: -50, 
              width: 200, 
              height: 200, 
              borderRadius: '50%', 
              background: 'radial-gradient(circle, rgba(25,118,210,0.08) 0%, rgba(25,118,210,0) 70%)',
              zIndex: 0
            }} 
          />
          
          <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 1200, mx: 'auto', px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box 
                component="img" 
                src="https://upload.wikimedia.org/wikipedia/ta/d/d0/Vcet_logo.jpg" 
                alt="VCET Logo" 
                sx={{ 
                  width: 140, 
                  height: 140, 
                  objectFit: 'contain',
                  borderRadius: '50%',
                  p: 1,
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '4px solid white'
                }} 
              />
            </Box>
            
            <Typography 
              variant="h1" 
              fontWeight={800} 
              color="primary" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                letterSpacing: '-0.5px',
                mb: 2,
                background: 'linear-gradient(90deg, #1565C0, #42a5f5)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to VCET Alumni Network
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              gutterBottom
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                mb: 4,
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              Connect with fellow alumni, celebrate achievements, and build meaningful professional relationships that last a lifetime.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.2s',
                  ':hover': { 
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
                  } 
                }} 
                href="/register"
              >
                Join the Network
              </Button>
              
              <Button 
                variant="outlined" 
                size="large" 
                sx={{ 
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  ':hover': { 
                    background: 'rgba(25, 118, 210, 0.04)',
                    transform: 'translateY(-3px)'
                  } 
                }} 
                href="/login"
              >
                Sign In
              </Button>
            </Box>
            
            {/* Stats Counter */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: { xs: 2, md: 4 },
                mt: 6,
                mb: 2,
                maxWidth: 900,
                mx: 'auto'
              }}
            >
              {[
                
              ].map((stat, idx) => (
                <Box 
                  key={idx} 
                  sx={{ 
                    textAlign: 'center',
                    minWidth: 120,
                    p: 2
                  }}
                >
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    color="primary"
                    sx={{ mb: 0.5 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Department Section with Cards */}
      <Fade {...sectionFadeProps} style={{ transitionDelay: '10ms' }}>
        <Box 
          sx={{ 
            mt: 8, 
            mb: 8,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            px: 3, 
            position: 'relative', 
            zIndex: 1,
            maxWidth: 1200,
            mx: 'auto'
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight={700} 
            color="primary" 
            gutterBottom 
            align="center"
            sx={{ 
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' } 
            }}
          >
            Explore by Department
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            align="center"
            sx={{ 
              maxWidth: 700, 
              mb: 5,
              fontSize: { xs: '1rem', md: '1.1rem' } 
            }}
          >
            Discover alumni achievements and connect with graduates from your department
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            {DEPARTMENTS.map((dept) => (
              <Grid item xs={12} sm={6} md={4} key={dept.code}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    ':hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      height: 120, 
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      p: 2
                    }}
                  >
                    <Typography variant="h5" fontWeight={700} align="center">
                      {dept.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      Connect with {dept.name} alumni and explore career opportunities.
                    </Typography>
                    
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/department/${dept.code}`)}
                        sx={{ 
                          borderRadius: 2, 
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          boxShadow: 2,
                          ':hover': { boxShadow: 4 }
                        }}
                      >
                        View Alumni
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

    

      {/* Tab Content */}
      {activeTab === 0 && (
        <Fade {...sectionFadeProps} style={{ transitionDelay: '50ms' }}>
          <Box 
            sx={{ 
              mt: 8, 
              mb: 8,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              px: 3, 
              position: 'relative', 
              zIndex: 1,
              maxWidth: 1200,
              mx: 'auto',
              background: 'linear-gradient(180deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0) 100%)',
              py: 6,
              borderRadius: 4
            }}
          >
            <Typography 
              variant="h3" 
              fontWeight={700} 
              color="primary" 
              gutterBottom 
              align="center"
              sx={{ 
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' } 
              }}
            >
              Upcoming Events
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center"
              sx={{ 
                maxWidth: 700, 
                mb: 5,
                fontSize: { xs: '1rem', md: '1.1rem' } 
              }}
            >
              Join us for exciting networking opportunities and alumni gatherings
            </Typography>
            
            {loadingEvents ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress size={60} thickness={4} /></Box>
            ) : errorEvents ? (
              <Alert severity="error">{errorEvents}</Alert>
            ) : publicEvents.length === 0 ? (
              <Typography color="text.secondary">No upcoming events available.</Typography>
            ) : (
              <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
                {publicEvents.map((event, idx) => (
                  <Grow in={true} timeout={600 + idx * 100} key={event._id}>
                    <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          borderRadius: 4, 
                          overflow: 'hidden',
                          width: '100%', 
                          minHeight: 200, 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'all 0.3s',
                          ':hover': { 
                            transform: 'translateY(-8px) scale(1.02)', 
                            boxShadow: 6 
                          } 
                        }}
                      >
                        <Box 
                          sx={{ 
                            p: 2.5, 
                            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                            display: 'flex', 
                            alignItems: 'center'
                          }}
                        >
                          <Box>
                            <Typography fontWeight={700} variant="h6">{event.title}</Typography>
                            <Typography variant="body2" color="text.secondary">Organized by {event.organizer?.name}</Typography>
                          </Box>
                          <EventIcon color="primary" sx={{ ml: 'auto', fontSize: 28 }} />
                        </Box>
                        <Box sx={{ p: 2.5, flexGrow: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            mb: 2, 
                            flexGrow: 1,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                          }}>
                            {event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Chip 
                              label={event.eventType} 
                              color="primary" 
                              size="small" 
                              sx={{ borderRadius: 1.5, fontWeight: 500 }}
                            />
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              {new Date(event.startDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grow>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      )}

     


      {/* Interesting Alumni Posts Section */}
      <Fade {...sectionFadeProps} style={{ transitionDelay: '150ms' }}>
        <Box sx={{ mt: 8, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3, position: 'relative', zIndex: 1, maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="h3" fontWeight={700} color="primary" gutterBottom align="center" sx={{ mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Alumni Spotlight
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ maxWidth: 700, mb: 5, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Discover inspiring stories and updates from our alumni community
          </Typography>
          {loadingPosts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress size={60} thickness={4} /></Box>
          ) : errorPosts ? (
            <Alert severity="error" sx={{ width: '100%', maxWidth: 900 }}>{errorPosts}</Alert>
          ) : alumniPosts.length === 0 ? (
            <Alert severity="info" sx={{ width: '100%', maxWidth: 900 }}>No posts available at the moment.</Alert>
          ) : (
            <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1100, mx: 'auto' }}>
              {alumniPosts.map((post, idx) => (
                <Grow in={true} timeout={600 + idx * 100} key={post._id}>
                  <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                    <Paper elevation={2} sx={{ 
                      borderRadius: 4, 
                      overflow: 'hidden',
                      width: '100%', 
                      minHeight: 120, 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'all 0.3s',
                      ':hover': { 
                        transform: 'translateY(-5px)',
                        boxShadow: 4
                      }
                    }}>
                      <Box sx={{ 
                        p: 2.5, 
                        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                        display: 'flex', 
                        alignItems: 'center'
                      }}>
                        <Avatar src={post.user?.photo} sx={{ 
                          width: 50, 
                          height: 50,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }} />
                        <Box sx={{ ml: 1.5 }}>
                          <Typography fontWeight={700}>{post.user?.name || 'Alumni'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ p: 2.5, flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ 
                          mb: 2,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis'
                        }}>
                          {post.content}
                        </Typography>
                        {post.attachment && (
                          <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {post.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                              <Box sx={{ 
                                borderRadius: 2, 
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}>
                                <img 
                                  src={post.attachment} 
                                  alt="attachment" 
                                  style={{ 
                                    width: '100%', 
                                    height: 180, 
                                    objectFit: 'cover' 
                                  }} 
                                />
                              </Box>
                            ) : post.attachment.match(/\.pdf$/i) ? (
                              <iframe src={post.attachment} title="PDF" style={{ width: '100%', height: 220, border: 'none', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                            ) : null}
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                              {(post.attachment.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) && (
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  href={post.attachment} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  sx={{ 
                                    borderRadius: 2,
                                    textTransform: 'none'
                                  }}
                                >
                                  View
                                </Button>
                              )}
                              <Button 
                                size="small" 
                                variant="outlined" 
                                href={post.attachment} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                download
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none'
                                }}
                              >
                                Download
                              </Button>
                              {post.attachment.match(/\.(doc|docx|ppt|pptx|xls|xlsx|txt)$/i) && (
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  {post.attachment.split('/').pop().length > 20 
                                    ? `${post.attachment.split('/').pop().substring(0, 20)}...` 
                                    : post.attachment.split('/').pop()}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          )}
        </Box>
      </Fade>

     

      {/* Placement Highlights */}
      <Fade {...sectionFadeProps} style={{ transitionDelay: '250ms' }}>
        <Box 
          sx={{ 
            mt: 8, 
            mb: 8,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            px: 3, 
            position: 'relative', 
            zIndex: 1,
            maxWidth: 1200,
            mx: 'auto'
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight={700} 
            color="primary" 
            gutterBottom 
            align="center"
            sx={{ 
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' } 
            }}
          >
            Placement Highlights
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            align="center"
            sx={{ 
              maxWidth: 700, 
              mb: 5,
              fontSize: { xs: '1rem', md: '1.1rem' } 
            }}
          >
            Explore our impressive placement records and career achievements
          </Typography>
          
          {loadingHighlights ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress size={60} thickness={4} /></Box>
          ) : errorHighlights ? (
            <Alert severity="error" sx={{ width: '100%', maxWidth: 900 }}>{errorHighlights}</Alert>
          ) : highlights ? (
            <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1100, mx: 'auto' }}>
              {[{
                icon: <EmojiEventsIcon color="primary" />, value: highlights.totalOffers, label: 'Total Offers'
              }, {
                icon: <BusinessIcon color="primary" />, value: highlights.highestPackage, label: 'Highest Package'
              }, {
                icon: <SchoolIcon color="primary" />, value: highlights.topRecruiters, label: 'Top Recruiters'
              }].map((stat, idx) => (
                <Grow in={true} timeout={600 + idx * 200} key={stat.label}>
                  <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                    <Paper elevation={2} sx={{ 
                      borderRadius: 4, 
                      boxShadow: 2, 
                      p: 3, 
                      textAlign: 'center', 
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s', 
                      ':hover': { 
                        transform: 'translateY(-8px) scale(1.04)', 
                        boxShadow: 6 
                      } 
                    }}>
                      <Box sx={{ 
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'rgba(25, 118, 210, 0.1)',
                        mx: 'auto'
                      }}>
                        {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                      </Box>
                      <Typography variant="h4" fontWeight={700} color="primary">{stat.value}</Typography>
                      <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
                    </Paper>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          ) : null}
        </Box>
      </Fade>

      

      {/* Top Recruiters */}
      <Fade {...sectionFadeProps} style={{ transitionDelay: '300ms' }}>
        <Box 
          sx={{ 
            mt: 8, 
            mb: 8,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            px: 3, 
            position: 'relative', 
            zIndex: 1,
            maxWidth: 1200,
            mx: 'auto',
            background: 'linear-gradient(180deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0) 100%)',
            py: 6,
            borderRadius: 4
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight={700} 
            color="primary" 
            gutterBottom 
            align="center"
            sx={{ 
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' } 
            }}
          >
            Top Recruiters
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            align="center"
            sx={{ 
              maxWidth: 700, 
              mb: 5,
              fontSize: { xs: '1rem', md: '1.1rem' } 
            }}
          >
            Leading companies that trust our talented alumni
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
      
    </Box>
  );
}

export default Home;