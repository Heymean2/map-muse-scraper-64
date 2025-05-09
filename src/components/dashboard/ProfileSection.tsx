
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import EmailChangeForm from "@/components/account/EmailChangeForm";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";

export default function ProfileSection() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Account Management
        </CardTitle>
        <CardDescription>Update your email and password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Email Change Section */}
        <EmailChangeForm />
        
        {/* Password Change Section */}
        <PasswordChangeForm />
      </CardContent>
    </Card>
  );
}
