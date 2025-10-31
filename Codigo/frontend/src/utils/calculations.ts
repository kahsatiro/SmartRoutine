import { Registra, Receita } from '../types';
import { daysUntilExpiry } from './date';

/**
* Cálculos específicos para o SmartRoutine
*/

/**
* Calcula estatísticas da despensa
*/
export function calculatePantryStats(items: Registra[]) {
    const total = items.length;
    const expired = items.filter((item) => {
        const days = daysUntilExpiry(item.dataValidade);
        return days < 0;
    }).length;

    const expiringSoon = items.filter((item) => {
        const days = daysUntilExpiry(item.dataValidade);
        return days >= 0 && days <= 3;
    }).length;

    const fresh = total - expired - expiringSoon;

    return {
        total,
        expired,
        expiringSoon,
        fresh,
        expiryRate: total > 0 ? (expired / total) * 100 : 0,
    };
}

/**
* Calcula valor total da despensa
*/
export function calculatePantryValue(items: Registra[], prices: Record<number, number>): number {
    return items.reduce((total, item) => {
        const price = prices[item.alimentoId] || 0;
        return total + price * item.quantidade;
    }, 0);
}

/**
* Calcula tempo total de preparo de receitas
*/
export function calculateTotalPrepTime(recipes: Receita[]): number {
    return recipes.reduce((total, recipe) => total + recipe.tempoPreparo, 0);
}

/**
* Calcula calorias totais de receitas
*/
export function calculateTotalCalories(recipes: Receita[]): number {
    return recipes.reduce((total, recipe) => {
        return total + (recipe.informacoes?.calorias || 0);
    }, 0);
}

/**
* Calcula média de avaliações
*/
export function calculateAverageRating(ratings: number[]): number {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return sum / ratings.length;
}

/**
* Calcula score de compatibilidade de receita com despensa
*/
export function calculateRecipeCompatibility(
    recipeIngredients: string[],
    availableIngredients: string[]
): {
    score: number;
    matchingIngredients: string[];
    missingIngredients: string[];
} {
    const matching = recipeIngredients.filter((ingredient) =>
        availableIngredients.some((available) =>
            available.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(available.toLowerCase())
        )
    );

    const missing = recipeIngredients.filter((ingredient) =>
        !matching.includes(ingredient)
    );

    const score = recipeIngredients.length > 0
        ? (matching.length / recipeIngredients.length) * 100
        : 0;

    return {
        score: Math.round(score),
        matchingIngredients: matching,
        missingIngredients: missing,
    };
}

/**
* Calcula desperdício de alimentos
*/
export function calculateFoodWaste(
    expiredItems: Registra[],
    totalItems: number
): {
    count: number;
    percentage: number;
    estimatedValue: number;
} {
    const count = expiredItems.length;
    const percentage = totalItems > 0 ? (count / totalItems) * 100 : 0;

    // Estimativa de valor perdido (pode ser melhorado com preços reais)
    const estimatedValue = expiredItems.reduce((total, item) => {
        const avgPrice = 10; // Preço médio estimado
        return total + avgPrice * item.quantidade;
    }, 0);

    return {
        count,
        percentage: Math.round(percentage * 100) / 100,
        estimatedValue: Math.round(estimatedValue * 100) / 100,
    };
}

/**
* Calcula economia projetada
*/
export function calculateProjectedSavings(
    currentWaste: number,
    targetReduction: number
): number {
    return currentWaste * (targetReduction / 100);
}

/**
* Calcula distribuição por categoria
*/
export function calculateCategoryDistribution<T>(
    items: T[],
    getCategoryFn: (item: T) => string
): Record<string, number> {
    return items.reduce((acc, item) => {
        const category = getCategoryFn(item);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}

/**
* Calcula tendência de consumo
*/
export function calculateConsumptionTrend(
    dataPoints: Array<{ date: string; quantity: number }>
): {
    trend: 'increasing' | 'decreasing' | 'stable';
    averagePerDay: number;
} {
    if (dataPoints.length < 2) {
        return { trend: 'stable', averagePerDay: 0 };
    }

    const totalQuantity = dataPoints.reduce((sum, point) => sum + point.quantity, 0);
    const averagePerDay = totalQuantity / dataPoints.length;

    const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2));
    const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2));

    const firstAvg = firstHalf.reduce((sum, p) => sum + p.quantity, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.quantity, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;
    const threshold = averagePerDay * 0.1; // 10% de variação

    let trend: 'increasing' | 'decreasing' | 'stable';
    if (difference > threshold) {
        trend = 'increasing';
    } else if (difference < -threshold) {
        trend = 'decreasing';
    } else {
        trend = 'stable';
    }

    return {
        trend,
        averagePerDay: Math.round(averagePerDay * 100) / 100,
    };
}