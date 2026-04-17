import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Card, CardContent, Grid, Avatar, 
  Chip, Paper, CircularProgress, Alert, Fade, Grow, Container, 
  useTheme, alpha, Stack, Divider, AvatarGroup, Skeleton 
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupsIcon from '@mui/icons-material/Groups';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from 'react-router-dom';

const recruiters = [
  'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'https://www.arkphire.com/hs-fs/hubfs/Presidio-Logo-Blue-1.png?width=1000&height=192&name=Presidio-Logo-Blue-1.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp6Uvy-j6B7DvvGIoH2lFjKgyofVdv2vj1aQ&s',
  'https://1000logos.net/wp-content/uploads/2021/09/Cognizant-Logo.jpg',
  'https://1000logos.net/wp-content/uploads/2021/04/Accenture-logo.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1280px-Infosys_logo.svg.png',
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

const sectionFadeProps = { timeout: 800, in: true, appear: true };

const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science', color: '#2563EB', icon: '💻' },
  { code: 'ECE', name: 'Electronics & Comm.', color: '#7C3AED', icon: '📡' },
  { code: 'IT', name: 'Information Tech.', color: '#059669', icon: '🌐' },
  { code: 'CIVIL', name: 'Civil', color: '#D97706', icon: '🏗️' },
  { code: 'MECH', name: 'Mechanical', color: '#DC2626', icon: '⚙️' },
  { code: 'EEE', name: 'Electrical & Electronics', color: '#0891B2', icon: '⚡' },
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

  const fetchBatches = (dept) => {
    setBatches(['2018', '2019', '2020', '2021', '2022', '2023']);
    setSelectedBatch(null);
    setTopAlumni([]);
  };

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFE' }}>
      {/* Hero Section */}
      <Fade {...sectionFadeProps}>
        <Box
          sx={{
            position: 'relative',
            bgcolor: '#FFFFFF',
            borderBottom: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          {/* Abstract Background */}
          <Box
            sx={{
              position: 'absolute',
              top: -150,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0) 70%)',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -100,
              left: -50,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0) 70%)',
              zIndex: 0,
            }}
          />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 6, md: 10 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
              {/* Left Content */}
              <Box flex={1} textAlign={{ xs: 'center', md: 'left' }}>
                <Box
                  component="img"
                  src="https://upload.wikimedia.org/wikipedia/ta/d/d0/Vcet_logo.jpg"
                  alt="VCET Logo"
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'contain',
                    borderRadius: 3,
                    mb: 3,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    display: { xs: 'block', md: 'block' },
                    mx: { xs: 'auto', md: 0 },
                  }}
                />
                <Typography
                  variant="h1"
                  fontWeight={800}
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, #1E293B 0%, #2563EB 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  Welcome to VCET<br />Alumni Network
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: '1.125rem',
                    maxWidth: 500,
                    mx: { xs: 'auto', md: 0 },
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Connect with fellow alumni, celebrate achievements, and build meaningful
                  professional relationships that last a lifetime.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                 
                  
                </Stack>
              </Box>

              {/* Right Content - Stats Cards */}
              <Box flex={1}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: '#F8FAFE',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack spacing={3}>
                    {[
                      { icon: <GroupsIcon sx={{ color: '#2563EB' }} />, value: '5,000+', label: 'Alumni Network' },
                      { icon: <WorkspacePremiumIcon sx={{ color: '#2563EB' }} />, value: '200+', label: 'Placements 2024' },
                      { icon: <EmojiEventsIcon sx={{ color: '#2563EB' }} />, value: '50+', label: 'Industry Awards' },
                    ].map((stat, idx) => (
                      <Stack key={idx} direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: alpha('#2563EB', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography variant="h5" fontWeight={700} color="#1E293B">
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.label}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Fade>

      {/* Department Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Fade {...sectionFadeProps}>
          <Box>
            <Typography
              variant="h2"
              fontWeight={700}
              align="center"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                color: '#1E293B',
                mb: 1,
              }}
            >
              Explore by Department
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}
            >
              Discover alumni achievements and connect with graduates from your department
            </Typography>

            <Grid container spacing={3}>
              {DEPARTMENTS.map((dept) => (
                <Grid item xs={12} sm={6} md={4} key={dept.code}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: dept.color,
                        boxShadow: `0 20px 25px -5px ${alpha(dept.color, 0.1)}`,
                      },
                    }}
                    onClick={() => navigate(`/department/${dept.code}`)}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: alpha(dept.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        mb: 2,
                      }}
                    >
                      {dept.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="#1E293B" gutterBottom>
                      {dept.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Connect with {dept.name} alumni and explore career opportunities.
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ textTransform: 'none', fontWeight: 600, color: dept.color, p: 0 }}
                    >
                      View Alumni
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>

      {/* Upcoming Events Section (Tab 0) */}
      {activeTab === 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Fade {...sectionFadeProps}>
            <Box>
              <Typography
                variant="h2"
                fontWeight={700}
                align="center"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  letterSpacing: '-0.02em',
                  color: '#1E293B',
                  mb: 1,
                }}
              >
                Upcoming Events
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}
              >
                Join us for exciting networking opportunities and alumni gatherings
              </Typography>

              {loadingEvents ? (
                <Grid container spacing={3}>
                  {[1, 2, 3].map((i) => (
                    <Grid item xs={12} md={4} key={i}>
                      <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
                    </Grid>
                  ))}
                </Grid>
              ) : errorEvents ? (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {errorEvents}
                </Alert>
              ) : publicEvents.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                  <Typography color="text.secondary">No upcoming events available.</Typography>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {publicEvents.map((event, idx) => (
                    <Grow in={true} timeout={500 + idx * 100} key={event._id}>
                      <Grid item xs={12} md={4}>
                        <Paper
                          elevation={0}
                          sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 },
                          }}
                        >
                          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h6" fontWeight={700} noWrap>
                              {event.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Organized by {event.organizer?.name}
                            </Typography>
                          </Box>
                          <Box sx={{ p: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                              {event.description.length > 80
                                ? `${event.description.substring(0, 80)}...`
                                : event.description}
                            </Typography>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Chip
                                label={event.eventType}
                                size="small"
                                sx={{ borderRadius: 1, bgcolor: alpha('#2563EB', 0.1), color: '#2563EB' }}
                              />
                              <Typography variant="caption" fontWeight={500}>
                                {new Date(event.startDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </Typography>
                            </Stack>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grow>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>
        </Container>
      )}

      {/* Alumni Spotlight Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Fade {...sectionFadeProps}>
          <Box>
            <Typography
              variant="h2"
              fontWeight={700}
              align="center"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                color: '#1E293B',
                mb: 1,
              }}
            >
              Alumni Spotlight
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}
            >
              Discover inspiring stories and updates from our alumni community
            </Typography>

            {loadingPosts ? (
              <Grid container spacing={3}>
                {[1, 2, 3].map((i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <Skeleton variant="rounded" height={250} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))}
              </Grid>
            ) : errorPosts ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errorPosts}
              </Alert>
            ) : alumniPosts.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">No posts available at the moment.</Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {alumniPosts.map((post, idx) => (
                  <Grow in={true} timeout={500 + idx * 100} key={post._id}>
                    <Grid item xs={12} md={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 },
                        }}
                      >
                        <Stack direction="row" spacing={2} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Avatar src={post.user?.photo} sx={{ width: 44, height: 44 }} />
                          <Box>
                            <Typography fontWeight={700}>{post.user?.name || 'Alumni'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box sx={{ p: 2, flexGrow: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {post.content}
                          </Typography>
                          {post.attachment && (
                            <Box sx={{ mt: 2 }}>
                              {post.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img
                                  src={post.attachment}
                                  alt="attachment"
                                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12 }}
                                />
                              ) : post.attachment.match(/\.pdf$/i) ? (
                                <iframe src={post.attachment} title="PDF" style={{ width: '100%', height: 160, borderRadius: 12 }} />
                              ) : null}
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Button size="small" href={post.attachment} target="_blank" sx={{ textTransform: 'none' }}>
                                  View
                                </Button>
                                <Button size="small" href={post.attachment} download sx={{ textTransform: 'none' }}>
                                  Download
                                </Button>
                              </Stack>
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
      </Container>

      {/* Placement Highlights */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Fade {...sectionFadeProps}>
          <Box>
            <Typography
              variant="h2"
              fontWeight={700}
              align="center"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                color: '#1E293B',
                mb: 1,
              }}
            >
              Placement Highlights
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}
            >
              Explore our impressive placement records and career achievements
            </Typography>

            {loadingHighlights ? (
              <Grid container spacing={3}>
                {[1, 2, 3].map((i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))}
              </Grid>
            ) : errorHighlights ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errorHighlights}
              </Alert>
            ) : highlights ? (
              <Grid container spacing={3}>
                {[
                  { icon: <EmojiEventsIcon />, value: highlights.totalOffers, label: 'Total Offers' },
                  { icon: <BusinessIcon />, value: highlights.highestPackage, label: 'Highest Package' },
                  { icon: <SchoolIcon />, value: highlights.topRecruiters, label: 'Top Recruiters' },
                ].map((stat, idx) => (
                  <Grow in={true} timeout={500 + idx * 100} key={stat.label}>
                    <Grid item xs={12} md={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 },
                        }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            bgcolor: alpha('#2563EB', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            color: '#2563EB',
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Typography variant="h4" fontWeight={700} color="#1E293B">
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {stat.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grow>
                ))}
              </Grid>
            ) : null}
          </Box>
        </Fade>
      </Container>

      {/* Top Recruiters */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Fade {...sectionFadeProps}>
          <Box>
            <Typography
              variant="h2"
              fontWeight={700}
              align="center"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                color: '#1E293B',
                mb: 1,
              }}
            >
              Top Recruiters
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}
            >
              Leading companies that trust our talented alumni
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              {recruiters.map((logo, idx) => (
                <Grow in={true} timeout={400 + idx * 50} key={idx}>
                  <Grid item xs={6} sm={4} md={2}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 80,
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'scale(1.05)', borderColor: '#2563EB' },
                      }}
                    >
                      <img
                        src={logo}
                        alt="Recruiter Logo"
                        style={{ height: 40, width: 'auto', maxWidth: 100, objectFit: 'contain' }}
                      />
                    </Paper>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default Home;