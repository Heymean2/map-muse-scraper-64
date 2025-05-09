import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, AlertCircle, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileSection() {
  const { user } = useAuth();
  
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailChangeLoading, setIsEmailChangeLoading] = useState(false);
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Handle email change
  const handleEmailChange = async () => {
    if (!newEmail) {
      toast.error("Please enter a new email address.");
      return;
    }
    
    setIsEmailChangeLoading(true);
    setEmailSuccess(false);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        email: newEmail 
      });
      
      if (error) throw error;
      
      toast.success("Verification email sent. Please check your inbox.");
      setEmailSuccess(true);
      // Keep the email in the field so user remembers what they entered
    } catch (error: any) {
      toast.error(error.message || "Failed to update email. Please try again.");
      setEmailSuccess(false);
    } finally {
      setIsEmailChangeLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation don't match.");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    
    setIsPasswordChangeLoading(true);
    setPasswordSuccess(false);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully.");
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password. Please try again.");
      setPasswordSuccess(false);
    } finally {
      setIsPasswordChangeLoading(false);
    }
  };

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
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Settings
            </h3>
            {emailSuccess && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Verification email sent
              </span>
            )}
          </div>
          
          <div className="grid gap-3">
            <div>
              <Label htmlFor="current-email" className="text-sm font-medium">
                Current Email
              </Label>
              <Input 
                id="current-email" 
                value={user?.email || ""}
                disabled
                className="bg-muted/50 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="new-email" className="text-sm font-medium">
                New Email Address
              </Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  id="new-email" 
                  type="email" 
                  placeholder="Enter new email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleEmailChange}
                  disabled={isEmailChangeLoading || !newEmail}
                  className="whitespace-nowrap"
                >
                  {isEmailChangeLoading ? "Sending..." : "Update Email"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                You'll need to verify your new email address before the change takes effect.
              </p>
            </div>
          </div>
        </div>
        
        {/* Password Change Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Password Settings
            </h3>
            {passwordSuccess && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Password updated
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="current-password" className="text-sm font-medium">
                Current Password
              </Label>
              <Input 
                id="current-password" 
                type="password" 
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="new-password" className="text-sm font-medium">
                New Password
              </Label>
              <Input 
                id="new-password" 
                type="password" 
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm New Password
              </Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Passwords don't match
                </div>
              )}
            </div>
            
            <Button 
              onClick={handlePasswordChange}
              disabled={isPasswordChangeLoading || !currentPassword || !newPassword || !confirmPassword}
              className="w-full mt-2"
            >
              {isPasswordChangeLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
