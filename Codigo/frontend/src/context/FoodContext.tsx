import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Registra, Alimento } from '../types';
import { registraService } from '../services/registraService';
import { alimentoService } from '../services/alimentoService';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

interface FoodContextType {
  // Registros (Compras)
  foodItems: Registra[];
  loading: boolean;
  addFoodItem: (item: Omit<Registra, 'id'>) => Promise<void>;
  updateFoodItem: (id: number, item: Partial<Registra>) => Promise<void>;
  deleteFoodItem: (id: number) => Promise<void>;
  refreshFoodItems: () => Promise<void>;

  // Estatísticas
  expiringItems: Registra[];
  expiredItems: Registra[];
  totalItems: number;

  // Alimentos (Catálogo)
  alimentos: Alimento[];
  alimentosLoading: boolean;
  categorias: string[];
  getAlimentosByCategoria: (categoria: string) => Promise<Alimento[]>;
  searchAlimentos: (query: string) => Promise<Alimento[]>;
  addAlimento: (alimento: Omit<Alimento, 'id'>) => Promise<void>;
  refreshAlimentos: () => Promise<void>;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [foodItems, setFoodItems] = useState<Registra[]>([]);
  const [loading, setLoading] = useState(false);

  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [alimentosLoading, setAlimentosLoading] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);

  // Calcular dias até vencimento
  const calculateDaysUntilExpiry = (dataValidade: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(dataValidade);
    expiryDate.setHours(0, 0, 0, 0);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Carregar registros de compras
  const refreshFoodItems = useCallback(async () => {
    if (!user) {
      setFoodItems([]);
      return;
    }

    setLoading(true);
    try {
      const items = await registraService.getByUsuario(user.id);
      const itemsWithDays = items.map(item => ({
        ...item,
        daysUntilExpiry: calculateDaysUntilExpiry(item.dataValidade),
      }));
      setFoodItems(itemsWithDays);
    } catch (error: any) {
      console.error('Erro ao carregar alimentos:', error);
      showNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao carregar alimentos',
      });
    } finally {
      setLoading(false);
    }
  }, [user, showNotification]);

  // Carregar catálogo de alimentos
  const refreshAlimentos = useCallback(async () => {
    setAlimentosLoading(true);
    try {
      const [alimentosData, categoriasData] = await Promise.all([
        alimentoService.getAll(),
        alimentoService.getCategorias(),
      ]);
      setAlimentos(alimentosData);
      setCategorias(categoriasData);
    } catch (error: any) {
      console.error('Erro ao carregar catálogo:', error);
      showNotification({
        type: 'error',
        message: 'Erro ao carregar catálogo de alimentos',
      });
    } finally {
      setAlimentosLoading(false);
    }
  }, [showNotification]);

  // Carregar dados ao montar e quando usuário mudar
  useEffect(() => {
    refreshFoodItems();
  }, [refreshFoodItems]);

  useEffect(() => {
    refreshAlimentos();
  }, [refreshAlimentos]);

  // CRUD de Registros
  const addFoodItem = async (item: Omit<Registra, 'id'>) => {
    try {
      await registraService.create(item);
      await refreshFoodItems();
      showNotification({
        type: 'success',
        message: 'Alimento adicionado com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao adicionar alimento:', error);
      showNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao adicionar alimento',
      });
      throw error;
    }
  };

  const updateFoodItem = async (id: number, item: Partial<Registra>) => {
    try {
      await registraService.update(id, item);
      await refreshFoodItems();
      showNotification({
        type: 'success',
        message: 'Alimento atualizado com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar alimento:', error);
      showNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao atualizar alimento',
      });
      throw error;
    }
  };

  const deleteFoodItem = async (id: number) => {
    try {
      await registraService.delete(id);
      await refreshFoodItems();
      showNotification({
        type: 'success',
        message: 'Alimento removido com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao deletar alimento:', error);
      showNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao remover alimento',
      });
      throw error;
    }
  };

  // CRUD de Alimentos (Catálogo)
  const addAlimento = async (alimento: Omit<Alimento, 'id'>) => {
    try {
      await alimentoService.create(alimento);
      await refreshAlimentos();
      showNotification({
        type: 'success',
        message: 'Alimento adicionado ao catálogo!',
      });
    } catch (error: any) {
      console.error('Erro ao adicionar alimento:', error);
      showNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao adicionar alimento',
      });
      throw error;
    }
  };

  const getAlimentosByCategoria = async (categoria: string): Promise<Alimento[]> => {
    try {
      return await alimentoService.getByCategoria(categoria);
    } catch (error) {
      console.error('Erro ao buscar alimentos por categoria:', error);
      return [];
    }
  };

  const searchAlimentos = async (query: string): Promise<Alimento[]> => {
    try {
      return await alimentoService.search(query);
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
      return [];
    }
  };

  // Estatísticas
  const expiringItems = foodItems.filter(
    item => item.daysUntilExpiry !== undefined && item.daysUntilExpiry > 0 && item.daysUntilExpiry <= 3
  );

  const expiredItems = foodItems.filter(
    item => item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 0
  );

  const value: FoodContextType = {
    foodItems,
    loading,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    refreshFoodItems,
    expiringItems,
    expiredItems,
    totalItems: foodItems.length,
    alimentos,
    alimentosLoading,
    categorias,
    getAlimentosByCategoria,
    searchAlimentos,
    addAlimento,
    refreshAlimentos,
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFood deve ser usado dentro de um FoodProvider');
  }
  return context;
};