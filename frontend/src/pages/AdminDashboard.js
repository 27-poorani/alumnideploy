import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, TextField, Avatar, Grid, Chip, CircularProgress, Grow } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import { format } from 'date-fns';

function AdminDashboard() {
  const [alumni, setAlumni] = useState([]);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [success, setSuccess] = useState('');

  // Top Students State (backend)
  const [topStudents, setTopStudents] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [errorTop, setErrorTop] = useState('');
  const [editStudent, setEditStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ name: '', company: '', package: '', batch: '', photo: '' });
  const [addMode, setAddMode] = useState(false);

  // Placement Highlights State
  const [highlights, setHighlights] = useState({ totalOffers: '', highestPackage: '', topRecruiters: '' });
  const [loadingHighlights, setLoadingHighlights] = useState(false);
  const [errorHighlights, setErrorHighlights] = useState('');
  const [editHighlights, setEditHighlights] = useState(false);

  // Add after useState for studentForm
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  // Alumni Posts State
  const [alumniPosts, setAlumniPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorPosts, setErrorPosts] = useState('');

  // Search State for Top Students
  const [studentSearch, setStudentSearch] = useState('');
  const [alumniSearch, setAlumniSearch] = useState('');

  // Events State
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState('');
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '' });
  const [editEventId, setEditEventId] = useState(null);

  // Fetch alumni (unchanged)
  const fetchAlumni = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (role !== 'admin') {
        setError('Access denied: Admins only');
        return;
      }
      const res = await fetch('http://localhost:5000/api/admin/alumni', {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch alumni');
      setAlumni(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch top students from backend
  const fetchTopStudents = async () => {
    setLoadingTop(true);
    setErrorTop('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/top-students', {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch top students');
      setTopStudents(data);
    } catch (err) {
      setErrorTop(err.message);
    }
    setLoadingTop(false);
  };

  const fetchHighlights = async () => {
    setLoadingHighlights(true);
    setErrorHighlights('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/placement-highlights', {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch highlights');
      setHighlights(data);
    } catch (err) {
      setErrorHighlights(err.message);
    }
    setLoadingHighlights(false);
  };

  const fetchAlumniPosts = async () => {
    setLoadingPosts(true);
    setErrorPosts('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/posts', {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch posts');
      setAlumniPosts(data);
    } catch (err) {
      setErrorPosts(err.message);
    }
    setLoadingPosts(false);
  };

  const handleApprovePost = async (id, approved) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/posts/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ approved }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to update post');
      setAlumniPosts(alumniPosts.map(p => p._id === data._id ? data : p));
    } catch (err) {
      setErrorPosts(err.message);
    }
  };

  const handleRemoveAttachment = async (post) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/posts/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ attachment: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to remove attachment');
      setAlumniPosts(alumniPosts.map(p => p._id === data._id ? data : p));
    } catch (err) {
      setErrorPosts(err.message);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setErrorPosts('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to delete post');
      setAlumniPosts(alumniPosts.filter(p => p._id !== id));
    } catch (err) {
      setErrorPosts(err.message);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    setErrorEvents('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/events', {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch events');
      setEvents(data);
    } catch (err) {
      setErrorEvents(err.message);
    }
    setLoadingEvents(false);
  };

  const handleEventDialogOpen = (event = null) => {
    if (event) {
      setEventForm({ title: event.title, description: event.description, date: event.date?.slice(0, 10) });
      setEditEventId(event._id);
    } else {
      setEventForm({ title: '', description: '', date: '' });
      setEditEventId(null);
    }
    setEventDialogOpen(true);
  };
  const handleEventDialogClose = () => {
    setEventDialogOpen(false);
    setEventForm({ title: '', description: '', date: '' });
    setEditEventId(null);
  };
  const handleEventFormChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };
  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editEventId ? 'PUT' : 'POST';
      const url = editEventId ? `http://localhost:5000/api/admin/events/${editEventId}` : 'http://localhost:5000/api/admin/events';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(eventForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to save event');
      handleEventDialogClose();
      fetchEvents();
    } catch (err) {
      setErrorEvents(err.message);
    }
  };
  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to delete event');
      fetchEvents();
    } catch (err) {
      setErrorEvents(err.message);
    }
  };

  useEffect(() => {
    fetchAlumni();
    fetchTopStudents();
    fetchHighlights();
    fetchAlumniPosts();
    fetchEvents();
  }, []);

  // Top Students CRUD (backend)
  const handleEditStudent = (student) => {
    setEditStudent(student);
    setStudentForm({ ...student });
    setAddMode(false);
  };
  const handleDeleteStudent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/top-students/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!res.ok) throw new Error('Failed to delete student');
      setSuccess('Student deleted!');
      fetchTopStudents();
    } catch (err) {
      setErrorTop(err.message);
    }
  };
  const handleAddStudent = () => {
    setStudentForm({ name: '', company: '', package: '', batch: '', photo: '' });
    setEditStudent(null);
    setAddMode(true);
  };
  const handleStudentFormChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };
  const handleStudentFormSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (addMode) {
        const res = await fetch('http://localhost:5000/api/admin/top-students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify(studentForm),
        });
        if (!res.ok) throw new Error('Failed to add student');
        setSuccess('Student added!');
      } else {
        const res = await fetch(`http://localhost:5000/api/admin/top-students/${editStudent._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify(studentForm),
        });
        if (!res.ok) throw new Error('Failed to update student');
        setSuccess('Student updated!');
      }
      setEditStudent(null);
      setAddMode(false);
      fetchTopStudents();
    } catch (err) {
      setErrorTop(err.message);
    }
  };

  const handleHighlightsChange = (e) => {
    setHighlights({ ...highlights, [e.target.name]: e.target.value });
  };

  const handleHighlightsSave = async (e) => {
    e.preventDefault();
    setErrorHighlights('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/placement-highlights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(highlights),
      });
      if (!res.ok) throw new Error('Failed to update highlights');
      setSuccess('Placement highlights updated!');
      setEditHighlights(false);
      fetchHighlights();
    } catch (err) {
      setErrorHighlights(err.message);
    }
  };

  // Alumni delete logic (unchanged)
  const handleDelete = (id) => {
    setDeleteId(id);
  };
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/alumni/${deleteId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!res.ok) throw new Error('Failed to delete alumni');
      setDeleteId(null);
      setSuccess('Alumni deleted successfully!');
      fetchAlumni();
    } catch (err) {
      setError(err.message);
    }
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
      const res = await fetch('http://localhost:5000/api/admin/top-students/upload-photo', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to upload photo');
      setStudentForm((prev) => ({ ...prev, photo: `http://localhost:5000${data.url}` }));
    } catch (err) {
      setErrorTop(err.message);
    }
    setUploadingPhoto(false);
  };

  // Remove the search bar and related filtering logic from the top students section.
  // Delete the studentSearch state, the TextField for search, and use topStudents directly for display.

  const filteredAlumni = alumni.filter(a =>
    (a.name && a.name.toLowerCase().includes(alumniSearch.toLowerCase())) ||
    (a.batch && a.batch.toLowerCase().includes(alumniSearch.toLowerCase())) ||
    (a.company && a.company.toLowerCase().includes(alumniSearch.toLowerCase()))
  );

  return (
    <Box sx={{ minHeight: '90vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)', py: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff', mb: 4 }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
                Admin Dashboard
              </Typography>
              {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    label="Search by name, batch, or company"
                    value={alumniSearch}
                    onChange={e => setAlumniSearch(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ width: 320 }}
                  />
                </Box>
              )}
              {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              ) : (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Batch</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAlumni.map((alum) => (
                        <TableRow key={alum._id}>
                          <TableCell>{alum.name}</TableCell>
                          <TableCell>{alum.email}</TableCell>
                          <TableCell>{alum.batch || '-'}</TableCell>
                          <TableCell>{alum.company || '-'}</TableCell>
                          <TableCell>
                            <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(alum._id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Alumni Posts Review Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff', mb: 4 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
                Alumni Posts Review
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
                        <Card sx={{ borderRadius: 4, boxShadow: 2, p: 2, background: '#f9f9ff', width: 320, minHeight: 120, display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                          {post.attachment && (
                            <Button size="small" color="error" variant="outlined" onClick={() => handleRemoveAttachment(post)}>
                              Remove Attachment
                            </Button>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Chip label={post.approved ? 'Approved' : 'Pending'} color={post.approved ? 'success' : 'warning'} size="small" />
                            {post.approved ? (
                              <Button size="small" color="warning" variant="outlined" onClick={() => handleApprovePost(post._id, false)}>Unapprove</Button>
                            ) : (
                              <Button size="small" color="success" variant="contained" onClick={() => handleApprovePost(post._id, true)}>Approve</Button>
                            )}
                            <Button size="small" color="error" variant="contained" onClick={() => handleDeletePost(post._id)}>
                              Delete
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    </Grow>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Events Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff', mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={600} color="primary">
                  Events
                </Typography>
                <Button variant="contained" onClick={() => handleEventDialogOpen()}>Add Event</Button>
              </Box>
              {loadingEvents ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
              ) : errorEvents ? (
                <Alert severity="error">{errorEvents}</Alert>
              ) : events.length === 0 ? (
                <Typography color="text.secondary">No events yet.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {events.map(event => (
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                      <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, textAlign: 'left', position: 'relative' }}>
                        <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>{event.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{event.description}</Typography>
                        <Typography variant="body2" color="secondary">{event.date ? format(new Date(event.date), 'PPP') : ''}</Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" onClick={() => handleEventDialogOpen(event)}>Edit</Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteEvent(event._id)}>Delete</Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Dialog open={eventDialogOpen} onClose={handleEventDialogClose}>
          <DialogTitle>{editEventId ? 'Edit Event' : 'Add Event'}</DialogTitle>
          <form onSubmit={handleEventFormSubmit}>
            <DialogContent>
              <TextField label="Title" name="title" value={eventForm.title} onChange={handleEventFormChange} fullWidth margin="dense" required />
              <TextField label="Description" name="description" value={eventForm.description} onChange={handleEventFormChange} fullWidth margin="dense" required multiline minRows={2} />
              <TextField label="Date" name="date" type="date" value={eventForm.date} onChange={handleEventFormChange} fullWidth margin="dense" required InputLabelProps={{ shrink: true }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEventDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Editable Top Students Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={600} color="primary">
                  Recently Placed Top Students
                </Typography>
                <Button variant="contained" onClick={handleAddStudent}>Add Student</Button>
              </Box>
              {loadingTop ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
              ) : errorTop ? (
                <Alert severity="error">{errorTop}</Alert>
              ) : (
                <Grid container spacing={3}>
                  {topStudents.map((student) => (
                    <Grid item xs={12} sm={6} md={3} key={student._id}>
                      <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, textAlign: 'center', position: 'relative' }}>
                        <Avatar src={student.photo} sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }} />
                        <Typography fontWeight={600}>{student.name}</Typography>
                        <Chip label={student.company} color="primary" size="small" sx={{ my: 1 }} />
                        <Typography variant="body2">Package: <b>{student.package}</b></Typography>
                        <Typography variant="body2">Batch: {student.batch}</Typography>
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined" onClick={() => handleEditStudent(student)}>Edit</Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteStudent(student._id)}>Delete</Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff', mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={600} color="primary">
                  Placement Highlights
                </Typography>
                <Button variant="contained" onClick={() => setEditHighlights(true)}>Edit</Button>
              </Box>
              {loadingHighlights ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
              ) : errorHighlights ? (
                <Alert severity="error">{errorHighlights}</Alert>
              ) : highlights ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 4, boxShadow: 2, p: 3, textAlign: 'center' }}>
                      <Box sx={{ mb: 1 }}><EmojiEventsIcon color="primary" /></Box>
                      <Typography variant="h5" fontWeight={700}>{highlights.totalOffers}</Typography>
                      <Typography color="text.secondary">Total Offers</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 4, boxShadow: 2, p: 3, textAlign: 'center' }}>
                      <Box sx={{ mb: 1 }}><BusinessIcon color="primary" /></Box>
                      <Typography variant="h5" fontWeight={700}>{highlights.highestPackage}</Typography>
                      <Typography color="text.secondary">Highest Package</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 4, boxShadow: 2, p: 3, textAlign: 'center' }}>
                      <Box sx={{ mb: 1 }}><SchoolIcon color="primary" /></Box>
                      <Typography variant="h5" fontWeight={700}>{highlights.topRecruiters}</Typography>
                      <Typography color="text.secondary">Top Recruiters</Typography>
                    </Card>
                  </Grid>
                </Grid>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit/Add Student Modal */}
      <Dialog open={!!editStudent || addMode} onClose={() => { setEditStudent(null); setAddMode(false); }}>
        <DialogTitle>{addMode ? 'Add Student' : 'Edit Student'}</DialogTitle>
        <form onSubmit={handleStudentFormSave}>
          <DialogContent>
            <TextField label="Name" name="name" value={studentForm.name} onChange={handleStudentFormChange} fullWidth margin="dense" required />
            <TextField label="Company" name="company" value={studentForm.company} onChange={handleStudentFormChange} fullWidth margin="dense" required />
            <TextField label="Package" name="package" value={studentForm.package} onChange={handleStudentFormChange} fullWidth margin="dense" required />
            <TextField label="Batch" name="batch" value={studentForm.batch} onChange={handleStudentFormChange} fullWidth margin="dense" required />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
              <Button variant="outlined" component="label">
                Upload Photo
                <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
              </Button>
              {uploadingPhoto && <CircularProgress size={24} />}
              {(photoPreview || studentForm.photo) && (
                <Avatar src={photoPreview || studentForm.photo} sx={{ width: 48, height: 48 }} />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setEditStudent(null); setAddMode(false); }}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={editHighlights} onClose={() => setEditHighlights(false)}>
        <DialogTitle>Edit Placement Highlights</DialogTitle>
        <form onSubmit={handleHighlightsSave}>
          <DialogContent>
            <TextField label="Total Offers" name="totalOffers" value={highlights.totalOffers} onChange={handleHighlightsChange} fullWidth margin="dense" required type="number" />
            <TextField label="Highest Package" name="highestPackage" value={highlights.highestPackage} onChange={handleHighlightsChange} fullWidth margin="dense" required />
            <TextField label="Top Recruiters" name="topRecruiters" value={highlights.topRecruiters} onChange={handleHighlightsChange} fullWidth margin="dense" required type="number" />
            {errorHighlights && <Alert severity="error" sx={{ mt: 2 }}>{errorHighlights}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditHighlights(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Alumni Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Alumni</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this alumni?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard; 