
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { startScraping } from "@/services/scraper";
import { useAuth } from "@/contexts/AuthContext";
import FormError from "./FormError";
import LoadingButton from "./LoadingButton";

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
        const freshSession = await refreshSession();
        console.log("Session refreshed successfully", !!freshSession);
        
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
      {children}
      <LoadingButton isLoading={isLoading}>Start Scraping</LoadingButton>
    </form>
  );
}
