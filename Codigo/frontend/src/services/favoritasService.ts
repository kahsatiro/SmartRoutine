import { api } from './api';
import { handleApiError } from './errorHandler';
import { ReceitaFavorita } from '../types';

export const favoritasService = {
  /**
   * Lista todas as receitas favoritas
   */
  async getAll(): Promise<ReceitaFavorita[]> {
    try {
      const response = await api.get<ReceitaFavorita[]>('/favoritas');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Busca favorita por ID
   */
  async getById(id: number): Promise<ReceitaFavorita> {
    try {
      const response = await api.get<ReceitaFavorita>(`/favoritas/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Lista favoritas de um usuário
   */
  async getByUsuario(usuarioId: number): Promise<ReceitaFavorita[]> {
    try {
      const response = await api.get<ReceitaFavorita[]>(`/favoritas/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Lista usuários que favoritaram uma receita
   */
  async getByReceita(receitaId: number): Promise<ReceitaFavorita[]> {
    try {
      const response = await api.get<ReceitaFavorita[]>(`/favoritas/receita/${receitaId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Verifica se uma receita é favorita do usuário
   */
  async check(usuarioId: number, receitaId: number): Promise<{ isFavorita: boolean }> {
    try {
      const response = await api.get<{ isFavorita: boolean }>(
        `/favoritas/check/${usuarioId}/${receitaId}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Conta quantos usuários favoritaram uma receita
   */
  async count(receitaId: number): Promise<{ count: number }> {
    try {
      const response = await api.get<{ count: number }>(`/favoritas/receita/${receitaId}/count`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Adiciona receita aos favoritos
   */
  async add(usuarioId: number, receitaId: number): Promise<{ message: string }> {
    try {
      const response = await api.post('/favoritas', { usuarioId, receitaId });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Remove receita dos favoritos por ID do favorito
   */
  async removeById(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/favoritas/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Remove receita dos favoritos por usuário e receita
   */
  async remove(usuarioId: number, receitaId: number): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/favoritas/usuario/${usuarioId}/receita/${receitaId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Toggle favorito (adiciona se não existe, remove se existe)
   */
  async toggle(usuarioId: number, receitaId: number): Promise<{
    isFavorita: boolean;
    message: string
  }> {
    try {
      const { isFavorita } = await this.check(usuarioId, receitaId);

      if (isFavorita) {
        await this.remove(usuarioId, receitaId);
        return { isFavorita: false, message: 'Receita removida dos favoritos' };
      } else {
        await this.add(usuarioId, receitaId);
        return { isFavorita: true, message: 'Receita adicionada aos favoritos' };
      }
    } catch (error) {
      handleApiError(error);
    }
  },
};