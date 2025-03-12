import React from 'react';
import { Box, Typography } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const CautionBox = ({ children }) => (
  <Box
    sx={{
      bgcolor: '#fff8e1', // Light yellow
      border: '1px solid rgb(255, 130, 130)',
      borderRadius: 2,
      p: 2,
      my: 2,
      display: 'flex'
    }}
  >
    <ReportProblemOutlinedIcon sx={{ 
      mr: 1, 
      color: '#ffb300',
      alignSelf: "flex-start", // Align icon to the top
      mt: "16px", // Small adjustment for better alignment
    }} />
    <Typography variant="body1" component="div" sx={{ lineHeight: 1.6 }}>
      {children}
    </Typography>
  </Box>
);

export default CautionBox;