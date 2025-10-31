import { useState, useEffect } from 'react';

/**
* Hook para detectar teclas pressionadas
* @param targetKey - Tecla a detectar (ex: 'Enter', 'Escape')
*/
export function useKeyPress(targetKey: string): boolean {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        const downHandler = ({ key }: KeyboardEvent) => {
            if (key === targetKey) {
                setKeyPressed(true);
            }
        };

        const upHandler = ({ key }: KeyboardEvent) => {
            if (key === targetKey) {
                setKeyPressed(false);
            }
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [targetKey]);

    return keyPressed;
}

/**
* Hook para detectar combinações de teclas (ex: Ctrl+S)
*/
export function useKeyCombo(
    keys: string[],
    callback: () => void,
    enabled = true
) {
    useEffect(() => {
        if (!enabled) return;

        const handler = (event: KeyboardEvent) => {
            const isComboPressed = keys.every((key) => {
                if (key === 'ctrl') return event.ctrlKey || event.metaKey;
                if (key === 'shift') return event.shiftKey;
                if (key === 'alt') return event.altKey;
                return event.key.toLowerCase() === key.toLowerCase();
            });

            if (isComboPressed) {
                event.preventDefault();
                callback();
            }
        };

        window.addEventListener('keydown', handler);

        return () => {
            window.removeEventListener('keydown', handler);
        };
    }, [keys, callback, enabled]);
}