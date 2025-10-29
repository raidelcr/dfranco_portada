import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { ChevronLeftIcon, CheckIcon, StarIcon, ChevronRightIcon } from './icons';
import { GridViewCard } from './ProductCard';


const RelatedProducts: React.FC<{
    currentProduct: Product;
    allProducts: Product[];
    onProductSelect: (product: Product) => void;
}> = ({ currentProduct, allProducts, onProductSelect }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const related = allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);

    if (related.length === 0) {
        return null;
    }

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Productos Relacionados</h2>
                <div className="hidden sm:flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                        aria-label="Desplazar a la izquierda"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                        aria-label="Desplazar a la derecha"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                className="flex items-stretch gap-4 md:gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {related.map(product => (
                    <div key={product.id} className="snap-start flex-shrink-0 w-2/5 sm:w-1/3 md:w-1/4 lg:w-1/5">
                        <GridViewCard product={product} onSelect={onProductSelect} />
                    </div>
                ))}
            </div>
        </div>
    );
};


interface ProductDetailProps {
    product: Product;
    onBack: () => void;
    allProducts: Product[];
    onProductSelect: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, allProducts, onProductSelect }) => {
    const [mainImage, setMainImage] = useState(product.imageUrls[0]);
    
    // Split description into features for a more structured view
    const features = product.description.split('. ').filter(s => s.length > 0);

    useEffect(() => {
        if (product) {
            setMainImage(product.imageUrls[0]);
        }
    }, [product]);

    return (
        <>
            <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in-down">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-dark mb-6 transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                    Volver a los productos
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Image Section */}
                    <div>
                        <div key={mainImage} className="aspect-square w-full rounded-lg overflow-hidden shadow-lg animate-fade-in-down">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Thumbnail Gallery */}
                        {product.imageUrls.length > 1 && (
                            <div className="mt-4 flex justify-center gap-4">
                                {product.imageUrls.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImage(img)}
                                        className={`w-20 h-20 rounded-md overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange ${mainImage === img ? 'ring-2 ring-brand-orange' : 'ring-1 ring-transparent hover:ring-gray-400'}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} - vista ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{product.category}</span>
                                {product.inStock ? (
                                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">En Stock</span>
                                ) : (
                                    <span className="text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">Agotado</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">{product.name}</h1>
                                {product.featured && (
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-yellow-800 bg-yellow-200 px-3 py-1 rounded-full whitespace-nowrap">
                                        <StarIcon className="w-4 h-4" />
                                        Destacado
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="pb-6 border-b border-gray-200">
                            <span className="text-4xl font-bold text-brand-orange">${product.price.toFixed(2)}</span>
                        </div>
                        
                        <div>
                            <h2 className="text-lg font-semibold text-brand-dark mb-3">Características Destacadas</h2>
                            <ul className="space-y-2 text-gray-600">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckIcon className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-auto pt-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    className="w-full bg-brand-orange text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
                                >
                                    Personalizar
                                </button>
                                {product.inStock && (
                                    <button
                                        className="w-full bg-transparent border-2 border-brand-dark text-brand-dark font-bold py-3 px-6 rounded-lg hover:bg-brand-dark hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark"
                                    >
                                        Encargar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <RelatedProducts 
                currentProduct={product}
                allProducts={allProducts}
                onProductSelect={onProductSelect}
            />
        </>
    );
};