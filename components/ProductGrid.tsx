import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface ProductGridProps {
    products: Product[];
    viewMode: 'grid' | 'list';
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, viewMode, currentPage, totalPages, onNextPage, onPrevPage }) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-500">No se encontraron productos</h2>
                <p className="text-gray-400 mt-2">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
        )
    }
    
    const containerClasses = viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
        : 'flex flex-col gap-4 md:gap-6';

    return (
        <>
            <div className={containerClasses}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 md:mt-12 space-x-4">
                    <button
                        onClick={onPrevPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Página anterior"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    <span className="text-sm font-medium text-gray-700">
                        {currentPage} de {totalPages}
                    </span>

                    <button
                        onClick={onNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Página siguiente"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </>
    );
};
