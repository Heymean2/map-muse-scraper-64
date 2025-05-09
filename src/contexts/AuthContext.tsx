
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { getLastRoute } from "@/services/routeMemory";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (mounted) {
          console.log(`Auth state changed: ${event}`);
          
          // Update on all auth state changes for better reliability
          setSession(newSession);
          setUser(newSession?.user || null);
          setLoading(false);
          
          // Provide feedback to user for major auth events
          if (event === "SIGNED_IN") {
            toast.success("Signed in successfully");
          } else if (event === "SIGNED_OUT") {
            toast.info("Signed out successfully");
          } else if (event === "TOKEN_REFRESHED") {
            console.log("Auth token refreshed");
          }
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
          throw error;
        }
        
        // Only update state if component is still mounted
        if (mounted) {
          console.log("Initial session retrieved:", !!data.session);
          setSession(data.session);
          setUser(data.session?.user || null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Function to manually refresh the session when needed
  const refreshSession = async () => {
    try {
      console.log("Manually refreshing session...");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        throw error;
      }
      
      console.log("Session refreshed successfully");
      setSession(data.session);
      setUser(data.session?.user || null);
      return data.session;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      throw error;
    }
  };

  // Implement the signOut function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state change listener will update the state
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const value = {
    session,
    user,
    loading,
    isLoading: loading,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
