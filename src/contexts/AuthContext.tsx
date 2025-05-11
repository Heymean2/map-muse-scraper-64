
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
  userDetails: UserDetails | null;
};

type UserDetails = {
  avatarUrl: string | null;
  provider: string | null;
  displayName: string | null;
};

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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details from profiles
  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, provider, display_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      setUserDetails({
        avatarUrl: data?.avatar_url || null,
        provider: data?.provider || 'email',
        displayName: data?.display_name || null,
      });
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

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
            fetchUserDetails(newSession.user.id);
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
            fetchUserDetails(data.session.user.id);
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
      
      // Fetch user details if we have a user
      if (data.session?.user) {
        fetchUserDetails(data.session.user.id);
      }
      
      return data.session;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      throw error;
    }
  };

  // Implement the signOut function with cleanup
  const signOut = async () => {
    try {
      // First clear any cached auth data
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Then sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Auth state change listener will update the state
      toast.info("Signed out successfully");
      setUserDetails(null);
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
    userDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
