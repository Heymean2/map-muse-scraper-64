
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function usePlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  
  // Fetch available plans, filtering out free plans
  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .not('price', 'eq', 0) // Filter out free plans
        .order('price');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Set default selected plan when data is loaded
  useEffect(() => {
    if (plansData && plansData.length > 0 && !selectedPlan) {
      setSelectedPlan(plansData[0]);
    }
  }, [plansData, selectedPlan]);

  return {
    selectedPlan,
    setSelectedPlan,
    plansData,
    plansLoading
  };
}
