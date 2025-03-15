
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ScraperForm from "@/components/ScraperForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const Index = () => {
  // Smooth scroll implementation
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin + anchor.pathname === window.location.origin + window.location.pathname) {
        e.preventDefault();
        const targetId = anchor.hash.slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjusted for navbar height
            behavior: 'smooth'
          });
          
          // Update URL without reloading the page
          history.pushState(null, '', anchor.hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <ScraperForm />
        <ResultsDisplay />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
