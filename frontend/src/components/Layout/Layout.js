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
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            display: 'flex',
          }}
        >
          <Box sx={{ flexGrow: 1, maxWidth: `calc(100% - ${2 * DRAWER_WIDTH}px)`, overflow: 'auto' }}>
            {React.cloneElement(children, { setHeadings })}
          </Box>
         
        </Box>
        <ContentIndex headings={headings}/>
      </Box>
    </Box>
  );
};

export default Layout;