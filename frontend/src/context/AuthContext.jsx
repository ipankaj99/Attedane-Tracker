import { createContext, useEffect, useState, useCallback } from 'react';

export const AuthContext = createContext();

// AuthProvider.jsx
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

   
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5071/api/Auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const freshUser = await response.json();
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      }
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
     
      await refreshUser();
      setIsAuthenticated(true);
      setLoading(false);
    };

    validateToken();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, setIsAuthenticated, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};