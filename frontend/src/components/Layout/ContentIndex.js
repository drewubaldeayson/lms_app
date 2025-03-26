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

  // Process headings to remove markdown
  const processedHeadings = headings.map(heading => ({
    ...heading,
    text: cleanMarkdownHeading(heading.text),
    id: cleanMarkdownHeading(heading.text)
      .toLowerCase()
      .replace(/[^\w]+/g, '-')
  }));

  // Function to handle scroll and highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = processedHeadings .map(heading => ({
        id: heading.id,
        element: document.getElementById(heading.id)
      })).filter(({ element }) => element);

      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const { id, element } = headingElements[i];
        if (element.offsetTop <= scrollPosition) {
          setActiveHeading(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);



  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Scroll to element
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Add temporary highlight effect
      element.style.backgroundColor = '#fff9c4'; // Light yellow background
      setTimeout(() => {
        element.style.backgroundColor = 'transparent';
        element.style.transition = 'background-color 0.5s ease';
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
            key={index}
            onClick={() => scrollToHeading(heading.id)}
            active={activeHeading === heading.id}
            sx={{
              pl: heading.level > 1 ? (heading.level * 2) : 2,
              py: 0.5
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