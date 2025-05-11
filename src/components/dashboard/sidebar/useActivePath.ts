
import { useLocation } from "react-router-dom";

export default function useActivePath() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    // Special case for dashboard home - exact match only
    if (path === "/dashboard" && currentPath === "/dashboard") {
      return true;
    }
    
    // For other specific routes, require exact path match
    if (path === "/dashboard/scrape" && currentPath === "/dashboard/scrape") {
      return true;
    }
    
    // For section routes like /dashboard/results, /dashboard/profile, etc.
    // Check if the current path starts with this path but is not the dashboard root
    if (path !== "/dashboard" && currentPath.startsWith(path)) {
      // Get the next segment after the path (if any)
      const remainingPath = currentPath.slice(path.length);
      
      // If there's no remaining path or it starts with a slash, it's in this section
      if (remainingPath === "" || remainingPath.startsWith("/")) {
        return true;
      }
    }
    
    return false;
  };

  return { isActive };
}
