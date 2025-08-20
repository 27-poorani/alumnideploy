# Fixed Issues

## JWT Authentication Issue

### Problem
The login endpoint was returning a 500 Internal Server Error when attempting to log in with admin credentials. This was preventing users from accessing the application.

### Root Cause
The issue was identified in the admin user creation process. The User model requires a `department` field, but this field was not being provided when creating the admin user during the login process.

### Solution
1. Added the required `department` field to the admin user creation in `routes/auth.js`:
   ```javascript
   adminUser = new User({
     name: 'Admin',
     email: 'admin@alumni.com',
     password: hashedPassword,
     role: 'admin',
     department: 'Administration' // Added this field
   });
   ```

2. Fixed a duplicate prefix in the MongoDB connection string in the `.env` file:
   ```
   // Changed from
   MONGO_URI=MONGO_URI=mongodb+srv://...
   
   // To
   MONGO_URI=mongodb+srv://...
   ```

3. Added better error logging to help diagnose similar issues in the future.

### Deployment Notes
When deploying to Render.com, ensure that the environment variables are correctly set and that any changes to the User model are reflected in the admin user creation process.