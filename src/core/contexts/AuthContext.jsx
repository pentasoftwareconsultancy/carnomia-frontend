import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import StorageService from "../services/storage.service"; // Adjust the import path as necessary

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Auto-sync from storage on mount
  useEffect(() => {
    const storedUser = StorageService.getData("user");
    if (storedUser) {
      console.log("my user logged")
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = useCallback((userData) => {
    setIsLoggedIn(true);
    setUser(userData.user);
    StorageService.setData("user", JSON.stringify(userData.user));
    StorageService.setData("token", userData.token);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    StorageService.clear();
  }, []);

  const hasRoles = (roles) => {
    const currentUser = StorageService.getData("user");
    if (!currentUser || !roles?.length) return false;
    const parsedUser = JSON.parse(currentUser);
    return parsedUser?.roles?.some((e) => roles.includes(e.roleName));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, hasRoles }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
