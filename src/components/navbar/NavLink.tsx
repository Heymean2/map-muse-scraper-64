
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface NavLinkProps {
  href: string;
  isPage?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function NavLink({ href, isPage, onClick, children, className }: NavLinkProps) {
  const location = useLocation();
  const baseClasses = "rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all";
  const fullClasses = `${baseClasses} ${className || ""}`;
  
  // Handle anchor links when not on homepage
  const isAnchorLink = href.startsWith('#');
  const isHomepage = location.pathname === '/';
  
  // If it's an anchor link but we're not on homepage, redirect to homepage first
  if (isAnchorLink && !isHomepage && !isPage) {
    const anchorTarget = href;
    return (
      <Link 
        to={`/${anchorTarget}`} 
        className={fullClasses} 
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  if (isPage) {
    return (
      <Link to={href} className={fullClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }
  
  return (
    <a href={href} className={fullClasses} onClick={onClick}>
      {children}
    </a>
  );
}
