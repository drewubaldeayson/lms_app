import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Box 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchResults = ({ results }) => {
  const navigate = useNavigate();
  const location = useLocation(); 

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Search Results
      </Typography>
      <List>
        {results.map((result, index) => (
          <ListItem 
            button 
            key={index}
            onClick={() => {
              const basePath = location.pathname.includes('/manual') 
                ? '/manual/content' 
                : '/content';
              navigate(`${basePath}/${result.filePath}`);
            }}
          >
            <ListItemText
              primary={result.title}
              secondary={result.excerpt}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SearchResults;