
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { withDelay, animationClasses } from "@/lib/animations";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Dashboard", href: "/dashboard", isPage: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check for user on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("You have been signed out");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-xl ${withDelay(animationClasses.fadeIn, 100)}`}>
            MapScraper
          </span>
        </div>

        {/* Desktop Navigation */}
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg shadow-lg animate-slide-down">
          <Container className="py-4">
            <ul className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.isPage ? (
                    <Link
                      to={link.href}
                      className="flex items-center gap-1 px-4 py-3 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label === "Dashboard" && <LayoutDashboard size={16} />}
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="block px-4 py-3 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                      onClick={() => setIsMenuOpen(false)}
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
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </Button>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}>
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
      )}
    </header>
  );
}
