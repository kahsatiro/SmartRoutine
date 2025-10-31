import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, SignupData } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<SignupData>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'smartroutine_user';
const TOKEN_STORAGE_KEY = 'smartroutine_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      // Se o backend retornar token, armazene aqui
      // localStorage.setItem(TOKEN_STORAGE_KEY, userData.token);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      await authService.signup(data);
      // Fazer login automático após cadastro
      await login({ email: data.email, senha: data.senha });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const updateUser = async (data: Partial<SignupData>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await authService.updateUsuario(user.id, data);
      const updatedUser = await authService.getUsuarioById(user.id);
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await authService.deleteUsuario(user.id);
      logout();
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!user) return;

    try {
      const updatedUser = await authService.getUsuarioById(user.id);
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      // Se falhar, pode ser que o token expirou
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
    deleteAccount,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};