import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Button, TextField, Avatar, 
  Chip, CircularProgress, Alert, Grow, Tabs, Tab, Drawer, List, ListItem, 
  ListItemIcon, ListItemText, Divider, CssBaseline, AppBar, Toolbar, 
  IconButton, useTheme, useMediaQuery, Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  EmojiEvents as EmojiEventsIcon,
  Forum as ForumIcon,
  Person as PersonIcon,
  Event as EventIcon,
  ExitToApp as ExitToAppIcon,
  MonetizationOn as DonationIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

// Sidebar navigation items
const drawerItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard', path: '/admin' },
  { text: 'Alumni', icon: <PeopleIcon />, section: 'alumni', path: '/admin' },
  { text: 'Elite Alumni', icon: <EmojiEventsIcon />, section: 'students', path: '/admin' },
  { text: 'Placement Highlights', icon: <BusinessIcon />, section: 'highlights', path: '/admin' },
  { text: 'Alumni Posts', icon: <ForumIcon />, section: 'posts', path: '/admin' },
  { text: 'Guidance Messages', icon: <MessageIcon />, section: 'messages', path: '/admin-mentor-messages' },
  { text: 'Donations', icon: <DonationIcon />, section: 'donations', path: '/admin-donations' },
  { text: 'Events', icon: <EventIcon />, section: 'events', path: '/admin' }
];

