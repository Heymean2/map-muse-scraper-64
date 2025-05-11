
import { createContext, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { fetchUserDetails } from "@/services/userProfiles";
import { signOut as authSignOut, refreshSession as authRefreshSession } from "@/services/authServices";

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => null,
  userDetails: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    session, setSession,
    user, setUser,
    userDetails, setUserDetails,
    loading, setLoading,
    isLoading 
  } = useAuthState();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        
        console.log(`Auth state changed: ${event}`);
        
        // Update on all auth state changes for better reliability
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Fetch user details if we have a user
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserDetails(newSession.user.id).then(details => {
              if (details) setUserDetails(details);
            });
          }, 0);
        }
        
        if (event === "SIGNED_IN") {
          toast.success("Signed in successfully");
          
          // Ensure session is completely set up
          setTimeout(() => {
            setLoading(false);
          }, 300);
        } else if (event === "SIGNED_OUT") {
          toast.info("Signed out successfully");
          setLoading(false);
          setUserDetails(null);
        } else if (event === "TOKEN_REFRESHED") {
          console.log("Auth token refreshed");
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          if (mounted) setLoading(false);
          return;
        }
        
        if (mounted) {
          console.log("Initial session retrieved:", !!data.session);
          setSession(data.session);
          setUser(data.session?.user || null);
          
          // Fetch user details if we have a user
          if (data.session?.user) {
            fetchUserDetails(data.session.user.id).then(details => {
              if (details) setUserDetails(details);
            });
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Wrap the signOut function
  const handleSignOut = async () => {
    await authSignOut();
    setUserDetails(null);
  };

  // Wrap the refreshSession function
  const handleRefreshSession = async () => {
    const newSession = await authRefreshSession();
    setSession(newSession);
    setUser(newSession?.user || null);
    
    // Fetch user details if we have a user
    if (newSession?.user) {
      const details = await fetchUserDetails(newSession.user.id);
      if (details) setUserDetails(details);
    }
    
    return newSession;
  };

  const value = {
    session,
    user,
    loading,
    isLoading,
    signOut: handleSignOut,
    refreshSession: handleRefreshSession,
    userDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
