// frontend/src/pages/ContentPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Paper, Typography, Modal, IconButton,
  TextField, Button, Snackbar } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import VideoPlayer from '../components/Content/VideoPlayer';

import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const API_URL = process.env.REACT_APP_API_URL || 'http://170.64.202.114:5000';

const ContentPage = ({ setHeadings }) => {
  const { '*': path } = useParams();
  const [content, setContent] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  

  useEffect(() => {
    const fetchContent = async () => {
      if (!path) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/api/content/file/${path}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          setContent(response.data.data.content);
          setVideos(response.data.data.videos || []);
          if (setHeadings) {
            setHeadings(response.data.data.headings);
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [path, setHeadings]);

  
  const handleEdit = () => {
    setEditableContent(content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/api/content/file/${path}`,
        { content: editableContent },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.data.success) {
        setContent(editableContent);
        setIsEditing(false);
        setSaveMessage('Content saved successfully');
      }
    } catch (error) {
      setError('Failed to save content');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableContent(content);
  };


  const ImageComponent = ({ src, alt }) => {
    const [imageError, setImageError] = useState(false);
    const { '*': currentPath } = useParams(); 

    const handleClick = () => {
      setSelectedImage(src);
    };

    // Transform the relative image path to absolute URL
    const getImageUrl = (relativePath) => {
      if (relativePath.startsWith('http')) {
        return relativePath;
      }
      
      // Get the directory of the current markdown file
      const currentDir = currentPath.split('/').slice(0, -1).join('/');
      
      // Remove './' from the relative path
      const cleanPath = relativePath.replace('./', '');
      
      // Construct the full URL
      return `${API_URL}/${currentDir}/${cleanPath}`;
    };

    const imageUrl = getImageUrl(src);
    console.log('Original src:', src);
    console.log('Transformed URL:', imageUrl);


    if (imageError) {
      return (
        <Box sx={{ 
          p: 2, 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          color: 'error.white',
          bgcolor: 'error.light',
          my: 2
        }}>
          Failed to load image: {alt}
        </Box>
      );
    }

    return (
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          my: 2,
          cursor: 'pointer'
        }}
      >
        <img
          src={imageUrl}
          alt={alt}
          onClick={handleClick}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            setImageError(true);
          }}
        />
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%', position: 'relative' }}>
      {/* Display videos if available */}
      {/* {videos.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ 
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 1,
              mb: 3
            }}>
            Related Videos
          </Typography>
          {videos.map((video, index) => (
            <VideoPlayer key={video._id || index} video={video} />
          ))}
        </Box>
      )} */}


      {/* <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
          {!isEditing ? (
            <IconButton onClick={handleEdit} color="primary">
              <EditIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleSave} color="primary">
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel} color="error">
                <CancelIcon />
              </IconButton>
            </Box>
          )}
      </Box> */}

      {/* Markdown content */}
      <Paper sx={{ p: 3 }}>
      {isEditing ? (
          <TextField
            fullWidth
            multiline
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            sx={{ 
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '14px'
              }
            }}
          />
        ) :  <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            img: ImageComponent,
            h1: ({ node, ...props }) => (
              <h1
                id={props.children.toString().toLowerCase().replace(/[^\w]+/g, '-')}
                style={{
                  scrollMarginTop: '80px', // Add scroll margin for smooth scrolling
                  transition: 'background-color 0.3s ease' // Add transition for highlight effect
                }}
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                id={props.children.toString().toLowerCase().replace(/[^\w]+/g, '-')}
                style={{
                  scrollMarginTop: '80px',
                  transition: 'background-color 0.3s ease'
                }}
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                id={props.children.toString().toLowerCase().replace(/[^\w]+/g, '-')}
                style={{
                  scrollMarginTop: '80px',
                  transition: 'background-color 0.3s ease'
                }}
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>}
      </Paper>

      <Snackbar
        open={!!saveMessage}
        autoHideDuration={3000}
        onClose={() => setSaveMessage('')}
        message={saveMessage}
      />

      {/* Image Modal */}
      <Modal
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: 1
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged view"
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ContentPage;