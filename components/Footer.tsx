
import React from 'react';
import { FacebookIcon, InstagramIcon, WhatsappIcon, MailIcon } from './icons';
import { SiteConfig } from '../types';

interface FooterProps {
    siteConfig: SiteConfig | null;
}

export const Footer: React.FC<FooterProps> = ({ siteConfig }) => {
    
    const defaultLogo = "https://dfrancomobiliariocuba.com/wp-content/uploads/2025/10/dfranco-con-eslogan.png";
    const defaultCopyright = `© ${new Date().getFullYear()} DFRANCO. Todos los derechos reservados.`;
    return (
        <footer className="bg-brand-dark border-t border-gray-700 text-brand-light mt-4 md:mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex flex-col items-center justify-center md:items-start">
                        <a href={siteConfig?.menu_inicio || '#'} className="block" aria-label="Página de inicio de DFRANCO">
                             <img 
                                src={siteConfig?.logo_url || defaultLogo} 
                                alt="Logo DFRANCO" 
                                className="h-14 w-auto filter invert" 
                            />
                        </a>
                        {/*<p className="mt-2 text-gray-400 text-base max-w-xs italic">...te parece familiar.</p>*/} 
                    </div>
                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Enlaces</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href={siteConfig?.menu_inicio || '#'} className="text-neutral-400 hover:text-white transition-colors">Inicio</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Contacto</h3>
                        <div className="flex mt-4 space-x-6 justify-center md:justify-start">
                            {siteConfig?.social_facebook && <a href={siteConfig.social_facebook} aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon className="w-6 h-6" /></a>}
                            {siteConfig?.social_instagram && <a href={siteConfig.social_instagram} aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon className="w-6 h-6" /></a>}
                            {siteConfig?.social_whatsapp && <a href={siteConfig.social_whatsapp} aria-label="WhatsApp" className="text-gray-400 hover:text-white transition-colors"><WhatsappIcon className="w-6 h-6" /></a>}
                            {siteConfig?.social_email && <a href={`mailto:${siteConfig.social_email}`} aria-label="Email" className="text-gray-400 hover:text-white transition-colors"><MailIcon className="w-6 h-6" /></a>}
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                    <p>{siteConfig?.footer_copyright || defaultCopyright}</p>
                </div>
            </div>
        </footer>
    );
};
