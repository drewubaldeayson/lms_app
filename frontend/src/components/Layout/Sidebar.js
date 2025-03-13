// frontend/src/components/Layout/Sidebar.js
import React, { useState, useEffect } from 'react';
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

const API_URL = process.env.REACT_APP_API_URL || 'http://170.64.202.114:5000';

const DRAWER_WIDTH = 350;

const TreeNode = ({ node, level = 0, selectedPath, onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isFile = !node.children;
    const isMarkdown = node.name.endsWith('.md');
    const isAttachment = !isMarkdown && isFile;

    const shouldRenderNode = () => {
        const excludedFolders = ['attachments'];
        return !excludedFolders.includes(node.name);
    };

    // If node should not be rendered, return null
    if (!shouldRenderNode()) {
        return null;
    }


    // Skip rendering the "markdown-files" node itself
  if (node.name === 'markdown-files') {
    return node.children.map((child, index) => (
      <TreeNode
        key={index}
        node={child}
        level={level} // Keep the same level as the parent
        selectedPath={selectedPath}
        onSelect={onSelect}
      />
    ));
  }
  
    const handleClick = () => {
        if (node.children) {
          setIsExpanded(!isExpanded);
        } else if (isMarkdown) {
          onSelect(node.path);
        }
    };

    const getIcon = () => {
      if (node.children) return <FolderOutlined />;
      if (isMarkdown) return <DescriptionOutlined />;
      if (node.name.match(/\.(jpg|jpeg|png|gif|svg)$/i)) return <ImageOutlined />;
      return <AttachFileOutlined />;
    };
  
    const displayName = node.name
    .replace(/.md$/, '');
  
    return (
      <>
        <ListItemButton
          onClick={handleClick}
          sx={{
            pl: level * 2 + 2,
            bgcolor: selectedPath === node.path ? 'action.selected' : 'inherit',
            cursor: isAttachment ? 'default' : 'pointer',
            '&:hover': {
              bgcolor: isAttachment ? 'inherit' : 'action.hover'
            }
          }}
          disabled={isAttachment}
        >
          <ListItemIcon>
            {getIcon()}
          </ListItemIcon>
          <Tooltip title={displayName} placement="right">
            <ListItemText 
              primary={displayName}
              sx={{
                opacity: isAttachment ? 0.6 : 1
              }}
            />
          </Tooltip>
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
                  onSelect={onSelect}
                />
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

const Sidebar = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDirectoryTree = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/content/tree`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (response.data.success) {
              console.log('Tree data:', response.data.data); // Debug log
              setTreeData(response.data.data);
            } else {
              setError('Failed to load directory structure');
            }
          } catch (error) {
            console.error('Error fetching tree:', error);
            setError('Error loading directory structure');
          } finally {
            setLoading(false);
          }
    };

    fetchDirectoryTree();
  }, []);

  const handleSelect = (path) => {
    console.log('Handling selection:', path); // Debug log
    navigate(`/content/${path}`);
  };

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

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          mt: 8
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        {treeData && (
          <List>
            <TreeNode
              node={treeData}
              selectedPath={location.pathname.replace('/content/', '')}
              onSelect={handleSelect}
            />
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;