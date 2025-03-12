// frontend/src/components/Layout/Layout.js
import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import ContentIndex from './ContentIndex';
import PrintIcon from '@mui/icons-material/Print';
import CompanyLogo from '../../assets/images/logo.png'; // Import your logo

import { useNavigate } from 'react-router-dom';
const DRAWER_WIDTH = 350;

const Layout = ({ children }) => {
  const [headings, setHeadings] = useState([]);
  const navigate = useNavigate();


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
      logoComponent={
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mr: 2 
        }}>
          <img 
            src={CompanyLogo} 
            alt="Knowledge Base Logo" 
            onClick={() => navigate('/')}
            style={{ 
              height: 40, 
              width: 'auto', 
              marginRight: 16 
            }} 
          />
        </Box>
      } />
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
        <Box sx={{ width: '25%', overflow: 'auto', position: 'sticky',
            top: 0,
            height: '100vh'}}>
          <ContentIndex headings={headings} />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;