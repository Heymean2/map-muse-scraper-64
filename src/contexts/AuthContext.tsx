
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Added isLoading as an alias to loading for consistency
  signOut: () => Promise<void>; // Added signOut function
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isLoading: true, // Also initialize isLoading
  signOut: async () => {}, // Initialize with empty function
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        // Only update state if component is still mounted
        if (mounted) {
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (mounted) {
          // Only update on actual auth state changes, not on tab focus
          if (
            event === "SIGNED_IN" || 
            event === "SIGNED_OUT" || 
            event === "USER_UPDATED" ||
            event === "TOKEN_REFRESHED"
          ) {
            console.log(`Auth state changed: ${event}`, newSession?.user?.email);
            setSession(newSession);
            setUser(newSession?.user || null);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Implement the signOut function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    session,
    user,
    loading,
    isLoading: loading, // Add isLoading as an alias to loading
    signOut, // Add the signOut function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
