import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const InfoBox = ({ children }) => {
  return (
    <Box
      sx={{
        bgcolor: '#e8eaf6', // Light blue background
        border: '1px solid #c5cae9', // Border color
        borderRadius: 2,
        p: 2,
        my: 2,
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <InfoOutlinedIcon sx={{ mr: 1, color: '#3f51b5' }} />
      <Typography variant="body1" component="div">
        {children}
      </Typography>
    </Box>
  );
};

export default InfoBox;