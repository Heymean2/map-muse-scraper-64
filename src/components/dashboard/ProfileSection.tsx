
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileSection() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailChangeLoading, setIsEmailChangeLoading] = useState(false);
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false);
  
  // Handle email change
  const handleEmailChange = async () => {
    if (!newEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a new email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsEmailChangeLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        email: newEmail 
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification Email Sent",
        description: "Please check your new email inbox to confirm the change.",
      });
      
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEmailChangeLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "All Fields Required",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPasswordChangeLoading(true);
    
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });
      
      if (signInError) {
        toast({
          title: "Incorrect Password",
          description: "Your current password is incorrect.",
          variant: "destructive",
        });
        setIsPasswordChangeLoading(false);
        return;
      }
      
      // Now update the password
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordChangeLoading(false);
    }
  };

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <CardTitle>{user?.email}</CardTitle>
            <CardDescription>Account Member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                <span>Email: {user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>User ID: {user?.id?.substring(0, 8)}...</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Management */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>Update your email and password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Change Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Email</h3>
              <div className="grid gap-2">
                <Label htmlFor="new-email">New Email Address</Label>
                <div className="flex gap-2">
                  <Input 
                    id="new-email" 
                    type="email" 
                    placeholder="Enter new email" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <Button 
                    onClick={handleEmailChange}
                    disabled={isEmailChangeLoading || !newEmail}
                  >
                    {isEmailChangeLoading ? "Updating..." : "Update"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  You'll need to verify your new email address before the change takes effect.
                </p>
              </div>
            </div>
            
            <Separator />
            
            {/* Password Change Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <div className="space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handlePasswordChange}
                  disabled={isPasswordChangeLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="mt-2"
                >
                  {isPasswordChangeLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
