import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  teamId: string;
  teamName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, teamId: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, teamId: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      try {
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        if (response.data.success) {
          setUser({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            teamId: response.data.user.teamId || '',
            teamName: response.data.user.teamName,
          });
        } else {
          localStorage.removeItem('token');
          // delete api.defaults.headers.common['Authorization'];
        }
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          localStorage.removeItem('token');
          // delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string, teamId: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/login', { email, password, teamId });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;

        localStorage.setItem('token', token);
        // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          teamId,
          teamName: userData.teamName,
        });

        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, teamId: string): Promise<boolean> => {
    try {
      const response = await api.post('/api/auth/signup', { name, email, password, teamId });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;

        localStorage.setItem('token', token);
        // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          teamId,
          teamName: userData.teamName,
        });

        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    // delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};