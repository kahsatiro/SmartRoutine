import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    iconColor?: string;
    trend?: {
        value: number;
        label: string;
        isPositive?: boolean;
    };
    onClick?: () => void;
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    description,
    icon: Icon,
    iconColor = 'text-muted-foreground',
    trend,
    onClick,
    className,
}) => {
    return (
        <Card
            className={cn(
                'hover:shadow-md transition-shadow',
                onClick && 'cursor-pointer hover:border-primary',
                className
            )}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn('h-4 w-4', iconColor)} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>

                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}

                {trend && (
                    <div className="flex items-center gap-1 mt-2">
                        <span
                            className={cn(
                                'text-xs font-medium',
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            )}
                        >
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </span>
                        <span className="text-xs text-muted-foreground">{trend.label}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};