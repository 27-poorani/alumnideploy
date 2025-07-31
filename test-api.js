// Simple API Test Script
// Run this in your browser console or as a Node.js script to test your API endpoints

const API_BASE_URL = 'https://your-backend-url.onrender.com'; // Replace with your actual backend URL

const testEndpoints = async () => {
  console.log('Testing API endpoints...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    console.log('Health check:', healthResponse.ok ? '✅ PASS' : '❌ FAIL');
    
    // Test public endpoints
    const topStudentsResponse = await fetch(`${API_BASE_URL}/api/top-students`);
    console.log('Top Students:', topStudentsResponse.ok ? '✅ PASS' : '❌ FAIL');
    
    const highlightsResponse = await fetch(`${API_BASE_URL}/api/placement-highlights`);
    console.log('Placement Highlights:', highlightsResponse.ok ? '✅ PASS' : '❌ FAIL');
    
    const alumniPostsResponse = await fetch(`${API_BASE_URL}/api/alumni/posts`);
    console.log('Alumni Posts:', alumniPostsResponse.ok ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n✅ All public endpoints tested!');
    console.log('\nTo test protected endpoints, you need to:');
    console.log('1. Register/login to get a token');
    console.log('2. Include the token in the Authorization header');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
};

// Run the test
testEndpoints(); 