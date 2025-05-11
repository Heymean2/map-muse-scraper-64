
import { Link } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withDelay, animationClasses } from "@/lib/animations";

interface DesktopNavProps {
  navLinks: {
    label: string;
    href: string;
    isPage?: boolean;
  }[];
  user: any;
  handleSignOut: () => void;
}

export function DesktopNav({ navLinks, user, handleSignOut }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      <ul className="flex space-x-2">
        {navLinks.map((link, index) => (
          <li key={link.label} className={withDelay(animationClasses.fadeIn, 150 + (index * 50))}>
            {link.isPage ? (
              <Link
                to={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1"
              >
                {link.label === "Dashboard" && <LayoutDashboard size={16} />}
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
      
      <div className="pl-4 flex space-x-2">
        {user ? (
          <>
            <Button 
              variant="outline" 
              className={withDelay(animationClasses.fadeIn, 400)}
              onClick={handleSignOut}
            >
              <LogOut size={16} className="mr-2" /> Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link to="/auth">
              <Button variant="outline" className={withDelay(animationClasses.fadeIn, 400)}>
                Sign In
              </Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button className={withDelay(animationClasses.fadeIn, 450)}>
                Get Started
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