function AdminMentorMessages() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('messages');
  
  const [mentorships, setMentorships] = useState([]);
  const [mentorshipsWithSelectedDates, setMentorshipsWithSelectedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminMessages, setAdminMessages] = useState({});
  const [proposedDates, setProposedDates] = useState({});
  const [sendingMessage, setSendingMessage] = useState({});
  const [approvingMentorship, setApprovingMentorship] = useState(false);
  const [sendingThankYou, setSendingThankYou] = useState({});
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchMentorships();
    fetchMentorshipsWithSelectedDates();
  }, []);

  const fetchMentorships = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.MENTORSHIPS_ADMIN_PENDING, {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch mentorships');
      setMentorships(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  
  const fetchMentorshipsWithSelectedDates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching mentorships with selected dates');
      
      const res = await fetch(API_ENDPOINTS.MENTORSHIPS_ADMIN_WITH_SELECTED_DATES, {
        headers: { 'x-auth-token': token },
        cache: 'no-store'
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch mentorships with selected dates');
      
      console.log('Fetched mentorships with selected dates:', data);
      setMentorshipsWithSelectedDates(data);
    } catch (err) {
      console.error('Error fetching mentorships with selected dates:', err);
      setError(err.message);
    }
    setLoading(false);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMentorshipApproval = async (mentorshipId, approved, featured = false) => {
    setApprovingMentorship(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.MENTORSHIPS}/${mentorshipId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ approved, featured })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to update mentorship status');
      setSuccess(`Mentorship ${approved ? 'approved' : 'rejected'} successfully!`);
      fetchMentorships();
    } catch (err) {
      setError(err.message);
    }
    setApprovingMentorship(false);
  };

  const handleAdminMessageChange = (id, value) => {
    setAdminMessages(prev => ({ ...prev, [id]: value }));
  };
  const handleProposedDateChange = (id, idx, value) => {
    setProposedDates(prev => ({
      ...prev,
      [id]: prev[id] ? prev[id].map((d, i) => (i === idx ? value : d)) : [value]
    }));
  };
  const handleAddDateField = (id) => {
    setProposedDates(prev => ({
      ...prev,
      [id]: prev[id] ? [...prev[id], ''] : ['']
    }));
  };
  const handleSendAdminMessage = async (mentorshipId) => {
    setSendingMessage(prev => ({ ...prev, [mentorshipId]: true }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.MENTORSHIPS}/${mentorshipId}/admin-message`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({
          adminMessage: adminMessages[mentorshipId],
          proposedDates: (proposedDates[mentorshipId] || []).filter(Boolean)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to send message');
      setSuccess('Message and dates sent!');
      fetchMentorships();
      setAdminMessages(prev => ({ ...prev, [mentorshipId]: '' }));
      setProposedDates(prev => ({ ...prev, [mentorshipId]: [] }));
    } catch (err) {
      setError(err.message);
    }
    setSendingMessage(prev => ({ ...prev, [mentorshipId]: false }));
  };
  
  const handleSendFinalThankYou = async (mentorshipId) => {
    setSendingThankYou(prev => ({ ...prev, [mentorshipId]: true }));
    try {
      const token = localStorage.getItem('token');
      console.log('Sending final thank you for mentorship:', mentorshipId);
      
      const res = await fetch(`${API_ENDPOINTS.MENTORSHIPS}/${mentorshipId}/final-thank`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({}),
        cache: 'no-store'
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to send final thank you');
      
      console.log('Final thank you sent successfully:', data);
      setSuccess('Final thank you sent!');
      
      // Remove the mentorship from the list immediately
      setMentorshipsWithSelectedDates(prev => 
        prev.filter(m => m._id !== mentorshipId)
      );
      
      // Refresh the lists to ensure everything is up to date
      fetchMentorshipsWithSelectedDates();
    } catch (err) {
      console.error('Error sending final thank you:', err);
      setError(err.message);
    }
    setSendingThankYou(prev => ({ ...prev, [mentorshipId]: false }));
  };

  // Only show mentorships that are not yet approved (newly posted by alumni)
  const unapprovedMentorships = mentorships.filter(m => !m.approved);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle navigation
  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Drawer content
  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {drawerItems.map((item) => (
          <ListItem 
            button 
            key={item.section}
            onClick={() => handleNavigation(item)}
            selected={activeSection === item.section}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              mb: 0.5,
              borderRadius: 1,
              mx: 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <List>
        <ListItem 
          button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/';
          }}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            mb: 0.5,
            borderRadius: 1,
            mx: 1,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - 240px)` },
          ml: { md: `240px` },
          display: { xs: 'block', md: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)', minHeight: '100vh' }}>
        <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
          Guidance Messages
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Pending Approvals" />
          <Tab label="Selected Dates" />
        </Tabs>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
      ) : tabValue === 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {unapprovedMentorships.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 4 }}>No new mentorships awaiting admin action.</Typography>
          ) : unapprovedMentorships.map((mentorship, idx) => (
            <Grow in={true} timeout={600 + idx * 100} key={mentorship._id}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ borderRadius: 4, boxShadow: 2, p: 3, background: '#f9f9ff', minHeight: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar src={mentorship.mentor?.photo} sx={{ width: 50, height: 50 }} />
                    <Box>
                      <Typography fontWeight={600} variant="h6">{mentorship.mentor?.name || 'Alumni'}</Typography>
                      <Typography variant="body2" color="text.secondary">{mentorship.mentor?.company || 'Company'}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>{mentorship.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>{mentorship.description?.length > 100 ? mentorship.description.substring(0, 100) + '...' : mentorship.description}</Typography>
                {/* Admin message and date proposal form */}
                {mentorship.adminMessage && mentorship.proposedDates?.length ? (
                  <Box sx={{ my: 1 }}>
                    <Typography variant="subtitle2" color="primary">Message already sent</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>{mentorship.adminMessage}</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>Proposed Dates:</Typography>
                    {mentorship.proposedDates.map((date, idx) => (
                      <Chip key={idx} label={new Date(date).toLocaleDateString()} sx={{ mr: 1, mb: 1 }} />
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ my: 1 }}>
                    <TextField
                      label="Thank you message"
                      value={adminMessages[mentorship._id] || ''}
                      onChange={e => handleAdminMessageChange(mentorship._id, e.target.value)}
                      fullWidth
                      multiline
                      minRows={2}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Propose 2-3 Dates</Typography>
                    {(proposedDates[mentorship._id] || ['']).map((date, idx) => (
                      <TextField
                        key={idx}
                        type="date"
                        value={date || ''}
                        onChange={e => handleProposedDateChange(mentorship._id, idx, e.target.value)}
                        sx={{ mb: 1, mr: 1 }}
                        InputLabelProps={{ shrink: true }}
                      />
                    ))}
                    <Button size="small" onClick={() => handleAddDateField(mentorship._id)} sx={{ mb: 1 }}>
                      + Add Date
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ ml: 2, mb: 1 }}
                      disabled={sendingMessage[mentorship._id]}
                      onClick={() => handleSendAdminMessage(mentorship._id)}
                    >
                      {sendingMessage[mentorship._id] ? 'Sending...' : 'Send Message & Dates'}
                    </Button>
                  </Box>
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {mentorship.expertise?.slice(0, 3).map((skill, index) => (
                    <Chip key={index} label={skill} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Availability: {mentorship.availability}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="body2" color="text.secondary">
                    {mentorship.currentMentees}/{mentorship.maxMentees} mentees
                  </Typography>
                  {!mentorship.approved && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        color="success" 
                        variant="contained" 
                        onClick={() => handleMentorshipApproval(mentorship._id, true, true)}
                        disabled={approvingMentorship}
                      >
                        Approve & Feature
                      </Button>
                      <Button 
                        size="small" 
                        color="primary" 
                        variant="contained" 
                        onClick={() => handleMentorshipApproval(mentorship._id, true, false)}
                        disabled={approvingMentorship}
                      >
                        Approve
                      </Button>
                     
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grow>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {mentorshipsWithSelectedDates.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 4 }}>No mentorships with selected dates awaiting final thank you.</Typography>
          ) : mentorshipsWithSelectedDates.map((mentorship, idx) => (
            <Grow in={true} timeout={600 + idx * 100} key={mentorship._id}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ borderRadius: 4, boxShadow: 2, p: 3, background: '#f9f9ff', minHeight: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar src={mentorship.mentor?.photo} sx={{ width: 50, height: 50 }} />
                    <Box>
                      <Typography fontWeight={600} variant="h6">{mentorship.mentor?.name || 'Alumni'}</Typography>
                      <Typography variant="body2" color="text.secondary">{mentorship.mentor?.company || 'Company'}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>{mentorship.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>{mentorship.description?.length > 100 ? mentorship.description.substring(0, 100) + '...' : mentorship.description}</Typography>
                  
                  <Box sx={{ my: 1 }}>
                    <Typography variant="subtitle2" color="primary">Admin Message:</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>{mentorship.adminMessage}</Typography>
                    
                    <Typography variant="subtitle2" color="primary">Proposed Dates:</Typography>
                    {mentorship.proposedDates.map((date, idx) => (
                      <Chip 
                        key={idx} 
                        label={new Date(date).toLocaleDateString()} 
                        sx={{ mr: 1, mb: 1, opacity: mentorship.selectedDate === date ? 1 : 0.6 }}
                        color={mentorship.selectedDate === date ? "primary" : "default"}
                        variant={mentorship.selectedDate === date ? "filled" : "outlined"}
                      />
                    ))}
                    
                    <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>Selected Date:</Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {mentorship.selectedDate ? new Date(mentorship.selectedDate).toLocaleDateString() : 'None'}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ mt: 2 }}
                      disabled={sendingThankYou[mentorship._id]}
                      onClick={() => handleSendFinalThankYou(mentorship._id)}
                    >
                      {sendingThankYou[mentorship._id] ? 'Sending...' : 'Send Final Thank You'}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            </Grow>
          ))}
        </Grid>
      )}
    </Box>
    </Box>
  );
}

export default AdminMentorMessages;