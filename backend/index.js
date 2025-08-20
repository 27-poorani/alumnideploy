const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://alumni-frontend-y63v.onrender.com', 'https://alumni-frontend-wg4d.onrender.com', 'https://alumni-portal-frontend.vercel.app', 'http://localhost:3000'] // Updated frontend URLs
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

// MongoDB connection with your provided connection string
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const alumniRoutes = require('./routes/alumni');
const adminRoutes = require('./routes/admin');
const topStudentsRoutes = require('./routes/topStudents');
const placementHighlightsRoutes = require('./routes/placementHighlights');

// Import feature routes
const mentorshipRoutes = require('./routes/mentorship');
const networkingEventsRoutes = require('./routes/networkingEvents');
const donationsRoutes = require('./routes/donations');

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/top-students', topStudentsRoutes);
app.use('/api/admin/top-students', topStudentsRoutes);
app.use('/api/placement-highlights', placementHighlightsRoutes);
app.use('/api/admin/placement-highlights', placementHighlightsRoutes);

// Apply feature routes
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/networking-events', networkingEventsRoutes);
app.use('/api/donations', donationsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Alumni Backend API is running' });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Handle 404 errors with JSON response
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});