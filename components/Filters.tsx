import React from 'react';
import { SortOption } from '../types';
import { SearchIcon, XIcon } from './icons';

interface FiltersProps {
    isVisible: boolean;
    onClose: () => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    priceRange: number;
    setPriceRange: (value: number) => void;
    inStockOnly: boolean;
    setInStockOnly: (value: boolean) => void;
    sortOption: SortOption;
    setSortOption: (value: SortOption) => void;
    maxPrice: number;
}

export const Filters: React.FC<FiltersProps> = ({
    isVisible, onClose, searchTerm, setSearchTerm, priceRange, setPriceRange, 
    inStockOnly, setInStockOnly, sortOption, setSortOption, maxPrice
}) => {
    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <aside 
                className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white p-6 shadow-xl z-50 md:z-auto transform transition-transform md:relative md:w-72 md:flex-shrink-0 md:transform-none md:bg-transparent md:p-0 md:shadow-none md:self-start ${isVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                aria-label="Filtros de productos"
            >
                {/* Mobile Menu Header & Nav */}
                <div className="md:hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Menú</h2>
                        <button onClick={onClose} aria-label="Cerrar menú">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-4">
                        <a href="#" className="text-black-600 hover:text-brand-orange font-medium transition-colors">Inicio</a>
                        <a href="#" className="text-black-600 hover:text-brand-orange font-medium transition-colors">Inspiración</a>
                        <a href="#" className="text-black-600 hover:text-brand-orange font-medium transition-colors">Servicios</a>
                    </nav>
                </div>
                
                {/* Desktop Filters */}
                <div className="hidden md:block sticky top-20 bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-xl font-bold mb-6">Filtros</h2>
                    
                    <div className="space-y-6">
                        {/* Search */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Buscar producto</label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Smartphone, camiseta..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-700 rounded-md focus:ring-brand-orange focus:border-brand-orange bg-white"
                                />
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <label htmlFor="sort" className="block text-sm font-medium text-gray-700">Ordenar por</label>
                            <select
                                id="sort"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"
                            >
                                <option value={SortOption.Newest}>Más reciente</option>
                                <option value={SortOption.PriceDesc}>Precio: Mayor a menor</option>
                                <option value={SortOption.PriceAsc}>Precio: Menor a mayor</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio hasta: <span className="font-bold text-brand-orange">${priceRange}</span></label>
                            <input
                                type="range"
                                id="price"
                                min="0"
                                max={maxPrice}
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2 accent-brand-orange"
                            />
                        </div>

                        {/* Stock Toggle */}
                        <div className="flex items-center pt-2">
                            <input
                                id="inStock"
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                                className="h-4 w-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange"
                            />
                            <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">
                                Solo en stock
                            </label>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};