import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Edit, Trash2, Package } from 'lucide-react';
import { Registra } from '../../types';
import { ExpiryBadge } from './ExpiryBadge';
import { cn } from '../ui/utils';

interface FoodItemCardProps {
    item: Registra;
    onEdit: (item: Registra) => void;
    onDelete: (item: Registra) => void;
    variant?: 'default' | 'compact';
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
    item,
    onEdit,
    onDelete,
    variant = 'default',
}) => {
    const isCompact = variant === 'compact';

    return (
        <Card className={cn(
            'hover:shadow-md transition-shadow',
            isCompact && 'border-none shadow-none hover:bg-muted/50'
        )}>
            <CardContent className={cn('p-4', isCompact && 'p-3')}>
                <div className="flex items-start justify-between gap-3">
                    {/* Icon */}
                    <div className={cn(
                        'rounded-full bg-primary/10 p-2 shrink-0',
                        isCompact && 'p-1.5'
                    )}>
                        <Package className={cn('text-primary', isCompact ? 'h-4 w-4' : 'h-5 w-5')} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={cn(
                                'font-semibold truncate',
                                isCompact ? 'text-sm' : 'text-base'
                            )}>
                                {item.nomeAlimento || 'Alimento'}
                            </h3>
                            <ExpiryBadge daysUntilExpiry={item.daysUntilExpiry} compact={isCompact} />
                        </div>

                        <div className={cn(
                            'space-y-1',
                            isCompact ? 'text-xs' : 'text-sm'
                        )}>
                            <p className="text-muted-foreground">
                                <span className="font-medium">Quantidade:</span>{' '}
                                {item.quantidade} {item.unidadeMedida}
                            </p>

                            <p className="text-muted-foreground">
                                <span className="font-medium">Validade:</span>{' '}
                                {new Date(item.dataValidade).toLocaleDateString('pt-BR')}
                            </p>

                            {item.lote && (
                                <p className="text-muted-foreground">
                                    <span className="font-medium">Lote:</span> {item.lote}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        {!isCompact && (
                            <div className="flex gap-2 mt-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(item)}
                                    className="flex-1"
                                >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Editar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDelete(item)}
                                    className="flex-1 text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Excluir
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Compact Actions */}
                    {isCompact && (
                        <div className="flex gap-1 shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(item)}
                                className="h-7 w-7"
                            >
                                <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(item)}
                                className="h-7 w-7 text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};