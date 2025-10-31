/**
* Formata moeda brasileira
*/
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

/**
* Formata número com separadores
*/
export function formatNumber(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
* Formata porcentagem
*/
export function formatPercentage(value: number, decimals: number = 0): string {
    return `${formatNumber(value, decimals)}%`;
}

/**
* Formata telefone brasileiro
*/
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone;
}

/**
* Formata CPF
*/
export function formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    return cpf;
}

/**
* Formata CNPJ
*/
export function formatCNPJ(cnpj: string): string {
    const cleaned = cnpj.replace(/\D/g, '');

    if (cleaned.length === 14) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return cnpj;
}

/**
* Formata CEP
*/
export function formatCEP(cep: string): string {
    const cleaned = cep.replace(/\D/g, '');

    if (cleaned.length === 8) {
        return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    return cep;
}

/**
* Formata tamanho de arquivo
*/
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
* Formata tempo decorrido (ex: "há 5 minutos")
*/
export function formatTimeAgo(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'agora mesmo';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `há ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `há ${diffInYears} ${diffInYears === 1 ? 'ano' : 'anos'}`;
}

/**
* Formata duração em minutos para texto legível
*/
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}min`;
}

/**
* Formata lista de itens em texto
*/
export function formatList(items: string[], maxItems: number = 3): string {
    if (items.length === 0) return '';

    if (items.length <= maxItems) {
        return items.join(', ');
    }

    const visible = items.slice(0, maxItems);
    const remaining = items.length - maxItems;

    return `${visible.join(', ')} e mais ${remaining}`;
}

/**
* Formata quantidade com unidade
*/
export function formatQuantity(quantity: number, unit: string): string {
    const formattedQuantity = formatNumber(quantity, quantity % 1 === 0 ? 0 : 2);
    return `${formattedQuantity} ${unit}`;
}

/**
* Mascara string (ex: email, cartão)
*/
export function maskString(str: string, visibleStart: number = 3, visibleEnd: number = 3): string {
    if (str.length <= visibleStart + visibleEnd) {
        return str;
    }

    const start = str.slice(0, visibleStart);
    const end = str.slice(-visibleEnd);
    const masked = '*'.repeat(str.length - visibleStart - visibleEnd);

    return `${start}${masked}${end}`;
}