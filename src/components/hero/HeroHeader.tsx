import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { withDelay, animationClasses } from "@/lib/animations";
const HeroHeader = () => {
  return <>
      <div className={`inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-accent/10 text-accent rounded-full ${withDelay(animationClasses.fadeIn, 100)}`}>
        <span className="relative">Google Maps Data at Your Fingertips</span>
      </div>
      
      <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 ${withDelay(animationClasses.slideUp, 200)}`}>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Extract Valuable Data</span> from Google Maps with Ease
      </h1>
      
      <p className={`text-xl text-slate-600 max-w-2xl mx-auto mb-8 ${withDelay(animationClasses.slideUp, 300)}`}>
        The most powerful and intuitive tool for extracting business data from Google Maps. Save hours of manual research and get more leads.
      </p>
      
      <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${withDelay(animationClasses.slideUp, 400)}`}>
        <Link to="/auth?tab=signup">
          <Button size="lg" className="min-w-[150px] h-12 text-base group">
            <span>Start Scraping Now</span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </Link>
        <Link to="#how-it-works">
          
        </Link>
      </div>

      
    </>;
};
export default HeroHeader;