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
    ? ['https://alumni-frontend-xsvh.onrender.com'] // Replace with your actual frontend URL
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection with your provided connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sriannapoorani05:sap@cluster0.4oaleij.mongodb.net/alumni?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const alumniRoutes = require('./routes/alumni');
const adminRoutes = require('./routes/admin');
const topStudentsRoutes = require('./routes/topStudents');
const placementHighlightsRoutes = require('./routes/placementHighlights');

app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/top-students', topStudentsRoutes);
app.use('/api/admin/top-students', topStudentsRoutes);
app.use('/api/placement-highlights', placementHighlightsRoutes);
app.use('/api/admin/placement-highlights', placementHighlightsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Alumni Backend API is running' });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 