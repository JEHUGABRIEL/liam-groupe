"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, sessionAction } from "@/lib/client";

const AuthContext = createContext(null);

/** Utilisateur connecté (profil de /api/me), ou null. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      setUser(await api("/me"));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const login = useCallback(async (credentials) => {
    await sessionAction("login", credentials);
    await reload();
  }, [reload]);

  const register = useCallback(async (form) => {
    await sessionAction("register", form);
    await reload();
  }, [reload]);

  const logout = useCallback(async () => {
    await sessionAction("logout").catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAdmin: user?.role === "ADMIN", login, register, logout, reload, setUser }),
    [user, loading, login, register, logout, reload],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return context;
}
