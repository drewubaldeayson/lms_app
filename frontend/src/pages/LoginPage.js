// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Paper, 
    Typography, 
    Alert,
    CircularProgress 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import CompanyLogo from '../assets/images/login-logo.png'; 


const API_URL = process.env.REACT_APP_API_URL || 'https://docs.muli.com.au:5000';


const LoginPage = () => {
    const [credentials, setCredentials] = useState({ 
        username: '', 
        password: '' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post( `${API_URL}/api/auth/login`, credentials);
            
            if (response.data.success) {
                // Store the token
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('username', response.data.data.username);
                localStorage.setItem('lastLogin', response.data.data.lastLogin);
                
                // Update auth context
                login(response.data.data.token);
                
                // Navigate to home page
                navigate('/');
            }
        } catch (error) {
            setError(
                error.response?.data?.message || 
                'An error occurred during login. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
         <Box
            sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            bgcolor: 'background.default' 
            }}
        >
       
            
            <Box sx={{ textAlign: 'center', mt: 2, mb:5 }}>
                <img src={CompanyLogo} alt="Logo" style={{ width: '350px' }} />
            </Box>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px' }}>
                <Typography variant="h5" align="center" sx={{ mb: 3 }}>
                    Knowledge Base Login
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ 
                            ...credentials, 
                            username: e.target.value 
                        })}
                        disabled={loading}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ 
                            ...credentials, 
                            password: e.target.value 
                        })}
                        disabled={loading}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Login'
                        )}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginPage;