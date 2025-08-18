import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, CircularProgress, Alert, Fade, Grow, MenuItem, Select, FormControl, InputLabel, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText, Badge, Tooltip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import { API_ENDPOINTS } from '../config/api';
import MentorshipAdminMessage from '../components/MentorshipAdminMessage';
import SideNav from '../components/SideNav';

function Mentorship() {
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentMentorship, setCurrentMentorship] = useState(null);
  const [mentorshipForm, setMentorshipForm] = useState({
    title: '',
    description: '',
    expertise: '',
    availability: '',
    maxMentees: 5,
    active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentMentorshipId, setCurrentMentorshipId] = useState(null);
  const [myMentorships, setMyMentorships] = useState([]);
  const [myMenteeships, setMyMenteeships] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [requestLoading, setRequestLoading] = useState(false);

  const isLoggedIn = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchMentorships();
    if (isLoggedIn) {
      fetchMyMentorships();
      fetchMyMenteeships();
    }
  }, [isLoggedIn]);

  const fetchMentorships = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.MENTORSHIPS, {
        cache: 'no-store' // Add cache-busting parameter
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch mentorships');
      console.log('Fetched mentorships:', data);
      setMentorships(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchMyMentorships = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.MENTORSHIPS_USER_MENTOR, {
        headers: { 'x-auth-token': token },
        cache: 'no-store' // Add cache-busting parameter
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      console.log('Fetched my mentorships:', data);
      setMyMentorships(data);
    } catch (err) {
      console.error('Error fetching my mentorships:', err);
    }
  };

  const fetchMyMenteeships = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.MENTORSHIPS_USER_MENTEE, {
        headers: { 'x-auth-token': token },
        cache: 'no-store' // Add cache-busting parameter
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      console.log('Fetched my menteeships:', data);
      setMyMenteeships(data);
    } catch (err) {
      console.error('Error fetching my menteeships:', err);
    }
  };

  const handleOpenDialog = (mentorship = null) => {
    if (mentorship) {
      setMentorshipForm({
        title: mentorship.title,
        description: mentorship.description,
        expertise: mentorship.expertise,
        availability: mentorship.availability,
        maxMentees: mentorship.maxMentees,
        active: mentorship.active
      });
      setIsEditing(true);
      setCurrentMentorshipId(mentorship._id);
    } else {
      setMentorshipForm({
        title: '',
        description: '',
        expertise: '',
        availability: '',
        maxMentees: 5,
        active: true
      });
      setIsEditing(false);
      setCurrentMentorshipId(null);
    }
    setOpenDialog(true);
  };

  const handleOpenDetailsDialog = async (mentorship) => {
    setCurrentMentorship(mentorship);
    
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        // Use the authenticated route to get full mentorship details including admin messages
        const res = await fetch(`${API_ENDPOINTS.MENTORSHIPS}/auth/${mentorship._id}`, {
          headers: { 'x-auth-token': token },
          // Add cache-busting parameter to prevent caching
          cache: 'no-store'
        });
        const data = await res.json();
        if (res.ok) {
          console.log('Fetched mentorship details:', data);
          setCurrentMentorship(data);
        }
      } catch (err) {
        console.error('Error fetching mentorship details:', err);
      }
    }
    
    setOpenDetailsDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setCurrentMentorship(null);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setMentorshipForm({ ...mentorshipForm, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `${API_ENDPOINTS.MENTORSHIPS}/${currentMentorshipId}` : API_ENDPOINTS.MENTORSHIPS;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(mentorshipForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to save mentorship');

      setOpenDialog(false);
      setSuccess(isEditing ? 'Mentorship program updated successfully!' : 'Mentorship program created successfully!');
      fetchMentorships();
      fetchMyMentorships();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mentorship program?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.MENTORSHIPS}/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to delete mentorship');

      setSuccess('Mentorship program deleted successfully!');
      fetchMentorships();
      fetchMyMentorships();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRequestMentorship = async (mentorshipId) => {
    if (!isLoggedIn) {
      setError('You must be logged in to request mentorship');
      return;
    }

    setRequestLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.MENTORSHIPS}/${mentorshipId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to request mentorship');

      setSuccess('Mentorship request sent successfully!');
      fetchMentorships();
      fetchMyMenteeships();
      handleCloseDetailsDialog();
    } catch (err) {
      setError(err.message);
    }
    setRequestLoading(false);
  };

  const handleMenteeRequest = async (mentorshipId, menteeId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.MENTORSHIPS}/${mentorshipId}/request/${menteeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || `Failed to ${status} mentee request`);

      setSuccess(`Mentee request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
      fetchMyMentorships();
      handleCloseDetailsDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  const displayedMentorships = activeTab === 'all' 
    ? mentorships 
    : activeTab === 'my-mentorships' 
      ? myMentorships 
      : myMenteeships;

  const isMenteeRequestPending = (mentorship) => {
    if (!isLoggedIn || !mentorship) return false;
    return mentorship.mentees?.some(m => m.user === userId && m.status === 'pending');
  };

  const isMentee = (mentorship) => {
    if (!isLoggedIn || !mentorship) return false;
    return mentorship.mentees?.some(m => m.user === userId && m.status === 'accepted');
  };

  return (
    <SideNav title="Mentorship Program">
      <Typography variant="h4" fontWeight={600} color="primary" gutterBottom align="center">
        Guidance Programs
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Connect with experienced alumni for guidance and professional development
      </Typography>

      {/* Tabs */}
      {isLoggedIn && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button 
            variant={activeTab === 'all' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('all')}
            sx={{ mx: 1 }}
          >
            All Programs
          </Button>
          <Button 
            variant={activeTab === 'my-mentorships' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('my-mentorships')}
            sx={{ mx: 1 }}
            startIcon={<SchoolIcon />}
          >
             guidance
          </Button>
         
        </Box>
      )}

      {/* Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        {isLoggedIn && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenDialog()}
            startIcon={<SchoolIcon />}
          >
            Offer Mentorship
          </Button>
        )}
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Mentorship Listings */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayedMentorships.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" color="text.secondary">
            {activeTab === 'all' 
              ? 'No mentorship programs available' 
              : activeTab === 'my-mentorships' 
                ? 'You are not mentoring anyone yet' 
                : 'You are not being mentored yet'}
          </Typography>
          {isLoggedIn && activeTab !== 'my-menteeships' && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleOpenDialog()}
              sx={{ mt: 2 }}
            >
              Offer Mentorship
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayedMentorships.map((mentorship, index) => (
            <Grow in={true} timeout={300 + index * 100} key={mentorship._id}>
              <Grid item xs={12} md={6} lg={4}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  ':hover': { transform: 'translateY(-5px)', boxShadow: 4 }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={mentorship.mentor?.photo} 
                        alt={mentorship.mentor?.name}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      >
                        {mentorship.mentor?.name?.charAt(0) || <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="div" fontWeight={600} color="primary">
                          {mentorship.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mentor: {mentorship.mentor?.name}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {mentorship.mentor?.company && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {mentorship.mentor.company}
                        </Typography>
                      </Box>
                    )}
                    
                    {mentorship.mentor?.designation && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {mentorship.mentor.designation}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {mentorship.availability}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {mentorship.currentMentees || 0}/{mentorship.maxMentees} mentees
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="body2" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {mentorship.description}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label={mentorship.expertise} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 2 }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleOpenDetailsDialog(mentorship)}
                      >
                        View Details
                      </Button>
                      
                      {isLoggedIn && mentorship.mentor?._id === userId && (
                        <Box>
                          <Button 
                            size="small" 
                            onClick={() => handleOpenDialog(mentorship)}
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(mentorship._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grow>
          ))}
        </Grid>
      )}

      {/* Mentorship Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Mentorship Program' : 'Offer a New Mentorship Program'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Program Title"
                name="title"
                value={mentorshipForm.title}
                onChange={handleChange}
                required
                placeholder="e.g., Career Guidance in Software Engineering"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Areas of Expertise"
                name="expertise"
                value={mentorshipForm.expertise}
                onChange={handleChange}
                required
                placeholder="e.g., Web Development, Machine Learning, Product Management"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Availability"
                name="availability"
                value={mentorshipForm.availability}
                onChange={handleChange}
                required
                placeholder="e.g., Weekends, 2 hours per week, Monthly calls"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Number of Mentees"
                name="maxMentees"
                type="number"
                value={mentorshipForm.maxMentees}
                onChange={handleChange}
                required
                inputProps={{ min: 1, max: 20 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="active"
                  value={mentorshipForm.active}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Program Description"
                name="description"
                value={mentorshipForm.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                placeholder="Describe what mentees can expect from your mentorship program, your approach, and any specific topics you can help with."
              />
            </Grid>
          </Grid>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Update Program' : 'Create Program'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mentorship Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        {currentMentorship && (
          <>
            <DialogTitle>
              <Typography variant="h6">{currentMentorship.title}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Mentor: {currentMentorship.mentor?.name}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>About this Mentorship</Typography>
                  <Typography variant="body1" paragraph>
                    {currentMentorship.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>Expertise</Typography>
                  <Typography variant="body1" paragraph>
                    {currentMentorship.expertise}
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Mentor Information</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={currentMentorship.mentor?.photo} 
                        alt={currentMentorship.mentor?.name}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      >
                        {currentMentorship.mentor?.name?.charAt(0) || <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{currentMentorship.mentor?.name}</Typography>
                        {currentMentorship.mentor?.designation && (
                          <Typography variant="body2">
                            {currentMentorship.mentor.designation} at {currentMentorship.mentor.company}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                    <Typography variant="h6" gutterBottom>Program Details</Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Availability:</Typography>
                      <Typography variant="body2">{currentMentorship.availability}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Mentees:</Typography>
                      <Typography variant="body2">{currentMentorship.currentMentees || 0}/{currentMentorship.maxMentees}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Status:</Typography>
                      <Chip 
                        label={currentMentorship.active ? 'Active' : 'Inactive'} 
                        size="small" 
                        color={currentMentorship.active ? 'success' : 'default'}
                      />
                    </Box>
                  </Card>
                  
                  {/* Mentee Request Button */}
                  {isLoggedIn && currentMentorship.mentor?._id !== userId && currentMentorship.active && (
                    <Box sx={{ mb: 3 }}>
                      {isMentee(currentMentorship) ? (
                        <Alert severity="success">
                          You are already a mentee in this program.
                        </Alert>
                      ) : isMenteeRequestPending(currentMentorship) ? (
                        <Alert severity="info">
                          Your request to join this program is pending.
                        </Alert>
                      ) : (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          fullWidth
                          onClick={() => handleRequestMentorship(currentMentorship._id)}
                          disabled={requestLoading || (currentMentorship.currentMentees >= currentMentorship.maxMentees)}
                        >
                          {requestLoading ? <CircularProgress size={24} /> : 'Request Mentorship'}
                        </Button>
                      )}
                      
                      {currentMentorship.currentMentees >= currentMentorship.maxMentees && (
                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                          This program has reached its maximum capacity.
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {/* Mentee Requests (for mentor) */}
                  {isLoggedIn && currentMentorship.mentor?._id === userId && currentMentorship.mentees?.some(m => m.status === 'pending') && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>Pending Requests</Typography>
                      <List>
                        {currentMentorship.mentees
                          .filter(m => m.status === 'pending')
                          .map(mentee => (
                            <ListItem key={mentee.user._id} sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar src={mentee.user.photo}>
                                  {mentee.user.name?.charAt(0) || <PersonIcon />}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText 
                                primary={mentee.user.name} 
                                secondary={mentee.requestDate ? new Date(mentee.requestDate).toLocaleDateString() : ''}
                              />
                              <Button 
                                size="small" 
                                color="primary" 
                                onClick={() => handleMenteeRequest(currentMentorship._id, mentee.user._id, 'accepted')}
                                sx={{ mr: 1 }}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="small" 
                                color="error" 
                                onClick={() => handleMenteeRequest(currentMentorship._id, mentee.user._id, 'rejected')}
                              >
                                Decline
                              </Button>
                            </ListItem>
                          ))}
                      </List>
                    </Box>
                  )}
                  
                  {/* Current Mentees (for mentor) */}
                  {isLoggedIn && currentMentorship.mentor?._id === userId && currentMentorship.mentees?.some(m => m.status === 'accepted') && (
                    <Box>
                      <Typography variant="h6" gutterBottom>Current Mentees</Typography>
                      <List>
                        {currentMentorship.mentees
                          .filter(m => m.status === 'accepted')
                          .map(mentee => (
                            <ListItem key={mentee.user._id} sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar src={mentee.user.photo}>
                                  {mentee.user.name?.charAt(0) || <PersonIcon />}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText 
                                primary={mentee.user.name} 
                                secondary={mentee.user.email}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Box>
                  )}
                  
                  {/* Admin Message and Date Selection (for alumni/mentor and mentees) */}
                  {isLoggedIn && (
                    <MentorshipAdminMessage 
                      mentorship={currentMentorship} 
                      refreshMentorships={() => {
                        fetchMentorships();
                        fetchMyMentorships();
                        fetchMyMenteeships();
                        // Refresh the current mentorship details
                        if (currentMentorship?._id) {
                          const token = localStorage.getItem('token');
                          fetch(`${API_ENDPOINTS.MENTORSHIPS}/auth/${currentMentorship._id}`, {
                            headers: { 'x-auth-token': token },
                            // Add cache-busting parameter to prevent caching
                            cache: 'no-store'
                          })
                            .then(res => res.json())
                            .then(data => {
                              if (data) {
                                console.log('Refreshed mentorship data:', data);
                                setCurrentMentorship(data);
                              }
                            })
                            .catch(err => console.error('Error refreshing mentorship:', err));
                        }
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailsDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </SideNav>
  );
}

export default Mentorship;