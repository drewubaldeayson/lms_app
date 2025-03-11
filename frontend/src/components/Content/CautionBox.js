import React from 'react';
import { Box, Typography } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const CautionBox = ({ children }) => (
  <Box
    sx={{
      bgcolor: '#fff8e1', // Light yellow
      border: '1px solidrgb(255, 130, 130)',
      borderRadius: 2,
      p: 2,
      my: 2,
      display: 'flex',
      alignItems: 'flex-start',
    }}
  >
    <ReportProblemOutlinedIcon sx={{ mr: 1, color: '#ffb300' }} />
    <Typography variant="body1" component="div">
      {children}
    </Typography>
  </Box>
);

export default CautionBox;