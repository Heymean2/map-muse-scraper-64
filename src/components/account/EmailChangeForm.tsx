import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function EmailChangeForm() {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [isEmailChangeLoading, setIsEmailChangeLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  
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

  return (
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
  );
}
