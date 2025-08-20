// Simple test script that doesn't require external dependencies
const http = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test login function
function testLogin() {
  console.log('Testing login functionality...');
  
  // Test admin login
  console.log('\nTesting admin login:');
  
  const data = JSON.stringify({
    email: 'admin',
    password: '123'
  });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  
  const req = http.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers));
    
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(responseData);
        console.log('Response:', JSON.stringify(parsedData, null, 2));
        
        if (res.statusCode === 200) {
          console.log('Admin login successful!');
        } else {
          console.log('Admin login failed!');
        }
      } catch (e) {
        console.error('Error parsing response:', e.message);
        console.log('Raw response:', responseData);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('Error during test:', error.message);
  });
  
  req.write(data);
  req.end();
}

// Run the test
testLogin();