import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Details from './pages/Details';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { Box } from '@mui/material';

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
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
