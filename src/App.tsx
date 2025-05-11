
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { saveRoute } from "@/services/routeMemory";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Results from "@/pages/Results";
import NotFound from "@/pages/NotFound";
import Checkout from "@/pages/Checkout";
import Billing from "@/pages/Billing";

// Route listener component to save routes
function RouteListener() {
  const location = useLocation();
  
  useEffect(() => {
    saveRoute(location.pathname);
  }, [location.pathname]);
  
  return null;
}

function App() {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <RouteListener />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
            <Route path="/result/*" element={<Navigate to="/dashboard/results/*" replace />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/billing" element={<Navigate to="/dashboard/billing" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
