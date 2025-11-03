
import React from 'react';
import { XIcon, FacebookIcon, InstagramIcon, WhatsappIcon } from './icons';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SiteConfig } from '../types';

interface MobileMenuProps {
    siteConfig: SiteConfig | null;
    isVisible: boolean;
    onClose: () => void;
    theme: string;
    onThemeToggle: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ siteConfig, isVisible, onClose, theme, onThemeToggle }) => {
    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <aside 
                className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 p-6 shadow-xl z-50 transform transition-transform md:hidden ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
                aria-label="Menú de navegación"
            >
                {/* Mobile Menu Header & Nav */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-brand-dark dark:text-brand-light">Menú</h2>
                        <button onClick={onClose} aria-label="Cerrar menú" className="text-brand-dark dark:text-brand-light">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-4">
                        <a href={siteConfig?.menu_inicio || '#'} className="text-brand-dark dark:text-brand-light hover:text-brand-orange font-medium transition-colors">Inicio</a>
                    </nav>
                     <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-brand-dark dark:text-brand-light">Tema</span>
                            <ThemeSwitcher theme={theme} onToggle={onThemeToggle} id="theme-toggle-mobile" />
                        </div>
                        <div className="flex justify-center items-center gap-6 mt-8">
                            {siteConfig?.social_facebook && <a href={siteConfig.social_facebook} aria-label="Facebook" className="text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors"><FacebookIcon className="w-6 h-6" /></a>}
                            {siteConfig?.social_instagram && <a href={siteConfig.social_instagram} aria-label="Instagram" className="text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors"><InstagramIcon className="w-6 h-6" /></a>}
                            {siteConfig?.social_whatsapp && <a href={siteConfig.social_whatsapp} aria-label="WhatsApp" className="text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors"><WhatsappIcon className="w-6 h-6" /></a>}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};