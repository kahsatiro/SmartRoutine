import React from 'react';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface ExpiryBadgeProps {
    daysUntilExpiry?: number;
    compact?: boolean;
    className?: string;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({
    daysUntilExpiry,
    compact = false,
    className,
}) => {
    if (daysUntilExpiry === undefined) {
        return (
            <Badge variant="outline" className={cn(compact && 'text-xs px-2', className)}>
                N/A
            </Badge>
        );
    }

    if (daysUntilExpiry <= 0) {
        return (
            <Badge
                variant="destructive"
                className={cn(compact && 'text-xs px-2', className)}
            >
                Vencido
            </Badge>
        );
    }

    if (daysUntilExpiry <= 3) {
        return (
            <Badge
                className={cn(
                    'bg-accent text-accent-foreground',
                    compact && 'text-xs px-2',
                    className
                )}
            >
                {daysUntilExpiry} {daysUntilExpiry === 1 ? 'dia' : 'dias'}
            </Badge>
        );
    }

    if (daysUntilExpiry <= 7) {
        return (
            <Badge
                variant="secondary"
                className={cn(compact && 'text-xs px-2', className)}
            >
                {daysUntilExpiry} dias
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className={cn(
                'border-green-200 bg-green-50 text-green-700',
                compact && 'text-xs px-2',
                className
            )}
        >
            Fresco
        </Badge>
    );
};