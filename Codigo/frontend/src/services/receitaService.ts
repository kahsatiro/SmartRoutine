import { api } from './api';
import { handleApiError } from './errorHandler';
import { Receita } from '../types';

export const receitaService = {
  /**
   * Lista todas as receitas
   */
  async getAll(): Promise<Receita[]> {
    try {
      const response = await api.get<Receita[]>('/receita');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca receita por ID
   */
  async getById(id: number): Promise<Receita> {
    try {
      const response = await api.get<Receita>(`/receita/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca receitas por título
   */
  async search(query: string): Promise<Receita[]> {
    try {
      const response = await api.get<Receita[]>('/receita/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca receitas por tempo máximo de preparo
   */
  async getByTempo(tempo: number): Promise<Receita[]> {
    try {
      const response = await api.get<Receita[]>(`/receita/tempo/${tempo}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca receitas por tag
   */
  async getByTag(tag: string): Promise<Receita[]> {
    try {
      const response = await api.get<Receita[]>(`/receita/tag/${tag}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Cria nova receita
   */
  async create(receita: Omit<Receita, 'id'>): Promise<{ message: string }> {
    try {
      const response = await api.post('/receita', receita);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Atualiza receita existente
   */
  async update(id: number, receita: Partial<Receita>): Promise<{ message: string }> {
    try {
      const response = await api.put(`/receita/${id}`, receita);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Deleta receita
   */
  async delete(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/receita/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca receitas que podem ser feitas com ingredientes disponíveis
   */
  async getReceitasPossiveis(ingredientesDisponiveis: string[]): Promise<Receita[]> {
    try {
      const response = await api.post<Receita[]>('/receita/possiveis', {
        ingredientes: ingredientesDisponiveis,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca receitas com paginação
   */
  async getPaginated(
    page: number = 1,
    limit: number = 12,
    filters?: {
      tempo?: number;
      tag?: string;
      dificuldade?: string;
    }
  ): Promise<{
    receitas: Receita[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get('/receita/paginated', {
        params: { page, limit, ...filters },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};