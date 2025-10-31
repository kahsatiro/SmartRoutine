import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { storageService } from './storageService';

// ============================================
// CONFIGURAÇÃO BASEADA NO .ENV
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6789';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
const LOG_REQUESTS = import.meta.env.VITE_LOG_REQUESTS === 'true';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const MOCK_DELAY = parseInt(import.meta.env.VITE_MOCK_DELAY || '500');
const IS_DEVELOPMENT = import.meta.env.DEV;
const IS_PRODUCTION = import.meta.env.PROD;

// ============================================
// CONFIGURAÇÃO DA INSTÂNCIA AXIOS
// ============================================

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ============================================
// INTERCEPTOR DE REQUISIÇÃO
// ============================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Adicionar token de autenticação (se existir)
    const token = storageService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adicionar timestamp para tracking
    if (config.headers) {
      config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Log de requisições em desenvolvimento
    if (LOG_REQUESTS && IS_DEVELOPMENT) {
      console.group(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
      console.log('📦 Dados:', config.data);
      console.log('🔧 Headers:', config.headers);
      console.log('⚙️ Params:', config.params);
      console.groupEnd();
    }

    // Simular delay em modo mock
    if (USE_MOCK_DATA && MOCK_DELAY > 0) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(config), MOCK_DELAY);
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (LOG_REQUESTS) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR DE RESPOSTA
// ============================================

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de respostas bem-sucedidas em desenvolvimento
    if (LOG_REQUESTS && IS_DEVELOPMENT) {
      console.group(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
      console.log('📥 Dados:', response.data);
      console.log('⏱️ Tempo:', response.headers['x-response-time'] || 'N/A');
      console.groupEnd();
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Log de erros
    if (LOG_REQUESTS) {
      console.group('❌ Response Error');
      console.error('Status:', error.response?.status);
      console.error('Message:', error.message);
      console.error('Data:', error.response?.data);
      console.error('URL:', error.config?.url);
      console.groupEnd();
    }

    // Tratamento de erros específicos
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          // Bad Request
          if (IS_DEVELOPMENT) {
            console.warn('⚠️ Bad Request:', data?.error || data?.message);
          }
          break;

        case 401:
          // Não autorizado - Limpar token e redirecionar
          console.warn('🔒 Não autorizado - Token inválido ou expirado');
          storageService.removeToken();
          storageService.removeUser();

          // Evitar loop infinito
          if (window.location.pathname !== '/' && !window.location.pathname.includes('login')) {
            window.location.href = '/';
          }
          break;

        case 403:
          // Acesso negado
          console.error('🚫 Acesso negado');
          break;

        case 404:
          // Não encontrado
          if (IS_DEVELOPMENT) {
            console.warn('🔍 Recurso não encontrado:', error.config?.url);
          }
          break;

        case 409:
          // Conflito (ex: email duplicado)
          console.warn('⚠️ Conflito:', data?.error || 'Recurso já existe');
          break;

        case 422:
          // Validação falhou
          console.warn('⚠️ Erro de validação:', data?.errors || data?.error);
          break;

        case 429:
          // Too Many Requests - Retry após delay
          console.warn('⏳ Muitas requisições - aguardando...');
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            await new Promise(resolve => setTimeout(resolve, 2000));
            return api(originalRequest);
          }
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Erros de servidor - Retry uma vez
          console.error('🔥 Erro no servidor');
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            await new Promise(resolve => setTimeout(resolve, 1000));
            return api(originalRequest);
          }
          break;

        default:
          console.error(`❌ Erro ${status}:`, error.response.statusText);
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('📡 Servidor não respondeu. Verifique sua conexão.');

      // Retry em caso de timeout
      if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
        originalRequest._retry = true;
        return api(originalRequest);
      }
    } else {
      // Erro ao configurar a requisição
      console.error('⚙️ Erro ao configurar requisição:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
* Verifica se a API está online
*/
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await api.get('/', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}

/**
* Obtém informações da API
*/
export async function getApiInfo(): Promise<{
  message: string;
  version: string;
  entities: string[];
} | null> {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Failed to get API info:', error);
    return null;
  }
}

/**
* Configura token de autenticação
*/
export function setAuthToken(token: string): void {
  storageService.setToken(token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
* Remove token de autenticação
*/
export function removeAuthToken(): void {
  storageService.removeToken();
  delete api.defaults.headers.common['Authorization'];
}

/**
* Faz requisição com retry automático
*/
export async function requestWithRetry<T>(
  config: AxiosRequestConfig,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await api(config);
      return response.data;
    } catch (error) {
      lastError = error;

      if (i < maxRetries - 1) {
        console.warn(`Tentativa ${i + 1} falhou. Tentando novamente em ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
}

/**
* Cancela todas as requisições pendentes
*/
const pendingRequests = new Map<string, AbortController>();

export function cancelPendingRequests(): void {
  pendingRequests.forEach((controller) => {
    controller.abort();
  });
  pendingRequests.clear();
}

/**
* Faz requisição cancelável
*/
export async function cancelableRequest<T>(
  config: AxiosRequestConfig,
  requestId: string
): Promise<T> {
  // Cancelar requisição anterior com mesmo ID
  if (pendingRequests.has(requestId)) {
    pendingRequests.get(requestId)?.abort();
  }

  // Criar novo AbortController
  const controller = new AbortController();
  pendingRequests.set(requestId, controller);

  try {
    const response = await api({
      ...config,
      signal: controller.signal,
    });
    pendingRequests.delete(requestId);
    return response.data;
  } catch (error) {
    pendingRequests.delete(requestId);
    throw error;
  }
}

// ============================================
// HELPERS PARA DESENVOLVIMENTO
// ============================================

/**
* Mock de resposta para testes
*/
export function mockResponse<T>(data: T, delay: number = MOCK_DELAY): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
* Simula erro de API
*/
export function mockError(message: string, status: number = 500): Promise<never> {
  return Promise.reject({
    response: {
      status,
      data: { error: message },
    },
  });
}

// ============================================
// INFORMAÇÕES DE DEBUG
// ============================================

if (IS_DEVELOPMENT && LOG_REQUESTS) {
  console.group('🔧 SmartRoutine API Configuration');
  console.log('📡 Base URL:', API_BASE_URL);
  console.log('⏱️ Timeout:', `${API_TIMEOUT}ms`);
  console.log('🧪 Mock Data:', USE_MOCK_DATA);
  console.log('📊 Log Requests:', LOG_REQUESTS);
  console.log('🌍 Environment:', import.meta.env.MODE);
  console.groupEnd();
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default api;