import { createContext, useContext, useEffect, useState } from "react";

const SESSION_COOKIE = "datamint-demo-session";
const AuthContext = createContext(null);

function readSession() {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
    if (!cookie) {
      return null;
    }
    const parsed = JSON.parse(decodeURIComponent(cookie.slice(SESSION_COOKIE.length + 1)));
    if (!parsed || typeof parsed.email !== "string") {
      return null;
    }
    return {
      email: parsed.email,
      name: typeof parsed.name === "string" ? parsed.name : "",
    };
  } catch {
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  useEffect(() => {
    const syncSession = () => setUser(readSession());
    window.addEventListener("focus", syncSession);
    document.addEventListener("visibilitychange", syncSession);
    return () => {
      window.removeEventListener("focus", syncSession);
      document.removeEventListener("visibilitychange", syncSession);
    };
  }, []);

  const startDemoSession = ({ email, name = "" }) => {
    const nextUser = { email: email.trim().toLowerCase(), name: name.trim() };
    document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(JSON.stringify(nextUser))}; Path=/; SameSite=Lax`;
    setUser(nextUser);
  };

  const logout = () => {
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, startDemoSession, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
