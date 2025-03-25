// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import ContentPage from './pages/ContentPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage'; 
import ManualContentPage from './pages/ManualContentPage';
import ManualHomePage from './pages/ManualHomePage';
import { SidebarProvider } from './components/Sidebar';
import {NavigationHandler} from './NavigationHandler';

const theme = createTheme({
  // Add your theme customization here
});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <SidebarProvider>
          <NavigationHandler />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                <HomePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/manual" element={
              <ProtectedRoute>
                <Layout>
                <ManualHomePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/content/*" element={
              <ProtectedRoute>
                <Layout>
                  <ContentPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/manual/content/*" element={
              <ProtectedRoute>
                <Layout>
                  <ManualContentPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            {/* 404 Route - must be the last route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
        </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;