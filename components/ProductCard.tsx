import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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