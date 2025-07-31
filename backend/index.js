const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/alumni', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
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
  res.send('Alumni Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 