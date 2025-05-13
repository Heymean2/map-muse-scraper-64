
import { ReactNode } from "react";

/**
 * Returns the appropriate color classes for a task status
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200';
    case 'processing':
      return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
  }
};

/**
 * Returns the appropriate status indicator icon
 */
export const getStatusIcon = (status: string): ReactNode => {
  // Using the ReactNode type allows us to return JSX elements
  switch (status) {
    case 'completed':
      return <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1.5"></span>;
    case 'processing':
      return <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse mr-1.5"></span>;
    case 'failed':
      return <span className="h-2.5 w-2.5 rounded-full bg-red-500 mr-1.5"></span>;
    default:
      return <span className="h-2.5 w-2.5 rounded-full bg-slate-500 mr-1.5"></span>;
  }
};
