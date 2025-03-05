import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results }) => {
  const navigate = useNavigate();

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
            onClick={() => navigate(`/content/${result.filePath}`)}
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