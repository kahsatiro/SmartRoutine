import { PATTERNS, FIELD_LIMITS } from './constants';

/**
* Funções de validação
*/

/**
* Valida email
*/
export function isValidEmail(email: string): boolean {
    return PATTERNS.EMAIL.test(email);
}

/**
* Valida CPF
*/
export function isValidCPF(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleaned.charAt(10))) return false;

    return true;
}

/**
* Valida CNPJ
*/
export function isValidCNPJ(cnpj: string): boolean {
    const cleaned = cnpj.replace(/\D/g, '');

    if (cleaned.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleaned)) return false;

    let size = cleaned.length - 2;
    let numbers = cleaned.substring(0, size);
    const digits = cleaned.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cleaned.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
}

/**
* Valida telefone brasileiro
*/
export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
}

/**
* Valida URL
*/
export function isValidURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
* Valida data no formato YYYY-MM-DD
*/
export function isValidDate(dateString: string): boolean {
    if (!PATTERNS.DATE.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}

/**
* Valida data futura
*/
export function isFutureDate(dateString: string): boolean {
    if (!isValidDate(dateString)) return false;

    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date >= today;
}

/**
* Valida data passada
*/
export function isPastDate(dateString: string): boolean {
    if (!isValidDate(dateString)) return false;

    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
}

/**
* Valida senha forte
*/
export function isStrongPassword(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < FIELD_LIMITS.PASSWORD.MIN) {
        errors.push(`Mínimo de ${FIELD_LIMITS.PASSWORD.MIN} caracteres`);
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Pelo menos uma letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Pelo menos um número');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Pelo menos um caractere especial');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
* Valida idade mínima
*/
export function isMinAge(birthDate: string, minAge: number): boolean {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age >= minAge;
}

/**
* Valida quantidade
*/
export function isValidQuantity(quantity: number): boolean {
    return quantity > 0 && !isNaN(quantity) && isFinite(quantity);
}

/**
* Valida arquivo
*/
export function isValidFile(
    file: File,
    maxSize: number,
    acceptedTypes: string[]
): { isValid: boolean; error?: string } {
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `Arquivo muito grande. Máximo: ${maxSize / 1024 / 1024}MB`,
        };
    }

    if (!acceptedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: `Tipo de arquivo não aceito. Aceitos: ${acceptedTypes.join(', ')}`,
        };
    }

    return { isValid: true };
}

/**
* Valida range numérico
*/
export function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
* Valida string não vazia
*/
export function isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
}

/**
* Valida comprimento de string
*/
export function hasValidLength(
    value: string,
    min: number,
    max: number
): boolean {
    const length = value.trim().length;
    return length >= min && length <= max;
}