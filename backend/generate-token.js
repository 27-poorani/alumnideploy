const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check if JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// Create a payload for the token with a real user ID
const payload = {
  // Using a real user ID from the database
  id: '688af5786989fcae0c855e8e', // SRI ANNAPOORANI S (alumni)
  role: 'alumni'
};

// Generate the token
const token = jwt.sign(
  payload,
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

console.log('Generated token:');
console.log(token);

// Also generate an admin token
const adminPayload = {
  id: '68a5f942dbd42d3fc18cf05f', // Admin user
  role: 'admin'
};

const adminToken = jwt.sign(
  adminPayload,
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

console.log('\nGenerated admin token:');
console.log(adminToken);