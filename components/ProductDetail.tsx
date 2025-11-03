import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product, SiteConfig } from '../types';
import { ChevronLeftIcon, StarIcon, ChevronRightIcon, XIcon, InfoIcon } from './icons';
import { GridViewCard } from './ProductCard';
import { apiCall } from '../lib/api';
import { OrderModal } from './OrderModal';
import { ProductDetailSkeleton } from './skeletons';

const ImageZoomModal: React.FC<{
    imageUrls: string[];
    initialIndex: number;
    altText: string;
    onClose: () => void;
}> = ({ imageUrls, initialIndex, altText, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (imageUrls.length > 1) {
                if (e.key === 'ArrowRight') handleNext();
                if (e.key === 'ArrowLeft') handlePrev();
            }
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onClose, imageUrls.length]);

    return (
        <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in-down"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Galería de imágenes ampliada"
        >
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                onClick={onClose}
                aria-label="Cerrar vista ampliada"
            >
                <XIcon className="w-8 h-8" />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {/* Prev Button */}
                {imageUrls.length > 1 && (
                    <button
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
                        onClick={handlePrev}
                        aria-label="Imagen anterior"
                    >
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                )}

                {/* Image and Counter */}
                <div className="flex flex-col items-center justify-center gap-4">
                    <img
                        src={imageUrls[currentIndex]}
                        alt={`${altText} (${currentIndex + 1} de ${imageUrls.length})`}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        key={currentIndex}
                    />
                    {imageUrls.length > 1 && (
                         <span className="text-white text-lg bg-black/50 px-3 py-1 rounded-full">
                            {currentIndex + 1} / {imageUrls.length}
                        </span>
                    )}
                </div>

                {/* Next Button */}
                {imageUrls.length > 1 && (
                    <button
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
                        onClick={handleNext}
                        aria-label="Siguiente imagen"
                    >
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                )}
            </div>
        </div>
    );
};

