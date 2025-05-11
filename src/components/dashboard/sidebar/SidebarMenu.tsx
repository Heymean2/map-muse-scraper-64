
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu as Menu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuBadge
} from "@/components/ui/sidebar";
import { SidebarMenuItem as MenuItem } from "./menuItems";

interface SidebarMenuProps {
  menuItems: MenuItem[];
  isActive: (path: string) => boolean;
}

export default function SidebarMenu({ menuItems, isActive }: SidebarMenuProps) {
  return (
    <SidebarContent className="px-2">
      <SidebarGroup>
        <Menu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path} className="group">
              <SidebarMenuButton 
                asChild 
                isActive={isActive(item.path)}
                tooltip={item.title}
                onMouseEnter={item.onMouseEnter}
                className={`my-1.5 flex items-center justify-start transition-all duration-300 ${item.hoverBg} ${isActive(item.path) ? "bg-primary-subtle/60" : ""}`}
              >
                <Link to={item.path} className="transition-colors flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-violet-primary" : item.color} transition-all duration-300 group-hover:scale-110`} />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{item.title}</span>
                </Link>
              </SidebarMenuButton>
              
              {/* Add badge if it exists */}
              {item.badge && (
                <SidebarMenuBadge 
                  className={`${item.badge.className || ""}`}
                >
                  {item.badge.count}
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          ))}
        </Menu>
      </SidebarGroup>
    </SidebarContent>
  );
}
