import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Function to clean markdown from headings
const cleanMarkdownHeading = (heading) => {
  // Remove code backticks
  let cleanedHeading = heading.replace(/`([^`]+)`/g, '$1');
  
  // Remove bold and italic markdown
  cleanedHeading = cleanedHeading
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Bold **text**
    .replace(/\*(.*?)\*/g, '$1')      // Italic *text*
    .replace(/__(.*?)__/g, '$1')      // Bold __text__
    .replace(/_(.*?)_/g, '$1');       // Italic _text_

  // Remove links
  cleanedHeading = cleanedHeading.replace(/$$([^$$]+)\]$$[^$$]+\)/g, '$1');

  // Trim any remaining whitespace
  return cleanedHeading.trim();
};

const IndexItem = styled(ListItem)(({ theme, active }) => ({
  paddingLeft: theme.spacing(2),
  cursor: 'pointer',
  borderLeft: '2px solid transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(active && {
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.selected,
  }),
}));

const ContentIndex = ({ headings }) => {
  const [activeHeading, setActiveHeading] = useState('');

  // Process headings to remove markdown and generate IDs
  const processedHeadings = headings.map((heading, index) => {
    // Clean the heading text
    const cleanText = cleanMarkdownHeading(heading.text);
    
    // Generate a robust ID based on the clean text
    const generateId = (text) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '')      // Remove leading/trailing hyphens
        || `heading-${index}`;      // Fallback ID if generation fails
    };

    // Use the backend ID if available, otherwise generate one
    const id = heading.id || generateId(cleanText);

    return {
      ...heading,
      id: id,
      text: cleanText
    };
  });

  // Scroll and highlight logic
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = processedHeadings
        .map(heading => ({
          id: heading.id,
          element: document.getElementById(heading.id)
        }))
        .filter(({ element }) => element);

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const { id, element } = headingElements[i];
        if (element.offsetTop <= scrollPosition) {
          setActiveHeading(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [processedHeadings]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      element.style.backgroundColor = '#fff9c4';
      element.style.transition = 'background-color 0.5s ease';
      
      setTimeout(() => {
        element.style.backgroundColor = 'transparent';
      }, 1000);

      setActiveHeading(id);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        position: 'sticky',
        top: 80,
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'auto',
        borderLeft: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{
          fontWeight: 500,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1
        }}
      >
        Table of Contents
      </Typography>
      <List dense>
        {processedHeadings.map((heading, index) => (
          <IndexItem
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            active={activeHeading === heading.id}
            sx={{
              pl: heading.level > 1 ? (heading.level * 2) : 2,
              py: 0.5,
              cursor: 'pointer'
            }}
          >
            <ListItemText
              primary={heading.text}
              sx={{
                '& .MuiTypography-root': {
                  fontSize: '1rem', 
                  fontWeight: activeHeading === heading.id ? 500 : 400,
                  color: activeHeading === heading.id ? 'primary.main' : 'text.primary'
                }
              }}
            />
          </IndexItem>
        ))}
      </List>
    </Paper>
  );
};

export default ContentIndex;