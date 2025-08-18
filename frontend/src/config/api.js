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
  UPLOAD_PHOTO: `${API_BASE_URL}/api/alumni/upload-photo`,
  ALUMNI_DETAILS: `${API_BASE_URL}/api/alumni/details`,
  ALUMNI_POSTS: `${API_BASE_URL}/api/alumni/posts`,
  ALUMNI_POST: `${API_BASE_URL}/api/alumni/post`,
  ALUMNI_POST_ATTACHMENT: `${API_BASE_URL}/api/alumni/post/upload-attachment`,
  
  // Admin endpoints
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_ALUMNI: `${API_BASE_URL}/api/admin/alumni`,
  ADMIN_ALUMNI_DEPARTMENT_COUNT: `${API_BASE_URL}/api/admin/alumni/department-count`,
  ADMIN_TOP_STUDENTS: `${API_BASE_URL}/api/admin/top-students`,
  ADMIN_PLACEMENT_HIGHLIGHTS: `${API_BASE_URL}/api/admin/placement-highlights`,
  ADMIN_POSTS: `${API_BASE_URL}/api/admin/posts`,
  ADMIN_EVENTS: `${API_BASE_URL}/api/admin/events`,
  ADMIN_TOP_STUDENTS_UPLOAD: `${API_BASE_URL}/api/admin/top-students/upload-photo`,
  ADMIN_MENTORSHIPS_PENDING: 'http://localhost:5000/api/mentorship/admin/pending',
  ADMIN_MENTORSHIPS_APPROVE: 'http://localhost:5000/api/mentorship',
  ADMIN_NETWORKING_EVENTS: `${API_BASE_URL}/api/admin/networking-events`,
  ADMIN_NETWORKING_EVENTS_PUBLISH: `${API_BASE_URL}/api/admin/networking-events`,
  ADMIN_NETWORKING_EVENTS_ALL: `${API_BASE_URL}/api/networking-events/admin/all`,
  
  // Public endpoints
  TOP_STUDENTS: `${API_BASE_URL}/api/top-students`,
  PLACEMENT_HIGHLIGHTS: `${API_BASE_URL}/api/placement-highlights`,
  
  // Mentorship endpoints
  MENTORSHIPS: `${API_BASE_URL}/api/mentorship`,
  MENTORSHIPS_FEATURED: `${API_BASE_URL}/api/mentorship/featured`,
  MENTORSHIPS_USER_MENTOR: `${API_BASE_URL}/api/mentorship/user/mentor`,
  MENTORSHIPS_USER_MENTEE: `${API_BASE_URL}/api/mentorship/user/mentee`,
  MENTORSHIPS_ADMIN_PENDING: `${API_BASE_URL}/api/mentorship/admin/pending`,
  
  // Networking Events endpoints
  NETWORKING_EVENTS: `${API_BASE_URL}/api/networking-events`,
  NETWORKING_EVENTS_MY: `${API_BASE_URL}/api/networking-events/my`,
  NETWORKING_EVENTS_MY_RSVPS: `${API_BASE_URL}/api/networking-events/my-rsvps`,
  NETWORKING_EVENTS_NOTIFICATIONS: `${API_BASE_URL}/api/networking-events/notifications`,
  NETWORKING_EVENTS_UPLOAD_IMAGE: `${API_BASE_URL}/api/networking-events/upload-image`,
  
  // Uploads
  UPLOADS: `${API_BASE_URL}/uploads`
};

export default API_BASE_URL;