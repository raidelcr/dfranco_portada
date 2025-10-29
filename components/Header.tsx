import React from 'react';
import { MenuIcon, FilterIcon } from './icons';

interface HeaderProps {
    onMenuToggle: () => void;
    onFilterToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onFilterToggle }) => {
    return (
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <a href="#" className="block" aria-label="Página de inicio de DFRANCO">
                        <img 
                            src="https://dfrancomobiliariocuba.com/wp-content/uploads/2025/08/ISOTIPO-PARA-WEB-negro-completo.png" 
                            alt="Logo DFRANCO" 
                            className="h-10 md:h-14 w-auto" 
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-black-600 hover:text-brand-orange font-medium transition-colors">Inicio</a>
                        <a href="#" className="text-black-600 hover:text-brand-orange font-medium transition-colors">Inspiración</a>
                        <a href="#" className="text-black-600 hover:text-brand-orange font-medium transition-colors">Servicios</a>
                    </nav>
                    
                     {/* Right side icons */}
                    <div className="flex items-center gap-1">
                        {/* Mobile Action Icons */}
                        <div className="flex items-center md:hidden">
                            <button onClick={onFilterToggle} className="text-black p-2 rounded-full" aria-label="Abrir filtros">
                                <FilterIcon className="w-6 h-6" />
                            </button>
                            <button onClick={onMenuToggle} className="text-black p-2 rounded-full" aria-label="Abrir menú de navegación">
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};