const RelatedProducts: React.FC<{
    currentProduct: Product;
    allProducts: Product[];
    onProductSelect: (product: Product) => void;
}> = ({ currentProduct, allProducts, onProductSelect }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const related = allProducts.filter(p => 
        p.id !== currentProduct.id && 
        p.categories.some(cat => currentProduct.categories.includes(cat))
    ).slice(0, 10);

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
                <h2 className="text-2xl md:text-3xl font-bold text-brand-dark dark:text-brand-light">Productos Relacionados</h2>
                <div className="hidden sm:flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Desplazar a la izquierda"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Desplazar a la derecha"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                className="flex items-stretch gap-4 md:gap-6 overflow-x-auto pb-4 px-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {related.map(product => (
                    <div key={product.id} className="snap-start flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                        <GridViewCard product={product} size="small" onProductSelect={onProductSelect} />
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
    categoryMap: Map<number, string>;
    siteConfig: SiteConfig | null;
    onProductSelect: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, allProducts, categoryMap, siteConfig, onProductSelect }) => {
    const [detailedProduct, setDetailedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mainImage, setMainImage] = useState(product.imageUrls[0]);
    const [isZoomed, setIsZoomed] = useState(false);
    const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'personalizar' | 'encargar' | null }>({ isOpen: false, mode: null });
    
    const handleOpenModal = (mode: 'personalizar' | 'encargar') => {
        setModalState({ isOpen: true, mode });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, mode: null });
    };
    
    useEffect(() => {
        const fetchDetails = async () => {
            if (!product || !categoryMap) return;

            setIsLoading(true);
            try {
                const data = await apiCall<any>(`/rrm/v1/catalogo/item?id=${product.id}`);
                
                const imageUrls = [
                    data.imagen_url,
                    data.imagen_secundaria1,
                    data.imagen_secundaria2,
                    data.imagen_secundaria3
                ].filter(Boolean);

                const categoryIds: number[] = Array.isArray(data.categorias) ? data.categorias : [];
                const categoryNames = categoryIds
                    .map(id => categoryMap.get(id))
                    .filter((name): name is string => !!name);

                setDetailedProduct({
                    ...product,
                    name: data.nombre || product.name,
                    description: data.descripcion || product.description,
                    price: parseFloat(data.precio) || product.price,
                    sku: data.sku,
                    imageUrls: imageUrls.length > 0 ? imageUrls : product.imageUrls,
                    inStock: data.stock !== null && Number(data.stock) > 0,
                    featured: data.destacado === '1',
                    createdAt: data.created_at || product.createdAt,
                    categories: categoryNames.length > 0 ? categoryNames : ['Sin categoría'],
                });

            } catch (error) {
                console.error("Failed to fetch product details:", error);
                setDetailedProduct(product);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [product, categoryMap]);

    useEffect(() => {
        if (detailedProduct?.imageUrls[0]) {
            setMainImage(detailedProduct.imageUrls[0]);
        }
    }, [detailedProduct]);

    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

    const displayProduct = detailedProduct || product;

    const descriptionParts = (displayProduct.description || '')
        .split(/(?:\s*<br\s*\/?>\s*)+/i)
        .map(s => s.trim().replace(/\\n/g, ''))
        .filter(Boolean);

    return (
        <>
            {isZoomed && (
                <ImageZoomModal 
                    imageUrls={displayProduct.imageUrls}
                    initialIndex={displayProduct.imageUrls.indexOf(mainImage)}
                    altText={`Vista ampliada de ${displayProduct.name}`}
                    onClose={() => setIsZoomed(false)}
                />
            )}

            {modalState.isOpen && modalState.mode && (
                <OrderModal 
                    product={displayProduct}
                    mode={modalState.mode}
                    isOpen={modalState.isOpen}
                    onClose={handleCloseModal}
                    siteConfig={siteConfig}
                />
            )}

            <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in-down">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-dark dark:hover:text-white mb-6 transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                    Volver a los productos
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Image Section */}
                    <div>
                        <div 
                            className="aspect-square w-full rounded-lg overflow-hidden shadow-lg relative cursor-zoom-in"
                            onClick={() => setIsZoomed(true)}
                            role="button"
                            aria-label="Ampliar imagen"
                        >
                            <img
                                src={mainImage}
                                alt={displayProduct.name}
                                className="w-full h-full object-cover transition-opacity duration-300"
                                key={mainImage}
                            />
                        </div>
                        {displayProduct.imageUrls.length > 1 && (
                            <div className="mt-4 flex justify-center gap-4">
                                {displayProduct.imageUrls.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImage(img)}
                                        className={`w-20 h-20 rounded-md overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange ${mainImage === img ? 'ring-2 ring-brand-orange' : 'ring-1 ring-transparent hover:ring-gray-400 dark:hover:ring-gray-500'}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${displayProduct.name} - vista ${index + 1}`}
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
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{displayProduct.categories.join(' / ')}</span>
                                {displayProduct.inStock ? (
                                    <span className="text-sm font-semibold text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-900/50 px-3 py-1 rounded-full">En Stock</span>
                                ) : (
                                    <span className="text-sm font-semibold text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-900/50 px-3 py-1 rounded-full">Agotado</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark dark:text-brand-light">{displayProduct.name}</h1>
                                {displayProduct.featured && (
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-yellow-800 bg-yellow-200 px-3 py-1 rounded-full whitespace-nowrap">
                                        <StarIcon className="w-4 h-4" />
                                        Destacado
                                    </span>
                                )}
                            </div>
                            {displayProduct.sku && (
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">SKU: {displayProduct.sku}</p>
                            )}
                        </div>

                        {displayProduct.price > 0 && (
                            <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-4xl font-bold text-brand-orange">${displayProduct.price.toFixed(2)}</span>
                            </div>
                        )}
                        
                        <div>
                            <h2 className="text-lg font-semibold text-brand-dark dark:text-brand-light mb-3">Descripción</h2>
                            <div className="space-y-3 text-gray-600 dark:text-gray-300">
                                {descriptionParts.map((part, index) => {
                                    if (part.startsWith('*')) {
                                        return (
                                            <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-lg flex items-start gap-3 text-sm">
                                                <InfoIcon className="w-6 h-6 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                <span>{part.substring(1).trim()}</span>
                                            </div>
                                        );
                                    }
                                    return <p key={index}>{part}</p>;
                                })}
                            </div>
                        </div>

                        <div className="mt-auto pt-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleOpenModal('personalizar')}
                                    className="w-full bg-brand-orange text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
                                >
                                    Personalizar
                                </button>
                                {displayProduct.inStock && (
                                    <button
                                        onClick={() => handleOpenModal('encargar')}
                                        className="w-full bg-transparent border-2 border-brand-dark text-brand-dark dark:border-brand-light dark:text-brand-light font-bold py-3 px-6 rounded-lg hover:bg-brand-dark hover:text-white dark:hover:bg-brand-light dark:hover:text-brand-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark dark:focus:ring-brand-light"
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
                currentProduct={displayProduct}
                allProducts={allProducts}
                onProductSelect={onProductSelect}
            />
        </>
    );
};