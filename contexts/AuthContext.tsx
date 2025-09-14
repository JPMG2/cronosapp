import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, LoginCredentials, AuthResponse } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id?: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Check if user is already logged in when app starts
  const checkAuthStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('authToken');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        // In real app, you'd verify token with your API here
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await AuthService.login(credentials);
      
      if (response.success && response.user) {
        // Store user data and token
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        // In real app, you'd store the JWT token from your API
        await AsyncStorage.setItem('authToken', 'mock-jwt-token');
        
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error in context:', error);
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await AsyncStorage.multiRemove(['user', 'authToken']);
      setUser(null);
      
      // Call logout service (for API cleanup if needed)
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check auth status when app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}