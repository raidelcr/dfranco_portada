

import React from 'react';
import { Product } from '../types';
import { StarIcon } from './icons';

interface CardProps {
    product: Product;
    size?: 'small';
    onProductSelect: (product: Product) => void;
}

export const GridViewCard: React.FC<CardProps> = ({ product, size, onProductSelect }) => {
    const isSmall = size === 'small';
    
    return (
        <button
            onClick={() => onProductSelect(product)}
            className="block group relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer text-left"
            aria-label={`Ver detalles de ${product.name}`}
        >
            {/* Background Image */}
            <img 
                src={product.imageUrls[0]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className={`absolute inset-0 flex flex-col justify-end text-white ${isSmall ? 'p-3' : 'p-4'}`}>
                <h3 className={`${isSmall ? 'text-base' : 'text-lg'} font-bold line-clamp-2`}>
                    {product.name}
                </h3>
                {!isSmall && (
                    <p 
                        className={`mt-1 text-sm text-gray-300 line-clamp-2`}
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                )}
                {product.price > 0 && (
                    <p className={`${isSmall ? 'mt-2' : 'mt-3'} ${isSmall ? 'text-lg' : 'text-xl'} font-bold text-brand-orange`}>${product.price.toFixed(2)}</p>
                )}
            </div>

            {/* Featured Status */}
            {product.featured && (
                 <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-200 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                     <StarIcon className="w-3 h-3" />
                     <span>Destacado</span>
                 </div>
            )}
        </button>
    );
};

export const ListViewCard: React.FC<CardProps> = ({ product, onProductSelect }) => (
    <button
        onClick={() => onProductSelect(product)}
        className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden w-full group cursor-pointer text-left"
        aria-label={`Ver detalles de ${product.name}`}
    >
        <div className="sm:w-1/3 sm:max-w-[200px] flex-shrink-0 h-48 sm:h-auto relative overflow-hidden">
            <img 
                src={product.imageUrls[0]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            {product.featured && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-200 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                    <StarIcon className="w-3 h-3" />
                    <span>Destacado</span>
                </div>
            )}
        </div>
        <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow text-brand-dark dark:text-brand-light">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{product.categories[0]}</p>
                <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light group-hover:text-brand-orange transition-colors">
                        {product.name}
                    </h3>
                </div>
                <p 
                    className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 sm:line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                />
            </div>
            {product.price > 0 && (
                 <p className="mt-4 text-xl font-bold text-brand-orange self-start sm:self-end">${product.price.toFixed(2)}</p>
            )}
        </div>
    </button>
);