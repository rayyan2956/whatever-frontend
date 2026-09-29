"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthSession, User } from "@/api/types";
import { api, refreshSession, setAccessToken, setSessionEndedHandler } from "./api";

type AuthState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: User }
  | { status: "anonymous"; user: null };

interface AuthContextValue {
  status: AuthState["status"];
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  reloadUser: () => Promise<void>;
  // After the profile is saved, so every screen shows the new values.
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });

  const startSession = useCallback((session: AuthSession) => {
    setAccessToken(session.accessToken);
    setState({ status: "authenticated", user: session.user });
  }, []);

  const endSession = useCallback(() => {
    setAccessToken(null);
    setState({ status: "anonymous", user: null });
  }, []);

  // On load, trade the refresh cookie for an access token.
  useEffect(() => {
    setSessionEndedHandler(endSession);
    refreshSession().then((session) => {
      if (session) startSession(session);
      else endSession();
    });
    return () => setSessionEndedHandler(null);
  }, [startSession, endSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      startSession(
        await api<AuthSession>("/auth/login", {
          method: "POST",
          body: { email, password },
          auth: false,
        }),
      );
    },
    [startSession],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      startSession(
        await api<AuthSession>("/auth/google", {
          method: "POST",
          body: { idToken },
          auth: false,
        }),
      );
    },
    [startSession],
  );

  const logout = useCallback(async () => {
    await api("/auth/logout", { method: "POST", auth: false }).catch(() => undefined);
    endSession();
  }, [endSession]);

  const logoutAll = useCallback(async () => {
    await api("/auth/logout-all", { method: "POST" });
    endSession();
  }, [endSession]);

  const reloadUser = useCallback(async () => {
    const user = await api<User>("/auth/me");
    setState({ status: "authenticated", user });
  }, []);

  const setUser = useCallback((user: User) => {
    setState({ status: "authenticated", user });
  }, []);

  const value = useMemo(
    () => ({
      status: state.status,
      user: state.user,
      login,
      loginWithGoogle,
      logout,
      logoutAll,
      reloadUser,
      setUser,
    }),
    [state, login, loginWithGoogle, logout, logoutAll, reloadUser, setUser],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
