import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Badge } from '../ui/badge';
import {
  Home,
  Package,
  ChefHat,
  User,
  LogOut,
  Menu,
  Settings,
  Bell,
  AlertTriangle,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFood } from '../../context/FoodContext';
import smartRoutineLogo from '../../assets/logo.png';
import { Page } from '@/types';
import { ThemeToggle } from '../shared/ThemeToggle';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: Page) => void;
}

interface NavigationItem {
  id: Page;
  label: string;
  icon: LucideIcon;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { expiringItems, expiredItems } = useFood();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Painel', icon: Home },
    { id: 'pantry', label: 'Despensa', icon: Package },
    { id: 'recipes', label: 'Receitas', icon: ChefHat },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const alertCount = expiringItems.length + expiredItems.length;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
            <img src={smartRoutineLogo} alt="SmartRoutine" className="w-8 h-8" />
            <span className="font-semibold text-xl hidden sm:inline">SmartRoutine</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => handleNavigate(item.id)}
                  className="flex items-center gap-2"
                >
                  <Icon size={18} />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Theme Toggle*/}
              <ThemeToggle />
              </div>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} />
                    {alertCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {alertCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {alertCount === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      Nenhuma notificação no momento
                    </div>
                  ) : (
                    <>
                      {expiredItems.length > 0 && (
                        <DropdownMenuItem
                          className="flex items-start gap-3 p-3 cursor-pointer"
                          onClick={() => handleNavigate('pantry')}
                        >
                          <div className="bg-destructive/10 p-2 rounded-full">
                            <AlertTriangle size={16} className="text-destructive" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Produtos Vencidos</p>
                            <p className="text-xs text-muted-foreground">
                              {expiredItems.length} {expiredItems.length === 1 ? 'item vencido' : 'itens vencidos'}
                            </p>
                          </div>
                        </DropdownMenuItem>
                      )}

                      {expiringItems.length > 0 && (
                        <DropdownMenuItem
                          className="flex items-start gap-3 p-3 cursor-pointer"
                          onClick={() => handleNavigate('pantry')}
                        >
                          <div className="bg-accent/10 p-2 rounded-full">
                            <AlertTriangle size={16} className="text-accent" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Vencendo em Breve</p>
                            <p className="text-xs text-muted-foreground">
                              {expiringItems.length} {expiringItems.length === 1 ? 'item vence' : 'itens vencem'} nos próximos 3 dias
                            </p>
                          </div>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu - Desktop */}
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {user?.nome.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden lg:inline">{user?.nome}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{user?.nome}</p>
                        <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigate('profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigate('profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col h-full">
                    {/* User Info */}
                    <div className="flex items-center gap-3 pb-4 border-b mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.nome.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate">{user?.nome}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={currentPage === item.id ? 'default' : 'ghost'}
                            onClick={() => handleNavigate(item.id)}
                            className="w-full justify-start gap-3"
                          >
                            <Icon size={20} />
                            {item.label}
                          </Button>
                        );
                      })}

                      {alertCount > 0 && (
                        <>
                          <div className="py-2">
                            <div className="border-t" />
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs font-medium text-muted-foreground mb-2">ALERTAS</p>
                            {expiredItems.length > 0 && (
                              <div className="flex items-center gap-2 text-sm mb-2">
                                <AlertTriangle size={16} className="text-destructive" />
                                <span>{expiredItems.length} vencidos</span>
                              </div>
                            )}
                            {expiringItems.length > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <AlertTriangle size={16} className="text-accent" />
                                <span>{expiringItems.length} vencendo</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Logout Button */}
                    <div className="pt-4 border-t">
                      <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                      >
                        <LogOut size={20} />
                        Sair
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
    </nav>
  );
};