import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Avatar, Snackbar, Alert, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import { API_ENDPOINTS } from '../config/api';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ batch: '', company: '', salary: '', designation: '', location: '', phone: '', linkedin: '' });
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
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflowX: 'hidden',
        py: 6,
      }}
    >
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
          maxWidth: 600,
          width: '100%',
          borderRadius: 7,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          p: 4,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          mt: 12,
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
              <Box sx={{ background: 'rgba(245,250,255,0.85)', borderRadius: 4, boxShadow: 0, p: 2.5, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom sx={{ mb: 2 }}>
                  Profile Details
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}><b>Batch:</b> <span style={{ fontWeight: 400 }}>{profile.batch || '-'}</span></Grid>
                  <Grid item xs={12} sm={6}><b>Company:</b> <span style={{ fontWeight: 400 }}>{profile.company || '-'}</span></Grid>
                  <Grid item xs={12} sm={6}><b>Salary:</b> <span style={{ fontWeight: 400 }}>{profile.salary || '-'}</span></Grid>
                  <Grid item xs={12} sm={6}><b>Designation:</b> <span style={{ fontWeight: 400 }}>{profile.designation || '-'}</span></Grid>
                  <Grid item xs={12} sm={6}><b>Location:</b> <span style={{ fontWeight: 400 }}>{profile.location || '-'}</span></Grid>
                  <Grid item xs={12} sm={6}><b>Phone:</b> <span style={{ fontWeight: 400 }}>{profile.phone || '-'}</span></Grid>
                  <Grid item xs={12}><b>LinkedIn:</b> {profile.linkedin ? <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', wordBreak: 'break-all', fontWeight: 500 }}>{profile.linkedin}</a> : '-'}</Grid>
                </Grid>
              </Box>
              <Box sx={{ background: 'rgba(245,250,255,0.85)', borderRadius: 4, boxShadow: 0, p: 2.5, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
                  Share Interesting Information for Students
                </Typography>
                <form onSubmit={handlePostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  <TextField
                    label="What's interesting?"
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    disabled={posting}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Button variant="outlined" component="label" sx={{ borderRadius: 3, fontWeight: 600, boxShadow: 1, ':hover': { background: '#e3f0ff' } }}>
                      Attach File
                      <input type="file" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" hidden onChange={handleAttachmentChange} />
                    </Button>
                    {uploadingAttachment && <CircularProgress size={20} />}
                    {postAttachment && (
                      <>
                        <a href={postAttachment} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 500, color: '#1976d2' }}>
                          {postAttachment.split('/').pop()}
                        </a>
                        <Button size="small" color="error" onClick={() => setPostAttachment(null)} sx={{ borderRadius: 3, fontWeight: 600 }}>Remove</Button>
                      </>
                    )}
                  </Box>
                  <Button type="submit" variant="contained" disabled={posting || !postContent.trim()} sx={{ borderRadius: 3, fontWeight: 700, boxShadow: 2, py: 1.2, ':hover': { background: '#1976d2' } }}>Post</Button>
                </form>
                {posts.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>Your Posts</Typography>
                    {posts.map(post => (
                      <Card key={post._id} sx={{ mb: 2, p: 2, background: 'rgba(255,255,255,0.95)', borderRadius: 4, boxShadow: 3, display: 'flex', flexDirection: 'column', gap: 1, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 8 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Avatar src={profile?.photo} sx={{ width: 36, height: 36, boxShadow: 1 }} />
                          <Box>
                            <Typography fontWeight={700}>{profile?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleString()}</Typography>
                          </Box>
                          <Box sx={{ flex: 1 }} />
                          <Button size="small" onClick={() => handleEditPost(post)} sx={{ borderRadius: 2, fontWeight: 600, ':hover': { background: '#e3f0ff' } }}>Edit</Button>
                          <Button size="small" color="error" onClick={() => handleDeletePost(post._id)} sx={{ borderRadius: 2, fontWeight: 600 }}>Delete</Button>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 1 }}>{post.content}</Typography>
                        {post.attachment && (
                          post.attachment.match(/\.(jpg|jpeg|png|gif)$/i)
                            ? <img src={post.attachment} alt="attachment" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
                            : <a href={post.attachment} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontWeight: 500 }}>{post.attachment.split('/').pop()}</a>
                        )}
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="contained" color="primary" size="large" sx={{ px: 5, fontWeight: 700, borderRadius: 3, boxShadow: 2, py: 1.2, ':hover': { background: '#1976d2' } }} onClick={handleOpen}>ADD / EDIT DETAILS</Button>
              </Box>
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
            <TextField label="Salary" name="salary" value={form.salary} onChange={handleChange} fullWidth margin="dense" />
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
    </Box>
  );
}

export default Dashboard; 