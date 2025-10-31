import React from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import smartRoutineLogo from '../../assets/logo.png';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        produto: [
            { label: 'Recursos', href: '#recursos' },
            { label: 'Preços', href: '#precos' },
            { label: 'Atualizações', href: '#atualizacoes' },
            { label: 'FAQ', href: '#faq' },
        ],
        empresa: [
            { label: 'Sobre', href: '#sobre' },
            { label: 'Blog', href: '#blog' },
            { label: 'Carreira', href: '#carreira' },
            { label: 'Contato', href: '#contato' },
        ],
        legal: [
            { label: 'Privacidade', href: '#privacidade' },
            { label: 'Termos', href: '#termos' },
            { label: 'Licença', href: '#licenca' },
            { label: 'Cookies', href: '#cookies' },
        ],
    };

    const socialLinks = [
        { icon: Github, href: 'https://github.com', label: 'GitHub' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: Mail, href: 'mailto:contato@smartroutine.com', label: 'Email' },
    ];

    return (
        <footer className="bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={smartRoutineLogo} alt="SmartRoutine" className="w-10 h-10" />
                            <span className="font-semibold text-xl">SmartRoutine</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                            Organize sua despensa, controle validades e descubra receitas incríveis.
                            Transforme sua forma de cozinhar.
                        </p>
                        <div className="flex items-center gap-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <Button
                                        key={social.label}
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                        className="h-9 w-9"
                                    >
                                        <a
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                        >
                                            <Icon size={18} />
                                        </a>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div>
                        <h3 className="font-semibold mb-3">Produto</h3>
                        <ul className="space-y-2">
                            {footerLinks.produto.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Empresa</h3>
                        <ul className="space-y-2">
                            {footerLinks.empresa.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="mb-8" />

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                        © {currentYear} SmartRoutine. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};