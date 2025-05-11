
import { Session, User } from "@supabase/supabase-js";

export type UserDetails = {
  avatarUrl: string | null;
  provider: string | null;
  displayName: string | null;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
  userDetails: UserDetails | null;
};
