import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { CheckCircle, X, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '../ui/utils';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertMessageProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  dismissible?: boolean;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-primary/10 border-primary text-primary-foreground',
    iconClassName: 'text-primary',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-destructive/10 border-destructive',
    iconClassName: 'text-destructive',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-accent/10 border-accent',
    iconClassName: 'text-accent',
  },
  info: {
    icon: Info,
    className: 'bg-secondary/10 border-secondary',
    iconClassName: 'text-secondary',
  },
};

export const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  title,
  message,
  onClose,
  className,
  dismissible = true,
}) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className={cn('h-4 w-4', config.iconClassName)} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="flex items-center justify-between gap-2">
        <span className="flex-1">{message}</span>
        {dismissible && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-auto p-1 h-auto hover:bg-transparent"
          >
            <X size={16} />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};