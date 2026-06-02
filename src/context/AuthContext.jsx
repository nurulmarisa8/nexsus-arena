import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock users database untuk development
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@nexusarena.gg',
    password: 'admin123',
    role: 'admin',
    avatar: null,
    division: 'Command Center',
  },
  {
    id: 2,
    username: 'ShadowStep',
    email: 'player@nexusarena.gg',
    password: 'player123',
    role: 'player',
    avatar: null,
    division: 'Vanguard Division',
    teamId: 1,
    teamName: 'Void Walkers',
  },
  {
    id: 3,
    username: 'RedViper',
    email: 'redviper@nexusarena.gg',
    password: 'player123',
    role: 'player',
    avatar: null,
    division: 'Vanguard Division',
    teamId: null,
    teamName: null,
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('nexus_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const found = MOCK_USERS.find(
        u => (u.email === email || u.username === email) && u.password === password
      );
      if (!found) throw new Error('Email atau password salah.');
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('nexus_user', JSON.stringify(safeUser));
      return safeUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const exists = MOCK_USERS.find(u => u.email === data.email || u.username === data.username);
      if (exists) throw new Error('Email atau username sudah terdaftar.');
      const newUser = {
        id: MOCK_USERS.length + 1,
        username: data.username,
        email: data.email,
        role: 'player',
        avatar: null,
        division: 'Rookie Division',
        teamId: null,
        teamName: null,
      };
      MOCK_USERS.push({ ...newUser, password: data.password });
      setUser(newUser);
      localStorage.setItem('nexus_user', JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('nexus_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPlayer: user?.role === 'player',
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
