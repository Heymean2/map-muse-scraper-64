
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { withDelay, animationClasses } from "@/lib/animations";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopNav } from "@/components/navbar/DesktopNav";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { useNavbar } from "@/components/navbar/useNavbar";
import { navLinks } from "@/components/navbar/navConstants";

export default function Navbar() {
  const { isScrolled, isMenuOpen, user, handleSignOut, toggleMenu, closeMenu } = useNavbar();
  const isMobile = useIsMobile();

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
        <DesktopNav 
          navLinks={navLinks} 
          user={user} 
          handleSignOut={handleSignOut} 
        />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      {isMobile && (
        <MobileMenu 
          isOpen={isMenuOpen} 
          navLinks={navLinks} 
          user={user} 
          handleSignOut={handleSignOut} 
          onCloseMenu={closeMenu}
        />
      )}
    </header>
  );
}
