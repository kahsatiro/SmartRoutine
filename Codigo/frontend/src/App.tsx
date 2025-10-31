import React, { useState, useEffect } from 'react';
import { AppProvider, useAuth } from './context';
import { LoadingSpinner } from './components/shared';
import { Page } from './types';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Pantry } from './pages/Pantry';
import { Recipes } from './pages/Recipes';
import { Profile } from './pages/Profile';

/**
* Componente interno que gerencia roteamento e autenticação
* Precisa estar dentro do AppProvider para acessar contexts
*/
function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user, loading } = useAuth();

  // Navegação entre páginas
  const navigate = (page: Page) => {
    setCurrentPage(page);
    // Scroll to top ao navegar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Redirecionar para dashboard se usuário já estiver logado
  useEffect(() => {
    if (user && currentPage === 'home') {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  // Redirecionar para home se usuário deslogar
  useEffect(() => {
    if (!user && !['home', 'login', 'signup'].includes(currentPage)) {
      setCurrentPage('home');
    }
  }, [user, currentPage]);

  // Loading inicial (carregando dados do localStorage)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Carregando SmartRoutine..." />
      </div>
    );
  }

  // Rotas públicas (sem autenticação)
  if (!user) {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'signup':
        return <Signup onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  }

  // Rotas privadas (requerem autenticação)
  switch (currentPage) {
    case 'dashboard':
      return <Dashboard onNavigate={navigate} />;
    case 'pantry':
      return <Pantry onNavigate={navigate} />;
    case 'recipes':
      return <Recipes onNavigate={navigate} />;
    case 'profile':
      return <Profile onNavigate={navigate} />;
    default:
      return <Dashboard onNavigate={navigate} />;
  }
}

/**
* Componente principal da aplicação
* Envolve tudo com os Providers necessários
*/
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}