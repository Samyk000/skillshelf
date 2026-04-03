"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/lib/supabase/client";

interface UserState {
  id: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: UserState | null;
  loading: boolean;
  refresh: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalView: "login" | "signup" | "forgot-password";
  openAuthModal: (view?: "login" | "signup" | "forgot-password") => void;
  closeAuthModal: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
  isAuthModalOpen: false,
  authModalView: "login",
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup" | "forgot-password">("login");
  const isLoadingRef = useRef(false);

  const openAuthModal = useCallback((view: "login" | "signup" | "forgot-password" = "login") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const loadUser = useCallback(async () => {
    // Prevent concurrent loads (handles rapid-fire calls from onAuthStateChange + visibilitychange)
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    const supabase = createClient();

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authUser.id)
          .single();

        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          role: profile?.role ?? "user",
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
    isLoadingRef.current = false;
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Initial load
    loadUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED"
      ) {
        loadUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUser]);

  // Refresh when the page becomes visible again (handles cross-tab auth changes)
  // Debounced to prevent excessive queries on rapid tab switches
  useEffect(() => {
    let lastFetch = 0;
    const COOLDOWN_MS = 5000;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        if (now - lastFetch > COOLDOWN_MS) {
          lastFetch = now;
          loadUser();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [loadUser]);

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        loading, 
        refresh: loadUser,
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
