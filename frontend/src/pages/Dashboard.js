import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Avatar, Snackbar, Alert, CircularProgress, Divider, Paper, IconButton, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SchoolIcon from '@mui/icons-material/School';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_ENDPOINTS } from '../config/api';
import API_BASE_URL from '../config/api';
import SideNav from '../components/SideNav';
 
function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ batch: '', company: '', designation: '', location: '', phone: '', linkedin: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [posting, setPosting] = useState(false);
  const [postAttachment, setPostAttachment] = useState(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editAttachment, setEditAttachment] = useState(null);
  const [editUploadingAttachment, setEditUploadingAttachment] = useState(false);
  const [events, setEvents] = useState([]);
  const [showEventBanner, setShowEventBanner] = useState(true);

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
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.ALUMNI_EVENTS);
        const data = await res.json();
        if (Array.isArray(data)) setEvents(data);
      } catch {}
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    // Hide banner if user dismissed this event
    if (events.length > 0) {
      const dismissed = localStorage.getItem('dismissedEventId');
      if (dismissed === events[0]._id) setShowEventBanner(false);
      else setShowEventBanner(true);
    }
  }, [events]);

  const handleDismissEventBanner = () => {
    if (events.length > 0) {
      localStorage.setItem('dismissedEventId', events[0]._id);
      setShowEventBanner(false);
    }
  };

  const handleOpen = () => {
    setForm({
      batch: profile?.batch || '',
      company: profile?.company || '',
      salary: profile?.salary || '',
      designation: profile?.designation || '',
      location: profile?.location || '',
      phone: profile?.phone || '',
      linkedin: profile?.linkedin || '',
    });
    setOpen(true);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo', file);
      const res = await fetch(API_ENDPOINTS.UPLOAD_PHOTO, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to upload photo');
              setForm((prev) => ({ ...prev, photo: `${API_BASE_URL}${data.url}` }));
    } catch (err) {
      setError(err.message);
    }
    setUploadingPhoto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.ALUMNI_DETAILS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to save details');
      setOpen(false);
      setSuccess('Details saved successfully!');
      fetchProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAttachmentChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAttachment(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('attachment', file);
      const res = await fetch(API_ENDPOINTS.ALUMNI_POST_ATTACHMENT, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to upload attachment');
      setPostAttachment(`${API_BASE_URL}${data.url}`);
    } catch (err) {
      setError(err.message);
    }
    setUploadingAttachment(false);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    setPosting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.ALUMNI_POST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ content: postContent, attachment: postAttachment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to post');
      setPostContent('');
      setPostAttachment(null);
      setPosts([data, ...posts]);
    } catch (err) {
      setError(err.message);
    }
    setPosting(false);
  };

  const handleEditAttachmentChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditUploadingAttachment(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('attachment', file);
      const res = await fetch(API_ENDPOINTS.ALUMNI_POST_ATTACHMENT, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to upload attachment');
      setEditAttachment(`${API_BASE_URL}${data.url}`);
    } catch (err) {
      setError(err.message);
    }
    setEditUploadingAttachment(false);
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setEditContent(post.content);
    setEditAttachment(post.attachment || null);
  };

  const handleEditPostSave = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    setPosting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.ALUMNI_POST}/${editPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ content: editContent, attachment: editAttachment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to update post');
      setPosts(posts.map(p => p._id === data._id ? data : p));
      setEditPost(null);
    } catch (err) {
      setError(err.message);
    }
    setPosting(false);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.ALUMNI_POST}/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to delete post');
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SideNav title="Alumni Dashboard">
      {/* Modern Event Notification Banner */}
      {showEventBanner && events.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            width: '100%',
            maxWidth: 600,
            display: 'flex',
            justifyContent: 'center',
            animation: 'fadeInDown 0.7s',
          }}
        >
          <Alert
            severity="info"
            iconMapping={{ info: <InfoIcon fontSize="large" sx={{ color: '#1976d2' }} /> }}
            onClose={handleDismissEventBanner}
            sx={{
              borderRadius: 4,
              boxShadow: 6,
              px: 3,
              py: 2,
              fontSize: '1.1rem',
              background: 'rgba(227, 240, 255, 0.95)',
              alignItems: 'center',
              width: '100%',
              maxWidth: 500,
              fontWeight: 500,
            }}
          >
            <strong>New Event:</strong> {events[0].title} — {events[0].description} ({events[0].date ? new Date(events[0].date).toLocaleDateString() : ''})
          </Alert>
        </Box>
      )}
      {/* Glassmorphism Card */}
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
          mt: 12,
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
            <Avatar src={profile?.photo} sx={{ width: 90, height: 90, bgcolor: 'primary.main', mb: 2, boxShadow: 3 }}>
              {!profile?.photo && <PersonIcon sx={{ fontSize: 56 }} />}
            </Avatar>
            <Typography variant="h3" fontWeight={800} color="primary" gutterBottom align="center" sx={{ letterSpacing: 1 }}>
              Alumni Dashboard
            </Typography>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          ) : profile ? (
            <>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>{profile.name?.toUpperCase()}</Typography>
                <Typography variant="body1" color="text.secondary">{profile.email}</Typography>
              </Box>
              <Paper elevation={3} sx={{ borderRadius: 4, p: 3, mb: 4, background: 'rgba(255,255,255,0.95)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    Profile Details
                  </Typography>
                  <Tooltip title="Edit Profile">
                    <IconButton color="primary" onClick={handleOpen} sx={{ background: 'rgba(25, 118, 210, 0.08)', '&:hover': { background: 'rgba(25, 118, 210, 0.15)' } }}>
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
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <LinkedInIcon color="primary" />
                      <Box sx={{ width: '100%' }}>
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
              </Paper>
              <Paper elevation={3} sx={{ borderRadius: 4, p: 3, mb: 4, background: 'rgba(255,255,255,0.95)' }}>
                <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
                  Share Your Experience
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <form onSubmit={handlePostSubmit}>
                  <TextField
                    placeholder="Share your professional journey, tips, or advice for students..."
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    disabled={posting}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(245,250,255,0.5)',
                      }
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Button 
                      variant="outlined" 
                      component="label" 
                      startIcon={<AttachFileIcon />}
                      sx={{ 
                        borderRadius: 2, 
                        fontWeight: 600, 
                        boxShadow: 1, 
                        ':hover': { background: 'rgba(25, 118, 210, 0.08)' } 
                      }}
                    >
                      Attach File
                      <input type="file" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" hidden onChange={handleAttachmentChange} />
                    </Button>
                    
                    {uploadingAttachment && <CircularProgress size={20} />}
                    
                    {postAttachment && (
                      <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2, gap: 1, flex: 1 }}>
                        {postAttachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                          <Box component="img" src={postAttachment} alt="Preview" sx={{ height: 40, width: 40, borderRadius: 1, objectFit: 'cover' }} />
                        ) : (
                          <AttachFileIcon color="primary" fontSize="small" />
                        )}
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={postAttachment} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          sx={{ 
                            color: 'primary.main', 
                            fontWeight: 500,
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {postAttachment.split('/').pop()}
                        </Typography>
                        <IconButton size="small" color="error" onClick={() => setPostAttachment(null)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    )}
                  </Box>
                  
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={posting || !postContent.trim()} 
                    sx={{ 
                      borderRadius: 2, 
                      fontWeight: 700, 
                      boxShadow: 2, 
                      py: 1.2,
                      px: 4,
                      ':hover': { background: '#1565c0' } 
                    }}
                  >
                    {posting ? 'Posting...' : 'Share Post'}
                  </Button>
                </form>
                
                {posts.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
                      Your Posts
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    {posts.map(post => (
                      <Paper 
                        key={post._id} 
                        elevation={2} 
                        sx={{ 
                          mb: 3, 
                          p: 2.5, 
                          borderRadius: 3, 
                          transition: 'transform 0.2s, box-shadow 0.2s', 
                          ':hover': { transform: 'translateY(-2px)', boxShadow: 4 } 
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar 
                            src={profile?.photo} 
                            sx={{ 
                              width: 48, 
                              height: 48, 
                              boxShadow: 2,
                              border: '2px solid white'
                            }} 
                          >
                            {!profile?.photo && <PersonIcon />}
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight={700}>{profile?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(post.createdAt).toLocaleString(undefined, { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Tooltip title="Edit Post">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditPost(post)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Delete Post">
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleDeletePost(post._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        
                        <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                          {post.content}
                        </Typography>
                        
                        {post.attachment && (
                          <Box sx={{ mt: 1 }}>
                            {post.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                              <Box 
                                component="img" 
                                src={post.attachment} 
                                alt="attachment" 
                                sx={{ 
                                  maxWidth: '100%', 
                                  borderRadius: 2, 
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                  maxHeight: 400,
                                  objectFit: 'contain'
                                }} 
                              />
                            ) : (
                              <Button
                                variant="outlined"
                                startIcon={<AttachFileIcon />}
                                component="a"
                                href={post.attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ borderRadius: 2 }}
                              >
                                {post.attachment.split('/').pop()}
                              </Button>
                            )}
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Box>
                )}
              </Paper>
              {/* Removed the ADD / EDIT DETAILS button since we now have an edit button in the profile details section */}
            </>
          ) : (
            <Typography align="center">No profile data found.</Typography>
          )}
        </CardContent>
      </Card>
      {/* Animations for event banner */}
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px) translateX(-50%); }
          100% { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
      `}</style>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add / Update Details</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField label="Batch" name="batch" value={form.batch} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Company" name="company" value={form.company} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Designation" name="designation" value={form.designation} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} fullWidth margin="dense" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
              <Button variant="outlined" component="label">
                Upload Photo
                <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
              </Button>
              {uploadingPhoto && <CircularProgress size={24} />}
              {(photoPreview || form.photo) && (
                <Avatar src={photoPreview || form.photo} sx={{ width: 48, height: 48 }} />
              )}
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={!!editPost} onClose={() => setEditPost(null)}>
        <DialogTitle>Edit Post</DialogTitle>
        <form onSubmit={handleEditPostSave}>
          <DialogContent>
            <TextField
              label="What's interesting?"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              fullWidth
              margin="dense"
              required
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
              <Button variant="outlined" component="label">
                Change Attachment
                <input type="file" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" hidden onChange={handleEditAttachmentChange} />
              </Button>
              {editUploadingAttachment && <CircularProgress size={20} />}
              {editAttachment && (
                <a href={editAttachment} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13 }}>
                  {editAttachment.split('/').pop()}
                </a>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditPost(null)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </SideNav>
  );
}

export default Dashboard;