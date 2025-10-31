import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    showNotification: (notification: Omit<Notification, 'id'>) => void;
    hideNotification: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const newNotification: Notification = {
            id,
            duration: 5000,
            ...notification,
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto-remover após duração
        if (newNotification.duration) {
            setTimeout(() => {
                hideNotification(id);
            }, newNotification.duration);
        }
    }, []);

    const hideNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const value: NotificationContextType = {
        notifications,
        showNotification,
        hideNotification,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

// Componente de exibição das notificações
const NotificationContainer: React.FC = () => {
    const { notifications, hideNotification } = useNotification();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {notifications.map(notification => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClose={() => hideNotification(notification.id)}
                />
            ))}
        </div>
    );
};

// Item individual de notificação
const NotificationItem: React.FC<{
    notification: Notification;
    onClose: () => void;
}> = ({ notification, onClose }) => {
    const bgColors = {
        success: 'bg-primary/10 border-primary',
        error: 'bg-destructive/10 border-destructive',
        warning: 'bg-accent/10 border-accent',
        info: 'bg-secondary/10 border-secondary',
    };

    return (
        <div
            className={`
       ${bgColors[notification.type]}
       border rounded-lg p-4 shadow-lg
       animate-in slide-in-from-right duration-300
       flex items-start gap-3
     `}
        >
            <div className="flex-1">
                {notification.title && (
                    <h4 className="font-semibold mb-1">{notification.title}</h4>
                )}
                <p className="text-sm">{notification.message}</p>
            </div>
            <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
            >
                ✕
            </button>
        </div>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
    }
    return context;
};