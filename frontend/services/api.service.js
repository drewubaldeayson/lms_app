// frontend/src/services/api.service.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://170.64.202.114:5000';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const contentService = {
  getTree: () => 
    axios.get(`${API_URL}/api/content/tree`, getAuthHeader()),

  getFile: (path) => 
    axios.get(`${API_URL}/api/content/file/${path}`, getAuthHeader()),

  search: (query) => 
    axios.get(`${API_URL}/api/search?q=${encodeURIComponent(query)}`, getAuthHeader())
};

export const authService = {
  login: (credentials) => 
    axios.post(`${API_URL}/api/auth/login`, credentials)
};