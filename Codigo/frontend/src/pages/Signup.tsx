import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';
import { AlertMessage } from '../components/shared/AlertMessage';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/errorHandler';
import { isValidEmail, isStrongPassword } from '../utils/validators';
import { ArrowLeft, User, Mail, Lock, Calendar, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import smartRoutineLogo from '../assets/logo.png';
import { Page } from '@/types';

interface SignupProps {
    onNavigate: (page: Page) => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (field === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) strength += 25;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 25) return 'bg-destructive';
        if (passwordStrength <= 50) return 'bg-accent';
        if (passwordStrength <= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const validateForm = (): string | null => {
        if (!formData.name.trim()) return 'Nome é obrigatório';
        if (!formData.email) return 'Email é obrigatório';
        if (!isValidEmail(formData.email)) return 'Email inválido';
        if (!formData.password) return 'Senha é obrigatória';

        const passwordCheck = isStrongPassword(formData.password);
        if (!passwordCheck.isValid) return passwordCheck.errors[0];

        if (formData.password !== formData.confirmPassword) {
            return 'As senhas não coincidem';
        }
        if (!formData.dateOfBirth) return 'Data de nascimento é obrigatória';
        if (!acceptTerms) return 'Você deve aceitar os termos e condições';

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            await signup({
                nome: formData.name,
                email: formData.email,
                senha: formData.password,
                dataNascimento: formData.dateOfBirth,
            });
            onNavigate('dashboard');
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen size="lg" text="Criando sua conta..." />;
    }

    const passwordRequirements = [
        { met: formData.password.length >= 6, label: 'Mínimo 6 caracteres' },
        { met: /[A-Z]/.test(formData.password), label: 'Uma letra maiúscula' },
        { met: /[a-z]/.test(formData.password), label: 'Uma letra minúscula' },
        { met: /[0-9]/.test(formData.password), label: 'Um número' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/5 px-4 py-8">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                            <img src={smartRoutineLogo} alt="SmartRoutine" className="w-12 h-12" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Crie sua conta</CardTitle>
                        <CardDescription>Junte-se ao SmartRoutine para gerenciar seu estoque de alimentos</CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <AlertMessage
                            type="error"
                            message={error}
                            onClose={() => setError('')}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="João Silva"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    disabled={loading}
                                    className="pl-10"
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    disabled={loading}
                                    className="pl-10"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    disabled={loading}
                                    className="pl-10 pr-10"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <Progress value={passwordStrength} className={getPasswordStrengthColor()} />
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {passwordRequirements.map((req, index) => (
                                            <div key={index} className="flex items-center gap-1">
                                                {req.met ? (
                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-3 w-3 text-muted-foreground" />
                                                )}
                                                <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirmar Senha */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    disabled={loading}
                                    className="pl-10 pr-10"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-xs text-destructive">As senhas não coincidem</p>
                            )}
                        </div>

                        {/* Data de Nascimento */}
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                    disabled={loading}
                                    className="pl-10"
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        {/* Termos */}
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="terms"
                                checked={acceptTerms}
                                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                                disabled={loading}
                            />
                            <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                                Eu concordo com os{' '}
                                <button type="button" className="text-primary hover:underline">
                                    Termos de Serviço
                                </button>{' '}
                                e{' '}
                                <button type="button" className="text-primary hover:underline">
                                    Política de Privacidade
                                </button>
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Ou
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Já tem uma conta? </span>
                        <Button
                            variant="link"
                            onClick={() => onNavigate('login')}
                            className="p-0 h-auto text-primary font-semibold"
                        >
                            Entrar
                        </Button>
                    </div>

                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => onNavigate('home')}
                            className="text-muted-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar ao início
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};