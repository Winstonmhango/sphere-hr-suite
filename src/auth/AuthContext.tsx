import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface User {
  email: string;
  name: string;
  role: "admin" | "manager" | "employee";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  defaultCredentials: { email: string; password: string };
}

const DEFAULT_CREDENTIALS = {
  email: "admin@spherehr.com",
  password: "admin123",
};

const DEFAULT_USER: User = {
  email: DEFAULT_CREDENTIALS.email,
  name: "Lisa Park",
  role: "admin",
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
      setUser(DEFAULT_USER);
      return { ok: true };
    }
    return { ok: false, error: "Invalid email or password" };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        defaultCredentials: DEFAULT_CREDENTIALS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
