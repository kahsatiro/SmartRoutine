/**
* Formata data para formato brasileiro
*/
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
    const d = new Date(date);

    if (format === 'long') {
        return d.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    return d.toLocaleDateString('pt-BR');
}

/**
* Formata data e hora
*/
export function formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('pt-BR');
}

/**
* Formata apenas hora
*/
export function formatTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
* Converte data para formato ISO (YYYY-MM-DD)
*/
export function toISODate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

/**
* Calcula diferença em dias entre duas datas
*/
export function daysBetween(date1: Date | string, date2: Date | string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const diffTime = d2.getTime() - d1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
* Calcula dias até vencimento
*/
export function daysUntilExpiry(expiryDate: Date | string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    return daysBetween(today, expiry);
}

/**
* Adiciona dias a uma data
*/
export function addDays(date: Date | string, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
* Subtrai dias de uma data
*/
export function subtractDays(date: Date | string, days: number): Date {
    return addDays(date, -days);
}

/**
* Adiciona meses a uma data
*/
export function addMonths(date: Date | string, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

/**
* Verifica se data é hoje
*/
export function isToday(date: Date | string): boolean {
    const d = new Date(date);
    const today = new Date();

    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
}

/**
* Verifica se data é amanhã
*/
export function isTomorrow(date: Date | string): boolean {
    return isToday(date) ? false : isToday(addDays(date, -1));
}

/**
* Verifica se data é esta semana
*/
export function isThisWeek(date: Date | string): boolean {
    const d = new Date(date);
    const today = new Date();

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return d >= weekStart && d <= weekEnd;
}

/**
* Verifica se data é este mês
*/
export function isThisMonth(date: Date | string): boolean {
    const d = new Date(date);
    const today = new Date();

    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}

/**
* Verifica se data está vencida
*/
export function isExpired(expiryDate: Date | string): boolean {
    return daysUntilExpiry(expiryDate) < 0;
}

/**
* Verifica se data vence em breve
*/
export function isExpiringSoon(expiryDate: Date | string, daysThreshold: number = 3): boolean {
    const days = daysUntilExpiry(expiryDate);
    return days >= 0 && days <= daysThreshold;
}

/**
* Obtém início do dia
*/
export function startOfDay(date: Date | string): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
* Obtém fim do dia
*/
export function endOfDay(date: Date | string): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

/**
* Obtém início do mês
*/
export function startOfMonth(date: Date | string): Date {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
* Obtém fim do mês
*/
export function endOfMonth(date: Date | string): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    d.setHours(23, 59, 59, 999);
    return d;
}

/**
* Calcula idade
*/
export function calculateAge(birthDate: Date | string): number {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

/**
* Formata período relativo (ex: "em 3 dias", "há 2 semanas")
*/
export function formatRelativeDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffInDays = daysBetween(now, d);

    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Amanhã';
    if (diffInDays === -1) return 'Ontem';

    if (diffInDays > 0) {
        if (diffInDays < 7) return `Em ${diffInDays} dias`;
        if (diffInDays < 30) return `Em ${Math.floor(diffInDays / 7)} semanas`;
        if (diffInDays < 365) return `Em ${Math.floor(diffInDays / 30)} meses`;
        return `Em ${Math.floor(diffInDays / 365)} anos`;
    } else {
        const absDays = Math.abs(diffInDays);
        if (absDays < 7) return `Há ${absDays} dias`;
        if (absDays < 30) return `Há ${Math.floor(absDays / 7)} semanas`;
        if (absDays < 365) return `Há ${Math.floor(absDays / 30)} meses`;
        return `Há ${Math.floor(absDays / 365)} anos`;
    }
}