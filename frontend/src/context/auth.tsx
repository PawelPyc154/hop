import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import axios from "axios";

export interface AuthContext {
  isAuthenticated: boolean;
  user: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axios.get("/users/me", { withCredentials: true }).then((res) => res.data),
  });

  const value = React.useMemo(
    () => ({ isAuthenticated: !!userQuery.data, user: userQuery.data }),
    [userQuery.data],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
