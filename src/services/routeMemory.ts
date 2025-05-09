
/**
 * Utility service for storing and retrieving the last visited route
 */

const ROUTE_MEMORY_KEY = "last_route_path";

export const saveRoute = (path: string): void => {
  // Don't save auth page as the last route
  if (path.startsWith('/auth')) {
    return;
  }
  
  localStorage.setItem(ROUTE_MEMORY_KEY, path);
};

export const getLastRoute = (): string => {
  return localStorage.getItem(ROUTE_MEMORY_KEY) || '/dashboard';
};

export const clearRouteMemory = (): void => {
  localStorage.removeItem(ROUTE_MEMORY_KEY);
};

export const isAuthRoute = (path: string): boolean => {
  return path.startsWith('/auth');
};
