// frontend/src/pages/ProfilePage.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'https://docs.muli.com.au:5000';

const ProfilePage = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const lastLogin = localStorage.getItem('lastLogin') 
    ? new Date(localStorage.getItem('lastLogin')).toLocaleString()
    : 'N/A';

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        `${API_URL}/api/users/update-username`,
        { newUsername },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('Username updated successfully');
        setUsername(newUsername);
        localStorage.setItem('username', newUsername);
        setNewUsername('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mr: 2
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              User Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your account settings
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Current Username: {username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Login: {lastLogin}
          </Typography>
        </Box>

        <form onSubmit={handleUpdateUsername}>
          <TextField
            fullWidth
            label="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            margin="normal"
            variant="outlined"
            disabled={loading}
          />

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ my: 2 }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading || !newUsername.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Username'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfilePage;