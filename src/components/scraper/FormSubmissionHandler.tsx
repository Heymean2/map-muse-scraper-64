
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
  const { refreshSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setFormError(null);
    setIsLoading(true);
    
    try {
      // Form validation
      if (!useKeyword && !selectedCategory) {
        setFormError("Please select a category or use a keyword");
        toast.error("Please select a category or use a keyword");
        return;
      }
      
      if (!selectedCountry) {
        setFormError("Please select a country");
        toast.error("Please select a country");
        return;
      }
      
      if (selectedStates.length === 0) {
        setFormError("Please select at least one state");
        toast.error("Please select at least one state");
        return;
      }
      
      if (selectedDataTypes.length === 0) {
        setFormError("Please select at least one data type to extract");
        toast.error("Please select at least one data type to extract");
        return;
      }
      
      // Ensure session is fresh
      try {
        console.log("Attempting to refresh session before scraping...");
        await refreshSession();
        console.log("Session refreshed successfully");
      } catch (refreshError) {
        console.error("Failed to refresh session:", refreshError);
        // We'll try to continue anyway
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
      
      if (result.success) {
        toast.dismiss(toastId);
        toast.success("Scraping started successfully");
        // Redirect to results page with task ID
        navigate(`/result${result.task_id ? `?task_id=${result.task_id}` : ''}`);
      } else {
        toast.dismiss(toastId);
        toast.error(result.error || "Failed to start scraping");
        setFormError(result.error || "Failed to start scraping");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while processing your request");
      setFormError("An unexpected error occurred. Please try again.");
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
