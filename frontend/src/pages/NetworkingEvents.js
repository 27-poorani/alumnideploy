import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, CircularProgress, Alert, Fade, Grow, MenuItem, Select, FormControl, InputLabel, Divider, CardMedia, IconButton, CardActions, Avatar, Tabs, Tab, List, ListItem, ListItemText, ListItemAvatar, Badge, Tooltip, Drawer, ListItemIcon, CssBaseline, AppBar, Toolbar, useTheme, useMediaQuery, Container } from '@mui/material';
// Remove the problematic imports
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VideocamIcon from '@mui/icons-material/Videocam';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import MicIcon from '@mui/icons-material/Mic';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';
import { Dashboard as DashboardIcon, People as PeopleIcon, School as SchoolIcon, Business as BusinessIcon, EmojiEvents as EmojiEventsIcon, Forum as ForumIcon, ExitToApp as ExitToAppIcon, MonetizationOn as DonationIcon, Message as MessageIcon } from '@mui/icons-material';

// Helper function to properly format image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If the image path already includes the full URL, return it as is
  if (imagePath.startsWith('http')) return imagePath;
  // If it's a relative path, prepend the API base URL
  return `${API_ENDPOINTS.UPLOADS}/${imagePath.replace(/^\/uploads\//, '')}`;
};

// Navigation items removed as they're no longer needed

