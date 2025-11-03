import React from 'react';
import { GridIcon, ListIcon } from './icons';

// Componente base reutilizable para todos los esqueletos
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse ${className}`} />
);

// Esqueleto para el Encabezado
export const HeaderSkeleton: React.FC = () => (
    <header className="sticky border-b top-0 bg-white/80 dark:bg-gray-900/80 dark:border-gray-700 backdrop-blur-sm shadow-sm z-40">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-20 md:h-20">
                <Skeleton className="h-10 w-32" />
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center space-x-8">
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <span className="h-6 w-px bg-gray-200 dark:bg-gray-700"></span>
                        <Skeleton className="h-7 w-14 rounded-full" />
                        <span className="h-6 w-px bg-gray-200 dark:bg-gray-700"></span>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                    </div>
                    <div className="flex items-center md:hidden">
                        <Skeleton className="h-6 w-6" />
                    </div>
                </div>
            </div>
        </div>
    </header>
);

// Esqueleto para el Carrusel de imágenes (Slider)
export const SliderSkeleton: React.FC = () => (
    <div className="relative w-full h-72 md:h-80 lg:h-96 bg-gray-200 dark:bg-gray-700 animate-pulse" />
);

// Esqueleto para la sección de Categorías
export const CategoryShowcaseSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-brand-dark">
        <div className="container mx-auto px-4 pt-8 pb-4">
            <div className="flex items-start gap-4 md:gap-8 overflow-x-hidden pb-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center justify-center flex-shrink-0 w-24">
                        <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
                        <Skeleton className="mt-2 h-4 w-16" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Esqueletos para las tarjetas de producto
const GridViewCardSkeleton: React.FC = () => (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-2 shadow-lg">
        <Skeleton className="w-full h-full" />
    </div>
);

const ListViewCardSkeleton: React.FC = () => (
    <div className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full p-2">
        <Skeleton className="sm:w-1/3 sm:max-w-[200px] flex-shrink-0 h-48 sm:h-auto" />
        <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow w-full">
            <div className="w-full">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4 mt-2" />
                <Skeleton className="h-4 w-full mt-3" />
                <Skeleton className="h-4 w-5/6 mt-1" />
            </div>
            <Skeleton className="h-8 w-1/3 mt-4 self-end" />
        </div>
    </div>
);

// Esqueleto para la parrilla de productos completa (Filtros + Lista)
export const ProductGridSkeleton: React.FC = () => {
    return (
        <div className="md:flex md:gap-8">
            <aside className="hidden md:block md:relative md:w-72 md:flex-shrink-0">
                <div className="sticky top-24 bg-white dark:bg-gray-900 p-6 shadow-lg rounded-lg">
                    <Skeleton className="h-6 w-24 mb-6" />
                    <div className="space-y-6">
                        <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-4 w-full mt-2" />
                        </div>
                        <div className="flex items-center pt-2">
                           <Skeleton className="h-4 w-4 rounded" />
                           <Skeleton className="h-4 w-24 ml-2" />
                        </div>
                    </div>
                </div>
            </aside>
            <div className="w-full mt-8 md:mt-0">
                <div className="flex justify-between items-center mb-4">
                    <Skeleton className="hidden sm:block h-4 w-48" />
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                       <div className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700">
                           <GridIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                       </div>
                       <div className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700">
                           <ListIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                       </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <GridViewCardSkeleton key={i} />)}
                </div>
            </div>
        </div>
    );
};

// Esqueleto para la vista de detalle del producto
export const ProductDetailSkeleton: React.FC = () => (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in-down">
        <Skeleton className="h-5 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="mt-4 flex justify-center gap-4">
                    <Skeleton className="w-20 h-20 rounded-md" />
                    <Skeleton className="w-20 h-20 rounded-md" />
                    <Skeleton className="w-20 h-20 rounded-md" />
                    <Skeleton className="w-20 h-20 rounded-md" />
                </div>
            </div>
            <div className="flex flex-col space-y-6">
                <div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-3/4 mt-2" />
                </div>
                <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <Skeleton className="h-12 w-1/2" />
                </div>
                <div>
                    <Skeleton className="h-6 w-1/4 mb-3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                </div>
                <div className="mt-auto pt-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Esqueleto para el Pie de página
export const FooterSkeleton: React.FC = () => (
    <footer className="bg-brand-dark border-t border-gray-700 text-brand-light mt-4 md:mt-16">
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <Skeleton className="h-14 w-36" />
                    <Skeleton className="mt-2 h-4 w-24" />
                </div>
                <div>
                    <Skeleton className="h-5 w-20" />
                    <ul className="mt-4 space-y-2">
                        <li><Skeleton className="h-4 w-16" /></li>
                    </ul>
                </div>
                <div>
                    <Skeleton className="h-5 w-24" />
                    <div className="flex mt-4 space-x-6 justify-center md:justify-start">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
        </div>
    </footer>
);