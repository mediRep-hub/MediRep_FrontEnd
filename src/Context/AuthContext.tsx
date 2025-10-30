import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface Admin {
  _id: string;
  adminId: string;
  name: string;
  phoneNumber: string;
  email: string;
  image: string;
  division: string;
  area: string;
  region: string;
  strategy: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: { admin: Admin; token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedData = localStorage.getItem("loginData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setAdmin(parsed.admin);
      setToken(parsed.token);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (data: { admin: Admin; token: string }) => {
    setAdmin(data.admin);
    setToken(data.token);
    setIsAuthenticated(true);
    localStorage.setItem("loginData", JSON.stringify(data));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("loginData");
  };

  return (
    <AuthContext.Provider
      value={{ admin, token, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
