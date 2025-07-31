import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLogin = new URLSearchParams(location.search).get('admin') === 'true';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      window.dispatchEvent(new Event('authChange'));
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)' }}>
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom align="center">
            {isAdminLogin ? 'Admin Login' : 'Login'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Email or Username" name="email" type="text" value={form.email} onChange={handleChange} required fullWidth margin="normal" />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth margin="normal" />
            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login; 