
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useCheckoutUrlParams(plansData: any[], setSelectedPlan: (plan: any) => void) {
  const location = useLocation();
  const navigate = useNavigate();
  const [creditAmount, setCreditAmount] = useState<number>(1000);
  const [creditPrice, setCreditPrice] = useState<number>(0);
  const [planType, setPlanType] = useState<string>("subscription");
  
  // Parse URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planIdParam = params.get("planId");
    const planTypeParam = params.get("planType");
    const creditAmountParam = params.get("creditAmount");
    
    if (planTypeParam) {
      setPlanType(planTypeParam);
    }
    
    if (creditAmountParam) {
      setCreditAmount(parseInt(creditAmountParam));
    }
    
    // If we have plansData and a planId parameter, set the selected plan
    if (plansData && planIdParam) {
      // If it's a credit plan, find the credit plan
      if (planTypeParam === 'credits') {
        const creditPlan = plansData.find(p => p.billing_period === 'credits');
        if (creditPlan) {
          setSelectedPlan(creditPlan);
          
          // Set the price_per_credit from the actual plan data
          // If the database has precision issues, use a fallback value
          let pricePerCredit = creditPlan.price_per_credit;
          
          // If the price is 0 or undefined due to precision issues, use the hardcoded value
          if (!pricePerCredit || pricePerCredit < 0.001) {
            console.log("Using fallback price per credit: 0.00299");
            pricePerCredit = 0.00299;
            
            // Add the correct price to the plan object so it's available elsewhere
            creditPlan.price_per_credit = pricePerCredit;
          }
          
          setCreditPrice(pricePerCredit);
          console.log("Credit plan selected:", creditPlan, "Price per credit:", pricePerCredit);
        }
      } else {
        // For subscription plans, find by ID
        const plan = plansData.find(p => String(p.id) === planIdParam);
        if (plan) {
          setSelectedPlan(plan);
        }
      }
    } else if (plansData && plansData.length > 0 && !planIdParam) {
      // If no plan selected, redirect back to billing
      navigate('/dashboard/billing');
    }
  }, [location, plansData, setSelectedPlan, navigate]);

  // Fetch credit plan directly if it's not in the plansData
  useEffect(() => {
    if (planType === 'credits' && !plansData?.some(p => p.billing_period === 'credits')) {
      const fetchCreditPlan = async () => {
        try {
          const { data, error } = await supabase
            .from('pricing_plans')
            .select('*')
            .eq('billing_period', 'credits')
            .single();

          if (error) {
            console.error("Error fetching credit plan:", error);
            return;
          }

          if (data) {
            console.log("Credit plan fetched directly:", data);
            
            // Fix the price_per_credit if it's not coming correctly from the database
            if (!data.price_per_credit || data.price_per_credit < 0.001) {
              console.log("Fixing price per credit to 0.00299");
              data.price_per_credit = 0.00299;
            }
            
            setSelectedPlan(data);
            setCreditPrice(data.price_per_credit || 0.00299);
          }
        } catch (error) {
          console.error("Error in credit plan fetch:", error);
        }
      };

      fetchCreditPlan();
    }
  }, [planType, plansData, setSelectedPlan]);

  // Update URL when credit amount changes
  useEffect(() => {
    if (planType === 'credits') {
      const params = new URLSearchParams(location.search);
      params.set('creditAmount', creditAmount.toString());
      
      // Update URL without full page reload
      const newUrl = `${location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [creditAmount, planType, location]);

  return {
    creditAmount,
    setCreditAmount,
    creditPrice,
    setCreditPrice,
    planType,
    setPlanType
  };
}
