import { useState, useCallback, ChangeEvent } from 'react';

type ValidationRule<T> = (value: T) => string | null;

interface UseFormProps<T> {
    initialValues: T;
    validationRules?: Partial<Record<keyof T, ValidationRule<any>[]>>;
    onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    handleChange: (field: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleBlur: (field: keyof T) => () => void;
    handleSubmit: (e: React.FormEvent) => void;
    setFieldValue: (field: keyof T, value: any) => void;
    setFieldError: (field: keyof T, error: string) => void;
    resetForm: () => void;
    isValid: boolean;
}

/**
* Hook para gerenciamento de formulários
*/
export function useForm<T extends Record<string, any>>({
    initialValues,
    validationRules = {},
    onSubmit,
}: UseFormProps<T>): UseFormReturn<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = useCallback(
        (field: keyof T, value: any): string | null => {
            const rules = validationRules[field];
            if (!rules) return null;

            for (const rule of rules) {
                const error = rule(value);
                if (error) return error;
            }
            return null;
        },
        [validationRules]
    );

    const handleChange = useCallback(
        (field: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;

            setValues((prev) => ({
                ...prev,
                [field]: value,
            }));

            // Validar apenas se o campo já foi tocado
            if (touched[field]) {
                const error = validateField(field, value);
                setErrors((prev) => ({
                    ...prev,
                    [field]: error || undefined,
                }));
            }
        },
        [touched, validateField]
    );

    const handleBlur = useCallback(
        (field: keyof T) => () => {
            setTouched((prev) => ({
                ...prev,
                [field]: true,
            }));

            const error = validateField(field, values[field]);
            setErrors((prev) => ({
                ...prev,
                [field]: error || undefined,
            }));
        },
        [validateField, values]
    );

    const setFieldValue = useCallback((field: keyof T, value: any) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const setFieldError = useCallback((field: keyof T, error: string) => {
        setErrors((prev) => ({
            ...prev,
            [field]: error,
        }));
    }, []);

    const validateAllFields = useCallback((): boolean => {
        const newErrors: Partial<Record<keyof T, string>> = {};
        let isValid = true;

        Object.keys(validationRules).forEach((field) => {
            const error = validateField(field as keyof T, values[field as keyof T]);
            if (error) {
                newErrors[field as keyof T] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    }, [validationRules, validateField, values]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            // Marcar todos os campos como tocados
            const allTouched = Object.keys(initialValues).reduce(
                (acc, key) => ({ ...acc, [key]: true }),
                {}
            );
            setTouched(allTouched);

            // Validar todos os campos
            const isValid = validateAllFields();

            if (!isValid) return;

            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        },
        [initialValues, validateAllFields, onSubmit, values]
    );

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    const isValid = Object.keys(errors).length === 0;

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldError,
        resetForm,
        isValid,
    };
}

// Validações comuns
export const validators = {
    required: (message = 'Campo obrigatório') => (value: any) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return message;
        }
        return null;
    },
    email: (message = 'Email inválido') => (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            return message;
        }
        return null;
    },
    minLength: (min: number, message?: string) => (value: string) => {
        if (value && value.length < min) {
            return message || `Mínimo de ${min} caracteres`;
        }
        return null;
    },
    maxLength: (max: number, message?: string) => (value: string) => {
        if (value && value.length > max) {
            return message || `Máximo de ${max} caracteres`;
        }
        return null;
    },
    pattern: (regex: RegExp, message = 'Formato inválido') => (value: string) => {
        if (value && !regex.test(value)) {
            return message;
        }
        return null;
    },
    min: (min: number, message?: string) => (value: number) => {
        if (value < min) {
            return message || `Valor mínimo: ${min}`;
        }
        return null;
    },
    max: (max: number, message?: string) => (value: number) => {
        if (value > max) {
            return message || `Valor máximo: ${max}`;
        }
        return null;
    },
};