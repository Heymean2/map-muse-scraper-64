
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useCurrentPlan() {
  // Fetch current user plan
  const { 
    data: currentPlanData, 
    isLoading: currentPlanLoading, 
    error: currentPlanError 
  } = useQuery({
    queryKey: ['currentPlan'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Not authenticated");
      }
      
      const response = await fetch(`https://culwnizfggplctdtujsz.supabase.co/functions/v1/getCurrentPlan`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error("Failed to fetch current plan:", await response.text());
        throw new Error("Failed to fetch current plan");
      }
      
      return response.json();
    }
  });
  
  return {
    currentPlanData,
    currentPlanLoading,
    currentPlanError
  };
}
