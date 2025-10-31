export { AuthProvider, useAuth } from './AuthContext';
export { FoodProvider, useFood } from './FoodContext';
export { RecipeProvider, useRecipe } from './RecipeContext';
export { NotificationProvider, useNotification } from './NotificationContext';
export { ThemeProvider, useTheme } from './ThemeContext';

// Provider combinado
export { AppProvider } from './AppContext';

// Re-export types se necessário
export type { Theme } from './ThemeContext';