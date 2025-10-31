import { useState, useEffect } from 'react';

/**
* Hook para detectar media queries CSS
* @param query - Media query string (ex: '(min-width: 768px)')
*/
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Compatibilidade com navegadores antigos
        if (media.addEventListener) {
            media.addEventListener('change', listener);
        } else {
            media.addListener(listener);
        }

        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', listener);
            } else {
                media.removeListener(listener);
            }
        };
    }, [matches, query]);

    return matches;
}

/**
* Hook com breakpoints predefinidos
*/
export function useBreakpoint() {
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
    const isDesktop = useMediaQuery('(min-width: 1025px)');
    const isSmallScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1025px)');

    return {
        isMobile,
        isTablet,
        isDesktop,
        isSmallScreen,
        isLargeScreen,
    };
}