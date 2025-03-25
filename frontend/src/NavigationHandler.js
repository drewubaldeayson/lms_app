import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebarRefresh } from './components/Sidebar';

export const NavigationHandler = () => {
  const location = useLocation();
  const { triggerSidebarRefresh } = useSidebarRefresh();

  useEffect(() => {
    // Trigger refresh on page load for specific paths
    const shouldTriggerRefresh = 
      location.pathname === '/' || 
      location.pathname === '/manual';

    if (shouldTriggerRefresh) {
      triggerSidebarRefresh();
    }
  }, [location.pathname, triggerSidebarRefresh]);

  return null;
};