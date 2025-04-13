import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string;
  login: (user: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  const login = (data: any) => {
    setIsAuthenticated(true);
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ isAuthenticated, user, accessToken, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
