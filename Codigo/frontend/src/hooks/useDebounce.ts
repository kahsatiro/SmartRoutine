import { useState, useEffect, useRef } from 'react';

/**
* Hook para debounce de valores
* Útil para otimizar buscas e filtros
* @param value - Valor a ser "debounced"
* @param delay - Delay em milissegundos (padrão: 500ms)
*/
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
* Hook para debounce de funções callback
* @param callback - Função a ser executada
* @param delay - Delay em milissegundos
*/
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 500
) {
    const timeoutRef = useRef<number | null>(null);

    const debouncedCallback = (...args: Parameters<T>) => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            callback(...args);
        }, delay);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
}