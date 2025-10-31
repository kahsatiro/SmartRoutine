import { AxiosError } from 'axios';

interface ErrorResponse {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
}

export class ApiError extends Error {
    status?: number;
    data?: ErrorResponse;

    constructor(message: string, status?: number, data?: ErrorResponse) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
* Extrai mensagem de erro amigável do erro da API
*/
export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        return error.message;
    }

    if (error instanceof AxiosError) {
        const data = error.response?.data as ErrorResponse;

        // Tentar obter mensagem de erro da resposta
        if (data?.error) {
            return data.error;
        }

        if (data?.message) {
            return data.message;
        }

        // Erros de validação
        if (data?.errors) {
            const firstError = Object.values(data.errors)[0];
            return Array.isArray(firstError) ? firstError[0] : 'Erro de validação';
        }

        // Mensagens padrão por status HTTP
        switch (error.response?.status) {
            case 400:
                return 'Requisição inválida. Verifique os dados enviados.';
            case 401:
                return 'Você precisa estar logado para realizar esta ação.';
            case 403:
                return 'Você não tem permissão para realizar esta ação.';
            case 404:
                return 'Recurso não encontrado.';
            case 409:
                return 'Este recurso já existe.';
            case 422:
                return 'Dados inválidos. Verifique os campos.';
            case 500:
                return 'Erro interno do servidor. Tente novamente mais tarde.';
            case 503:
                return 'Serviço temporariamente indisponível.';
            default:
                if (error.code === 'ECONNABORTED') {
                    return 'A requisição demorou muito. Tente novamente.';
                }
                if (error.code === 'ERR_NETWORK') {
                    return 'Erro de conexão. Verifique sua internet.';
                }
                return 'Erro ao processar requisição.';
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Ocorreu um erro inesperado.';
}

/**
* Manipulador de erros para ser usado em catch blocks
*/
export function handleApiError(error: unknown): never {
    const message = getErrorMessage(error);

    if (error instanceof AxiosError) {
        throw new ApiError(
            message,
            error.response?.status,
            error.response?.data as ErrorResponse
        );
    }

    throw new Error(message);
}