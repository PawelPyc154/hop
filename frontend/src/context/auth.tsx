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
    // staleTime: 0,
    // gcTime: 0,
  });
  const user = userQuery.data;
  const isAuthenticated = !!user;
  // console.log("user", user, userQuery.error);
  // console.log("isAuthenticated", isAuthenticated);
  return (
    <AuthContext.Provider value={{ isAuthenticated, user: user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
