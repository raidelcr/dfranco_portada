import React from 'react';
import { Product } from '../types';
import { StarIcon } from './icons';

interface CardProps {
    product: Product;
    onSelect: (product: Product) => void;
}

export const GridViewCard: React.FC<CardProps> = ({ product, onSelect }) => (
    <div 
        onClick={() => onSelect(product)} 
        className="block group relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(product)}
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
        <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
            <h3 className="text-lg font-bold">
                {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-300 line-clamp-2">{product.description}</p>
            <p className="mt-3 text-xl font-bold text-brand-orange">${product.price.toFixed(2)}</p>
        </div>

         {/* Stock Status */}
         {!product.inStock && (
            <div className="absolute top-3 left-3 bg-brand-dark text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">Agotado</div>
        )}
        {/* Featured Status */}
        {product.featured && (
             <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-200 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                 <StarIcon className="w-3 h-3" />
                 <span>Destacado</span>
             </div>
        )}
    </div>
);

export const ListViewCard: React.FC<CardProps> = ({ product, onSelect }) => (
    <div 
        onClick={() => onSelect(product)} 
        className="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden w-full group cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(product)}
        aria-label={`Ver detalles de ${product.name}`}
    >
        <div className="sm:w-1/3 sm:max-w-[200px] flex-shrink-0 h-48 sm:h-auto relative overflow-hidden">
            <img 
                src={product.imageUrls[0]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            {!product.inStock && (
                <div className="absolute top-3 left-3 bg-brand-dark text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">Agotado</div>
            )}
            {product.featured && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-200 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                    <StarIcon className="w-3 h-3" />
                    <span>Destacado</span>
                </div>
            )}
        </div>
        <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow text-brand-dark">
            <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</p>
                <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                        {product.name}
                    </h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">{product.description}</p>
            </div>
            <p className="mt-4 text-xl font-bold text-brand-orange self-start sm:self-end">${product.price.toFixed(2)}</p>
        </div>
    </div>
);