
import { ReactNode } from "react";

/**
 * Returns the appropriate color classes for a task status
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Returns the appropriate status indicator icon
 */
export const getStatusIcon = (status: string): ReactNode => {
  // Using the ReactNode type allows us to return JSX elements from HeaderTitle.tsx
  switch (status) {
    case 'completed':
      return <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>;
    case 'processing':
      return <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mr-1.5"></span>;
    case 'failed':
      return <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>;
    default:
      return <span className="h-2 w-2 rounded-full bg-gray-500 mr-1.5"></span>;
  }
};
