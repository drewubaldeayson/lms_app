// frontend/src/pages/ManualContentPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Paper, Typography, Modal, IconButton,
  TextField, Button, Snackbar } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import VideoPlayer from '../components/Content/VideoPlayer';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2pdf from 'html2pdf.js';

import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoBox from '../components/Content/InfoBox';
import CautionBox from '../components/Content/CautionBox';
import WarningBox from '../components/Content/WarningBox';
import NoteBox from '../components/Content/NoteBox';

const API_URL = process.env.REACT_APP_API_URL || 'http://170.64.202.114:5000';




const ManualContentPage = ({ setHeadings }) => {
  const { '*': path } = useParams();
  const [content, setContent] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [videos, setVideos] = useState([]);
  const [localHeadings, setLocalHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef();
  
  

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
          setLocalHeadings(response.data.data.headings);
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


  const handleExport = () => {
    setExporting(true);
    const element = contentRef.current;

    // Wait for images to load
    const images = element.getElementsByTagName('img');


    const imageLoadPromises = Array.from(images).map((img) => {
      // If the image is already a data URL, there's nothing to do.
      if (img.src.startsWith('data:')) {
        return Promise.resolve();
      }
    return new Promise((resolve) => {
      // Fetch the image as a blob
      fetch(img.src, { mode: 'cors' })
      .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.blob();
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
        // Replace the image’s src with the base64 URL
        img.src = reader.result;
        resolve();
        };
        reader.onerror = () => {
          console.error('Error reading blob as data URL for', img.src);
          resolve();
          };
          reader.readAsDataURL(blob);
          })
          .catch(error => {
          console.error('Error fetching image for pdf export', error);
          resolve();
          });
    });
  });

    Promise.all(imageLoadPromises).then(() => {
      // Optionally add a slight delay to ensure the DOM updates
      setTimeout(() => {
        const opt = {
          margin: 1,
          filename: `${path.split('/').pop().replace('.md', '.pdf')}`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: false, logging: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
  
  
        html2pdf().from(element).set(opt).save().finally(() => {
          setExporting(false);
        });
      }, 500);
    });
  };

  const ImageComponent = ({ src, alt }) => {
    const [imageError, setImageError] = useState(false);
    const { '*': currentPath } = useParams();
    const [dataUrl, setDataUrl] = useState(null);
  
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
  
      // Construct the full URL and encode it
      const fullPath = `${API_URL}/api/content/${currentDir}/${cleanPath}`;
      return encodeURI(fullPath);
    };
  
    const imageUrl = getImageUrl(src);
    console.log('Original src:', src);
    console.log('Transformed URL:', imageUrl);

    useEffect(() => {
      const fetchImageAsBase64 = async () => {
      try {
      const response = await fetch(imageUrl, { mode: 'cors',  headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }  });
      if (!response.ok) {
      }
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
      setDataUrl(reader.result);
      setLoading(false);
      };
      reader.onerror = (err) => {
      console.error('Error reading blob as data URL', err);
      setError(true);
      setLoading(false);
      };
      reader.readAsDataURL(blob);
      } catch (err) {
      console.error('Error converting image to base64', err);
      setError(true);
      setLoading(false);
      }
      };
      fetchImageAsBase64();

    }, [imageUrl])

  
    if (imageError) {
      return (
        <Box
          sx={{
            p: 2,
            border: '1px solid #ccc',
            borderRadius: '4px',
            color: 'error.white',
            bgcolor: 'error.light',
            my: 2
          }}
        >
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
          src={dataUrl}
          alt={alt}
          onClick={handleClick}
          // crossOrigin="anonymous"
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}
          onError={(e) => {
            console.error('Image failed to load:', dataUrl);
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

      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <IconButton onClick={handleExport} color="primary" disabled={exporting}>
          <PictureAsPdfIcon />
        </IconButton>
        {exporting && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <CircularProgress />
            <span style={{ marginLeft: '10px' }}>Generating PDF...</span>
          </Box>
        )}
      </Box>

      {/* Markdown content */}
      <Paper sx={{ p: 3 }}  ref={contentRef}>
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
        ) :  
        <div style={{ fontFamily: 'Calibri, sans-serif' }}>
        <ReactMarkdown
          components={{
            blockquote: ({ node, children, ...props }) => {
              // Helper function to extract text from children recursively
              const extractText = (child) => {
                if (typeof child === 'string') {
                  return child;
                } else if (React.isValidElement(child)) {
                  return React.Children.toArray(child.props.children).map(extractText).join('');
                }
                return '';
              };
      
              const textContent = children.map(extractText).join('').trim();

              const markers = {
                '[!INFO]': InfoBox,
                '[!WARNING]': WarningBox,
                '[!CAUTION]': CautionBox,
                '[!NOTE]': NoteBox,
              };

      
              for (const [marker, Component] of Object.entries(markers)) {
                if (textContent.startsWith(marker)) {
                  // Pass the original children to preserve markdown syntax
                  const contentWithoutMarker = textContent.slice(marker.length).trim();
                  return (
                    <Component>
                      <div style={{ fontFamily: 'Calibri, sans-serif' }}>
                      <ReactMarkdown
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
                      
                      }}>{contentWithoutMarker }</ReactMarkdown>
                      </div>
                    </Component>
                  );
                }
              }
      
              return <blockquote>{children}</blockquote>;
            },
            
            
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
            h1: ({ node, children, ...props }) => {
              // Safely extract text, handling various child types
              const extractText = (child) => {
                if (child === null || child === undefined) return '';
                if (typeof child === 'string') return child;
                if (React.isValidElement(child)) {
                  if (typeof child.props.children === 'string') return child.props.children;
                  if (Array.isArray(child.props.children)) {
                    return child.props.children.map(extractText).join('');
                  }
                  return extractText(child.props.children);
                }
                return '';
              };
            
              const headingText = React.Children.toArray(children)
                .map(extractText)
                .join('')
                .trim();
            
              const matchedHeading = localHeadings.find(h => h.text === headingText && h.level === 1);
              
              return (
                <h1
                  id={matchedHeading ? matchedHeading.id : headingText.toLowerCase().replace(/[^\w]+/g, '-')}
                  style={{
                    scrollMarginTop: '80px',
                    transition: 'background-color 0.3s ease'
                  }}
                  {...props}
                />
              );
            },
            h2: ({ node, children, ...props }) => {
              // Safely extract text, handling various child types
              const extractText = (child) => {
                if (child === null || child === undefined) return '';
                if (typeof child === 'string') return child;
                if (React.isValidElement(child)) {
                  if (typeof child.props.children === 'string') return child.props.children;
                  if (Array.isArray(child.props.children)) {
                    return child.props.children.map(extractText).join('');
                  }
                  return extractText(child.props.children);
                }
                return '';
              };
            
              const headingText = React.Children.toArray(children)
                .map(extractText)
                .join('')
                .trim();
            
              const matchedHeading = localHeadings.find(h => h.text === headingText && h.level === 2);
              
              return (
                <h2
                  id={matchedHeading ? matchedHeading.id : headingText.toLowerCase().replace(/[^\w]+/g, '-')}
                  style={{
                    scrollMarginTop: '80px',
                    fontSize: '1.6em',
                    transition: 'background-color 0.3s ease'
                  }}
                  {...props}
                />
              );
            },
            h3: ({ node, children, ...props }) => {
              // Safely extract text, handling various child types
              const extractText = (child) => {
                if (child === null || child === undefined) return '';
                if (typeof child === 'string') return child;
                if (React.isValidElement(child)) {
                  if (typeof child.props.children === 'string') return child.props.children;
                  if (Array.isArray(child.props.children)) {
                    return child.props.children.map(extractText).join('');
                  }
                  return extractText(child.props.children);
                }
                return '';
              };
            
              const headingText = React.Children.toArray(children)
                .map(extractText)
                .join('')
                .trim();
            
              const matchedHeading = localHeadings.find(h => h.text === headingText && h.level === 3);
              
              return (
                <h3
                  id={matchedHeading ? matchedHeading.id : headingText.toLowerCase().replace(/[^\w]+/g, '-')}
                  style={{
                    scrollMarginTop: '80px',
                    fontSize: '1.4em',
                    transition: 'background-color 0.3s ease'
                  }}
                  {...props}
                />
              );
            },
            h4: ({ node, children, ...props }) => {
              // Safely extract text, handling various child types
              const extractText = (child) => {
                if (child === null || child === undefined) return '';
                if (typeof child === 'string') return child;
                if (React.isValidElement(child)) {
                  if (typeof child.props.children === 'string') return child.props.children;
                  if (Array.isArray(child.props.children)) {
                    return child.props.children.map(extractText).join('');
                  }
                  return extractText(child.props.children);
                }
                return '';
              };
            
              const headingText = React.Children.toArray(children)
                .map(extractText)
                .join('')
                .trim();
            
              const matchedHeading = localHeadings.find(h => h.text === headingText && h.level === 4);
              
              return (
                <h4
                  id={matchedHeading ? matchedHeading.id : headingText.toLowerCase().replace(/[^\w]+/g, '-')}
                  style={{
                    scrollMarginTop: '80px',
                    fontSize: '1.2em',
                    transition: 'background-color 0.3s ease'
                  }}
                  {...props}
                />
              );
            },
            h5: ({ node, children, ...props }) => {
              // Safely extract text, handling various child types
              const extractText = (child) => {
                if (child === null || child === undefined) return '';
                if (typeof child === 'string') return child;
                if (React.isValidElement(child)) {
                  if (typeof child.props.children === 'string') return child.props.children;
                  if (Array.isArray(child.props.children)) {
                    return child.props.children.map(extractText).join('');
                  }
                  return extractText(child.props.children);
                }
                return '';
              };
            
              const headingText = React.Children.toArray(children)
                .map(extractText)
                .join('')
                .trim();
            
              const matchedHeading = localHeadings.find(h => h.text === headingText && h.level === 5);
              
              return (
                <h5
                  id={matchedHeading ? matchedHeading.id : headingText.toLowerCase().replace(/[^\w]+/g, '-')}
                  style={{
                    scrollMarginTop: '80px',
                    fontSize: '1.1em',
                    transition: 'background-color 0.3s ease'
                  }}
                  {...props}
                />
              );
            },
            h6: ({ node, children, ...props }) => {
              // Safely extract text, handling various child types
              const extractText = (child) => {
                if (child === null || child === undefined) return '';
                if (typeof child === 'string') return child;
                if (React.isValidElement(child)) {
                  if (typeof child.props.children === 'string') return child.props.children;
                  if (Array.isArray(child.props.children)) {
                    return child.props.children.map(extractText).join('');
                  }
                  return extractText(child.props.children);
                }
                return '';
              };
            
              const headingText = React.Children.toArray(children)
                .map(extractText)
                .join('')
                .trim();
            
              const matchedHeading = localHeadings.find(h => h.text === headingText && h.level === 6);
              
              return (
                <h6
                  id={matchedHeading ? matchedHeading.id : headingText.toLowerCase().replace(/[^\w]+/g, '-')}
                  style={{
                    scrollMarginTop: '80px',
                    fontSize: '1em',
                    transition: 'background-color 0.3s ease'
                  }}
                  {...props}
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown></div>}
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

export default ManualContentPage;