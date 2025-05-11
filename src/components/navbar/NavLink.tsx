
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  isPage?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function NavLink({ href, isPage, onClick, children, className }: NavLinkProps) {
  const baseClasses = "rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all";
  const fullClasses = `${baseClasses} ${className || ""}`;

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
