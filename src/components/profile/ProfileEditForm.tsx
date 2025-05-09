
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { User, UserCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  job_title: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
});

interface ProfileFormProps {
  initialData?: {
    full_name?: string | null;
    job_title?: string | null;
    company?: string | null;
    location?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
  };
  onSuccess?: () => void;
}

export default function ProfileEditForm({ initialData, onSuccess }: ProfileFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar_url || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData?.full_name || "",
      job_title: initialData?.job_title || "",
      company: initialData?.company || "",
      location: initialData?.location || "",
      bio: initialData?.bio || "",
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    setIsUploading(true);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      toast.error("Error uploading avatar: " + error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      let avatarUrl = initialData?.avatar_url || null;
      
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error("Error updating profile: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Upload Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center mb-4">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src={avatarPreview || ""} alt="Profile" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {initialData?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || <UserCircle />}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h3 className="text-lg font-medium">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                Upload a new profile picture. JPG, PNG or GIF. 2MB max.
              </p>
              <div>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm">
                    <User className="mr-2 h-4 w-4" />
                    Change avatar
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleAvatarChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Profile Information Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="job_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, CA" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about yourself" 
                    {...field}
                    value={field.value || ""}
                    className="min-h-[120px]" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {(isSubmitting || isUploading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
