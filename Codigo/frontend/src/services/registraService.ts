import { api } from './api';
import { handleApiError } from './errorHandler';
import { Registra } from '../types';

export const registraService = {
  /**
   * Lista todos os registros
   */
  async getAll(): Promise<Registra[]> {
    try {
      const response = await api.get<Registra[]>('/registra');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca registro por ID
   */
  async getById(id: number): Promise<Registra> {
    try {
      const response = await api.get<Registra>(`/registra/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Lista registros de um usuário específico
   */
  async getByUsuario(usuarioId: number): Promise<Registra[]> {
    try {
      const response = await api.get<Registra[]>(`/registra/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Lista produtos próximos ao vencimento
   */
  async getProximosVencimento(usuarioId: number, dias: number = 3): Promise<Registra[]> {
    try {
      const response = await api.get<Registra[]>(
        `/registra/usuario/${usuarioId}/vencimento/${dias}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Lista produtos vencidos
   */
  async getVencidos(usuarioId: number): Promise<Registra[]> {
    try {
      const response = await api.get<Registra[]>(`/registra/usuario/${usuarioId}/vencidos`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Registra nova compra
   */
  async create(registra: Omit<Registra, 'id'>): Promise<{ message: string }> {
    try {
      const response = await api.post('/registra', registra);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Atualiza registro de compra
   */
  async update(id: number, registra: Partial<Registra>): Promise<{ message: string }> {
    try {
      const response = await api.put(`/registra/${id}`, registra);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Deleta registro de compra
   */
  async delete(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/registra/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Deleta múltiplos registros
   */
  async deleteMany(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await api.post('/registra/delete-many', { ids });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Exporta dados da despensa (para CSV/PDF)
   */
  async exportData(usuarioId: number, format: 'json' | 'csv' = 'json'): Promise<any> {
    try {
      const response = await api.get(`/registra/usuario/${usuarioId}/export`, {
        params: { format },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};