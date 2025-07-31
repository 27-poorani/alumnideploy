import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Registration failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      window.dispatchEvent(new Event('authChange'));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)' }}>
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom align="center">
            Alumni Registration
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth margin="normal" />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth margin="normal" />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth margin="normal" />
            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button 
                  component={Link} 
                  to="/login" 
                  color="primary" 
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  Login
                </Button>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register; 