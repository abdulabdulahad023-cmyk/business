import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  register: (email: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock token
    const token = localStorage.getItem('mock_jwt_token');
    const storedUser = localStorage.getItem('mock_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('mock_jwt_token');
        localStorage.removeItem('mock_user');
      }
    }
    setIsLoading(false);
  }, []);

  const generateMockToken = (email: string) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }));
    const signature = 'mock_signature_for_presentation_only';
    return `${header}.${payload}.${signature}`;
  };

  const login = async (email: string, name: string = 'Demo User') => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const token = generateMockToken(email);
    const mockUser = { name, email };
    
    localStorage.setItem('mock_jwt_token', token);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    
    setUser(mockUser);
  };

  const register = async (email: string, name: string) => {
    await login(email, name);
  };

  const logout = () => {
    localStorage.removeItem('mock_jwt_token');
    localStorage.removeItem('mock_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        register, 
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
