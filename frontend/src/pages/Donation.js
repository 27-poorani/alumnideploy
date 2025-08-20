import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';
import { API_ENDPOINTS } from '../config/api';

function Donation() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalDonated, setTotalDonated] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    purpose: '',
    message: ''
  });

  // Payment data
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const steps = ['Donation Details', 'Payment Information', 'Confirmation'];

  // Removed drawerItems as we're using the SideNav component now
  
  // Function to fetch total donated amount
  const fetchTotalDonated = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch(API_ENDPOINTS.DONATIONS_STATS);
      
      if (response.ok) {
        const data = await response.json();
        setTotalDonated(data.totalAmount);
      } else {
        console.error('Failed to fetch total donations');
      }
    } catch (err) {
      console.error('Error fetching total donations:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch total donated amount on component mount
  useEffect(() => {
    fetchTotalDonated();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate donation form
      if (!formData.name || !formData.email || !formData.amount || !formData.purpose) {
        setError('Please fill all required fields');
        return;
      }
      setError('');
    } else if (activeStep === 1) {
      // Validate payment form
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        setError('Please fill all payment details');
        return;
      }
      setError('');
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Ensure amount is a number
      const donationData = {
        ...formData,
        amount: Number(formData.amount), // Convert to number
        paymentDetails: {
          lastFourDigits: paymentData.cardNumber.slice(-4)
        },
        status: 'pending'
      };
      
      // Validate data before submission
      if (isNaN(donationData.amount)) {
        setError('Amount must be a valid number');
        setLoading(false);
        return;
      }
      
      console.log('Submitting donation data:', donationData);
      
      const response = await fetch(API_ENDPOINTS.DONATIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(donationData)
      });
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.msg || 'Failed to submit donation');
        }
        
        // Use the success message from the server if available
        setSuccess(data.msg || 'Your donation has been submitted successfully! Thank you for your generosity.');
        console.log('Donation created:', data.donation);
        
        // Refresh the total donated amount
        fetchTotalDonated();
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response. Please try again later.');
      }
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        amount: '',
        purpose: '',
        message: ''
      });
      setPaymentData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Donation Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Full Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="email"
                  name="email"
                  label="Email Address"
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  fullWidth
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="amount"
                  name="amount"
                  label="Donation Amount (₹)"
                  fullWidth
                  type="number"
                  value={formData.amount}
                  onChange={handleFormChange}
                  InputProps={{ inputProps: { min: 100 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="purpose-label">Donation Purpose</InputLabel>
                  <Select
                    labelId="purpose-label"
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    label="Donation Purpose"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="Scholarship Fund">Scholarship Fund</MenuItem>
                    <MenuItem value="Infrastructure Development">Infrastructure Development</MenuItem>
                    <MenuItem value="Research Programs">Research Programs</MenuItem>
                    <MenuItem value="Student Activities">Student Activities</MenuItem>
                    <MenuItem value="General Fund">General Fund</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="message"
                  name="message"
                  label="Message (Optional)"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Payment Details</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="cardNumber"
                  name="cardNumber"
                  label="Card Number"
                  fullWidth
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  inputProps={{ maxLength: 16 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="cardName"
                  name="cardName"
                  label="Name on Card"
                  fullWidth
                  value={paymentData.cardName}
                  onChange={handlePaymentChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="expiryDate"
                  name="expiryDate"
                  label="Expiry Date (MM/YY)"
                  fullWidth
                  value={paymentData.expiryDate}
                  onChange={handlePaymentChange}
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="cvv"
                  name="cvv"
                  label="CVV"
                  fullWidth
                  type="password"
                  value={paymentData.cvv}
                  onChange={handlePaymentChange}
                  inputProps={{ maxLength: 3 }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Donation Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{formData.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Email:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{formData.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Amount:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">₹{formData.amount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Purpose:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{formData.purpose}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Payment Method:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Credit Card ending in {paymentData.cardNumber.slice(-4)}</Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                By clicking "Complete Donation", you agree to process this payment and submit your donation.
              </Typography>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <SideNav title="Donations">
      <Container maxWidth="md" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary" fontWeight="bold">
          Make a Donation
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Your contribution helps support our alumni community and future generations of students.
        </Typography>
        
        {/* Display total donated amount */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 4,
            p: 2,
            bgcolor: 'primary.light',
            borderRadius: 2,
            color: 'white'
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Total Donations 
            
          </Typography>
          {loadingStats ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <Typography variant="h4" align="center" fontWeight="bold">
              ₹{totalDonated.toLocaleString()}
            </Typography>
          )}
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 2, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mt: 3, ml: 1 }}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 3, ml: 1 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Complete Donation'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ mt: 3, ml: 1 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
    </SideNav>
  );
}

export default Donation;