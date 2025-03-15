
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { animationClasses } from "@/lib/animations";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-slate-900 animate-fade-in">404</div>
          <div className="h-1 w-16 bg-accent mx-auto my-6 animate-scale-in"></div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800 animate-slide-up">
          Page Not Found
        </h1>
        
        <p className="text-slate-600 mb-8 animate-slide-up animation-delay-100">
          We couldn't find the page you're looking for. The page might have been moved or deleted.
        </p>
        
        <Button
          asChild
          className="animate-fade-in animation-delay-200"
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
