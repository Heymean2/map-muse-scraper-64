import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { startScraping, getUserPlanInfo } from "@/services/scraper";
import { useAuth } from "@/contexts/AuthContext";
import FormError from "./FormError";
import LoadingButton from "./LoadingButton";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CreditCard, InfinityIcon } from "lucide-react";
import { UserPlanInfo } from "@/services/scraper/types";

interface FormSubmissionHandlerProps {
  searchQuery: string;
  selectedCategory: string;
  useKeyword: boolean;
  selectedCountry: string;
  selectedStates: string[];
  selectedDataTypes: string[];
  selectedRating: string;
  children: React.ReactNode;
}

export default function FormSubmissionHandler({
  searchQuery,
  selectedCategory,
  useKeyword,
  selectedCountry,
  selectedStates,
  selectedDataTypes,
  selectedRating,
  children
}: FormSubmissionHandlerProps) {
  const navigate = useNavigate();
  const { refreshSession, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Get user plan information with refetchOnMount and refetchOnWindowFocus
  const { data: planInfo, isLoading: planInfoLoading, refetch: refetchPlanInfo } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo,
    enabled: !!session,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 30000 // 30 seconds
  });
  
  console.log("FormSubmissionHandler - planInfo:", planInfo);
  
  // Determine plan types
  const isCreditBasedPlan = planInfo?.billing_period === 'credits';
  const isSubscriptionPlan = planInfo?.billing_period === 'monthly' && !planInfo?.isFreePlan;
  const hasBothPlanTypes = planInfo?.hasBothPlanTypes;

  // Function to ensure user is authenticated
  const ensureAuthenticated = async () => {
    if (!session) {
      toast.error("You must be logged in to use this feature");
      navigate("/auth", { state: { returnTo: "/dashboard/scrape" } });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setFormError(null);
    setIsLoading(true);
    
    try {
      // Check authentication first
      if (!await ensureAuthenticated()) {
        setIsLoading(false);
        return;
      }
      
      // Form validation
      if (!useKeyword && !selectedCategory) {
        setFormError("Please select a category or use a keyword");
        toast.error("Please select a category or use a keyword");
        setIsLoading(false);
        return;
      }
      
      if (!selectedCountry) {
        setFormError("Please select a country");
        toast.error("Please select a country");
        setIsLoading(false);
        return;
      }
      
      if (selectedStates.length === 0) {
        setFormError("Please select at least one state");
        toast.error("Please select at least one state");
        setIsLoading(false);
        return;
      }
      
      if (selectedDataTypes.length === 0) {
        setFormError("Please select at least one data type to extract");
        toast.error("Please select at least one data type to extract");
        setIsLoading(false);
        return;
      }
      
      // Ensure session is fresh before making the request
      try {
        console.log("Refreshing session before scraping...");
        await refreshSession();
        console.log("Session refreshed successfully");
        
        // Wait for token to be properly saved/propagated
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (refreshError) {
        console.error("Failed to refresh session:", refreshError);
        
        // Try to sign in again if refresh fails
        toast.error("Session refresh failed. Please try signing in again.");
        setFormError("Session refresh failed. Please try signing in again.");
        navigate('/auth', { state: { returnTo: '/dashboard/scrape' } });
        setIsLoading(false);
        return;
      }
      
      // Prepare keywords
      const keywords = useKeyword ? searchQuery : selectedCategory;
      
      // Start scraping with loading toast
      const toastId = toast.loading("Starting scraping process...");
      
      const result = await startScraping({
        keywords,
        country: selectedCountry,
        states: selectedStates,
        fields: selectedDataTypes,
        rating: selectedRating || undefined
      });
      
      toast.dismiss(toastId);
      
      if (result.success) {
        toast.success("Scraping started successfully");
        // Redirect to results page with task ID
        navigate(`/result${result.task_id ? `?task_id=${result.task_id}` : ''}`);
      } else {
        toast.error(result.error || "Failed to start scraping");
        setFormError(result.error || "Failed to start scraping");
        
        // If auth error, redirect to auth page
        if (result.error?.toLowerCase().includes('auth')) {
          toast.error("Authentication issue detected. Please sign in again.");
          navigate('/auth', { state: { returnTo: '/dashboard/scrape' } });
        }
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while processing your request");
      setFormError(`An unexpected error occurred: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormError error={formError} />
      
      {/* Show active plan info */}
      {hasBothPlanTypes && (
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertTitle>You have multiple plans</AlertTitle>
          <AlertDescription>
            Your subscription plan will be used first. After your subscription expires, you can use your available credits ({planInfo?.credits} credits).
          </AlertDescription>
        </Alert>
      )}
      
      {!hasBothPlanTypes && planInfo && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md mb-4">
          <div className="text-sm font-medium mb-1">Current Plan:</div>
          <div className="flex items-center gap-2 text-sm">
            {isSubscriptionPlan ? (
              <>
                <InfinityIcon className="h-4 w-4 text-green-500" />
                <span>Unlimited access with {planInfo.planName}</span>
              </>
            ) : isCreditBasedPlan ? (
              <>
                <CreditCard className="h-4 w-4 text-blue-500" />
                <span>{planInfo.credits} credits available</span>
              </>
            ) : (
              <span>Free Plan ({planInfo.totalRows} / {planInfo.freeRowsLimit} rows used)</span>
            )}
          </div>
        </div>
      )}
      
      {children}
      <LoadingButton isLoading={isLoading}>Start Scraping</LoadingButton>
    </form>
  );
}
