// frontend/src/pages/NotFoundPage.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}
    >
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        The page you are looking for does not exist.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;