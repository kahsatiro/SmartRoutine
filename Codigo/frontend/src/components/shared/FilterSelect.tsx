import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterSelectProps {
    label?: string;
    placeholder?: string;
    options: FilterOption[];
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
    label,
    placeholder = 'Selecione...',
    options,
    value,
    onValueChange,
    className,
}) => {
    return (
        <div className={className}>
            {label && <Label className="mb-2 block text-sm font-medium">{label}</Label>}
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};