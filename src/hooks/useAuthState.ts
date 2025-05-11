
import { useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { UserDetails } from "@/types/auth";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  return {
    session,
    setSession,
    user,
    setUser,
    userDetails,
    setUserDetails,
    loading,
    setLoading,
    isLoading: loading,
  };
}
