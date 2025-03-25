import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ManualHomePage = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Manual Knowledge Base Page
      </Typography>
      <Typography paragraph>
        Please select a manual document from the left menu to get started.
      </Typography>
    </Paper>
  );
};

export default ManualHomePage;