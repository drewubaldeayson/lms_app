// frontend/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Box } from '@mui/material'

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || 'http://170.64.202.114:5000';

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       
        // Check token validity on app load
        const checkTokenValidity = async () => {
            // Check if user is authenticated on component mount
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    // Implement a token validation endpoint on your backend
                    const response = await axios.get(`${API_URL}/api/auth/validate-token`, {
                    headers: { Authorization: `Bearer ${token}` }
                    });
        
                    if (response.data.valid) {
                        setIsAuthenticated(true);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    handleLogout();
                } finally {
                    setLoading(false);  // Move setLoading here
                }
            } else {
                setLoading(false);  // If no token, still set loading to false
            }
        };


        // Session timeout check
        const checkSessionTimeout = () => {
            const lastActivity = localStorage.getItem('lastActivity');
            const currentTime = Date.now();
            const EIGHT_HOURS = 8 * 60 * 60 * 1000; 
    
            if (lastActivity && (currentTime - parseInt(lastActivity) > EIGHT_HOURS)) {
                handleLogout();
            }
        };


        // Track user activity
        const trackActivity = () => {
            localStorage.setItem('lastActivity', Date.now().toString());
        };
    
        window.addEventListener('mousemove', trackActivity);
        window.addEventListener('keydown', trackActivity);
        
        checkTokenValidity();
        checkSessionTimeout();
    
        // Set up periodic session check
        const sessionCheckInterval = setInterval(checkSessionTimeout, 60000); 
  

        return () => {
            window.removeEventListener('mousemove', trackActivity);
            window.removeEventListener('keydown', trackActivity);
            clearInterval(sessionCheckInterval);
        };
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('lastActivity');
        setIsAuthenticated(false);
    };

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh'
            }}>
                <CircularProgress />
            </div>
        ); // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};