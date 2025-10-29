import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    viewMode: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {

    if (viewMode === 'list') {
        return (
            <a href="#" className="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden w-full group">
                <div className="sm:w-1/3 sm:max-w-[200px] flex-shrink-0 h-48 sm:h-auto relative overflow-hidden">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                    {!product.inStock && (
                        <div className="absolute top-3 left-3 bg-brand-dark text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">Agotado</div>
                    )}
                </div>
                <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow text-brand-dark">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</p>
                        <h3 className="mt-1 text-lg font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                            <span className="absolute inset-0" aria-hidden="true"></span>
                            {product.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">{product.description}</p>
                    </div>
                    <p className="mt-4 text-xl font-bold text-brand-orange self-start sm:self-end">${product.price.toFixed(2)}</p>
                </div>
            </a>
        );
    }
    
    // Grid View is the default
    return (
        <a href="#" className="block group relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            {/* Background Image */}
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <h3 className="text-lg font-bold">
                    {/* The span makes the whole card clickable */}
                    <span className="absolute inset-0" aria-hidden="true"></span>
                    {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-300 line-clamp-2">{product.description}</p>
                <p className="mt-3 text-xl font-bold text-brand-orange">${product.price.toFixed(2)}</p>
            </div>

             {/* Stock Status */}
             {!product.inStock && (
                <div className="absolute top-3 left-3 bg-brand-dark text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">Agotado</div>
            )}
        </a>
    );
};
