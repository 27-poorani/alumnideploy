// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // Alumni endpoints
  ALUMNI_DASHBOARD: `${API_BASE_URL}/api/alumni/dashboard`,
  ALUMNI_EVENTS: `${API_BASE_URL}/api/alumni/events`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/alumni/profile`,
  UPLOAD_PHOTO: `${API_BASE_URL}/api/alumni/photo`,
  
  // Admin endpoints
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  TOP_STUDENTS: `${API_BASE_URL}/api/top-students`,
  PLACEMENT_HIGHLIGHTS: `${API_BASE_URL}/api/placement-highlights`,
  
  // Uploads
  UPLOADS: `${API_BASE_URL}/uploads`
};

export default API_BASE_URL; 