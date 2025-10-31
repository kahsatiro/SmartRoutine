import { api } from './api';
import { handleApiError } from './errorHandler';
import { User, LoginCredentials, SignupData } from '../types';

export const authService = {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<User>('/usuario/login', credentials);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Cadastra novo usuário
   */
  async signup(data: SignupData): Promise<{ message: string }> {
    try {
      const response = await api.post('/usuario', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Lista todos os usuários (admin)
   */
  async getAllUsuarios(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/usuario');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca usuário por ID
   */
  async getUsuarioById(id: number): Promise<User> {
    try {
      const response = await api.get<User>(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Atualiza dados do usuário
   */
  async updateUsuario(id: number, data: Partial<SignupData>): Promise<{ message: string }> {
    try {
      const response = await api.put(`/usuario/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Deleta usuário
   */
  async deleteUsuario(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Valida token (se implementado no backend)
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      await api.get('/usuario/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Solicita recuperação de senha (se implementado no backend)
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/usuario/forgot-password', { email });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Redefine senha (se implementado no backend)
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/usuario/reset-password', {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};