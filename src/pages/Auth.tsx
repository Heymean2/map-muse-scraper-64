
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { withDelay, animationClasses } from "@/lib/animations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLastRoute } from "@/services/routeMemory";
import { Separator } from "@/components/ui/separator";
import { Google } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse URL params to determine active tab
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';

  // Check auth status on page load
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Use stored location or from state, or fall back to last saved route
        const from = location.state?.from || getLastRoute();
        navigate(from);
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Use stored location or fall back to last saved route
          const from = location.state?.from || getLastRoute();
          navigate(from);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.state]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        toast.success("Sign up successful! Please check your email to confirm your account.");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
      toast.error(error.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        toast.success("Successfully signed in!");
        // Navigate to the stored route or dashboard
        const from = location.state?.from || getLastRoute();
        navigate(from);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during sign in");
      toast.error(error.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;
      
      // The redirect happens automatically, no need to navigate
    } catch (error: any) {
      setError(error.message || "An error occurred with Google sign in");
      toast.error(error.message || "Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <Container className={`max-w-md w-full ${withDelay(animationClasses.fadeIn, 100)}`}>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Sign In</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Processing..." : "Sign In"}
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-background px-2 text-xs text-muted-foreground">
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <Google className="h-4 w-4" />
                      Google
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Sign Up</CardTitle>
                  <CardDescription>
                    Create a new account to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters
                      </p>
                    </div>
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Processing..." : "Create Account"}
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-background px-2 text-xs text-muted-foreground">
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <Google className="h-4 w-4" />
                      Google
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
