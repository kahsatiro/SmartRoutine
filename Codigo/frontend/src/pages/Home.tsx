import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Footer } from '../components/layout/Footer';
import {
    Calendar,
    ChefHat,
    ShoppingCart,
    BookOpen,
    Heart,
    Star,
    CheckCircle,
    TrendingUp,
    Clock
} from 'lucide-react';
import { ImageWithFallback } from '../assets/ImageWithFallback';
import smartRoutineLogo from '../assets/logo.png';
import { Page } from '@/types';

interface HomeProps {
    onNavigate: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    const features = [
        {
            icon: Calendar,
            title: "Controle de Validade",
            description: "Mantenha o controle dos alimentos e suas datas de validade com alertas inteligentes",
            color: "rgb(99, 102, 241)"
        },
        {
            icon: ChefHat,
            title: "Receitas Personalizadas",
            description: "Descubra receitas baseadas nos alimentos que você tem na despensa",
            color: "rgb(245, 158, 11)"
        },
        {
            icon: ShoppingCart,
            title: "Gestão de Estoque",
            description: "Organize sua despensa e gerencie seu estoque de forma eficiente",
            color: "rgb(16, 185, 129)"
        },
        {
            icon: BookOpen,
            title: "Biblioteca de Receitas",
            description: "Acesse centenas de receitas categorizadas e salve suas favoritas",
            color: "rgb(99, 102, 241)"
        },
    ];

    const benefits = [
        {
            icon: TrendingUp,
            title: "Reduza o Desperdício",
            description: "Até 40% menos desperdício de alimentos",
        },
        {
            icon: Clock,
            title: "Economize Tempo",
            description: "Planeje suas refeições em minutos",
        },
        {
            icon: Heart,
            title: "Alimentação Saudável",
            description: "Receitas balanceadas e nutritivas",
        },
    ];

    const testimonials = [
        {
            name: "Maria Silva",
            role: "Chef de Cozinha",
            content: "O SmartRoutine revolucionou como organizo minha cozinha. Nunca mais desperdicei alimentos!",
            rating: 5,
            avatar: "MS"
        },
        {
            name: "João Santos",
            role: "Pai de Família",
            content: "Fantástico para quem tem família grande. As receitas sugeridas são sempre certeiras.",
            rating: 5,
            avatar: "JS"
        },
        {
            name: "Ana Costa",
            role: "Estudante",
            content: "Perfeito para quem vive sozinho. Me ajuda a economizar e comer melhor.",
            rating: 5,
            avatar: "AC"
        },
    ];

    const stats = [
        { value: "10K+", label: "Usuários Ativos" },
        { value: "500+", label: "Receitas" },
        { value: "95%", label: "Satisfação" },
        { value: "30%", label: "Economia Média" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header Navigation */}
            <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={smartRoutineLogo} alt="SmartRoutine" className="w-8 h-8" />
                        <span className="font-semibold text-xl">SmartRoutine</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => onNavigate('login')}>
                            Entrar
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90" onClick={() => onNavigate('signup')}>
                            Criar Conta
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-5 py-16 md:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-block">
                            <Badge variant="secondary" className="text-sm px-4 py-1">
                                ✨ Gestão Inteligente de Alimentos
                            </Badge>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Gerencie seus{" "}
                                <span className="text-primary">alimentos</span>{" "}
                                e descubra{" "}
                                <span className="text-secondary">receitas</span>{" "}
                                incríveis
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Organize sua despensa, controle validades e encontre as melhores receitas
                                baseadas nos ingredientes que você tem em casa.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                                onClick={() => onNavigate('signup')}
                            >
                                Começar Agora
                                <CheckCircle className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-8 py-6"
                                onClick={() => onNavigate('login')}
                            >
                                Ver Demonstração
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-primary">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1605291535065-e1d52d2b264a?q=80&w=1170&auto=format&fit=crop"
                                alt="Cozinha moderna com alimentos saudáveis"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg border max-w-xs hidden md:block">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold">Receita Favorita</p>
                                    <p className="text-sm text-muted-foreground">Salada Caesar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-muted/30 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="text-center space-y-4 mb-16">
                        <Badge variant="outline" className="text-sm px-4 py-1">
                            Recursos
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">Principais Recursos</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Tudo o que você precisa para uma cozinha organizada e receitas deliciosas
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <CardHeader className="text-center">
                                    <div
                                        className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4"
                                        style={{ backgroundColor: feature.color }}
                                    >
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                                <ImageWithFallback
                                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1170&auto=format&fit=crop"
                                    alt="Dashboard do SmartRoutine"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="space-y-8 order-1 lg:order-2">
                            <div className="space-y-4">
                                <Badge variant="outline" className="text-sm px-4 py-1">
                                    Benefícios
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    Por que escolher o SmartRoutine?
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    Transforme sua forma de gerenciar alimentos e descubra o prazer
                                    de cozinhar com economia e sustentabilidade.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="shrink-0">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <benefit.icon className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                                            <p className="text-muted-foreground">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-muted/30 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="text-center space-y-4 mb-16">
                        <Badge variant="outline" className="text-sm px-4 py-1">
                            Depoimentos
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">O que nossos usuários dizem</h2>
                        <p className="text-xl text-muted-foreground">
                            Depoimentos reais de pessoas que transformaram sua rotina culinária
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < testimonial.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-primary">
                <div className="max-w-7xl mx-auto px-5 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                            Pronto para transformar sua cozinha?
                        </h2>
                        <p className="text-xl text-primary-foreground/90">
                            Junte-se a milhares de usuários que já descobriram uma nova forma de cozinhar
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 py-6"
                                onClick={() => onNavigate('signup')}
                            >
                                Criar Conta Gratuita
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-6 bg-primary-foreground text-primary border-primary-foreground hover:bg-primary-foreground/90"
                                onClick={() => onNavigate('login')}
                            >
                                Já Tenho Conta
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};