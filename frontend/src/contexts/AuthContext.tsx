import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginRequest } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('nioe_token');
    const storedUser = localStorage.getItem('nioe_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        
        // Verify token is still valid
        authService.getMe()
          .then((response) => {
            if (response.success && response.data) {
              setUser(response.data);
              localStorage.setItem('nioe_user', JSON.stringify(response.data));
            } else {
              logout();
            }
          })
          .catch(() => {
            logout();
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        logout();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Listen for auth events
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        
        localStorage.setItem('nioe_token', response.token);
        localStorage.setItem('nioe_user', JSON.stringify(response.user));
        
        toast.success(`Bem-vindo, ${response.user.nome}!`);
        return true;
      } else {
        toast.error('Credenciais inválidas');
        return false;
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Erro ao fazer login';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nioe_token');
    localStorage.removeItem('nioe_user');
    
    // Call API logout (don't wait for response)
    authService.logout().catch(() => {
      // Ignore errors on logout
    });
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};