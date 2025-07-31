import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

function Navigation() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role')
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role')
      });
    };

    const handleAuthChange = () => {
      setAuthState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role')
      });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const token = authState.token;
  const role = authState.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthState({ token: null, role: null });
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <SchoolIcon sx={{ mr: 1, color: '#1976d2' }} />
        <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
          VCET Connect
        </Typography>
        
        {/* Always show Home */}
        <Button color="primary" component={Link} to="/" sx={{ mx: 1 }}>
          Home
        </Button>

        {/* Show Register and Login only when not authenticated */}
        {!token && (
          <>
            <Button color="primary" component={Link} to="/register" sx={{ mx: 1 }}>
              Register
            </Button>
            <Button color="primary" component={Link} to="/login" sx={{ mx: 1 }}>
              Login
            </Button>
          </>
        )}

        {/* Show Dashboard and Profile for authenticated alumni */}
        {token && role === 'alumni' && (
          <>
            <Button color="primary" component={Link} to="/dashboard" sx={{ mx: 1 }}>
              Dashboard
            </Button>
            <Button color="primary" component={Link} to="/details" sx={{ mx: 1 }}>
              Profile
            </Button>
          </>
        )}

        {/* Show Admin Dashboard for admin users */}
        {token && role === 'admin' && (
          <Button color="primary" component={Link} to="/admin" sx={{ mx: 1 }}>
            Admin Dashboard
          </Button>
        )}

        {/* Show Logout for authenticated users */}
        {token && (
          <Button color="error" onClick={handleLogout} sx={{ mx: 1 }}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation; 