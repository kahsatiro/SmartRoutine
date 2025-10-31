import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Navigation } from '../components/layout/Navigation';
import { StatsCard } from '../components/shared/StatsCard';
import { FoodItemCard } from '../components/shared/FoodItemCard';
import { RecipeCard } from '../components/shared/RecipeCard';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { AlertMessage } from '../components/shared/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import { useRecipe } from '../context/RecipeContext';
import { useNotification } from '../context/NotificationContext';
import { Page } from '../types';
import {
  Package,
  AlertTriangle,
  Heart,
  ChefHat,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingCart,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { formatDate, daysUntilExpiry } from '../utils/date';
import { calculatePantryStats } from '../utils/calculations';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { foodItems, expiringItems, expiredItems, loading: foodLoading } = useFood();
  const { recipes, favorites, loading: recipeLoading } = useRecipe();
  const { showNotification } = useNotification();

  // Mostrar notificação de boas-vindas (apenas na primeira vez)
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome && user) {
      showNotification({
        type: 'success',
        title: 'Bem-vindo!',
        message: `Olá ${user.nome.split(' ')[0]}! Comece adicionando alimentos à sua despensa.`,
        duration: 8000,
      });
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [user, showNotification]);

  // Alertar sobre itens vencidos
  useEffect(() => {
    if (expiredItems.length > 0) {
      showNotification({
        type: 'error',
        title: 'Atenção!',
        message: `Você tem ${expiredItems.length} ${expiredItems.length === 1 ? 'item vencido' : 'itens vencidos'} na despensa.`,
        duration: 10000,
      });
    }
  }, [expiredItems.length, showNotification]);

  // Alertar sobre itens vencendo em breve
  useEffect(() => {
    if (expiringItems.length > 0 && expiredItems.length === 0) {
      showNotification({
        type: 'warning',
        title: 'Aviso',
        message: `${expiringItems.length} ${expiringItems.length === 1 ? 'item vence' : 'itens vencem'} nos próximos 3 dias.`,
        duration: 8000,
      });
    }
  }, [expiringItems.length, expiredItems.length, showNotification]);

  const stats = calculatePantryStats(foodItems);
  const recentRecipes = recipes.slice(0, 3);
  const topExpiringItems = [...expiringItems, ...expiredItems].slice(0, 5);

  const loading = foodLoading || recipeLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentPage="dashboard" onNavigate={onNavigate} />
        <LoadingSpinner fullScreen text="Carregando dados..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="dashboard" onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Bem-vindo de volta, {user?.nome.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            {new Date().getHours() < 12
              ? 'Bom dia! '
              : new Date().getHours() < 18
                ? 'Boa tarde! '
                : 'Boa noite! '}
            Aqui está o resumo da sua despensa hoje, {formatDate(new Date(), 'long')}.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Alimentos"
            value={stats.total}
            description="Itens na despensa"
            icon={Package}
            iconColor="text-primary"
            onClick={() => onNavigate('pantry')}
          />

          <StatsCard
            title="Vencendo Em Breve"
            value={stats.expiringSoon}
            description="Itens vencem em 3 dias"
            icon={AlertTriangle}
            iconColor="text-accent"
            trend={
              stats.expiringSoon > 0
                ? { value: stats.expiringSoon, label: 'requer atenção', isPositive: false }
                : undefined
            }
            onClick={() => onNavigate('pantry')}
          />

          <StatsCard
            title="Itens Vencidos"
            value={stats.expired}
            description="Precisam ser removidos"
            icon={AlertCircle}
            iconColor="text-destructive"
            onClick={() => onNavigate('pantry')}
          />

          <StatsCard
            title="Receitas Favoritas"
            value={favorites.length}
            description="Suas receitas salvas"
            icon={Heart}
            iconColor="text-destructive"
            onClick={() => onNavigate('recipes')}
          />
        </div>

        {/* Alerts Section */}
        {(expiredItems.length > 0 || expiringItems.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expired Items Alert */}
            {expiredItems.length > 0 && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    Itens Vencidos ({expiredItems.length})
                  </CardTitle>
                  <CardDescription>
                    Estes itens estão vencidos e devem ser removidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {expiredItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-background rounded-md border border-destructive/20"
                      >
                        <div>
                          <p className="font-medium">{item.nomeAlimento}</p>
                          <p className="text-sm text-muted-foreground">
                            Venceu em {formatDate(item.dataValidade)}
                          </p>
                        </div>
                        <Badge variant="destructive">Vencido</Badge>
                      </div>
                    ))}
                    {expiredItems.length > 3 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onNavigate('pantry')}
                      >
                        Ver todos ({expiredItems.length - 3} mais)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Expiring Soon Alert */}
            {expiringItems.length > 0 && (
              <Card className="border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <AlertTriangle className="h-5 w-5" />
                    Vencendo Em Breve ({expiringItems.length})
                  </CardTitle>
                  <CardDescription>
                    Estes itens vencem nos próximos 3 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {expiringItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-background rounded-md border border-accent/20"
                      >
                        <div>
                          <p className="font-medium">{item.nomeAlimento}</p>
                          <p className="text-sm text-muted-foreground">
                            Vence em {formatDate(item.dataValidade)}
                          </p>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">
                          {item.daysUntilExpiry} {item.daysUntilExpiry === 1 ? 'dia' : 'dias'}
                        </Badge>
                      </div>
                    ))}
                    {expiringItems.length > 3 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onNavigate('pantry')}
                      >
                        Ver todos ({expiringItems.length - 3} mais)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Success Message when no alerts */}
        {expiredItems.length === 0 && expiringItems.length === 0 && foodItems.length > 0 && (
          <AlertMessage
            type="success"
            title="Tudo em ordem!"
            message="Nenhum alimento vencido ou vencendo em breve. Continue assim!"
            dismissible={false}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>Gerencie sua despensa e receitas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => onNavigate('pantry')}
                className="w-full justify-start"
                variant="outline"
              >
                <Package className="mr-2 h-4 w-4" />
                Ver Despensa
                <Badge variant="secondary" className="ml-auto">
                  {foodItems.length}
                </Badge>
              </Button>
              <Button
                onClick={() => onNavigate('recipes')}
                className="w-full justify-start"
                variant="outline"
              >
                <ChefHat className="mr-2 h-4 w-4" />
                Explorar Receitas
                <Badge variant="secondary" className="ml-auto">
                  {recipes.length}
                </Badge>
              </Button>
              <Button
                onClick={() => onNavigate('profile')}
                className="w-full justify-start"
                variant="outline"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Planejamento Semanal
              </Button>
            </CardContent>
          </Card>

          {/* Pantry Overview */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Visão Geral da Despensa</CardTitle>
                <CardDescription>Status dos seus alimentos</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate('pantry')}>
                Ver Tudo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {foodItems.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="Despensa vazia"
                  description="Comece adicionando alimentos para começar a gerenciar sua despensa"
                  actionLabel="Adicionar Alimento"
                  onAction={() => onNavigate('pantry')}
                />
              ) : (
                <div className="space-y-4">
                  {/* Stats Distribution */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.fresh}
                      </div>
                      <div className="text-xs text-muted-foreground">Frescos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {stats.expiringSoon}
                      </div>
                      <div className="text-xs text-muted-foreground">Vencendo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-destructive">
                        {stats.expired}
                      </div>
                      <div className="text-xs text-muted-foreground">Vencidos</div>
                    </div>
                  </div>

                  {/* Recent Items */}
                  <div>
                    <h4 className="font-semibold mb-3">Itens Recentes</h4>
                    <div className="space-y-2">
                      {foodItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => onNavigate('pantry')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{item.nomeAlimento}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantidade} {item.unidadeMedida}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {formatDate(item.dataValidade)}
                            </p>
                            {item.daysUntilExpiry !== undefined && (
                              <Badge
                                variant={
                                  item.daysUntilExpiry <= 0
                                    ? 'destructive'
                                    : item.daysUntilExpiry <= 3
                                      ? 'default'
                                      : 'secondary'
                                }
                                className={
                                  item.daysUntilExpiry > 3 && item.daysUntilExpiry <= 7
                                    ? 'bg-accent text-accent-foreground'
                                    : ''
                                }
                              >
                                {item.daysUntilExpiry <= 0
                                  ? 'Vencido'
                                  : `${item.daysUntilExpiry}d`}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recipes Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Receitas Recomendadas
              </CardTitle>
              <CardDescription>Sugestões baseadas em sua despensa</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('recipes')}>
              Ver Todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {recipes.length === 0 ? (
              <EmptyState
                icon={ChefHat}
                title="Nenhuma receita disponível"
                description="Adicione receitas para começar a planejar suas refeições"
                actionLabel="Explorar Receitas"
                onAction={() => onNavigate('recipes')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.some(f => f.receitaId === recipe.id)}
                    onToggleFavorite={() => { }}
                    onViewDetails={() => onNavigate('recipes')}
                    variant="compact"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shopping Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Sugestões de Compras
              </CardTitle>
              <CardDescription>Baseado no seu consumo</CardDescription>
            </CardHeader>
            <CardContent>
              {foodItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Adicione alimentos para receber sugestões personalizadas
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <span className="text-sm">Leite</span>
                    <Badge variant="outline">Comum</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <span className="text-sm">Ovos</span>
                    <Badge variant="outline">Essencial</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <span className="text-sm">Arroz</span>
                    <Badge variant="outline">Baixo estoque</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Gerar Lista de Compras
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Dica da Semana
              </CardTitle>
              <CardDescription>Aproveite melhor seus alimentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                  <h4 className="font-semibold mb-2">💡 Organize por categorias</h4>
                  <p className="text-sm text-muted-foreground">
                    Agrupe alimentos similares na despensa para encontrá-los mais facilmente
                    e evitar compras duplicadas.
                  </p>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold mb-2">📅 FIFO - First In, First Out</h4>
                  <p className="text-sm text-muted-foreground">
                    Use os alimentos mais antigos primeiro. Coloque os novos atrás dos antigos
                    na geladeira e despensa.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Footer */}
        {stats.expiryRate < 10 && foodItems.length > 5 && (
          <Card className="bg-linear-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Parabéns! Você está indo muito bem! 🎉
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sua taxa de desperdício é de apenas {stats.expiryRate.toFixed(1)}%.
                    Continue assim e você vai economizar ainda mais!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};