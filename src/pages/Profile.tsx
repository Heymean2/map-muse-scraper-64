import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ProfileSection from "@/components/dashboard/ProfileSection";
import UserProfileCard from "@/components/dashboard/UserProfileCard";
export default function Profile() {
  return <Container>
      <div className="flex items-center justify-between mb-6 mt-7">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account information and settings</p>
        </div>
        <Link to="/dashboard/settings">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
      
      <div className="space-y-8">
        {/* User profile card */}
        <div className="animate-fade-in">
          <UserProfileCard />
        </div>
        
        <Separator />
        
        <Tabs defaultValue="account" className="w-full animate-fade-in">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <div className="animate-fade-in animate-delay-100">
              <ProfileSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>;
}