import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { withDelay, animationClasses } from "@/lib/animations";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import FormContainer from "./scraper/FormContainer";
export default function ScraperForm() {
  const navigate = useNavigate();
  const {
    user,
    session
  } = useAuth();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && !session) {
      toast.error("You must be logged in to use this feature");
      navigate("/auth", {
        state: {
          returnTo: "/dashboard/scrape"
        }
      });
    }
  }, [user, session, navigate]);

  // Show loading state while checking authentication
  if (!user && !session) {
    return <Container className="max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Container>;
  }
  return <Container className="max-w-4xl">
      <div className="text-center max-w-3xl mx-auto mb-8 mt-7">
        <h2 className={`text-3xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
          Start Scraping in Minutes
        </h2>
        <p className={`text-lg text-slate-600 dark:text-slate-400 ${withDelay(animationClasses.slideUp, 200)}`}>
          Our intuitive interface makes it easy to extract the data you need from Google Maps.
        </p>
        <p className={`text-sm text-slate-500 dark:text-slate-500 mt-2 ${withDelay(animationClasses.slideUp, 300)}`}>
          When you start a scraping task, it's automatically sent to our external backend for immediate processing.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-xl">
          <FormContainer />
        </div>
      </div>
    </Container>;
}