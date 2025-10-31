import { useState, useEffect, useCallback } from 'react';

interface UseAsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
    execute: (...args: any[]) => Promise<void>;
    reset: () => void;
}

/**
* Hook para gerenciar operações assíncronas
*/
export function useAsync<T>(
    asyncFunction: (...args: any[]) => Promise<T>,
    immediate = true
): UseAsyncReturn<T> {
    const [state, setState] = useState<UseAsyncState<T>>({
        data: null,
        loading: immediate,
        error: null,
    });

    const execute = useCallback(
        async (...args: any[]) => {
            setState({ data: null, loading: true, error: null });

            try {
                const data = await asyncFunction(...args);
                setState({ data, loading: false, error: null });
            } catch (error) {
                setState({ data: null, loading: false, error: error as Error });
            }
        },
        [asyncFunction]
    );

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, []);

    return { ...state, execute, reset };
}