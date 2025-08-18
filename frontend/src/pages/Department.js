import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Grid, Avatar, Chip, CircularProgress, Alert, Fade, Grow, Paper } from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

const BATCH_RANGES = [
  { label: '2021-2025', value: '2021' },
  { label: '2020-2024', value: '2020' },
  { label: '2019-2023', value: '2019' },
  { label: '2018-2022', value: '2018' },
  { label: '2017-2021', value: '2017' },
  { label: '2016-2020', value: '2016' },
  { label: '2015-2019', value: '2015' },
  { label: '2014-2018', value: '2014' },
  { label: '2013-2017', value: '2013' },
  { label: '2012-2016', value: '2012' },
];
const DEPARTMENTS = {
  CSE: 'Computer Science',
  ECE: 'Electronics & Comm.',
  IT: 'Information Tech.',
  CIVIL: 'Civil',
  MECH: 'Mechanical',
  EEE: 'Electrical & Electronics',
};

function Department() {
  const { dept } = useParams();
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [topAlumni, setTopAlumni] = useState([]);
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [errorAlumni, setErrorAlumni] = useState('');

  const fetchTopAlumni = async (batch) => {
    setLoadingAlumni(true);
    setErrorAlumni('');
    setTopAlumni([]);
    try {
      const res = await fetch(`${API_ENDPOINTS.TOP_STUDENTS_BY_DEPARTMENT_BATCH}?department=${dept}&batch=${batch}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch top alumni');
      setTopAlumni(data);
    } catch (err) {
      setErrorAlumni(err.message);
    }
    setLoadingAlumni(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)', p: 0, position: 'relative', overflow: 'hidden' }}>
      <Fade in={true} appear={true} timeout={900}>
        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 4, position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight={600} color="primary" gutterBottom align="center">
            {DEPARTMENTS[dept] || dept} Department
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            <h2><b>Select Batch</b></h2>
          </Typography>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, mb: 3, background: '#f8faff', minWidth: 220 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, overflowX: 'auto', pb: 1 }}>
              {BATCH_RANGES.map((batch) => (
                <Button
                  key={batch.value}
                  variant={selectedBatch === batch.value ? 'contained' : 'text'}
                  color={selectedBatch === batch.value ? 'secondary' : 'primary'}
                  onClick={() => {
                    setSelectedBatch(batch.value);
                    fetchTopAlumni(batch.value);
                  }}
                  sx={{
                    minWidth: 140,
                    fontWeight: 500,
                    justifyContent: 'center',
                    textAlign: 'center',
                    borderRadius: 2,
                    background: selectedBatch === batch.value ? 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)' : 'transparent',
                    color: selectedBatch === batch.value ? '#fff' : 'primary.main',
                    boxShadow: selectedBatch === batch.value ? 3 : 0,
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: selectedBatch === batch.value ? 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)' : '#e3f0ff',
                      color: selectedBatch === batch.value ? '#fff' : 'primary.main',
                    },
                  }}
                >
                   {batch.label}
                </Button>
              ))}
            </Box>
          </Paper>
          {selectedBatch && (
            <Box sx={{ mt: 3, width: '100%', maxWidth: 900 }}>
              <Typography variant="h5" fontWeight={600} color="primary" gutterBottom align="center">
                Elite Alumni - {DEPARTMENTS[dept] || dept} {BATCH_RANGES.find(b => b.value === selectedBatch)?.label || selectedBatch}
              </Typography>
              {loadingAlumni ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
              ) : errorAlumni ? (
                <Alert severity="error">{errorAlumni}</Alert>
              ) : topAlumni.length === 0 ? (
                <Typography color="text.secondary" align="center">No alumni found for this batch.</Typography>
              ) : (
                <Grid container spacing={4} justifyContent="center" sx={{ mx: 'auto', mt: 1 }}>
                  {topAlumni.map((alum, idx) => (
                    <Grow in={true} timeout={600 + idx * 200} key={alum._id || idx}>
                      <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
                        <Card sx={{ borderRadius: 4, boxShadow: 4, p: 2, textAlign: 'center', width: 220, mx: 'auto', transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'translateY(-8px) scale(1.04)', boxShadow: 6 }, background: '#fff' }}>
                          <Avatar src={alum.photo} sx={{ width: 72, height: 72, mx: 'auto', mb: 1, transition: 'transform 0.2s', ':hover': { transform: 'scale(1.12)' } }} />
                          <Typography fontWeight={600} sx={{ fontSize: 18 }}>{alum.name}</Typography>
                          <Chip label={alum.company} color="primary" size="small" sx={{ my: 1 }} />
                          <Typography variant="body2">Package: <b>{alum.package}</b></Typography>
                          <Typography variant="body2">Batch: {alum.batch}</Typography>
                        </Card>
                      </Grid>
                    </Grow>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
}

export default Department;