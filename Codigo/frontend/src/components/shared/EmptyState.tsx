import React, { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
    children?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
    children,
}) => {
    return (
        <Card className={cn('text-center', className)}>
            <CardContent className="py-12 px-4">
                <div className="flex flex-col items-center space-y-4 max-w-md mx-auto">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                        <Icon className="w-10 h-10 text-muted-foreground" />
                    </div>

                    {/* Text */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>

                    {/* Action */}
                    {actionLabel && onAction && (
                        <Button onClick={onAction} className="mt-2">
                            {actionLabel}
                        </Button>
                    )}

                    {/* Custom Children */}
                    {children}
                </div>
            </CardContent>
        </Card>
    );
};