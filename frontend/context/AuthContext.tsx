
"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;

  setHasProfile: React.Dispatch<React.SetStateAction<boolean>>;
  hasProfile: boolean;

  setAuthEmail: React.Dispatch<React.SetStateAction<string>>;
  authEmail: string;

  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;

  getFirstLetter: () => string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>("");

  const getFirstLetter = () => {
    return typeof authEmail === "string" && authEmail.length > 0
      ? authEmail.charAt(0).toUpperCase()
      : "";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, hasProfile, setHasProfile, authEmail, setAuthEmail, isLoading, setIsLoading, getFirstLetter }}>
      {children}
    </AuthContext.Provider>
  );
};
