import React, { useState } from 'react';
import { Box, Typography, Chip, Button, Alert, CircularProgress } from '@mui/material';
import { format } from 'date-fns';

function MentorshipAdminMessage({ mentorship, onDateSelected, refreshMentorships }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Debug log to check if finalThanked is being passed correctly
  console.log('MentorshipAdminMessage - mentorship:', mentorship);
  console.log('MentorshipAdminMessage - finalThanked:', mentorship?.finalThanked);

  // Check if this mentorship has admin message and proposed dates
  const hasAdminMessage = mentorship?.adminMessage && mentorship?.proposedDates?.length > 0;
  
  // Check if alumni has already selected a date
  const hasSelectedDate = mentorship?.selectedDate;

  const handleDateSelect = async () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/mentorship/${mentorship._id}/select-date`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ selectedDate })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to select date');
      
      setSuccess('Date selected successfully!');
      if (refreshMentorships) refreshMentorships();
      if (onDateSelected) onDateSelected(selectedDate);
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  if (!hasAdminMessage) return null;

  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f9ff', borderRadius: 2, border: '1px solid #e0e9f7' }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Message from Admin
      </Typography>
      
      <Typography variant="body1" paragraph>
        {mentorship.adminMessage}
      </Typography>
      
      {hasSelectedDate ? (
        <Box>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            You've selected a date:
          </Typography>
          <Chip 
            label={format(new Date(mentorship.selectedDate), 'MMMM d, yyyy')} 
            color="success" 
            sx={{ mt: 1 }}
          />
          {mentorship.finalThanked ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              The admin has sent a final thank you message. Your mentorship program is now complete!
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              Waiting for admin to send a final thank you message.
            </Alert>
          )}
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Please select one of the proposed dates:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
            {mentorship.proposedDates.map((date, idx) => (
              <Chip 
                key={idx} 
                label={format(new Date(date), 'MMMM d, yyyy')} 
                onClick={() => setSelectedDate(date)}
                color={selectedDate === date ? 'primary' : 'default'}
                variant={selectedDate === date ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleDateSelect}
            disabled={loading || !selectedDate}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm Selected Date'}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default MentorshipAdminMessage;