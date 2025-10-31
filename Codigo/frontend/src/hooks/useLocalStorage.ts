import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

/**
* Hook para gerenciar dados no localStorage
* @param key - Chave do localStorage
* @param initialValue - Valor inicial
*/
export function useLocalStorage<T>(key: string, initialValue: T) {
    // Função para obter o valor inicial
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Função para salvar valor
    const setValue = useCallback(
        (value: SetValue<T>) => {
            if (typeof window === 'undefined') {
                console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
            }

            try {
                const newValue = value instanceof Function ? value(storedValue) : value;
                window.localStorage.setItem(key, JSON.stringify(newValue));
                setStoredValue(newValue);
                window.dispatchEvent(new Event('local-storage'));
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    // Função para remover valor
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
            window.dispatchEvent(new Event('local-storage'));
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    // Sincronizar com mudanças em outras tabs/windows
    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue());
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, [readValue]);

    return [storedValue, setValue, removeValue] as const;
}