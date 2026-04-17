import React, { useEffect, useState } from 'react';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, Alert, Dialog, 
  DialogTitle, DialogContent, DialogActions, Snackbar, TextField, 
  Avatar, Grid, Chip, CircularProgress, Grow, MenuItem, Drawer, 
  List, ListItem, ListItemIcon, ListItemText, Divider, CssBaseline, 
  AppBar, Toolbar, IconButton, useTheme, useMediaQuery, Container
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  EmojiEvents as EmojiEventsIcon,
  Event as EventIcon,
  Forum as ForumIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  MonetizationOn as DonationIcon,
  Message as MessageIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  TrendingUp as TrendingUpIcon,
  Insights as InsightsIcon,
  Recommend as RecommendIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Sidebar navigation items
const drawerItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard', path: '/admin' },
  { text: 'Alumni', icon: <PeopleIcon />, section: 'alumni', path: '/admin' },
  { text: 'Elite Alumni', icon: <EmojiEventsIcon />, section: 'students', path: '/admin' },
  { text: 'Placement Highlights', icon: <BusinessIcon />, section: 'highlights', path: '/admin' },
  { text: 'Alumni Posts', icon: <ForumIcon />, section: 'posts', path: '/admin' },
  { text: 'Guidance Messages', icon: <MessageIcon />, section: 'messages', path: '/admin-mentor-messages' },
  { text: 'Donations', icon: <DonationIcon />, section: 'donations', path: '/admin-donations' },
];

function AdminDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [alumni, setAlumni] = useState([]);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [success, setSuccess] = useState('');

  // Top Students State (backend)
  const [topStudents, setTopStudents] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [errorTop, setErrorTop] = useState('');
  const [editStudent, setEditStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ name: '', company: '', package: '', batch: '', department: '', photo: '' });
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
  const [posts, setPosts] = useState([]); // For NovaILE Analytics

  // Events State
  const [events, setEvents] = useState([]); // For NovaILE Analytics
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState('');

  // Search State for Top Students
  const [studentSearch, setStudentSearch] = useState('');
  const [alumniSearch, setAlumniSearch] = useState('');

  // Mentorship State
  const [pendingMentorships, setPendingMentorships] = useState([]);
  const [loadingMentorships, setLoadingMentorships] = useState(false);
  const [errorMentorships, setErrorMentorships] = useState('');

  // Add after useState for batchCounts
  const [batchCounts, setBatchCounts] = useState([]);
  const [loadingBatchCounts, setLoadingBatchCounts] = useState(false);
  const [errorBatchCounts, setErrorBatchCounts] = useState('');

  // Add state for admin message and proposed dates
  const [adminMessages, setAdminMessages] = useState({});
  const [proposedDates, setProposedDates] = useState({});
  const [sendingMessage, setSendingMessage] = useState({});

  // Drawer toggle handler
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Filter alumni based on search
  const filteredAlumni = alumni.filter(alum => {
    const searchLower = alumniSearch.toLowerCase();
    return (
      alum.name?.toLowerCase().includes(searchLower) ||
      alum.batch?.toLowerCase().includes(searchLower) ||
      alum.company?.toLowerCase().includes(searchLower) ||
      alum.linkedin?.toLowerCase().includes(searchLower)
    );
  });

  // Handle navigation to admin pages
  const handleNavigation = (item) => {
    if (item.path) {
      if (item.path === '/admin') {
        // For items with /admin path, navigate with the section state
        navigate(item.path, { state: { activeSection: item.section } });
      } else {
        // For other paths, just navigate to them
        navigate(item.path);
      }
    } else {
      // For items without a path, just set the active section
      setActiveSection(item.section);
    }
    
    // Only close the drawer on mobile devices
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Drawer content
  const drawer = (
    <div>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 2,
        background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
        color: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          sx={{
            fontWeight: 600,
            letterSpacing: 0.5,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <AdminPanelSettingsIcon sx={{ mr: 1 }} /> Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {drawerItems.map((item) => (
          <ListItem 
            button 
            key={item.section}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation(item);
            }}
            selected={activeSection === item.section}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                },
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              mb: 0.8,
              borderRadius: 1.5,
              mx: 1,
              transition: 'all 0.2s ease-in-out',
              padding: '8px 16px',
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: activeSection === item.section ? '#fff' : theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: activeSection === item.section ? 600 : 400,
              }} 
            />
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
              backgroundColor: theme.palette.error.light,
              color: '#fff',
              '& .MuiListItemIcon-root': {
                color: '#fff',
              },
            },
            borderRadius: 1.5,
            mx: 1,
            mb: 0.8,
            transition: 'all 0.2s ease-in-out',
            padding: '8px 16px',
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: 40, 
            color: theme.palette.error.main,
            transition: 'all 0.2s ease-in-out',
          }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ 
              fontWeight: 500,
            }} 
          />
        </ListItem>
      </List>
    </div>
  );

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
      const res = await fetch(API_ENDPOINTS.ADMIN_ALUMNI, {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch alumni');
      setAlumni(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch pending mentorships
  const fetchPendingMentorships = async () => {
    setLoadingMentorships(true);
    setErrorMentorships('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.ADMIN_MENTORSHIPS_PENDING, {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch pending mentorships');
      setPendingMentorships(data);
    } catch (err) {
      setErrorMentorships(err.message);
    }
    setLoadingMentorships(false);
  };

  // Handle mentorship approval
  const handleMentorshipApproval = async (mentorshipId, approved, featured = false) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.MENTORSHIPS}/${mentorshipId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ approved, featured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to update mentorship');
      setSuccess(`Mentorship ${approved ? 'approved' : 'rejected'} successfully!`);
      fetchPendingMentorships();
    } catch (err) {
      setErrorMentorships(err.message);
    }
  };

  // Fetch top students from backend
  const fetchTopStudents = async () => {
    setLoadingTop(true);
    setErrorTop('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.ADMIN_TOP_STUDENTS, {
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
      const res = await fetch(API_ENDPOINTS.ADMIN_PLACEMENT_HIGHLIGHTS, {
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
      const res = await fetch(API_ENDPOINTS.ADMIN_POSTS, {
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
      const res = await fetch(`${API_ENDPOINTS.ADMIN_POSTS}/${id}/approve`, {
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
      const res = await fetch(`${API_ENDPOINTS.ADMIN_POSTS}/${post._id}`, {
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
      const res = await fetch(`${API_ENDPOINTS.ADMIN_POSTS}/${id}`, {
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

  // Removed Events-related functions

  // Update fetchBatchCounts to use department count endpoint
  const fetchDepartmentCounts = async () => {
    setLoadingBatchCounts(true);
    setErrorBatchCounts('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.ADMIN_ALUMNI_DEPARTMENT_COUNT, {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch department counts');
      setBatchCounts(data);
    } catch (err) {
      setErrorBatchCounts(err.message);
    }
    setLoadingBatchCounts(false);
  };

  useEffect(() => {
    fetchAlumni();
    fetchPendingMentorships();
    fetchTopStudents();
    fetchHighlights();
    fetchAlumniPosts();
    fetchDepartmentCounts();
  }, []);

  // Check for activeSection in location state
  useEffect(() => {
    if (location.state && location.state.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location]);

  // Top Students CRUD (backend)
  const handleEditStudent = (student) => {
    setEditStudent(student);
    setStudentForm({ ...student });
    setAddMode(false);
  };
  const handleDeleteStudent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.ADMIN_TOP_STUDENTS}/${id}`, {
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
    setStudentForm({ name: '', company: '', package: '', batch: '', department: '', photo: '' });
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
        const res = await fetch(API_ENDPOINTS.ADMIN_TOP_STUDENTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify(studentForm),
        });
        if (!res.ok) throw new Error('Failed to add student');
        setSuccess('Student added!');
      } else {
        const res = await fetch(`${API_ENDPOINTS.ADMIN_TOP_STUDENTS}/${editStudent._id}`, {
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
      const res = await fetch(API_ENDPOINTS.ADMIN_PLACEMENT_HIGHLIGHTS, {
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
      const res = await fetch(`${API_ENDPOINTS.ADMIN_ALUMNI}/${deleteId}`, {
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
      const res = await fetch(API_ENDPOINTS.ADMIN_TOP_STUDENTS_UPLOAD, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to upload photo');
      setStudentForm((prev) => ({ ...prev, photo: `${API_BASE_URL}${data.url}` }));
    } catch (err) {
      setErrorTop(err.message);
    }
    setUploadingPhoto(false);
  };

  // Remove the search bar and related filtering logic from the top students section.
  // Delete the studentSearch state, the TextField for search, and use topStudents directly for display.

  const DEPARTMENTS = [
    { code: 'CSE', name: 'Computer Science' },
    { code: 'ECE', name: 'Electronics & Comm.' },
    { code: 'IT', name: 'Information Tech.' },
    { code: 'CIVIL', name: 'Civil' },
    { code: 'MECH', name: 'Mechanical' },
    { code: 'EEE', name: 'Electrical & Electronics' },
  ];

  // Handler to update message
  const handleAdminMessageChange = (id, value) => {
    setAdminMessages(prev => ({ ...prev, [id]: value }));
  };
  // Handler to update proposed dates
  const handleProposedDateChange = (id, idx, value) => {
    setProposedDates(prev => ({
      ...prev,
      [id]: prev[id] ? prev[id].map((d, i) => (i === idx ? value : d)) : [value]
    }));
  };
  // Handler to add a new date field
  const handleAddDateField = (id) => {
    setProposedDates(prev => ({
      ...prev,
      [id]: prev[id] ? [...prev[id], ''] : ['']
    }));
  };
  // Handler to send message and dates
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
      fetchPendingMentorships();
      setAdminMessages(prev => ({ ...prev, [mentorshipId]: '' }));
      setProposedDates(prev => ({ ...prev, [mentorshipId]: [] }));
    } catch (err) {
      setErrorMentorships(err.message);
    }
    setSendingMessage(prev => ({ ...prev, [mentorshipId]: false }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - 240px)` },
          ml: { md: `240px` },
          display: { md: 'none' },
          background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              fontWeight: 600,
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <AdminPanelSettingsIcon sx={{ mr: 1 }} /> Admin Panel
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
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 }, 
          pt: { xs: 8, md: 4 }, 
          background: 'linear-gradient(135deg, #f0f7ff 0%, #f5f9ff 100%)', 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%231976d2\' fill-opacity=\'0.03\'%3E%3Cpath opacity=\'.5\' d=\'M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : null}
        {success ? (
          <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
            <Alert severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          </Snackbar>
        ) : null}
        
        {/* Render content based on active section */}
        {activeSection === 'dashboard' ? (
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)', 
                p: 4, 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', 
                mb: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 30px rgba(149, 157, 165, 0.3)',
                  transform: 'translateY(-5px)'
                } 
              }}>
                <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
                  Dashboard 
                </Typography>
              </Card>

              {/* Department-wise Alumni Counts - Visualization Graph */}
              <Card sx={{ 
                borderRadius: 6, 
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', 
                p: 3, 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
                mb: 4,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)'
                }
              }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    pb: 2,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                  }}>
                    <Box 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(45deg, #3a36db, #5d34ec)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 8px 16px rgba(58, 54, 219, 0.3)',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            boxShadow: '0 0 0 0 rgba(58, 54, 219, 0.4)'
                          },
                          '70%': {
                            boxShadow: '0 0 0 10px rgba(58, 54, 219, 0)'
                          },
                          '100%': {
                            boxShadow: '0 0 0 0 rgba(58, 54, 219, 0)'
                          }
                        }
                      }}
                    >
                      <BarChartIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Typography 
                      variant="h5" 
                      fontWeight={700} 
                      sx={{ 
                        background: 'linear-gradient(90deg, #3a36db, #5d34ec)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 10px rgba(58, 54, 219, 0.1)'
                      }}
                    >
                      Department-wise Alumni Counts
                    </Typography>
                  </Box>
                  {loadingBatchCounts ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
                  ) : errorBatchCounts ? (
                    <Alert severity="error">{errorBatchCounts}</Alert>
                  ) : (
                    <Box>
                      {/* Bar Chart Visualization */}
                      <Box sx={{ height: 400, width: '100%', mb: 4 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={(() => {
                              // All departments that should be displayed
                              const allDepartments = [
                                { id: 'CSE', name: 'CSE' },
                                { id: 'ECE', name: 'ECE' },
                                { id: 'EEE', name: 'EEE' },
                                { id: 'MECH', name: 'Mech' },
                                { id: 'CIVIL', name: 'Civil' }
                              ];
                              
                              // Create a map of existing department counts
                              const countMap = {};
                              batchCounts.forEach(dept => {
                                countMap[dept._id] = dept.count;
                              });
                              
                              // Create data for the chart
                              return allDepartments.map(dept => ({
                                name: dept.name,
                                count: countMap[dept.id] || 0,
                                fill: dept.name === 'CSE' ? '#1976d2' : 
                                      dept.name === 'ECE' ? '#2E7D32' :
                                      dept.name === 'EEE' ? '#F57F17' :
                                      dept.name === 'Mech' ? '#C62828' : '#4527A0'
                              }));
                            })()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value, name) => [`${value} Alumni`, 'Count']}
                              labelStyle={{ fontWeight: 'bold', color: '#333' }}
                              contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: 8,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                border: 'none'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="count" name="Alumni Count" fill="#1976d2" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                      
                      {/* Card Display */}
                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        {(() => {
                          // All departments that should be displayed
                          const allDepartments = [
                            { id: 'CSE', name: 'CSE' },
                            { id: 'ECE', name: 'ECE' },
                            { id: 'EEE', name: 'EEE' },
                            { id: 'MECH', name: 'Mech' },
                            { id: 'CIVIL', name: 'Civil' }
                          ];
                          
                          // Create a map of existing department counts
                          const countMap = {};
                          batchCounts.forEach(dept => {
                            countMap[dept._id] = dept.count;
                          });
                          
                          // Define colors for cards
                          const bgColors = [
                            '#FFF9C4', // Light Yellow
                            '#C8E6C9', // Light Green
                            '#FFCDD2', // Light Red
                            '#BBDEFB', // Light Blue
                            '#D1C4E9', // Light Purple
                          ];
                          
                          const textColors = [
                            '#F57F17', // Dark Yellow
                            '#2E7D32', // Dark Green
                            '#C62828', // Dark Red
                            '#1565C0', // Dark Blue
                            '#4527A0', // Dark Purple
                          ];
                          
                          // Return department cards with counts (0 if no alumni)
                          return allDepartments.map((dept, index) => {
                            const colorIndex = index % bgColors.length;
                            return (
                              <Grid item xs={12} sm={6} md={2.4} key={dept.id}>
                                <Card 
                                  sx={{ 
                                    borderRadius: 4, 
                                    background: `linear-gradient(135deg, ${bgColors[colorIndex]} 0%, rgba(255,255,255,0.8) 100%)`,
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                                    width: 170,
                                    height: 170, // Fixed height for all cards
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 0,
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                      transform: 'translateY(-5px)',
                                      boxShadow: `0 12px 25px rgba(${textColors[colorIndex].replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.2)`
                                    }
                                  }}
                                >
                                  <Typography 
                                    variant="h1" 
                                    fontWeight={800} 
                                    sx={{ 
                                      background: `linear-gradient(135deg, ${textColors[colorIndex]} 30%, rgba(0,0,0,0.7) 100%)`,
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                      fontSize: '4rem',
                                      lineHeight: 1,
                                      mb: 1,
                                      textShadow: `0 2px 10px rgba(${textColors[colorIndex].replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.2)`
                                    }}
                                  >
                                    {countMap[dept.id] || 0}
                                  </Typography>
                                  <Typography 
                                    variant="h6" 
                                    fontWeight={700}
                                    sx={{ 
                                      color: textColors[colorIndex],
                                      fontSize: '1.25rem',
                                      letterSpacing: '0.5px',
                                      textShadow: `0 1px 3px rgba(${textColors[colorIndex].replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.1)`
                                    }}
                                  >
                                    {dept.name}
                                  </Typography>
                                </Card>
                              </Grid>
                            );
                          });
                        })()} 
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
              
              {/* NovaILE AI Analytics Dashboard */}
              <Card 
                sx={{ 
                  borderRadius: 6, 
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', 
                  p: 3, 
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
                  mb: 4,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(45deg, #3a36db, #5d34ec)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 8px 16px rgba(58, 54, 219, 0.3)',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            boxShadow: '0 0 0 0 rgba(58, 54, 219, 0.4)'
                          },
                          '70%': {
                            boxShadow: '0 0 0 10px rgba(58, 54, 219, 0)'
                          },
                          '100%': {
                            boxShadow: '0 0 0 0 rgba(58, 54, 219, 0)'
                          }
                        }
                      }}
                    >
                      <AdminPanelSettingsIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Typography 
                      variant="h5" 
                      fontWeight={700} 
                      sx={{ 
                        background: 'linear-gradient(90deg, #3a36db, #5d34ec)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 10px rgba(58, 54, 219, 0.1)'
                      }}
                    >
                      NovaILE AI Analytics
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {/* AI Insights Card */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ 
                        borderRadius: 4, 
                        boxShadow: '0 10px 30px rgba(31, 38, 135, 0.15)',
                        p: 3,
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 242, 245, 0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 15px 35px rgba(31, 38, 135, 0.2)'
                        }
                      }}>
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          sx={{ 
                            background: 'linear-gradient(90deg, #3a36db, #5d34ec)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1
                          }}
                        >
                          <InsightsIcon sx={{ mr: 1, color: '#3a36db' }} />
                          AI-Powered Insights
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Chip 
                              icon={<TrendingUpIcon />} 
                              label="Trending" 
                              size="small" 
                              sx={{ 
                                background: 'linear-gradient(90deg, rgba(25, 118, 210, 0.2), rgba(66, 165, 245, 0.2))', 
                                color: '#1976d2',
                                fontWeight: 600,
                                mr: 1,
                                border: '1px solid rgba(25, 118, 210, 0.2)',
                                boxShadow: '0 2px 5px rgba(25, 118, 210, 0.1)',
                                '&:hover': {
                                  background: 'linear-gradient(90deg, rgba(25, 118, 210, 0.3), rgba(66, 165, 245, 0.3))',
                                  boxShadow: '0 3px 8px rgba(25, 118, 210, 0.15)'
                                }
                              }} 
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              CSE department shows highest growth rate
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Chip 
                              icon={<InsightsIcon />} 
                              label="Insight" 
                              size="small" 
                              sx={{ 
                                background: 'linear-gradient(90deg, rgba(46, 125, 50, 0.2), rgba(76, 175, 80, 0.2))', 
                                color: '#2E7D32',
                                fontWeight: 600,
                                mr: 1,
                                border: '1px solid rgba(46, 125, 50, 0.2)',
                                boxShadow: '0 2px 5px rgba(46, 125, 50, 0.1)',
                                '&:hover': {
                                  background: 'linear-gradient(90deg, rgba(46, 125, 50, 0.3), rgba(76, 175, 80, 0.3))',
                                  boxShadow: '0 3px 8px rgba(46, 125, 50, 0.15)'
                                }
                              }} 
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Alumni engagement increased by 27% this month
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Chip 
                              icon={<RecommendIcon />} 
                              label="Recommendation" 
                              size="small" 
                              sx={{ 
                                background: 'linear-gradient(90deg, rgba(245, 127, 23, 0.2), rgba(255, 167, 38, 0.2))', 
                                color: '#F57F17',
                                fontWeight: 600,
                                mr: 1,
                                border: '1px solid rgba(245, 127, 23, 0.2)',
                                boxShadow: '0 2px 5px rgba(245, 127, 23, 0.1)',
                                '&:hover': {
                                  background: 'linear-gradient(90deg, rgba(245, 127, 23, 0.3), rgba(255, 167, 38, 0.3))',
                                  boxShadow: '0 3px 8px rgba(245, 127, 23, 0.15)'
                                }
                              }} 
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Consider organizing networking event for ECE alumni
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                    
                    {/* Real-time Metrics */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ 
                        borderRadius: 4, 
                        boxShadow: '0 10px 30px rgba(31, 38, 135, 0.15)',
                        p: 3,
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 242, 245, 0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 15px 35px rgba(31, 38, 135, 0.2)'
                        }
                      }}>
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          sx={{ 
                            background: 'linear-gradient(90deg, #3a36db, #5d34ec)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1
                          }}
                        >
                          <TimelineIcon sx={{ mr: 1, color: '#3a36db' }} />
                          Real-time Metrics
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0.05) 100%)',
                                textAlign: 'center',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 6px 15px rgba(25, 118, 210, 0.15)'
                                }
                              }}>
                                <Typography variant="h3" fontWeight={700} color="primary">
                                  {batchCounts.reduce((total, dept) => total + dept.count, 0)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                  Total Alumni
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.15) 0%, rgba(46, 125, 50, 0.05) 100%)',
                                textAlign: 'center',
                                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.1)',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 6px 15px rgba(46, 125, 50, 0.15)'
                                }
                              }}>
                                <Typography variant="h3" fontWeight={700} sx={{ color: '#2E7D32' }}>
                                  {topStudents.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                  Top Performers
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                background: 'linear-gradient(135deg, rgba(245, 127, 23, 0.15) 0%, rgba(245, 127, 23, 0.05) 100%)',
                                textAlign: 'center',
                                boxShadow: '0 4px 12px rgba(245, 127, 23, 0.1)',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 6px 15px rgba(245, 127, 23, 0.15)'
                                }
                              }}>
                                <Typography variant="h3" fontWeight={700} sx={{ color: '#F57F17' }}>
                                  {posts.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                  Alumni Posts
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                background: 'linear-gradient(135deg, rgba(198, 40, 40, 0.15) 0%, rgba(198, 40, 40, 0.05) 100%)',
                                textAlign: 'center',
                                boxShadow: '0 4px 12px rgba(198, 40, 40, 0.1)',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 6px 15px rgba(198, 40, 40, 0.15)'
                                }
                              }}>
                                <Typography variant="h3" fontWeight={700} sx={{ color: '#C62828' }}>
                                  {events.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                  Active Events
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      ) : activeSection === 'students' ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                borderRadius: 6, 
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', 
                p: 3, 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(45deg, #3a36db, #5d34ec)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 8px 16px rgba(58, 54, 219, 0.3)'
                      }}
                    >
                      <EmojiEventsIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Typography 
                      variant="h5" 
                      fontWeight={700} 
                      sx={{ 
                        background: 'linear-gradient(90deg, #3a36db, #5d34ec)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 10px rgba(58, 54, 219, 0.1)'
                      }}
                    >
                      Top Alumni
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    onClick={handleAddStudent}
                    sx={{
                      background: 'linear-gradient(90deg, #3a36db, #5d34ec)',
                      boxShadow: '0 4px 10px rgba(58, 54, 219, 0.3)',
                      borderRadius: 2,
                      px: 3,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #5d34ec, #3a36db)',
                        boxShadow: '0 6px 15px rgba(58, 54, 219, 0.4)'
                      }
                    }}
                  >
                    <AddIcon sx={{ mr: 1 }} /> Add Student
                  </Button>
                </Box>
                {loadingTop ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
                ) : errorTop ? (
                  <Alert severity="error">{errorTop}</Alert>
                ) : (
                  <Grid container spacing={3}>
                    {topStudents.map((student) => (
                      <Grid item xs={12} sm={6} md={3} key={student._id}>
                        <Card sx={{ 
                          borderRadius: 4, 
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', 
                          p: 2, 
                          textAlign: 'center', 
                          position: 'relative',
                          background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 25px rgba(0, 0, 0, 0.15)'
                          }
                        }}>
                          <Avatar 
                            src={student.photo} 
                            sx={{ 
                              width: 80, 
                              height: 80, 
                              mx: 'auto', 
                              mb: 2,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: '3px solid #fff'
                            }} 
                          />
                          <Typography fontWeight={700} variant="h6" sx={{ mb: 0.5 }}>{student.name}</Typography>
                          <Chip 
                            label={student.company} 
                            color="primary" 
                            size="small" 
                            sx={{ 
                              my: 1,
                              background: 'linear-gradient(90deg, #3a36db, #5d34ec)',
                              fontWeight: 600,
                              boxShadow: '0 2px 5px rgba(58, 54, 219, 0.2)'
                            }} 
                          />
                          <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>Package: <b>{student.package}</b></Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Batch: {student.batch}</Typography>
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              onClick={() => handleEditStudent(student)}
                              sx={{ 
                                borderRadius: 2,
                                borderColor: '#3a36db',
                                color: '#3a36db',
                                '&:hover': {
                                  borderColor: '#3a36db',
                                  backgroundColor: 'rgba(58, 54, 219, 0.05)'
                                }
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error" 
                              onClick={() => handleDeleteStudent(student._id)}
                              sx={{ 
                                borderRadius: 2,
                                '&:hover': {
                                  backgroundColor: 'rgba(211, 47, 47, 0.05)'
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : activeSection === 'highlights' ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff' }}>
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
      ) : activeSection === 'posts' ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff' }}>
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
        </Grid>
      ) : activeSection === 'donations' ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff' }}>
              <CardContent>
                <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
                  Donations Management
                </Typography>
                <Typography variant="body1" paragraph>
                  This section allows you to manage alumni donations. You can view, add, edit, and delete donation records.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/admin-donations');
                  }}
                  startIcon={<DonationIcon />}
                  sx={{ mt: 2 }}
                >
                  Go to Donations Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : activeSection === 'events' ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff' }}>
              <CardContent>
                <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
                  Events Management
                </Typography>
                <Typography variant="body1" paragraph>
                  This section allows you to manage networking events. You can create, edit, and delete events, as well as manage registrations.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/networking-events');
                  }}
                  startIcon={<EventIcon />}
                  sx={{ mt: 2 }}
                >
                  Go to Events Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : activeSection === 'alumni' ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 6, boxShadow: 6, p: 3, background: '#fff' }}>
              <CardContent>
                <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
                  Alumni Management
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    label="Search by name, batch, company, or LinkedIn"
                    value={alumniSearch}
                    onChange={e => setAlumniSearch(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ width: 320 }}
                  />
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Batch</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>LinkedIn</TableCell>
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
                            {alum.linkedin ? (
                              <a href={alum.linkedin} target="_blank" rel="noopener noreferrer">{alum.linkedin}</a>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(alum._id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      {/* Edit/Add Student Modal */}
      <Dialog open={!!editStudent || addMode} onClose={() => { setEditStudent(null); setAddMode(false); }}>
        <DialogTitle>{addMode ? 'Add Student' : 'Edit Student'}</DialogTitle>
        <form onSubmit={handleStudentFormSave}>
          <DialogContent>
            <TextField label="Name" name="name" value={studentForm.name} onChange={handleStudentFormChange} fullWidth margin="dense" required />
            <TextField label="Company" name="company" value={studentForm.company} onChange={handleStudentFormChange} fullWidth margin="dense" required />
            <TextField label="Package" name="package" value={studentForm.package} onChange={handleStudentFormChange} fullWidth margin="dense" required />
            <TextField label="Batch" name="batch" value={studentForm.batch} onChange={handleStudentFormChange} fullWidth margin="dense" required />
            <TextField
              select
              label="Department"
              name="department"
              value={studentForm.department}
              onChange={handleStudentFormChange}
              fullWidth
              margin="dense"
              required
            >
              {DEPARTMENTS.map((dept) => (
                <MenuItem key={dept.code} value={dept.code}>{dept.name}</MenuItem>
              ))}
            </TextField>
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
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this alumni?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
    </Box>
  );
}

export default AdminDashboard;