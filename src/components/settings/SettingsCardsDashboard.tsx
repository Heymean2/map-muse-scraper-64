
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  Bell, 
  Languages, 
  Database, 
  UserCircle, 
  Lock,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettingsCategoryProps {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  iconColor?: string;
}

function SettingsCategory({ icon: Icon, title, description, to, iconColor }: SettingsCategoryProps) {
  return (
    <Link to={to} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
        <CardContent className="flex flex-col p-6 h-full">
          <div className={cn(
            "mb-4 rounded-full w-12 h-12 flex items-center justify-center",
            iconColor || "bg-primary/10 text-primary"
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface SettingsPageHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export function SettingsPageHeader({ title, showBackButton = false }: SettingsPageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {showBackButton && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          asChild
        >
          <Link to="/dashboard/settings">
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Link>
        </Button>
      )}
    </div>
  );
}

export default function SettingsCardsDashboard() {
  const categories = [
    {
      icon: UserCircle,
      title: "Account",
      description: "Manage your account settings and preferences",
      to: "/dashboard/settings/account",
      iconColor: "bg-blue-50 text-blue-600"
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize the look and feel of the application",
      to: "/dashboard/settings/appearance",
      iconColor: "bg-purple-50 text-purple-600"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure how and when you receive notifications",
      to: "/dashboard/settings/notifications",
      iconColor: "bg-yellow-50 text-yellow-600"
    },
    {
      icon: Lock,
      title: "Security",
      description: "Update your password and security settings",
      to: "/dashboard/settings/security",
      iconColor: "bg-red-50 text-red-600"
    },
    {
      icon: Languages,
      title: "Language & Region",
      description: "Set your preferred language and regional settings",
      to: "/dashboard/settings/language",
      iconColor: "bg-green-50 text-green-600"
    },
    {
      icon: Database,
      title: "Data & Privacy",
      description: "Manage your data and privacy preferences",
      to: "/dashboard/settings/data",
      iconColor: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <SettingsCategory 
            key={category.title}
            icon={category.icon}
            title={category.title}
            description={category.description}
            to={category.to}
            iconColor={category.iconColor}
          />
        ))}
      </div>
    </div>
  );
}
