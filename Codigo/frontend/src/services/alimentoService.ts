import { api } from './api';
import { handleApiError } from './errorHandler';
import { Alimento } from '../types';

export const alimentoService = {
  /**
   * Lista todos os alimentos
   */
  async getAll(): Promise<Alimento[]> {
    try {
      const response = await api.get<Alimento[]>('/alimento');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca alimento por ID
   */
  async getById(id: number): Promise<Alimento> {
    try {
      const response = await api.get<Alimento>(`/alimento/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Lista alimentos por categoria
   */
  async getByCategoria(categoria: string): Promise<Alimento[]> {
    try {
      const response = await api.get<Alimento[]>(`/alimento/categoria/${categoria}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca alimentos por nome
   */
  async search(query: string): Promise<Alimento[]> {
    try {
      const response = await api.get<Alimento[]>('/alimento/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Lista todas as categorias disponíveis
   */
  async getCategorias(): Promise<string[]> {
    try {
      const response = await api.get<string[]>('/alimento/categorias');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Cria novo alimento no catálogo
   */
  async create(alimento: Omit<Alimento, 'id'>): Promise<{ message: string }> {
    try {
      const response = await api.post('/alimento', alimento);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Atualiza alimento existente
   */
  async update(id: number, alimento: Partial<Alimento>): Promise<{ message: string }> {
    try {
      const response = await api.put(`/alimento/${id}`, alimento);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Deleta alimento do catálogo
   */
  async delete(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/alimento/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca alimentos com paginação (se implementado no backend)
   */
  async getPaginated(page: number = 1, limit: number = 20): Promise<{
    alimentos: Alimento[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get('/alimento/paginated', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};