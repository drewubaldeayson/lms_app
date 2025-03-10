// frontend/src/components/Layout/Layout.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import ContentIndex from './ContentIndex';

const DRAWER_WIDTH = 308;

const Layout = ({ children }) => {
  const [headings, setHeadings] = useState([]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          display: 'flex',
          gap: 2
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {React.cloneElement(children, { setHeadings })}
        </Box>
        <ContentIndex headings={headings} sx={{ width: DRAWER_WIDTH }} />
      </Box>
    </Box>
  );
};

export default Layout;