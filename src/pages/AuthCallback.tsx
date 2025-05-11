
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getLastRoute } from '@/services/routeMemory';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          toast.success("Successfully signed in!");
          // Navigate to the dashboard or the last route
          const lastRoute = getLastRoute() || '/dashboard';
          navigate(lastRoute, { replace: true });
        } else {
          // If there's no session, redirect to the auth page
          navigate('/auth', { replace: true });
        }
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        toast.error(error.message || "Authentication failed");
        navigate('/auth', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
