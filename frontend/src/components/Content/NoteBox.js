import React from 'react';
import { Box, Typography } from '@mui/material';
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';

const NoteBox = ({ children }) => (
  <Box
    sx={{
      bgcolor: '#e3f2fd', // Light blue
      border: '1px solid #90caf9',
      borderRadius: 2,
      p: 2,
      my: 2,
      display: 'flex'
    }}
  >
    <NoteOutlinedIcon sx={{ 
      mr: 1, 
      color: '#42a5f5',
      alignSelf: "flex-start", // Align icon to the top
      mt: "16px", // Small adjustment for better alignment
    }} />
    <Typography variant="body1" component="div" sx={{ lineHeight: 1.6 }}>
      {children}
    </Typography>
  </Box>
);

export default NoteBox;