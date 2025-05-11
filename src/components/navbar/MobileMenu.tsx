
import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/navbar/NavLink";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: {
    label: string;
    href: string;
    isPage?: boolean;
  }[];
  user: any;
  handleSignOut: () => void;
  onCloseMenu: () => void;
}

export function MobileMenu({ 
  isOpen, 
  navLinks, 
  user, 
  handleSignOut, 
  onCloseMenu 
}: MobileMenuProps) {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg shadow-lg animate-slide-down">
      <Container className="py-4">
        <ul className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.isPage ? (
                <Link
                  to={link.href}
                  className="flex items-center gap-1 px-4 py-3 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  onClick={onCloseMenu}
                >
                  {link.label === "Dashboard" && <LayoutDashboard size={16} />}
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="block px-4 py-3 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  onClick={onCloseMenu}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
          <li className="pt-2 flex flex-col space-y-2">
            {user ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  handleSignOut();
                  onCloseMenu();
                }}
              >
                <LogOut size={16} className="mr-2" /> Sign Out
              </Button>
            ) : (
              <>
                <Link to="/auth" onClick={onCloseMenu}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?tab=signup" onClick={onCloseMenu}>
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </li>
        </ul>
      </Container>
    </div>
  );
}
