
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Session, User } from "@supabase/supabase-js";
import { UserDetails, AuthContextType } from "@/types/auth";
import { signOut as authSignOut, refreshSession as authRefreshSession } from "@/services/authServices";

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Add a flag to track if this is the initial session load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const navigate = useNavigate();

  // Fetch user profile details when user changes
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) {
        setUserDetails(null);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url, provider, display_name')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user details:", error);
          return;
        }
        
        setUserDetails({
          avatarUrl: data.avatar_url,
          provider: data.provider,
          displayName: data.display_name
        });
      } catch (error) {
        console.error("Unexpected error fetching user details:", error);
      }
    };
    
    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  useEffect(() => {
    // Check for session when the component mounts
    const getInitialSession = async () => {
      console.info("Getting initial session...");
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        if (data?.session) {
          setUser(data.session.user);
          setSession(data.session);
          // Don't show toast on initial page load
          console.info("Initial session retrieved:", !!data.session);
        }
      } catch (error) {
        console.error("Unexpected error getting session:", error);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.info("Auth state changed:", event);
        
        if (newSession) {
          setUser(newSession.user);
          setSession(newSession);
          
          // Only show "Signed in successfully" on a genuine sign-in event, not on token refreshes
          if (event === "SIGNED_IN" && !isInitialLoad) {
            toast.success("Signed in successfully");
          }
        } else {
          setUser(null);
          setSession(null);
          
          if (event === "SIGNED_OUT") {
            toast.info("Signed out successfully");
            navigate("/");
          }
        }
        
        setIsLoading(false);
      }
    );

    // Return a cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isInitialLoad]);

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await authSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };
  
  // Refresh session function
  const refreshSession = async () => {
    try {
      const newSession = await authRefreshSession();
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
      }
      return newSession;
    } catch (error) {
      console.error("Error refreshing session:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading: isLoading,
        isLoading,
        refreshSession,
        signUp,
        signIn,
        signOut,
        userDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
