import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
    Home,
    Package,
    ChefHat,
    User,
    Settings,
    LogOut,
    AlertTriangle,
    Heart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFood } from '../../context/FoodContext';
import { useRecipe } from '../../context/RecipeContext';
import smartRoutineLogo from '../../assets/logo.png';
import { cn } from '../ui/utils';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
    currentPage,
    onNavigate,
    collapsed = false
}) => {
    const { user, logout } = useAuth();
    const { foodItems, expiringItems, expiredItems } = useFood();
    const { favorites } = useRecipe();

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Painel',
            icon: Home,
            badge: null
        },
        {
            id: 'pantry',
            label: 'Despensa',
            icon: Package,
            badge: foodItems.length > 0 ? foodItems.length : null
        },
        {
            id: 'recipes',
            label: 'Receitas',
            icon: ChefHat,
            badge: null
        },
    ];

    const secondaryItems = [
        {
            id: 'profile',
            label: 'Perfil',
            icon: User
        },
        {
            id: 'settings',
            label: 'Configurações',
            icon: Settings
        },
    ];

    const alertCount = expiringItems.length + expiredItems.length;

    return (
        <aside
            className={cn(
                "bg-card border-r border-border h-screen sticky top-0 flex flex-col transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <img src={smartRoutineLogo} alt="SmartRoutine" className="w-8 h-8" />
                    {!collapsed && (
                        <span className="font-semibold text-lg">SmartRoutine</span>
                    )}
                </div>
            </div>

            {/* User Info */}
            {!collapsed && (
                <div className="p-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src="/placeholder-avatar.jpg" />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                {user?.nome.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-medium text-sm truncate">{user?.nome}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                <div className="space-y-1">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                            <Button
                                key={item.id}
                                variant={isActive ? 'default' : 'ghost'}
                                onClick={() => onNavigate(item.id)}
                                className={cn(
                                    "w-full justify-start gap-3 relative",
                                    collapsed && "justify-center px-2"
                                )}
                            >
                                <Icon size={20} />
                                {!collapsed && (
                                    <>
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.badge !== null && (
                                            <Badge variant="secondary" className="ml-auto">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </Button>
                        );
                    })}
                </div>

                {/* Alerts Section */}
                {!collapsed && alertCount > 0 && (
                    <>
                        <Separator />
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                                ALERTAS
                            </p>
                            <div className="space-y-1">
                                {expiredItems.length > 0 && (
                                    <button
                                        onClick={() => onNavigate('pantry')}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors text-left"
                                    >
                                        <AlertTriangle size={18} className="text-destructive shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">Vencidos</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {expiredItems.length} {expiredItems.length === 1 ? 'item' : 'itens'}
                                            </p>
                                        </div>
                                    </button>
                                )}

                                {expiringItems.length > 0 && (
                                    <button
                                        onClick={() => onNavigate('pantry')}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors text-left"
                                    >
                                        <AlertTriangle size={18} className="text-accent shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">Vencendo</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {expiringItems.length} {expiringItems.length === 1 ? 'item' : 'itens'}
                                            </p>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Favorites */}
                {!collapsed && favorites.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                                FAVORITOS
                            </p>
                            <button
                                onClick={() => onNavigate('recipes')}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                            >
                                <Heart size={18} className="text-destructive fill-current shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Receitas Favoritas</p>
                                    <p className="text-xs text-muted-foreground">
                                        {favorites.length} {favorites.length === 1 ? 'receita' : 'receitas'}
                                    </p>
                                </div>
                            </button>
                        </div>
                    </>
                )}

                <Separator />

                {/* Secondary Navigation */}
                <div className="space-y-1">
                    {secondaryItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                            <Button
                                key={item.id}
                                variant={isActive ? 'default' : 'ghost'}
                                onClick={() => onNavigate(item.id)}
                                className={cn(
                                    "w-full justify-start gap-3",
                                    collapsed && "justify-center px-2"
                                )}
                            >
                                <Icon size={20} />
                                {!collapsed && item.label}
                            </Button>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className={cn(
                        "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
                        collapsed && "justify-center px-2"
                    )}
                >
                    <LogOut size={20} />
                    {!collapsed && 'Sair'}
                </Button>
            </div>
        </aside>
    );
};