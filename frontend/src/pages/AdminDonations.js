import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery
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
  ExitToApp as ExitToAppIcon,
  MonetizationOn as DonationIcon,
  Event as EventIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
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
  { text: 'Events', icon: <EventIcon />, section: 'events', path: '/networking-events' },
];

function AdminDonations() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('donations');
  
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalDonated, setTotalDonated] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [donationStats, setDonationStats] = useState({
    pending: 0,
    completed: 0,
    rejected: 0
  });
  
  // Dialog state
  const [open, setOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Function to fetch total donated amount
  const fetchTotalDonated = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch(API_ENDPOINTS.DONATIONS_STATS);
      
      if (response.ok) {
        const data = await response.json();
        setTotalDonated(data.totalAmount);
      } else {
        console.error('Failed to fetch total donations');
      }
    } catch (err) {
      console.error('Error fetching total donations:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchTotalDonated();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      const response = await fetch(API_ENDPOINTS.DONATIONS, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
          'Cache-Control': 'no-store'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch donations');
      }
      
      setDonations(data);
      
      // Calculate donation statistics
      const stats = {
        pending: 0,
        completed: 0,
        rejected: 0
      };
      
      data.forEach(donation => {
        if (donation.status in stats) {
          stats[donation.status]++;
        }
      });
      
      setDonationStats(stats);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (donation) => {
    setSelectedDonation(donation);
    setStatus(donation.status);
    setAdminNotes(donation.adminNotes || '');
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDonation(null);
    setStatus('');
    setAdminNotes('');
  };

  const handleUpdateDonation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      const response = await fetch(`${API_ENDPOINTS.DONATIONS}/${selectedDonation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          status,
          adminNotes
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update donation');
      }
      
      // Update the donations list
      setDonations(donations.map(donation => 
        donation._id === selectedDonation._id ? { ...donation, status, adminNotes } : donation
      ));
      
      setSuccess('Donation updated successfully');
      handleCloseDialog();
      fetchTotalDonated(); // Refresh total donated amount
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error updating donation:', err);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle navigation
  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
    } else {
      // For items without a path, navigate to admin dashboard with the section
      navigate('/admin', { state: { activeSection: item.section } });
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

  if (loading) {
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
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>Loading donations...</Typography>
        </Box>
      </Box>
    );
  }

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
        <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary" fontWeight="bold">
          Manage Donations
        </Typography>
        
        {/* Total Donations Stats */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: 'primary.main', 
            color: 'white',
            minWidth: '200px'
          }}
        >
          <Typography variant="subtitle1" align="center">
            Total Donations
          </Typography>
          {loadingStats ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <CircularProgress size={24} color="inherit" />
            </Box>
          ) : (
            <Typography variant="h4" align="center" fontWeight="bold">
              ₹{totalDonated.toLocaleString()}
            </Typography>
          )}
        </Paper>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      {/* Donation Statistics */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#FFF9C4', height: '100%' }}>
              <Typography variant="h6" align="center" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h3" align="center" color="#FFA000" fontWeight="bold">
                {donationStats.pending}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#C8E6C9', height: '100%' }}>
              <Typography variant="h6" align="center" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h3" align="center" color="#2E7D32" fontWeight="bold">
                {donationStats.completed}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#FFCDD2', height: '100%' }}>
              <Typography variant="h6" align="center" gutterBottom>
                Rejected
              </Typography>
              <Typography variant="h3" align="center" color="#C62828" fontWeight="bold">
                {donationStats.rejected}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            fetchDonations();
            fetchTotalDonated();
          }}
        >
          Refresh
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2">Date</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Name</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Email</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Amount</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Purpose</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      No donations found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                donations.map((donation) => (
                  <TableRow key={donation._id}>
                    <TableCell>
                      {format(new Date(donation.date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{donation.name}</TableCell>
                    <TableCell>{donation.email}</TableCell>
                    <TableCell>₹{donation.amount}</TableCell>
                    <TableCell>{donation.purpose}</TableCell>
                    <TableCell>{getStatusChip(donation.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleOpenDialog(donation)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Donation Management Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Donation</DialogTitle>
        <DialogContent>
          {selectedDonation && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Name:</Typography>
                  <Typography variant="body1">{selectedDonation.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Email:</Typography>
                  <Typography variant="body1">{selectedDonation.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Amount:</Typography>
                  <Typography variant="body1">₹{selectedDonation.amount}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Purpose:</Typography>
                  <Typography variant="body1">{selectedDonation.purpose}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Message:</Typography>
                  <Typography variant="body1">{selectedDonation.message || 'No message provided'}</Typography>
                </Grid>
              </Grid>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Admin Notes"
                multiline
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateDonation} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
      </Box>
    </Box>
  );
}

// Custom Grid component removed to avoid conflict with Material-UI Grid

export default AdminDonations;