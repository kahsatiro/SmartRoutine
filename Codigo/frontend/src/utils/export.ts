import { Registra, Receita } from '../types';
import { formatDate, formatDateTime } from './date';
import { formatQuantity } from './formatters';

/**
* Utilitários para exportação de dados
*/

/**
* Converte array para CSV
*/
export function arrayToCSV<T extends Record<string, any>>(
    data: T[],
    headers: Array<{ key: keyof T; label: string }>
): string {
    if (data.length === 0) return '';

    // Cabeçalho
    const headerRow = headers.map((h) => h.label).join(',');

    // Linhas de dados
    const dataRows = data.map((item) => {
        return headers
            .map((header) => {
                const value = item[header.key];
                // Escapar vírgulas e aspas
                const stringValue = String(value ?? '');
                if (stringValue.includes(',') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            })
            .join(',');
    });

    return [headerRow, ...dataRows].join('\n');
}

/**
* Exporta despensa para CSV
*/
export function exportPantryToCSV(items: Registra[]): string {
    const headers = [
        { key: 'nomeAlimento' as keyof Registra, label: 'Alimento' },
        { key: 'quantidade' as keyof Registra, label: 'Quantidade' },
        { key: 'unidadeMedida' as keyof Registra, label: 'Unidade' },
        { key: 'dataCompra' as keyof Registra, label: 'Data Compra' },
        { key: 'dataValidade' as keyof Registra, label: 'Data Validade' },
        { key: 'lote' as keyof Registra, label: 'Lote' },
    ];

    return arrayToCSV(items, headers);
}

/**
* Exporta receitas para CSV
*/
export function exportRecipesToCSV(recipes: Receita[]): string {
    const flattenedRecipes = recipes.map((recipe) => ({
        titulo: recipe.titulo,
        porcao: recipe.porcao,
        tempoPreparo: recipe.tempoPreparo,
        dificuldade: recipe.informacoes?.dificuldade || '',
        calorias: recipe.informacoes?.calorias || 0,
        tags: recipe.informacoes?.tags?.join('; ') || '',
    }));

    const headers = [
        { key: 'titulo' as const, label: 'Título' },
        { key: 'porcao' as const, label: 'Porção' },
        { key: 'tempoPreparo' as const, label: 'Tempo (min)' },
        { key: 'dificuldade' as const, label: 'Dificuldade' },
        { key: 'calorias' as const, label: 'Calorias' },
        { key: 'tags' as const, label: 'Tags' },
    ];

    return arrayToCSV(flattenedRecipes, headers);
}

/**
* Baixa arquivo
*/
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
* Exporta despensa para CSV e baixa
*/
export function downloadPantryCSV(items: Registra[], filename?: string) {
    const csv = exportPantryToCSV(items);
    const defaultFilename = `despensa-${formatDate(new Date()).replace(/\//g, '-')}.csv`;
    downloadFile(csv, filename || defaultFilename, 'text/csv;charset=utf-8;');
}

/**
* Exporta receitas para CSV e baixa
*/
export function downloadRecipesCSV(recipes: Receita[], filename?: string) {
    const csv = exportRecipesToCSV(recipes);
    const defaultFilename = `receitas-${formatDate(new Date()).replace(/\//g, '-')}.csv`;
    downloadFile(csv, filename || defaultFilename, 'text/csv;charset=utf-8;');
}

/**
* Exporta JSON e baixa
*/
export function downloadJSON(data: any, filename: string) {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, filename, 'application/json');
}

/**
* Gera relatório em texto
*/
export function generatePantryReport(items: Registra[]): string {
    const report: string[] = [];

    report.push('========================================');
    report.push('      RELATÓRIO DA DESPENSA');
    report.push('========================================');
    report.push('');
    report.push(`Data: ${formatDateTime(new Date())}`);
    report.push(`Total de Itens: ${items.length}`);
    report.push('');
    report.push('========================================');
    report.push('      ITENS CADASTRADOS');
    report.push('========================================');
    report.push('');

    items.forEach((item, index) => {
        report.push(`${index + 1}. ${item.nomeAlimento}`);
        report.push(`   Quantidade: ${formatQuantity(item.quantidade, item.unidadeMedida)}`);
        report.push(`   Validade: ${formatDate(item.dataValidade)}`);
        if (item.lote) {
            report.push(`   Lote: ${item.lote}`);
        }
        report.push('');
    });

    report.push('========================================');
    report.push('SmartRoutine - Gestão Inteligente de Alimentos');
    report.push('========================================');

    return report.join('\n');
}

/**
* Baixa relatório em texto
*/
export function downloadPantryReport(items: Registra[], filename?: string) {
    const report = generatePantryReport(items);
    const defaultFilename = `relatorio-despensa-${formatDate(new Date()).replace(/\//g, '-')}.txt`;
    downloadFile(report, filename || defaultFilename, 'text/plain;charset=utf-8;');
}