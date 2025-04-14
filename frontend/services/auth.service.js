// frontend/src/services/auth.service.js

const API_URL = process.env.REACT_APP_API_URL || 'https://docs.muli.com.au:5000';

export const login = (credentials) => {
  return axios.post(`${API_URL}/api/auth/login`, credentials);
};

export const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});