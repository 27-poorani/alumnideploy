const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Environment variables test:');
console.log('JWT_SECRET defined:', process.env.JWT_SECRET ? 'Yes' : 'No');
console.log('MONGO_URI defined:', process.env.MONGO_URI ? 'Yes' : 'No');

// Try to sign a token
try {
  const payload = { test: 'test' };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret-for-testing');
  console.log('JWT token generation successful:', token.substring(0, 20) + '...');
} catch (error) {
  console.error('JWT token generation failed:', error.message);
}