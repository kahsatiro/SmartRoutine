const STORAGE_KEYS = {
    USER: 'smartroutine_user',
    TOKEN: 'smartroutine_token',
    THEME: 'smartroutine_theme',
    PREFERENCES: 'smartroutine_preferences',
} as const;

class StorageService {
    private prefix = 'smartroutine_';

    /**
     * Salva item no localStorage
     */
    setItem<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serializedValue);
        } catch (error) {
            console.error(`Erro ao salvar no localStorage (${key}):`, error);
        }
    }

    /**
     * Recupera item do localStorage
     */
    getItem<T>(key: string): T | null {
        try {
            const serializedValue = localStorage.getItem(this.prefix + key);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue) as T;
        } catch (error) {
            console.error(`Erro ao recuperar do localStorage (${key}):`, error);
            return null;
        }
    }

    /**
     * Remove item do localStorage
     */
    removeItem(key: string): void {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (error) {
            console.error(`Erro ao remover do localStorage (${key}):`, error);
        }
    }

    /**
     * Limpa todos os itens do localStorage relacionados ao app
     */
    clear(): void {
        try {
            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
        }
    }

    /**
     * Verifica se uma chave existe
     */
    hasItem(key: string): boolean {
        return localStorage.getItem(this.prefix + key) !== null;
    }

    // Métodos específicos para dados da aplicação
    setUser(user: any): void {
        this.setItem(STORAGE_KEYS.USER, user);
    }

    getUser<T>(): T | null {
        return this.getItem<T>(STORAGE_KEYS.USER);
    }

    removeUser(): void {
        this.removeItem(STORAGE_KEYS.USER);
    }

    setToken(token: string): void {
        this.setItem(STORAGE_KEYS.TOKEN, token);
    }

    getToken(): string | null {
        return this.getItem<string>(STORAGE_KEYS.TOKEN);
    }

    removeToken(): void {
        this.removeItem(STORAGE_KEYS.TOKEN);
    }

    setTheme(theme: string): void {
        this.setItem(STORAGE_KEYS.THEME, theme);
    }

    getTheme(): string | null {
        return this.getItem<string>(STORAGE_KEYS.THEME);
    }
}

export const storageService = new StorageService();