
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useAuthRedirect(returnUrl: string = "/dashboard") {
  const navigate = useNavigate();

  // Handle redirects if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth', { state: { returnUrl } });
      }
    };
    
    checkAuth();
  }, [navigate, returnUrl]);
}
