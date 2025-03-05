// frontend/src/pages/HomePage.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const HomePage = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Knowledge Base
      </Typography>
      <Typography paragraph>
        Please select a document from the left menu to get started.
      </Typography>
    </Paper>
  );
};

export default HomePage;