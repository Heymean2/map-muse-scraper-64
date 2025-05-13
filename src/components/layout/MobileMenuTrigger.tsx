
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileMenuTrigger() {
  const { toggleSidebar } = useSidebar();
  
  return (
    <div className="fixed left-4 top-20 z-40 block md:hidden">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleSidebar}
        className="bg-background shadow-md border border-slate-200"
        aria-label="Toggle sidebar menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}
