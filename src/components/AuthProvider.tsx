import type { AuthError, SupabaseClient, User } from "@supabase/supabase-js";
import React from "react";

export type AuthContext = {
  isLoading: boolean;
  user?: User | null;
  error?: AuthError | null;
  supabaseClient: SupabaseClient;
};

const AuthContext = React.createContext<AuthContext>({
  isLoading: false,
  user: null,
  error: null,
  supabaseClient: {} as any,
});

export const useAuth = () => React.useContext(AuthContext);

type Props = {
  children: React.ReactNode;
  supabaseClient: SupabaseClient;
};

export const AuthProvider = ({ children, supabaseClient }: Props) => {
  const [user, setUser] = React.useState<User | null | undefined>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<AuthError>();

  React.useEffect(() => {
    setIsLoading(true);
    const getUser = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      const currentUser = data.session?.user;

      if (error) {
        setError(error);
      }
      setUser(currentUser ?? null);
      setIsLoading(false);
    };
    getUser();
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, user, error, supabaseClient }}>
      {!isLoading ? children : null}
    </AuthContext.Provider>
  );
};

export function useSupabaseClient<
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database
>() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useSupabaseClient must be used within a AuthContext.`);
  }

  return context.supabaseClient as SupabaseClient<Database, SchemaName>;
}
