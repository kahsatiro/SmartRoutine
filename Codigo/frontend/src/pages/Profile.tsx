import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Navigation } from '../components/layout/Navigation';
import { PageHeader } from '../components/layout/PageHeader';
import { AlertMessage } from '../components/shared/AlertMessage';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { StatsCard } from '../components/shared/StatsCard';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import { useRecipe } from '../context/RecipeContext';
import { useToast } from '../hooks/useToast';
import { useForm, validators } from '../hooks/useForm';
import {
    User,
    Mail,
    Calendar,
    Lock,
    Bell,
    Palette,
    Shield,
    Trash2,
    Camera,
    Save,
    AlertTriangle,
    CheckCircle,
    Package,
    Heart,
    ChefHat,
    TrendingUp,
    Eye,
    EyeOff
} from 'lucide-react';
import { getInitials } from '../utils/helpers';
import { formatDate, calculateAge } from '../utils/date';
import { isValidEmail, isStrongPassword } from '../utils/validators';
import { getErrorMessage } from '../services/errorHandler';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Page } from '@/types';

interface ProfileProps {
    onNavigate: (page: Page) => void;
}

interface ProfileFormData {
    nome: string;
    email: string;
    dataNascimento: string;
}

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
    const { user, updateUser, deleteAccount, logout } = useAuth();
    const { foodItems } = useFood();
    const { favorites, recipes } = useRecipe();
    const { success, error: showError } = useToast();

    // State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    // Password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Preferences
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        expiryAlerts: true,
        recipeRecommendations: true,
        weeklyReport: false,
        darkMode: false,
    });

    // Profile Form
    const profileForm = useForm<ProfileFormData>({
        initialValues: {
            nome: user?.nome || '',
            email: user?.email || '',
            dataNascimento: user?.dataNascimento || '',
        },
        validationRules: {
            nome: [
                validators.required('Nome é obrigatório'),
                validators.minLength(2, 'Nome deve ter no mínimo 2 caracteres'),
            ],
            email: [
                validators.required('Email é obrigatório'),
                validators.email('Email inválido'),
            ],
            dataNascimento: [
                validators.required('Data de nascimento é obrigatória'),
            ],
        },
        onSubmit: handleUpdateProfile,
    });

    // Password Form
    const passwordForm = useForm<PasswordFormData>({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationRules: {
            currentPassword: [validators.required('Senha atual é obrigatória')],
            newPassword: [
                validators.required('Nova senha é obrigatória'),
                validators.minLength(6, 'Senha deve ter no mínimo 6 caracteres'),
            ],
            confirmPassword: [
                validators.required('Confirmação de senha é obrigatória'),
                (value) => {
                    if (value !== passwordForm.values.newPassword) {
                        return 'As senhas não coincidem';
                    }
                    return null;
                },
            ],
        },
        onSubmit: handleChangePassword,
    });

    // Handle profile update
    async function handleUpdateProfile(values: ProfileFormData) {
        setLoading(true);
        try {
            await updateUser({
                nome: values.nome,
                email: values.email,
                dataNascimento: values.dataNascimento,
                senha: undefined, // Não atualiza senha aqui
            });
            setIsEditingProfile(false);
            success('Perfil atualizado com sucesso!');
        } catch (err) {
            showError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    // Handle password change
    async function handleChangePassword(values: PasswordFormData) {
        setLoading(true);
        try {
            // Verificar senha atual (simulado - implementar no backend)
            await updateUser({
                senha: values.newPassword,
            });
            passwordForm.resetForm();
            setIsChangingPassword(false);
            success('Senha alterada com sucesso!');
        } catch (err) {
            showError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    // Handle preference change
    const handlePreferenceChange = (key: keyof typeof preferences) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
        success('Preferência atualizada!');
    };

    // Handle delete account
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'EXCLUIR') {
            showError('Digite "EXCLUIR" para confirmar');
            return;
        }

        setLoading(true);
        try {
            await deleteAccount();
            logout();
            onNavigate('home');
            success('Conta excluída com sucesso');
        } catch (err) {
            showError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    // Handle avatar upload (simulado)
    const handleAvatarUpload = () => {
        success('Funcionalidade de upload será implementada em breve!');
    };

    // User stats
    const userStats = {
        totalFoodItems: foodItems.length,
        favoriteRecipes: favorites.length,
        totalRecipes: recipes.length,
        accountAge: user?.dataNascimento
            ? Math.floor((new Date().getTime() - new Date(user.dataNascimento).getTime()) / (1000 * 60 * 60 * 24 * 365))
            : 0,
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation currentPage="profile" onNavigate={onNavigate} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Perfil e Configurações"
                    description="Gerencie suas informações pessoais e preferências"
                    breadcrumbs={[
                        { label: 'Dashboard', href: '#' },
                        { label: 'Perfil' },
                    ]}
                />

                {/* User Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatsCard
                        title="Alimentos"
                        value={userStats.totalFoodItems}
                        description="Na despensa"
                        icon={Package}
                        iconColor="text-primary"
                    />
                    <StatsCard
                        title="Favoritas"
                        value={userStats.favoriteRecipes}
                        description="Receitas salvas"
                        icon={Heart}
                        iconColor="text-destructive"
                    />
                    <StatsCard
                        title="Receitas"
                        value={userStats.totalRecipes}
                        description="Total disponível"
                        icon={ChefHat}
                        iconColor="text-secondary"
                    />
                    <StatsCard
                        title="Membro desde"
                        value={user.dataNascimento ? calculateAge(user.dataNascimento) : 0}
                        description="Anos conosco"
                        icon={TrendingUp}
                        iconColor="text-accent"
                    />
                </div>

                {/* Main Content */}
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="personal">Pessoal</TabsTrigger>
                        <TabsTrigger value="security">Segurança</TabsTrigger>
                        <TabsTrigger value="preferences">Preferências</TabsTrigger>
                        <TabsTrigger value="danger">Conta</TabsTrigger>
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="space-y-6">
                        {/* Profile Header */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Pessoais</CardTitle>
                                <CardDescription>Atualize seus dados pessoais e foto de perfil</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src="/placeholder-avatar.jpg" />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                            {getInitials(user.nome)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-semibold text-lg">{user.nome}</h3>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                                            <Badge variant="secondary">
                                                Membro desde {formatDate(user.dataNascimento)}
                                            </Badge>
                                            {calculateAge(user.dataNascimento) > 0 && (
                                                <Badge variant="outline">
                                                    {calculateAge(user.dataNascimento)} anos
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleAvatarUpload}
                                        className="flex items-center gap-2"
                                    >
                                        <Camera className="h-4 w-4" />
                                        Alterar Foto
                                    </Button>
                                </div>

                                <Separator />

                                {/* Profile Form */}
                                <form onSubmit={profileForm.handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nome">Nome Completo *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    id="nome"
                                                    value={profileForm.values.nome}
                                                    onChange={profileForm.handleChange('nome')}
                                                    onBlur={profileForm.handleBlur('nome')}
                                                    disabled={!isEditingProfile || loading}
                                                    className="pl-10"
                                                />
                                            </div>
                                            {profileForm.touched.nome && profileForm.errors.nome && (
                                                <p className="text-sm text-destructive">{profileForm.errors.nome}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileForm.values.email}
                                                    onChange={profileForm.handleChange('email')}
                                                    onBlur={profileForm.handleBlur('email')}
                                                    disabled={!isEditingProfile || loading}
                                                    className="pl-10"
                                                />
                                            </div>
                                            {profileForm.touched.email && profileForm.errors.email && (
                                                <p className="text-sm text-destructive">{profileForm.errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    id="dataNascimento"
                                                    type="date"
                                                    value={profileForm.values.dataNascimento}
                                                    onChange={profileForm.handleChange('dataNascimento')}
                                                    onBlur={profileForm.handleBlur('dataNascimento')}
                                                    disabled={!isEditingProfile || loading}
                                                    max={new Date().toISOString().split('T')[0]}
                                                    className="pl-10"
                                                />
                                            </div>
                                            {profileForm.touched.dataNascimento && profileForm.errors.dataNascimento && (
                                                <p className="text-sm text-destructive">{profileForm.errors.dataNascimento}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Idade</Label>
                                            <Input
                                                value={`${calculateAge(profileForm.values.dataNascimento || user.dataNascimento)} anos`}
                                                disabled
                                                className="bg-muted"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {!isEditingProfile ? (
                                            <Button
                                                type="button"
                                                onClick={() => setIsEditingProfile(true)}
                                                className="bg-primary hover:bg-primary/90"
                                            >
                                                Editar Perfil
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    type="submit"
                                                    disabled={loading || !profileForm.isValid}
                                                    className="bg-primary hover:bg-primary/90"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <LoadingSpinner size="sm" className="mr-2" />
                                                            Salvando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="mr-2 h-4 w-4" />
                                                            Salvar Alterações
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsEditingProfile(false);
                                                        profileForm.resetForm();
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Cancelar
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Activity Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumo de Atividades</CardTitle>
                                <CardDescription>Sua jornada no SmartRoutine</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium">Alimentos Cadastrados</p>
                                                <p className="text-sm text-muted-foreground">Total de itens na despensa</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold">{foodItems.length}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Heart className="h-5 w-5 text-destructive" />
                                            <div>
                                                <p className="font-medium">Receitas Favoritas</p>
                                                <p className="text-sm text-muted-foreground">Receitas que você salvou</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold">{favorites.length}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <ChefHat className="h-5 w-5 text-secondary" />
                                            <div>
                                                <p className="font-medium">Receitas Criadas</p>
                                                <p className="text-sm text-muted-foreground">Receitas adicionadas por você</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold">0</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Segurança da Conta
                                </CardTitle>
                                <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {!isChangingPassword ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Lock className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-medium">Senha</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Última alteração: Nunca
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsChangingPassword(true)}
                                            >
                                                Alterar Senha
                                            </Button>
                                        </div>

                                        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-green-900 dark:text-green-100">
                                                        Sua conta está segura
                                                    </p>
                                                    <p className="text-sm text-green-700 dark:text-green-300">
                                                        Todas as medidas de segurança estão ativas
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={passwordForm.handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Senha Atual *</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    id="currentPassword"
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    value={passwordForm.values.currentPassword}
                                                    onChange={passwordForm.handleChange('currentPassword')}
                                                    onBlur={passwordForm.handleBlur('currentPassword')}
                                                    disabled={loading}
                                                    className="pl-10 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {passwordForm.touched.currentPassword && passwordForm.errors.currentPassword && (
                                                <p className="text-sm text-destructive">{passwordForm.errors.currentPassword}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">Nova Senha *</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    id="newPassword"
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={passwordForm.values.newPassword}
                                                    onChange={passwordForm.handleChange('newPassword')}
                                                    onBlur={passwordForm.handleBlur('newPassword')}
                                                    disabled={loading}
                                                    className="pl-10 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {passwordForm.touched.newPassword && passwordForm.errors.newPassword && (
                                                <p className="text-sm text-destructive">{passwordForm.errors.newPassword}</p>
                                            )}
                                            {passwordForm.values.newPassword && (
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground">Requisitos da senha:</p>
                                                    <ul className="text-xs space-y-1">
                                                        <li className={passwordForm.values.newPassword.length >= 6 ? 'text-green-600' : 'text-muted-foreground'}>
                                                            {passwordForm.values.newPassword.length >= 6 ? '✓' : '○'} Mínimo 6 caracteres
                                                        </li>
                                                        <li className={/[A-Z]/.test(passwordForm.values.newPassword) ? 'text-green-600' : 'text-muted-foreground'}>
                                                            {/[A-Z]/.test(passwordForm.values.newPassword) ? '✓' : '○'} Uma letra maiúscula
                                                        </li>
                                                        <li className={/[0-9]/.test(passwordForm.values.newPassword) ? 'text-green-600' : 'text-muted-foreground'}>
                                                            {/[0-9]/.test(passwordForm.values.newPassword) ? '✓' : '○'} Um número
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={passwordForm.values.confirmPassword}
                                                    onChange={passwordForm.handleChange('confirmPassword')}
                                                    onBlur={passwordForm.handleBlur('confirmPassword')}
                                                    disabled={loading}
                                                    className="pl-10 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword && (
                                                <p className="text-sm text-destructive">{passwordForm.errors.confirmPassword}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <Button
                                                type="submit"
                                                disabled={loading || !passwordForm.isValid}
                                                className="bg-primary hover:bg-primary/90"
                                            >
                                                {loading ? 'Alterando...' : 'Alterar Senha'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsChangingPassword(false);
                                                    passwordForm.resetForm();
                                                }}
                                                disabled={loading}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notificações
                                </CardTitle>
                                <CardDescription>Gerencie como você recebe atualizações</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificações por Email</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receber alertas importantes por email
                                        </p>
                                    </div>
                                    <Switch
                                        checked={preferences.emailNotifications}
                                        onCheckedChange={() => handlePreferenceChange('emailNotifications')}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Alertas de Vencimento</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Notificar quando alimentos estiverem próximos ao vencimento
                                        </p>
                                    </div>
                                    <Switch
                                        checked={preferences.expiryAlerts}
                                        onCheckedChange={() => handlePreferenceChange('expiryAlerts')}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Sugestões de Receitas</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receber recomendações personalizadas de receitas
                                        </p>
                                    </div>
                                    <Switch
                                        checked={preferences.recipeRecommendations}
                                        onCheckedChange={() => handlePreferenceChange('recipeRecommendations')}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Relatório Semanal</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receber resumo semanal da sua despensa
                                        </p>
                                    </div>
                                    <Switch
                                        checked={preferences.weeklyReport}
                                        onCheckedChange={() => handlePreferenceChange('weeklyReport')}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    Aparência
                                </CardTitle>
                                <CardDescription>Personalize a interface do SmartRoutine</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Modo Escuro</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Ativar tema escuro (em breve)
                                        </p>
                                    </div>
                                    <Switch
                                        checked={preferences.darkMode}
                                        onCheckedChange={() => handlePreferenceChange('darkMode')}
                                        disabled
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Danger Zone Tab */}
                    <TabsContent value="danger" className="space-y-6">
                        <Card className="border-destructive/50">
                            <CardHeader>
                                <CardTitle className="text-destructive flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Zona de Perigo
                                </CardTitle>
                                <CardDescription>
                                    Ações irreversíveis que afetarão permanentemente sua conta
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Warning */}
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <div className="flex gap-3">
                                        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm">Atenção!</p>
                                            <p className="text-sm text-muted-foreground">
                                                Excluir sua conta irá remover permanentemente todos os seus dados,
                                                incluindo alimentos, receitas e preferências. Esta ação não pode ser desfeita.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Account Section */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Excluir Conta Permanentemente</h4>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Ao excluir sua conta, você perderá acesso a:
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                {foodItems.length} {foodItems.length === 1 ? 'alimento cadastrado' : 'alimentos cadastrados'}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Heart className="h-4 w-4 text-muted-foreground" />
                                                {favorites.length} {favorites.length === 1 ? 'receita favorita' : 'receitas favoritas'}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <ChefHat className="h-4 w-4 text-muted-foreground" />
                                                Todas as suas receitas personalizadas
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                Todo o histórico de compras e planejamentos
                                            </li>
                                        </ul>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => setShowDeleteDialog(true)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir Minha Conta
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Account Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Excluir Conta Permanentemente
                        </DialogTitle>
                        <DialogDescription>
                            Esta é uma ação irreversível. Todos os seus dados serão perdidos para sempre.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-sm font-medium mb-2">Você perderá:</p>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>• {foodItems.length} alimentos cadastrados</li>
                                <li>• {favorites.length} receitas favoritas</li>
                                <li>• Todo o histórico de compras</li>
                                <li>• Todas as configurações e preferências</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmDelete">
                                Digite <span className="font-bold">EXCLUIR</span> para confirmar
                            </Label>
                            <Input
                                id="confirmDelete"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="EXCLUIR"
                                className="font-mono"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setDeleteConfirmText('');
                                }}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'EXCLUIR' || loading}
                                className="flex-1"
                            >
                                {loading ? 'Excluindo...' : 'Excluir Conta'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};