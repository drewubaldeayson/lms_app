import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// SidebarContext.jsx
const SidebarContext = createContext({
  shouldRefreshSidebar: false,
  triggerSidebarRefresh: () => {},
  resetSidebarRefresh: () => {}
});

export const SidebarProvider = ({ children }) => {
  const [shouldRefreshSidebar, setShouldRefreshSidebar] = useState(() => {
    // Check localStorage on initial load
    return localStorage.getItem('refreshSidebar') === 'true';
  });

  // Trigger refresh and set in localStorage
  const triggerSidebarRefresh = useCallback(() => {
    setShouldRefreshSidebar(true);
    localStorage.setItem('refreshSidebar', 'true');
  }, []);

  // Reset refresh state and clear localStorage
  const resetSidebarRefresh = useCallback(() => {
    setShouldRefreshSidebar(false);
    localStorage.removeItem('refreshSidebar');
  }, []);

  // Automatically check and reset on mount
  useEffect(() => {
    const refreshStatus = localStorage.getItem('refreshSidebar');
    if (refreshStatus === 'true') {
      setShouldRefreshSidebar(true);
    }
  }, []);

  return (
    <SidebarContext.Provider 
      value={{ 
        shouldRefreshSidebar, 
        triggerSidebarRefresh, 
        resetSidebarRefresh 
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarRefresh = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarRefresh must be used within a SidebarProvider');
  }
  return context;
};