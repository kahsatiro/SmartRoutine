export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:6789',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
} as const;

// Chaves do localStorage
export const STORAGE_KEYS = {
    USER: 'smartroutine_user',
    TOKEN: 'smartroutine_token',
    THEME: 'smartroutine_theme',
    PREFERENCES: 'smartroutine_preferences',
    LANGUAGE: 'smartroutine_language',
} as const;

// Categorias de alimentos
export const FOOD_CATEGORIES = [
    'Frutas',
    'Vegetais',
    'Carnes',
    'Laticínios',
    'Grãos',
    'Padaria',
    'Bebidas',
    'Condimentos',
    'Temperos',
    'Proteínas',
    'Massas',
    'Enlatados',
    'Congelados',
    'Doces',
    'Outros',
] as const;

// Unidades de medida
export const UNITS = [
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'L', label: 'Litro (L)' },
    { value: 'ml', label: 'Mililitro (ml)' },
    { value: 'unidade', label: 'Unidade' },
    { value: 'pacote', label: 'Pacote' },
    { value: 'caixa', label: 'Caixa' },
    { value: 'lata', label: 'Lata' },
    { value: 'garrafa', label: 'Garrafa' },
] as const;

// Níveis de dificuldade de receitas
export const DIFFICULTY_LEVELS = [
    'Muito Fácil',
    'Fácil',
    'Médio',
    'Difícil',
    'Muito Difícil',
] as const;

// Tipos de refeição
export const MEAL_TYPES = [
    'Café da Manhã',
    'Lanche da Manhã',
    'Almoço',
    'Lanche da Tarde',
    'Jantar',
    'Ceia',
    'Sobremesa',
    'Petisco',
] as const;

// Tags populares de receitas
export const RECIPE_TAGS = [
    'vegetariano',
    'vegano',
    'low-carb',
    'fitness',
    'proteico',
    'saudável',
    'rápido',
    'fácil',
    'econômico',
    'gourmet',
    'tradicional',
    'sem-glúten',
    'sem-lactose',
    'integral',
    'diet',
    'light',
] as const;

// Limites de validade
export const EXPIRY_THRESHOLDS = {
    EXPIRED: 0,
    EXPIRING_SOON: 3,
    WARNING: 7,
    FRESH: 30,
} as const;

// Cores por status de validade
export const EXPIRY_COLORS = {
    EXPIRED: {
        bg: 'bg-destructive',
        text: 'text-destructive',
        border: 'border-destructive',
    },
    EXPIRING_SOON: {
        bg: 'bg-accent',
        text: 'text-accent',
        border: 'border-accent',
    },
    WARNING: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-500',
        border: 'border-yellow-500',
    },
    FRESH: {
        bg: 'bg-green-500',
        text: 'text-green-500',
        border: 'border-green-500',
    },
} as const;

// Configurações de paginação
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_ITEMS_PER_PAGE: 12,
    ITEMS_PER_PAGE_OPTIONS: [12, 24, 48, 96],
} as const;

// Limites de campos
export const FIELD_LIMITS = {
    NAME: {
        MIN: 2,
        MAX: 100,
    },
    EMAIL: {
        MAX: 255,
    },
    PASSWORD: {
        MIN: 6,
        MAX: 128,
    },
    RECIPE_TITLE: {
        MIN: 3,
        MAX: 200,
    },
    INGREDIENT: {
        MAX: 100,
    },
    INSTRUCTION: {
        MAX: 500,
    },
} as const;

// Regex patterns
export const PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
    DATE: /^\d{4}-\d{2}-\d{2}$/,
    TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
} as const;

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
    REQUIRED: 'Este campo é obrigatório',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PASSWORD: 'Senha deve ter no mínimo 6 caracteres',
    PASSWORDS_NOT_MATCH: 'As senhas não coincidem',
    INVALID_DATE: 'Data inválida',
    INVALID_PHONE: 'Telefone inválido',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
    NOT_FOUND: 'Recurso não encontrado',
    UNAUTHORIZED: 'Você não tem permissão para esta ação',
} as const;

// Mensagens de sucesso padrão
export const SUCCESS_MESSAGES = {
    SAVED: 'Dados salvos com sucesso!',
    CREATED: 'Criado com sucesso!',
    UPDATED: 'Atualizado com sucesso!',
    DELETED: 'Removido com sucesso!',
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    SIGNUP_SUCCESS: 'Cadastro realizado com sucesso!',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
} as const;

// Configurações de tema
export const THEME_CONFIG = {
    DEFAULT: 'system',
    OPTIONS: ['light', 'dark', 'system'] as const,
} as const;

// Configurações de idioma
export const LANGUAGE_CONFIG = {
    DEFAULT: 'pt-BR',
    OPTIONS: ['pt-BR', 'en-US', 'es-ES'] as const,
} as const;

// Limites de arquivo
export const FILE_LIMITS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

export const APP_CONFIG = {
    NAME: import.meta.env.VITE_APP_NAME || 'SmartRoutine',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    ENV: import.meta.env.VITE_APP_ENV || 'development',
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:6789',
} as const;

export const FEATURE_FLAGS = {
    AI_RECIPES: import.meta.env.VITE_ENABLE_AI_RECIPES === 'true',
    PDF_EXPORT: import.meta.env.VITE_ENABLE_PDF_EXPORT === 'true',
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
} as const;

export const UI_CONFIG = {
    DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME || 'light',
    DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'pt-BR',
    ITEMS_PER_PAGE: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '12'),
    TOAST_DURATION: parseInt(import.meta.env.VITE_TOAST_DURATION || '5000'),
} as const;

export const ALERT_CONFIG = {
    EXPIRY_WARNING_DAYS: parseInt(import.meta.env.VITE_EXPIRY_WARNING_DAYS || '3'),
    LOW_STOCK_WARNING_DAYS: parseInt(import.meta.env.VITE_LOW_STOCK_WARNING_DAYS || '7'),
} as const;