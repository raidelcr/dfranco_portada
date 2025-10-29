
import React from 'react';
import { FacebookIcon, InstagramIcon, WhatsappIcon, MailIcon } from './icons';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-brand-light mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <a href="#" className="block" aria-label="Página de inicio de DFRANCO">
                             <img 
                                src="https://dfrancomobiliariocuba.com/wp-content/uploads/2025/08/ISOTIPO-PARA-WEB-negro-completo.png" 
                                alt="Logo DFRANCO" 
                                className="h-14 w-auto filter invert" 
                            />
                        </a>
                        <p className="mt-2 text-gray-400 text-sm max-w-xs">Diseño y funcionalidad en cada producto que seleccionamos para ti.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Enlaces</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Inicio</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Inspiración</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Servicios</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Política de Privacidad</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Contacto</h3>
                        <div className="flex mt-4 space-x-6 justify-center md:justify-start">
                            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon className="w-6 h-6" /></a>
                            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                            <a href="#" aria-label="WhatsApp" className="text-gray-400 hover:text-white transition-colors"><WhatsappIcon className="w-6 h-6" /></a>
                            <a href="#" aria-label="Email" className="text-gray-400 hover:text-white transition-colors"><MailIcon className="w-6 h-6" /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} DFRANCO. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};