import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Heart, Clock, Users, ChefHat, Trash2 } from 'lucide-react';
import { Receita } from '../../types';
import { ImageWithFallback } from '../../assets/ImageWithFallback';
import { cn } from '../ui/utils';

interface RecipeCardProps {
    recipe: Receita;
    isFavorite: boolean;
    onToggleFavorite: (recipeId: number) => void;
    onViewDetails: (recipe: Receita) => void;
    onDelete?: (recipeId: Receita) => void;
    variant?: 'default' | 'featured' | 'compact';
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    isFavorite,
    onToggleFavorite,
    onViewDetails,
    onDelete,
    variant = 'default',
}) => {
    const isFeatured = variant === 'featured';
    const isCompact = variant === 'compact';

    return (
        <Card className={cn(
            'overflow-hidden hover:shadow-lg transition-all',
            isFeatured && 'border-2 border-primary',
            isCompact && 'hover:shadow-md'
        )}>
            {/* Image */}
            <div className={cn(
                'relative',
                isCompact ? 'h-32' : isFeatured ? 'h-64' : 'h-48'
            )}>
                <ImageWithFallback
                    src={recipe.informacoes?.ingredientes?.[0]
                        ? `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500`
                        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
                    }
                    alt={recipe.titulo}
                    className="w-full h-full object-cover"
                />

                {/* Overlay Badges */}
                <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            'bg-background/80 backdrop-blur-sm hover:bg-background/90',
                            isCompact && 'h-7 w-7'
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(recipe.id);
                        }}
                    >
                        <Heart
                            size={isCompact ? 14 : 16}
                            className={isFavorite ? 'text-destructive fill-current' : ''}
                        />
                    </Button>
                </div>

                {/* Difficulty Badge */}
                {recipe.informacoes?.dificuldade && !isCompact && (
                    <Badge
                        className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
                        variant="secondary"
                    >
                        {recipe.informacoes.dificuldade}
                    </Badge>
                )}
            </div>

            {/* Content */}
            <CardHeader className={cn(isCompact && 'p-3')}>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className={cn(
                        'line-clamp-2',
                        isCompact ? 'text-sm' : isFeatured ? 'text-xl' : 'text-lg'
                    )}>
                        {recipe.titulo}
                    </CardTitle>
                    {isFeatured && (
                        <div className="bg-primary/10 p-2 rounded-full shrink-0">
                            <ChefHat className="h-5 w-5 text-primary" />
                        </div>
                    )}
                </div>

                {/* Meta Information */}
                <div className={cn(
                    'flex flex-wrap gap-3 text-muted-foreground',
                    isCompact ? 'text-xs' : 'text-sm'
                )}>
                    <div className="flex items-center gap-1">
                        <Clock size={isCompact ? 12 : 14} />
                        {recipe.tempoPreparo} min
                    </div>
                    <div className="flex items-center gap-1">
                        <Users size={isCompact ? 12 : 14} />
                        {recipe.porcao}
                    </div>
                    {recipe.informacoes?.calorias && (
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{recipe.informacoes.calorias}</span> kcal
                        </div>
                    )}
                </div>
            </CardHeader>

            {!isCompact && (
                <CardContent className="space-y-3">
                    {/* Tags */}
                    {recipe.informacoes?.tags && recipe.informacoes.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {recipe.informacoes.tags.slice(0, isFeatured ? 5 : 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {recipe.informacoes.tags.length > (isFeatured ? 5 : 3) && (
                                <Badge variant="outline" className="text-xs">
                                    +{recipe.informacoes.tags.length - (isFeatured ? 5 : 3)}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Ingredients Preview */}
                    {recipe.informacoes?.ingredientes && !isFeatured && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                                Ingredientes principais:
                            </p>
                            <p className="text-sm line-clamp-2">
                                {recipe.informacoes.ingredientes.slice(0, 3).join(', ')}
                                {recipe.informacoes.ingredientes.length > 3 && '...'}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={() => onViewDetails(recipe)}
                            className="flex-1"
                            variant={isFeatured ? 'default' : 'outline'}
                        >
                            Ver Receita
                        </Button>
                        {onDelete && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(recipe);
                                }}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            )}

            {/* Compact View Details Button */}
            {isCompact && (
                <CardContent className="p-3 pt-0">
                    <Button
                        onClick={() => onViewDetails(recipe)}
                        className="w-full"
                        size="sm"
                        variant="outline"
                    >
                        Ver Receita
                    </Button>
                </CardContent>
            )}
        </Card>
    );
};