export interface User {
    id: number;
    nome: string;
    email: string;
    dataNascimento: string;
}

export interface LoginCredentials {
    email: string;
    senha: string;
}

export interface SignupData {
    nome: string;
    email: string;
    senha: string;
    dataNascimento: string;
}

export interface Alimento {
    id: number;
    nome: string;
    categoria: string;
}

export interface Registra {
    id: number;
    alimentoId: number;
    usuarioId: number;
    nomeAlimento?: string;
    nomeUsuario?: string;
    dataCompra: string;
    dataValidade: string;
    unidadeMedida: string;
    lote?: string;
    quantidade: number;
    daysUntilExpiry?: number;
}

export interface ReceitaInformacoes {
    ingredientes: string[];
    modo_preparo: string[];
    dificuldade: string;
    tipo_refeicao: string;
    calorias: number;
    tags: string[];
}

export interface Receita {
    id: number;
    titulo: string;
    porcao: string;
    tempoPreparo: number;
    informacoes: ReceitaInformacoes;
}

export interface ReceitaFavorita {
    id: number;
    usuarioId: number;
    receitaId: number;
    nomeUsuario?: string;
    tituloReceita?: string;
    dataAdicao: string;
}

export type Page = 'home' | 'login' | 'signup' | 'dashboard' | 'pantry' | 'recipes' | 'profile';