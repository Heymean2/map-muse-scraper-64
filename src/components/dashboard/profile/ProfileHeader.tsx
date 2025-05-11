
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileHeaderProps {
  email: string;
  createdAt: string;
}

export function ProfileHeader({ email, createdAt }: ProfileHeaderProps) {
  const { userDetails } = useAuth();
  
  // Format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Get user initials for avatar fallback
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
        <AvatarImage src={userDetails?.avatarUrl || ""} alt={email} />
        <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
          {getInitials(email)}
        </AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="text-2xl">
          {userDetails?.displayName || email}
          {userDetails?.provider === 'google' && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Google
            </span>
          )}
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Member since {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
}
