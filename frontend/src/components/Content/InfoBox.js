import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const InfoBox = ({ children }) => (
  <Box
    sx={{
      bgcolor: '#e8f4fd', // Light blue
      border: '1px solid #b3e5fc',
      borderRadius: 2,
      p: 2,
      my: 2,
      display: 'flex',
      alignItems: 'flex-start',
    }}
  >
    <InfoOutlinedIcon sx={{ mr: 1, color: '#0288d1' }} />
    <Typography variant="body1" component="div">
      {children}
    </Typography>
  </Box>
);

export default InfoBox;