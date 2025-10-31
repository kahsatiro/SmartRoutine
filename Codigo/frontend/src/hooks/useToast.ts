import { useNotification } from '../context/NotificationContext';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
    title?: string;
    duration?: number;
}

/**
* Hook simplificado para mostrar notificações
*/
export const useToast = () => {
    const { showNotification } = useNotification();

    const toast = (type: ToastType, message: string, options?: ToastOptions) => {
        showNotification({
            type,
            message,
            title: options?.title,
            duration: options?.duration,
        });
    };

    return {
        toast,
        success: (message: string, options?: ToastOptions) => toast('success', message, options),
        error: (message: string, options?: ToastOptions) => toast('error', message, options),
        warning: (message: string, options?: ToastOptions) => toast('warning', message, options),
        info: (message: string, options?: ToastOptions) => toast('info', message, options),
    };
};