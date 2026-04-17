const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ===================== CORS CONFIG (FIXED) ===================== */
app.use(cors({
  origin: (origin, callback) => {
    console.log("Incoming origin:", origin);

    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    // ✅ Allow ALL localhost (any port)
    if (
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1')
    ) {
      return callback(null, true);
    }

    // ✅ Allow deployed frontends
    if (
      origin === 'https://alumni-frontend-suwe.onrender.com' ||
      origin === 'https://alumni-portal-frontend.vercel.app'
    ) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error(`CORS not allowed: ${origin}`));
  },
  credentials: true
}));

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

/* ===================== DATABASE ===================== */
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

/* ===================== ROUTES ===================== */
const authRoutes = require('./routes/auth');
const alumniRoutes = require('./routes/alumni');
const adminRoutes = require('./routes/admin');
const topStudentsRoutes = require('./routes/topStudents');
const placementHighlightsRoutes = require('./routes/placementHighlights');

const mentorshipRoutes = require('./routes/mentorship');
const networkingEventsRoutes = require('./routes/networkingEvents');
const donationsRoutes = require('./routes/donations');

app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/top-students', topStudentsRoutes);
app.use('/api/admin/top-students', topStudentsRoutes);

app.use('/api/placement-highlights', placementHighlightsRoutes);
app.use('/api/admin/placement-highlights', placementHighlightsRoutes);

app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/networking-events', networkingEventsRoutes);
app.use('/api/donations', donationsRoutes);

/* ===================== ROOT ===================== */
app.get('/', (req, res) => {
  res.json({ message: 'Alumni Backend API is running' });
});

/* ===================== HEALTH ===================== */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/* ===================== ERROR HANDLER (CORS SAFE) ===================== */
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  // ✅ Ensure CORS headers even on error
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");

  res.status(500).json({
    msg: err.message
  });
});

/* ===================== 404 ===================== */
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

/* ===================== SERVER ===================== */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});