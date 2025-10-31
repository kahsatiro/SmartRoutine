import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '../ui/utils';

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    debounceMs?: number;
    className?: string;
    defaultValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Buscar...',
    onSearch,
    debounceMs = 300,
    className,
    defaultValue = '',
}) => {
    const [query, setQuery] = useState(defaultValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, debounceMs, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className={cn('relative', className)}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10"
            />
            {query && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};