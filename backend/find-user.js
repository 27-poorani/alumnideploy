const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected');
  findUsers();
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

async function findUsers() {
  try {
    // Find all users
    const users = await User.find().select('_id name email role');
    
    if (users.length === 0) {
      console.log('No users found in the database');
    } else {
      console.log(`Found ${users.length} users:`);
      users.forEach(user => {
        console.log(`ID: ${user._id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }
  } catch (err) {
    console.error('Error finding users:', err.message);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}