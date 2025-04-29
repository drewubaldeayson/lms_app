import React, { useState, useEffect,useRef } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Box,
  Typography,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  FolderOutlined,
  DescriptionOutlined,
  ExpandLess,
  ExpandMore,
  ImageOutlined,
  AttachFileOutlined
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import { useSidebarRefresh } from '../Sidebar';  

const API_URL = process.env.REACT_APP_API_URL || 'https://docs.muli.com.au';
const DRAWER_WIDTH = 350;

const Sidebar = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { shouldRefreshSidebar, resetSidebarRefresh } = useSidebarRefresh();
  // Ref to track if this is the first load or page reload
  const isInitialLoadRef = useRef(true);
  // Determine if current path is manual
  const isManualPath = () => 
    location.pathname.includes('/manual') || 
    location.pathname === '/manual';

  // Fetch directory tree
  const fetchDirectoryTree = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine endpoint based on current path
      const endpoint = isManualPath()
        ? `${API_URL}/api/content/tree/manual`
        : `${API_URL}/api/content/tree`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        console.log('Tree data loaded:', response.data.data);
        setTreeData(response.data.data);
      } else {
        throw new Error('Failed to load directory structure');
      }
    } catch (error) {
      console.error('Error fetching tree:', error);
      setError(error.message || 'Error loading directory structure');
    } finally {
      setLoading(false);
      resetSidebarRefresh();
      isInitialLoadRef.current = false;
    }
  };

  // Fetch on component mount and specific conditions
  useEffect(() => {
    // Conditions to fetch directory tree:
    // 1. First page load (initial load or page reload)
    // 2. Explicitly triggered by header button (shouldRefreshSidebar)
    const shouldFetchTree = 
      isInitialLoadRef.current || 
      shouldRefreshSidebar;

    if (shouldFetchTree) {
      // Only fetch if:
      // - It's the first load
      // - Or triggered by header button (switching between Procedure/Manual)
      const isHeaderNavigation = 
        location.pathname === '/' || 
        location.pathname === '/manual';

      if (isInitialLoadRef.current || isHeaderNavigation) {
        fetchDirectoryTree();
      }
    }
  }, [shouldRefreshSidebar, location.pathname]);


  const handleSelect = (path) => {
    const basePath = isManualPath() ? '/manual/content' : '/content';
    navigate(`${basePath}/${path}`);
  };


  // Render loading state
  if (loading) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            mt: 8
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Drawer>
    );
  }

  // Render error state
  if (error) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            mt: 8
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Drawer>
    );
  }

  // TreeNode component (simplified)
  const TreeNode = ({ node, level = 0, selectedPath }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isFile = !node.children;
    const isMarkdown = node.name.endsWith('.md');

    // Skip certain nodes
    const shouldRenderNode = () => {
      const excludedFolders = ['attachments'];
      return !excludedFolders.includes(node.name);
    };

    if (!shouldRenderNode()) return null;

    // Skip top-level markdown-files node
    if (node.name === 'markdown-files' || node.name === 'markdown-files-manual') {
      return node.children.map((child, index) => (
        <TreeNode
          key={index}
          node={child}
          level={level}
          selectedPath={selectedPath}
        />
      ));
    }

    const handleClick = () => {
      if (node.children) {
        setIsExpanded(!isExpanded);
      } else if (isMarkdown) {
        handleSelect(node.path);
      }
    };

    const getIcon = () => {
      if (node.children) return <FolderOutlined />;
      if (isMarkdown) return <DescriptionOutlined />;
      return <AttachFileOutlined />;
    };

    const displayName = node.name.replace(/.md$/, '');

    return (
      <>
        <ListItemButton
          onClick={handleClick}
          sx={{
            pl: level * 2 + 2,
            bgcolor: selectedPath === node.path ? 'action.selected' : 'inherit'
          }}
        >
          <ListItemIcon>{getIcon()}</ListItemIcon>
          <ListItemText primary={displayName} />
          {node.children && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        
        {node.children && (
          <Collapse in={isExpanded}>
            <List disablePadding>
              {node.children.map((child, index) => (
                <TreeNode
                  key={index}
                  node={child}
                  level={level + 1}
                  selectedPath={selectedPath}
                />
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          mt: 8
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mb: '90px'  }}>
        {treeData && (
          <List>
            <TreeNode
              node={treeData}
              selectedPath={
                isManualPath() 
                  ? location.pathname.replace('/manual/content/', '') 
                  : location.pathname.replace('/content/', '')
              }
            />
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;