function NetworkingEvents() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('events');
  
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [myRSVPs, setMyRSVPs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventType: 'In-Person',
    location: '',
    virtualLink: '',
    startDate: null,
    endDate: null,
    capacity: '',
    speakers: ''
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const isLoggedIn = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      fetchAdminEvents();
    } else {
      fetchEvents();
    }
    if (isLoggedIn) {
      fetchMyEvents();
      fetchMyRSVPs();
    }
  }, [isLoggedIn, isAdmin]);

  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      setUpcomingEvents(events.filter(event => new Date(event.startDate) > now));
      setPastEvents(events.filter(event => new Date(event.startDate) <= now));
    }
  }, [events]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'x-auth-token': token } : {};
      
      const res = await fetch(API_ENDPOINTS.NETWORKING_EVENTS, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch events');
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.NETWORKING_EVENTS_MY, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setMyEvents(data);
    } catch (err) {
      console.error('Error fetching my events:', err);
    }
  };

  const fetchMyRSVPs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.NETWORKING_EVENTS_MY_RSVPS, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setMyRSVPs(data);
    } catch (err) {
      console.error('Error fetching my RSVPs:', err);
    }
  };

  const fetchAdminEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.ADMIN_NETWORKING_EVENTS_ALL, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching admin events:', err);
    }
  };

  const handleOpenEventDialog = (event = null) => {
    if (event) {
      setEventForm({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        location: event.location || '',
        virtualLink: event.virtualLink || '',
        startDate: event.startDate ? new Date(event.startDate) : null,
        endDate: event.endDate ? new Date(event.endDate) : null,
        capacity: event.capacity || '',
        speakers: event.speakers ? event.speakers.join(', ') : ''
      });
      setImagePreview(event.image || '');
      setIsEditing(true);
      setCurrentEventId(event._id);
    } else {
      setEventForm({
        title: '',
        description: '',
        eventType: 'In-Person',
        location: '',
        virtualLink: '',
        startDate: null,
        endDate: null,
        capacity: '',
        speakers: ''
      });
      setImage(null);
      setImagePreview('');
      setIsEditing(false);
      setCurrentEventId(null);
    }
    setOpenEventDialog(true);
  };

  const handleOpenDetailsDialog = (event) => {
    setCurrentEvent(event);
    setOpenDetailsDialog(true);
  };

  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
    setError('');
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setCurrentEvent(null);
  };

  const handleEventChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, date) => {
    setEventForm({ ...eventForm, [name]: date });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPG, JPEG, and PNG images are allowed');
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    
    setUploadLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', image);
      
      const res = await fetch(API_ENDPOINTS.NETWORKING_EVENTS_UPLOAD_IMAGE, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to upload image');
      
      return data.imageUrl;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setUploadLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!eventForm.title || !eventForm.description || !eventForm.startDate || !eventForm.endDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (eventForm.eventType === 'In-Person' && !eventForm.location) {
      setError('Location is required for in-person events');
      return;
    }
    
    if (eventForm.eventType === 'Virtual' && !eventForm.virtualLink) {
      setError('Virtual link is required for virtual events');
      return;
    }
    
    if (new Date(eventForm.startDate) >= new Date(eventForm.endDate)) {
      setError('End date must be after start date');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      let imageUrl = null;
      
      if (image) {
        imageUrl = await uploadImage();
        if (!imageUrl) return;
      }
      
      const eventData = { ...eventForm };
      if (imageUrl) eventData.image = imageUrl;
      
      // Convert dates to ISO strings for proper JSON serialization
      if (eventData.startDate) {
        eventData.startDate = new Date(eventData.startDate).toISOString();
      }
      if (eventData.endDate) {
        eventData.endDate = new Date(eventData.endDate).toISOString();
      }
      
      // Process speakers
      if (eventData.speakers) {
        eventData.speakers = eventData.speakers.split(',').map(speaker => speaker.trim());
      } else {
        eventData.speakers = [];
      }
      
      const url = isEditing 
        ? `${API_ENDPOINTS.NETWORKING_EVENTS}/${currentEventId}`
        : API_ENDPOINTS.NETWORKING_EVENTS;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to save event');

      setOpenEventDialog(false);
      setSuccess(isEditing ? 'Event updated successfully!' : 'Event created successfully!');
      
      // Refresh events based on user role
      if (isLoggedIn && isAdmin) {
        fetchAdminEvents();
      } else {
        fetchEvents();
      }
      if (isLoggedIn) fetchMyEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRSVP = async (eventId, status) => {
    setRsvpLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.NETWORKING_EVENTS}/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to RSVP');

      setSuccess(`You have successfully ${status === 'attending' ? 'RSVP\'d' : 'declined'} for this event`);
      
      // Refresh events based on user role
      if (isLoggedIn && isAdmin) {
        fetchAdminEvents();
      } else {
        fetchEvents();
      }
      fetchMyRSVPs();
      
      // Update current event if details dialog is open
      if (currentEvent && currentEvent._id === eventId) {
        const token = localStorage.getItem('token');
        const headers = token ? { 'x-auth-token': token } : {};
        const updatedEvent = await fetch(`${API_ENDPOINTS.NETWORKING_EVENTS}/${eventId}`, { headers });
        const updatedEventData = await updatedEvent.json();
        setCurrentEvent(updatedEventData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.NETWORKING_EVENTS}/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to delete event');

      setSuccess('Event deleted successfully!');
      // Refresh events based on user role
      if (isLoggedIn && isAdmin) {
        fetchAdminEvents();
      } else {
        fetchEvents();
      }
      if (isLoggedIn) fetchMyEvents();
      fetchMyRSVPs(); // Also refresh RSVPs
      
      // Close details dialog if open
      if (openDetailsDialog && currentEvent && currentEvent._id === id) {
        setOpenDetailsDialog(false);
        setCurrentEvent(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublish = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.NETWORKING_EVENTS}/${id}/publish`, {
        method: 'PUT',
        headers: { 'x-auth-token': token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to publish event');

      setSuccess('Event published successfully!');
      fetchEvents();
      if (isLoggedIn) fetchMyEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const getDisplayedEvents = () => {
    return upcomingEvents;
  };

  const formatDateTime = (dateString) => {
    const options = { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const getRSVPStatus = (event) => {
    if (!isLoggedIn || !event.attendees) return null;
    
    const userAttendance = event.attendees.find(a => a.user === userId);
    return userAttendance ? userAttendance.status : null;
  };

  // Add this function to check if the user has RSVP'd to an event
const checkUserRSVP = (event) => {
    if (!isLoggedIn || !userId) return false;
    return event.attendees && event.attendees.some(attendee => 
      attendee.user === userId || (attendee.user && attendee.user._id === userId)
    );
  };

  // Add this function to get the user's RSVP status for an event
//Remove duplicate function declaration since getUserRSVPStatus is already defined below
//Remove duplicate getUserRSVPStatus declaration since it's defined below
const checkEventRSVPStatus = (event) => {
    if (!isLoggedIn || !userId) return null;
    const attendee = event.attendees && event.attendees.find(attendee => 
      attendee.user === userId || (attendee.user && attendee.user._id === userId)
    );
    return attendee ? attendee.status : null;
  };

  const getAttendeeCount = (event) => {
    if (!event.attendees) return 0;
    return event.attendees.filter(a => a.status === 'attending').length;
  };

  // Add this function to check if the user has RSVP'd to an event
  const hasUserRSVPd = (event) => {
    if (!isLoggedIn || !userId) return false;
    return event.attendees && event.attendees.some(attendee => 
      attendee.user === userId || (attendee.user && attendee.user._id === userId)
    );
  };

  // Add this function to get the user's RSVP status for an event
  const getUserRSVPStatus = (event) => {
    if (!isLoggedIn || !userId) return null;
    const attendee = event.attendees && event.attendees.find(attendee => 
      attendee.user === userId || (attendee.user && attendee.user._id === userId)
    );
    return attendee ? attendee.status : null;
  };

  const eventTypeIcons = {
    'In-Person': <LocationOnIcon />,
    'Virtual': <VideocamIcon />,
    'Hybrid': <>
      <LocationOnIcon fontSize="small" />
      <VideocamIcon fontSize="small" />
    </>
  };

  const displayedEvents = getDisplayedEvents();

 

  // Navigation functionality removed

  // Main content for both admin and regular users
  const mainContent = (
    <>
      <Typography variant="h4" fontWeight={600} color="primary" gutterBottom align="center">
        Alumni Networking Events
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Connect with fellow alumni through various networking opportunities
      </Typography>

      {/* Admin Notice */}
      {isLoggedIn && !isAdmin && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Only administrators can create events. You can RSVP to participate in posted events.
          </Typography>
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Upcoming Events" icon={<EventIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Action Button - Only for Admins */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        {isLoggedIn && isAdmin && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenEventDialog()}
            startIcon={<AdminPanelSettingsIcon />}
          >
            Create Event
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

      {/* Events Listings */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayedEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" color="text.secondary">
            {tabValue === 0 
              ? 'No upcoming events available' 
              : tabValue === 1 
                ? 'No past events available' 
                : tabValue === 2
                  ? 'You have not created any events yet'
                  : 'You have not RSVP\'d to any events yet'}
          </Typography>
          {isLoggedIn && isAdmin && tabValue === 2 && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleOpenEventDialog()}
              sx={{ mt: 2 }}
              startIcon={<AdminPanelSettingsIcon />}
            >
              Create Event
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayedEvents.map((event, index) => (
            <Grow in={true} timeout={300 + index * 100} key={event._id}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  ':hover': { transform: 'translateY(-5px)', boxShadow: 4 }
                }}>
                  {event.image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={event.image ? getImageUrl(event.image) : 'https://via.placeholder.com/300x140?text=No+Image'}
                      alt={event.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div" fontWeight={600} color="primary">
                        {event.title}
                      </Typography>
                      {!event.published && (
                        <Chip 
                          label="Draft" 
                          size="small" 
                          color="default"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={event.organizer?.photo} 
                        alt={event.organizer?.name}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      >
                        {event.organizer?.name?.charAt(0) || <PersonIcon />}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        Organized by {event.organizer?.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Chip 
                        label={event.eventType} 
                        size="small" 
                        icon={eventTypeIcons[event.eventType]}
                        color={event.eventType === 'In-Person' ? 'primary' : event.eventType === 'Virtual' ? 'secondary' : 'info'}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(event.startDate)}
                      </Typography>
                    </Box>
                    
                    {event.eventType !== 'Virtual' && event.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {event.location}
                        </Typography>
                      </Box>
                    )}
                    
                    {event.speakers && event.speakers.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <MicIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Speakers: {event.speakers.join(', ')}
                        </Typography>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="body2" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {event.description}
                    </Typography>
                    
                    {/* Show attendee details for admin users only */}
                    {isAdmin && event.attendees && event.attendees.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Attendees ({event.attendees.filter(a => a.status === 'attending').length}):
                        </Typography>
                        <Box sx={{ maxHeight: 100, overflow: 'auto' }}>
                          {event.attendees
                            .filter(a => a.status === 'attending')
                            .slice(0, 3)
                            .map((attendee, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Avatar 
                                  src={attendee.user?.photo} 
                                  alt={attendee.user?.name}
                                  sx={{ width: 20, height: 20, mr: 1 }}
                                >
                                  {attendee.user?.name?.charAt(0) || <PersonIcon />}
                                </Avatar>
                                <Typography variant="caption" color="text.secondary">
                                  {attendee.user?.name}
                                </Typography>
                              </Box>
                            ))}
                          {event.attendees.filter(a => a.status === 'attending').length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                              +{event.attendees.filter(a => a.status === 'attending').length - 3} more
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GroupIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {getAttendeeCount(event)}{event.capacity ? `/${event.capacity}` : ''} attending
                        </Typography>
                      </Box>
                      
                      {isLoggedIn && getRSVPStatus(event) && (
                        <Chip 
                          label={getRSVPStatus(event) === 'attending' ? 'Attending' : 'Declined'} 
                          size="small" 
                          color={getRSVPStatus(event) === 'attending' ? 'success' : 'error'}
                          icon={getRSVPStatus(event) === 'attending' ? <CheckCircleIcon /> : <CancelIcon />}
                        />
                      )}
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleOpenDetailsDialog(event)}
                    >
                      View Details
                    </Button>
                    
                    {isLoggedIn && !isAdmin && event.published && new Date(event.startDate) > new Date() && (
                      getRSVPStatus(event) ? (
                        <Button 
                          variant="contained" 
                          color={getRSVPStatus(event) === 'attending' ? 'error' : 'success'}
                          size="small"
                          onClick={() => handleRSVP(event._id, getRSVPStatus(event) === 'attending' ? 'declined' : 'attending')}
                          disabled={rsvpLoading}
                        >
                          {rsvpLoading ? <CircularProgress size={24} /> : 
                            (getRSVPStatus(event) === 'attending' ? 'Cancel RSVP' : 'Attend')}
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          onClick={() => handleRSVP(event._id, 'attending')}
                          disabled={rsvpLoading}
                        >
                          {rsvpLoading ? <CircularProgress size={24} /> : 'RSVP'}
                        </Button>
                      )
                    )}
                  </CardActions>
                  
                  {/* Admin/Organizer Actions */}
                  {isLoggedIn && isAdmin && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, bgcolor: '#f5f5f5' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenEventDialog(event)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(event._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      {!event.published && (
                        <Button 
                          size="small" 
                          color="success"
                          onClick={() => handlePublish(event._id)}
                          sx={{ ml: 1 }}
                        >
                          Publish
                        </Button>
                      )}
                    </Box>
                  )}
                  {/* Show attendee responses for My RSVPs tab */}
                  {tabValue === 3 && isAdmin && event.attendees && event.attendees.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Responses:
                      </Typography>
                      <List sx={{ maxHeight: 150, overflow: 'auto', p: 0 }}>
                        {event.attendees.map((attendee, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemAvatar>
                              <Avatar 
                                src={attendee.user?.photo} 
                                alt={attendee.user?.name}
                                sx={{ width: 24, height: 24 }}
                              >
                                {attendee.user?.name?.charAt(0) || <PersonIcon />}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                              primary={attendee.user?.name}
                              secondary={`${attendee.status === 'attending' ? 'Attending' : 'Declined'} • ${new Date(attendee.registrationDate).toLocaleDateString()}`}
                              primaryTypographyProps={{ variant: 'body2' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grow>
          ))}
        </Grid>
      )}

      {/* Event Form Dialog - Only for Admins */}
      <Dialog open={openEventDialog} onClose={handleCloseEventDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Event' : 'Create New Event'}
          {!isAdmin && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
              Only administrators can create events.
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={eventForm.title}
                onChange={handleEventChange}
                required
                placeholder="e.g., Annual Alumni Meetup"
                disabled={!isAdmin}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="eventType"
                  value={eventForm.eventType}
                  onChange={handleEventChange}
                  label="Event Type"
                  required
                  disabled={!isAdmin}
                >
                  <MenuItem value="In-Person">In-Person</MenuItem>
                  <MenuItem value="Virtual">Virtual</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity (Optional)"
                name="capacity"
                type="number"
                value={eventForm.capacity}
                onChange={handleEventChange}
                placeholder="Leave blank for unlimited"
                disabled={!isAdmin}
              />
            </Grid>
            {(eventForm.eventType === 'In-Person' || eventForm.eventType === 'Hybrid') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={eventForm.location}
                  onChange={handleEventChange}
                  required={eventForm.eventType !== 'Virtual'}
                  placeholder="e.g., Campus Auditorium, 123 Main St"
                  disabled={!isAdmin}
                />
              </Grid>
            )}
            {(eventForm.eventType === 'Virtual' || eventForm.eventType === 'Hybrid') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Virtual Link"
                  name="virtualLink"
                  value={eventForm.virtualLink}
                  onChange={handleEventChange}
                  required={eventForm.eventType !== 'In-Person'}
                  placeholder="e.g., Zoom or Google Meet link"
                  disabled={!isAdmin}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              {/* Replaced DateTimePicker with TextField */}
              <TextField
                fullWidth
                label="Start Date & Time"
                name="startDate"
                type="datetime-local"
                value={eventForm.startDate ? new Date(eventForm.startDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleDateChange('startDate', new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
                required
                disabled={!isAdmin}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Replaced DateTimePicker with TextField */}
              <TextField
                fullWidth
                label="End Date & Time"
                name="endDate"
                type="datetime-local"
                value={eventForm.endDate ? new Date(eventForm.endDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleDateChange('endDate', new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
                required
                disabled={!isAdmin}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Speakers (Optional)"
                name="speakers"
                value={eventForm.speakers}
                onChange={handleEventChange}
                placeholder="Enter speaker names separated by commas"
                disabled={!isAdmin}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Description"
                name="description"
                value={eventForm.description}
                onChange={handleEventChange}
                required
                multiline
                rows={4}
                placeholder="Describe your event, its purpose, and what attendees can expect."
                disabled={!isAdmin}
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
          <Button onClick={handleCloseEventDialog}>Cancel</Button>
          {isAdmin && (
            <Button 
              onClick={handleEventSubmit} 
              variant="contained" 
              color="primary"
              disabled={uploadLoading}
            >
              {uploadLoading ? <CircularProgress size={24} /> : (isEditing ? 'Update Event' : 'Create Event')}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        {currentEvent && (
          <>
            <DialogContent>
              <Grid container spacing={3}>
                {currentEvent.image && (
                  <Grid item xs={12}>
                    <img 
                      src={getImageUrl(currentEvent.image)} 
                      alt={currentEvent.title} 
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                  </Grid>
                )}
                
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight={600} color="primary">
                      {currentEvent.title}
                    </Typography>
                    <Chip 
                      label={currentEvent.eventType} 
                      icon={eventTypeIcons[currentEvent.eventType]}
                      color={currentEvent.eventType === 'In-Person' ? 'primary' : currentEvent.eventType === 'Virtual' ? 'secondary' : 'info'}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                    <Avatar 
                      src={currentEvent.organizer?.photo} 
                      alt={currentEvent.organizer?.name}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    >
                      {currentEvent.organizer?.name?.charAt(0) || <PersonIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        Organized by {currentEvent.organizer?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(currentEvent.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body1" paragraph>
                    {currentEvent.description}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2">Start Time</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(currentEvent.startDate)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2">End Time</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(currentEvent.endDate)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {(currentEvent.eventType === 'In-Person' || currentEvent.eventType === 'Hybrid') && currentEvent.location && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="subtitle2">Location</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {currentEvent.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    {(currentEvent.eventType === 'Virtual' || currentEvent.eventType === 'Hybrid') && currentEvent.virtualLink && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VideocamIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="subtitle2">Virtual Link</Typography>
                            <Typography variant="body2" color="text.secondary">
                              <a href={currentEvent.virtualLink} target="_blank" rel="noopener noreferrer">
                                {currentEvent.virtualLink}
                              </a>
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    {currentEvent.speakers && currentEvent.speakers.length > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <MicIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="subtitle2">Speakers</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {currentEvent.speakers.join(', ')}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Attendance</Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Attendees:
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="primary">
                        {getAttendeeCount(currentEvent)}{currentEvent.capacity ? `/${currentEvent.capacity}` : ''}
                      </Typography>
                    </Box>
                    
                    {isLoggedIn && !isAdmin && new Date(currentEvent.startDate) > new Date() && currentEvent.published && (
                      <Box sx={{ mt: 2 }}>
                        {getRSVPStatus(currentEvent) ? (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2">
                              Your status: 
                              <Chip 
                                label={getRSVPStatus(currentEvent) === 'attending' ? 'Attending' : 'Declined'} 
                                size="small" 
                                color={getRSVPStatus(currentEvent) === 'attending' ? 'success' : 'error'}
                                sx={{ ml: 1 }}
                              />
                            </Typography>
                            <Button 
                              variant="outlined" 
                              size="small"
                              color={getRSVPStatus(currentEvent) === 'attending' ? 'error' : 'success'}
                              onClick={() => handleRSVP(currentEvent._id, getRSVPStatus(currentEvent) === 'attending' ? 'declined' : 'attending')}
                              disabled={rsvpLoading}
                            >
                              {rsvpLoading ? <CircularProgress size={20} /> : 
                                (getRSVPStatus(currentEvent) === 'attending' ? 'Cancel' : 'Attend')}
                            </Button>
                          </Box>
                        ) : (
                          <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            onClick={() => handleRSVP(currentEvent._id, 'attending')}
                            disabled={rsvpLoading || (currentEvent.capacity && getAttendeeCount(currentEvent) >= currentEvent.capacity)}
                          >
                            {rsvpLoading ? <CircularProgress size={24} /> : 'RSVP Now'}
                          </Button>
                        )}
                      </Box>
                    )}
                    
                    {currentEvent.attendees && currentEvent.attendees.length > 0 && isAdmin && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Attendee List ({currentEvent.attendees.filter(a => a.status === 'attending').length} attending)
                        </Typography>
                        <List sx={{ maxHeight: 200, overflow: 'auto', p: 0 }}>
                          {currentEvent.attendees
                            .filter(a => a.status === 'attending')
                            .map((attendee, index) => (
                              <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                <ListItemAvatar>
                                  <Avatar 
                                    src={attendee.user?.photo} 
                                    alt={attendee.user?.name}
                                    sx={{ width: 32, height: 32 }}
                                  >
                                    {attendee.user?.name?.charAt(0) || <PersonIcon />}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary={attendee.user?.name}
                                  secondary={
                                    isAdmin ? 
                                    `${attendee.user?.email || 'No email'} • ${attendee.user?.company || 'No company'} • ${new Date(attendee.registrationDate).toLocaleDateString()}` :
                                    new Date(attendee.registrationDate).toLocaleDateString()
                                  }
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                              </ListItem>
                            ))
                          }
                        </List>
                        
                        {/* Show declined attendees for admin */}
                        {isAdmin && currentEvent.attendees.filter(a => a.status === 'declined').length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom color="error">
                              Declined ({currentEvent.attendees.filter(a => a.status === 'declined').length})
                            </Typography>
                            <List sx={{ maxHeight: 150, overflow: 'auto', p: 0 }}>
                              {currentEvent.attendees
                                .filter(a => a.status === 'declined')
                                .map((attendee, index) => (
                                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                    <ListItemAvatar>
                                      <Avatar 
                                        src={attendee.user?.photo} 
                                        alt={attendee.user?.name}
                                        sx={{ width: 24, height: 24 }}
                                      >
                                        {attendee.user?.name?.charAt(0) || <PersonIcon />}
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                      primary={attendee.user?.name}
                                      secondary={`${attendee.user?.email || 'No email'} • ${new Date(attendee.registrationDate).toLocaleDateString()}`}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                      secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                  </ListItem>
                                ))
                              }
                            </List>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Card>
                  
                  {/* Admin Management - Only for Admins */}
                  {isLoggedIn && isAdmin && (
                    <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
                      <Typography variant="h6" gutterBottom>Event Management</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            handleCloseDetailsDialog();
                            handleOpenEventDialog(currentEvent);
                          }}
                        >
                          Edit Event
                        </Button>
                        {!currentEvent.published && (
                          <Button 
                            variant="outlined" 
                            color="success"
                            onClick={() => {
                              handleCloseDetailsDialog();
                              handlePublish(currentEvent._id);
                            }}
                          >
                            Publish Event
                          </Button>
                        )}
                        <Button 
                          variant="outlined" 
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            handleCloseDetailsDialog();
                            handleDelete(currentEvent._id);
                          }}
                        >
                          Delete Event
                        </Button>
                      </Box>
                    </Card>
                  )}
                </Grid>
                
              </Grid>
            </DialogContent>
            
            <DialogActions>
    <Button onClick={handleCloseDetailsDialog}>Close</Button>
    {isLoggedIn && !isAdmin && new Date(currentEvent.startDate) > new Date() && currentEvent.published && !getRSVPStatus(currentEvent) && (
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => handleRSVP(currentEvent._id, 'attending')}
        disabled={rsvpLoading || (currentEvent.capacity && getAttendeeCount(currentEvent) >= currentEvent.capacity)}
      >
        {rsvpLoading ? <CircularProgress size={24} /> : 'RSVP'}
      </Button>
    )}
  </DialogActions>
          </>
        )}
      </Dialog>
      
        
    </>
  );

  // Conditional rendering based on user role
  return (
    <>
      {isLoggedIn && isAdmin ? (
        // Admin view with admin navigation
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - 240px)` },
              ml: { sm: `240px` },
              display: { xs: 'block', sm: 'block' },
              bgcolor: 'white',
              color: 'text.primary',
              boxShadow: 1
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                Events Management
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            component="nav"
            sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
            >
              <div>
                <Toolbar>
                  <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: '#1976d2' }}>
                    Admin Panel
                  </Typography>
                </Toolbar>
                <Divider />
                <List>
                  <ListItem 
                    onClick={() => navigate('/admin')}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                  <ListItem 
                    onClick={() => {
                      localStorage.setItem('adminSection', 'alumni');
                      navigate('/admin');
                    }}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Alumni" />
                  </ListItem>
                  <ListItem 
                    onClick={() => {
                      localStorage.setItem('adminSection', 'students');
                      navigate('/admin');
                    }}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <EmojiEventsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Elite Alumni" />
                  </ListItem>
                  <ListItem 
                    onClick={() => {
                      localStorage.setItem('adminSection', 'highlights');
                      navigate('/admin');
                    }}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText primary="Placement Highlights" />
                  </ListItem>
                  <ListItem 
                    onClick={() => {
                      localStorage.setItem('adminSection', 'posts');
                      navigate('/admin');
                    }}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <ForumIcon />
                    </ListItemIcon>
                    <ListItemText primary="Alumni Posts" />
                  </ListItem>
                  <ListItem 
                    onClick={() => navigate('/networking-events')}
                    sx={{
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <EventIcon />
                    </ListItemIcon>
                    <ListItemText primary="Events" />
                  </ListItem>
                  <ListItem 
                    onClick={() => navigate('/admin-mentor-messages')}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <MessageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Mentor Messages" />
                  </ListItem>
                  <ListItem 
                    onClick={() => navigate('/admin-donations')}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DonationIcon />
                    </ListItemIcon>
                    <ListItemText primary="Donations" />
                  </ListItem>
                  <ListItem 
                    button 
                    onClick={() => navigate('/networking-events')}
                    sx={{
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <EmojiEventsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Elite Alumni" />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.dispatchEvent(new Event('authChange'));
                    navigate('/');
                  }}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </div>
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
              open
            >
              <div>
                <Toolbar>
                  <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: '#1976d2' }}>
                    Admin Panel
                  </Typography>
                </Toolbar>
                <Divider />
                <List>
                  <ListItem 
                    onClick={() => navigate('/admin')}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                  <ListItem 
                    onClick={() => {
                      localStorage.setItem('adminSection', 'alumni');
                      navigate('/admin');
                    }}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Alumni" />
                  </ListItem>
                  <ListItem 
                    onClick={() => {
                      localStorage.setItem('adminSection', 'students');
                      navigate('/admin');
                    }}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <EmojiEventsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Elite Alumni" />
                  </ListItem>
                  <ListItem 
                    onClick={() => {
                      localStorage.setItem('adminSection', 'highlights');
                      navigate('/admin');
                    }}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText primary="Placement Highlights" />
                  </ListItem>
                  <ListItem 
                    onClick={() => {
                      localStorage.setItem('adminSection', 'posts');
                      navigate('/admin');
                    }}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <ForumIcon />
                    </ListItemIcon>
                    <ListItemText primary="Alumni Posts" />
                  </ListItem>
                  <ListItem 
                    onClick={() => navigate('/admin-mentor-messages')}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <MessageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Mentor Messages" />
                  </ListItem>
                  <ListItem 
                    onClick={() => navigate('/admin-donations')}
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DonationIcon />
                    </ListItemIcon>
                    <ListItemText primary="Donations" />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.dispatchEvent(new Event('authChange'));
                    navigate('/');
                  }}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </div>
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{ 
              flexGrow: 1, 
              p: 3, 
              width: { sm: `calc(100% - 240px)` },
              mt: { xs: 8, sm: 8 },
              maxWidth: 1200,
              mx: 'auto'
            }}
          >
            {mainContent}
          </Box>
        </Box>
      ) : (
        // Regular alumni view with standard SideNav
        <SideNav title="Alumni Networking Events" adminItems={[
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
          { text: 'Alumni', icon: <PeopleIcon />, path: '/admin', onClick: () => localStorage.setItem('adminSection', 'alumni') },
          { text: 'Elite Alumni', icon: <EmojiEventsIcon />, path: '/admin', onClick: () => localStorage.setItem('adminSection', 'students') },
          { text: 'Placement Highlights', icon: <BusinessIcon />, path: '/admin', onClick: () => localStorage.setItem('adminSection', 'highlights') },
          { text: 'Alumni Posts', icon: <ForumIcon />, path: '/admin', onClick: () => localStorage.setItem('adminSection', 'posts') },
          { text: 'Mentor Messages', icon: <MessageIcon />, path: '/admin-mentor-messages' },
          { text: 'Donations', icon: <DonationIcon />, path: '/admin-donations' },
          { text: 'Events', icon: <EventIcon />, path: '/networking-events', active: true, onClick: null }
        ]} isAdmin={userRole === 'admin'}>
          <Box sx={{ p: 3 }}>
            {mainContent}
          </Box>
        </SideNav>
      )}
    
    </>
  );
}

export default NetworkingEvents;