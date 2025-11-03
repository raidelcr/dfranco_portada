
import React from 'react';
import { MenuIcon, FacebookIcon, InstagramIcon, WhatsappIcon } from './icons';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SiteConfig } from '../types';

interface HeaderProps {
    siteConfig: SiteConfig | null;
    onMenuToggle: () => void;
    isProductDetailView: boolean;
    isVisible: boolean;
    theme: string;
    onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ siteConfig, onMenuToggle, isProductDetailView, isVisible, theme, onThemeToggle }) => {

    const defaultLogo = "https://dfrancomobiliariocuba.com/wp-content/uploads/2025/08/ISOTIPO-PARA-WEB-negro-completo.png";

    return (
        <header className={`sticky border-b top-0 bg-white/80 dark:bg-gray-900/80 dark:border-gray-700 backdrop-blur-sm shadow-sm z-40 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} md:translate-y-0`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20 md:h-20">
                    {/* Logo */}
                    <a href={siteConfig?.menu_inicio || '#'} className="block" aria-label="Página de inicio de DFRANCO">
                        <img 
                            src={siteConfig?.logo_url || defaultLogo} 
                            alt="Logo DFRANCO" 
                            className="h-12 md:h-14 w-auto dark:filter dark:invert" 
                        />
                    </a>
                    
                    <div className="flex items-center gap-6">
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href={siteConfig?.menu_inicio || '#'} className="text-brand-dark dark:text-brand-light hover:text-brand-orange font-medium transition-colors">Inicio</a>
                        </nav>
                        
                        {/* Desktop Social and Theme Toggle */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
                            <ThemeSwitcher theme={theme} onToggle={onThemeToggle} id="theme-toggle-desktop" />
                            <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
                            <div className="flex items-center gap-4">
                                {siteConfig?.social_facebook && <a href={siteConfig.social_facebook} aria-label="Facebook" className="text-brand-dark dark:text-brand-light hover:text-brand-orange transition-colors"><FacebookIcon className="w-5 h-5" /></a>}
                                {siteConfig?.social_instagram && <a href={siteConfig.social_instagram} aria-label="Instagram" className="text-brand-dark dark:text-brand-light hover:text-brand-orange transition-colors"><InstagramIcon className="w-5 h-5" /></a>}
                                {siteConfig?.social_whatsapp && <a href={siteConfig.social_whatsapp} aria-label="WhatsApp" className="text-brand-dark dark:text-brand-light hover:text-brand-orange transition-colors"><WhatsappIcon className="w-5 h-5" /></a>}
                            </div>
                        </div>
                        
                         {/* Mobile Action Icons */}
                        <div className="flex items-center md:hidden">
                            <button onClick={onMenuToggle} className="text-black dark:text-white p-2 rounded-full" aria-label="Abrir menú de navegación">
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};