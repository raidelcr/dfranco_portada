
import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface ThemeSwitcherProps {
    theme: string;
    onToggle: () => void;
    id?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onToggle, id = 'theme-toggle' }) => {
    const isDark = theme === 'dark';
    return (
        <label htmlFor={id} className="relative inline-flex items-center cursor-pointer" title={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}>
            <input
                type="checkbox"
                id={id}
                className="sr-only peer"
                checked={isDark}
                onChange={onToggle}
                aria-label={`Activar tema ${isDark ? 'claro' : 'oscuro'}`}
            />
            <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-orange/50 dark:bg-gray-700"></div>
            <div className="absolute top-1 left-1 bg-white dark:bg-gray-800 rounded-full h-5 w-5 peer-checked:translate-x-full transition-all flex items-center justify-center">
                {isDark ? (
                    <MoonIcon className="w-3 h-3 text-yellow-300" />
                ) : (
                    <SunIcon className="w-3 h-3 text-yellow-500" />
                )}
            </div>
        </label>
    );
};