import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Details from './pages/Details';
import Mentorship from './pages/Mentorship';
import NetworkingEvents from './pages/NetworkingEvents';
import Department from './pages/Department';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { Box } from '@mui/material';
import AdminMentorMessages from './pages/AdminMentorMessages';
import Donation from './pages/Donation';
import AdminDonations from './pages/AdminDonations';

function App() {
  return (
    <Router>
      <Navigation />
      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="alumni">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/details" 
            element={
              <ProtectedRoute requiredRole="alumni">
                <Details />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentorship" 
            element={
              <ProtectedRoute>
                <Mentorship />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/networking-events" 
            element={
              <ProtectedRoute>
                <NetworkingEvents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-mentor-messages" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminMentorMessages />
              </ProtectedRoute>
            } 
          />
          <Route path="/department/:dept" element={<Department />} />
          <Route 
            path="/donation" 
            element={
              <ProtectedRoute requiredRole="alumni">
                <Donation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-donations" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDonations />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
