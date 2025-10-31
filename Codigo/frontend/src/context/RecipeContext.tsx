import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Receita, ReceitaFavorita } from '../types';
import { receitaService } from '../services/receitaService';
import { favoritasService } from '../services/favoritasService';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

interface RecipeContextType {
  recipes: Receita[];
  favorites: ReceitaFavorita[];
  loading: boolean;
  addRecipe: (recipe: Omit<Receita, 'id'>) => Promise<void>;
  updateRecipe: (id: number, recipe: Partial<Receita>) => Promise<void>;
  deleteRecipe: (id: number) => Promise<void>;
  toggleFavorite: (receitaId: number) => Promise<void>;
  isFavorite: (receitaId: number) => boolean;
  refreshRecipes: () => Promise<void>;
  searchRecipes: (query: string) => Promise<Receita[]>;
  getRecipesByTempo: (tempo: number) => Promise<Receita[]>;
  getRecipesByTag: (tag: string) => Promise<Receita[]>;
  getFavoriteRecipes: () => Receita[];
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [recipes, setRecipes] = useState<Receita[]>([]);
  const [favorites, setFavorites] = useState<ReceitaFavorita[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const receitasData = await receitaService.getAll();
      setRecipes(receitasData);

      if (user) {
        const favoritasData = await favoritasService.getByUsuario(user.id);
        setFavorites(favoritasData);
      }
    } catch (error: any) {
      console.error('Erro ao carregar receitas:', error);
      showNotification({
        type: 'error',
        message: 'Erro ao carregar receitas',
      });
    } finally {
      setLoading(false);
    }
  }, [user, showNotification]);

  useEffect(() => {
    refreshRecipes();
  }, [refreshRecipes]);

  const addRecipe = async (recipe: Omit<Receita, 'id'>) => {
    try {
      await receitaService.create(recipe);
      await refreshRecipes();
      showNotification({
        type: 'success',
        message: 'Receita adicionada com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao adicionar receita:', error);
      showNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao adicionar receita',
      });
      throw error;
    }
  };

  const updateRecipe = async (id: number, recipe: Partial<Receita>) => {
    try {
      await receitaService.update(id, recipe);
      await refreshRecipes();
      showNotification({
        type: 'success',
        message: 'Receita atualizada com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar receita:', error);
      showNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao atualizar receita',
      });
      throw error;
    }
  };

  const deleteRecipe = async (id: number) => {
    try {
      await receitaService.delete(id);
      await refreshRecipes();
      showNotification({
        type: 'success',
        message: 'Receita removida com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao deletar receita:', error);
      showNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao remover receita',
      });
      throw error;
    }
  };

  const toggleFavorite = async (receitaId: number) => {
    if (!user) {
      showNotification({
        type: 'warning',
        message: 'Você precisa estar logado para favoritar receitas',
      });
      return;
    }

    try {
      const favorita = favorites.find(f => f.receitaId === receitaId);

      if (favorita) {
        await favoritasService.remove(user.id, receitaId);
        showNotification({
          type: 'info',
          message: 'Receita removida dos favoritos',
        });
      } else {
        await favoritasService.add(user.id, receitaId);
        showNotification({
          type: 'success',
          message: 'Receita adicionada aos favoritos!',
        });
      }

      await refreshRecipes();
    } catch (error: any) {
      console.error('Erro ao alternar favorito:', error);
      showNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao processar favorito',
      });
      throw error;
    }
  };

  const isFavorite = (receitaId: number): boolean => {
    return favorites.some(f => f.receitaId === receitaId);
  };

  const searchRecipes = async (query: string): Promise<Receita[]> => {
    try {
      return await receitaService.search(query);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      return [];
    }
  };

  const getRecipesByTempo = async (tempo: number): Promise<Receita[]> => {
    try {
      return await receitaService.getByTempo(tempo);
    } catch (error) {
      console.error('Erro ao buscar receitas por tempo:', error);
      return [];
    }
  };

  const getRecipesByTag = async (tag: string): Promise<Receita[]> => {
    try {
      return await receitaService.getByTag(tag);
    } catch (error) {
      console.error('Erro ao buscar receitas por tag:', error);
      return [];
    }
  };

  const getFavoriteRecipes = (): Receita[] => {
    const favoriteIds = favorites.map(f => f.receitaId);
    return recipes.filter(recipe => favoriteIds.includes(recipe.id));
  };

  const value: RecipeContextType = {
    recipes,
    favorites,
    loading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    isFavorite,
    refreshRecipes,
    searchRecipes,
    getRecipesByTempo,
    getRecipesByTag,
    getFavoriteRecipes,
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipe deve ser usado dentro de um RecipeProvider');
  }
  return context;
};