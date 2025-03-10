import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';

const WarningBox = ({ children }) => (
  <Box
    sx={{
      bgcolor: '#fff3e0', // Light orange
      border: '1px solid #ffcc80',
      borderRadius: 2,
      p: 2,
      my: 2,
      display: 'flex',
      alignItems: 'flex-start',
    }}
  >
    <WarningOutlinedIcon sx={{ mr: 1, color: '#ffa726' }} />
    <Typography variant="body1" component="div">
      {children}
    </Typography>
  </Box>
);

export default WarningBox;