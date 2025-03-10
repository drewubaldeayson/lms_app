// frontend/src/components/Layout/Layout.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import ContentIndex from './ContentIndex';

const DRAWER_WIDTH = 350;

const Layout = ({ children }) => {
  const [headings, setHeadings] = useState([]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ width: '25%', overflow: 'auto' }}>
          <Sidebar />
        </Box>
        <Box
          component="main"
          sx={{
            width: '50%',
            p: 3,
            mt: 8,
            overflow: 'auto',
          }}
        >
          {React.cloneElement(children, { setHeadings })}
        </Box>
        <Box sx={{ width: '25%', overflow: 'auto' }}>
          <ContentIndex headings={headings} />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;