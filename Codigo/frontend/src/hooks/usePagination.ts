import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
    items: T[];
    itemsPerPage?: number;
    initialPage?: number;
}

interface UsePaginationReturn<T> {
    currentPage: number;
    totalPages: number;
    currentItems: T[];
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startIndex: number;
    endIndex: number;
}

/**
* Hook para paginação de arrays
*/
export function usePagination<T>({
    items,
    itemsPerPage = 10,
    initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    }, [items, currentPage, itemsPerPage]);

    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, items.length);

    return {
        currentPage,
        totalPages,
        currentItems,
        nextPage,
        prevPage,
        goToPage,
        hasNextPage,
        hasPrevPage,
        startIndex,
        endIndex,
    };
}