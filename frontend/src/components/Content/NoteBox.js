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
      display: 'flex',
      alignItems: 'flex-start',
    }}
  >
    <NoteOutlinedIcon sx={{ mr: 1, color: '#42a5f5' }} />
    <Typography variant="body1" component="div">
      {children}
    </Typography>
  </Box>
);

export default NoteBox;