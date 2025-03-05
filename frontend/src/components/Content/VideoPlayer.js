// frontend/src/components/Content/VideoPlayer.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const VideoPlayer = ({ video }) => {
  // Function to get clean embed URL
  const getEmbedUrl = (url) => {
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return url; // Return original if it's already an embed URL
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        mb: 3,
        p: 2,
        backgroundColor: 'background.paper'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: 'primary.main',
          fontWeight: 500
        }}
      >
        {video.title}
      </Typography>
      
      {video.description && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2 }}
        >
          {video.description}
        </Typography>
      )}
      
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 Aspect Ratio
          width: '100%',
          overflow: 'hidden',
          borderRadius: 1
        }}
      >
        <iframe
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0
          }}
          src={getEmbedUrl(video.youtubeUrl)}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
    </Paper>
  );
};

export default VideoPlayer;