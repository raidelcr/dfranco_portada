
import React, { useState, useEffect, useRef } from 'react';
import { SortOption } from '../types';
import { SearchIcon } from './icons';

interface AutocompleteProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
    placeholder?: string;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({ id, value, onChange, suggestions, placeholder }) => {
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectSuggestion = (suggestion: string) => {
        onChange(suggestion);
        setIsSuggestionsVisible(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isSuggestionsVisible || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                handleSelectSuggestion(suggestions[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsSuggestionsVisible(false);
            setActiveIndex(-1);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setActiveIndex(-1); // Reset active index when typing
    }
    
    const hasSuggestions = suggestions.length > 0 && isSuggestionsVisible;

    const inputClassName = "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md focus:ring-brand-orange focus:border-brand-orange bg-white dark:bg-gray-800";

    return (
        <div className="relative" ref={wrapperRef}>
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
                type="text"
                id={id}
                value={value}
                onChange={handleInputChange}
                onFocus={() => setIsSuggestionsVisible(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={inputClassName}
                autoComplete="off"
            />
            {hasSuggestions && (
                <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 shadow-lg max-h-60 overflow-auto animate-fade-in-down" style={{animationDuration: '150ms'}}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={`px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-200 ${
                                index === activeIndex ? 'bg-brand-orange text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

interface FiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    priceRange: number;
    setPriceRange: (value: number) => void;
    inStockOnly: boolean;
    setInStockOnly: (value: boolean) => void;
    sortOption: SortOption;
    setSortOption: (value: SortOption) => void;
    maxPrice: number;
    suggestions: string[];
}

export const DesktopFilters: React.FC<FiltersProps> = ({
    searchTerm, setSearchTerm, priceRange, setPriceRange, 
    inStockOnly, setInStockOnly, sortOption, setSortOption, maxPrice, suggestions
}) => {
    return (
        <aside 
            className="hidden md:block md:relative md:w-72 md:flex-shrink-0 md:self-start"
            aria-label="Filtros de productos"
        >
            {/* Desktop Filters */}
            <div className="sticky top-24 bg-white dark:bg-gray-900 p-6 shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-6 text-brand-dark dark:text-brand-light">Filtros</h2>
                
                <div className="space-y-6">
                    {/* Search */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Buscar producto</label>
                        <div className="relative mt-1">
                            <Autocomplete
                                id="search"
                                value={searchTerm}
                                onChange={setSearchTerm}
                                suggestions={suggestions}
                                placeholder="Sofá, cocina, butaca..."
                            />
                        </div>
                    </div>

                    {/* Sort */}
                    <div>
                        <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por</label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as SortOption)}
                            className="w-full mt-1 py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"
                        >
                            <option value={SortOption.Newest}>Más reciente</option>
                            <option value={SortOption.PriceDesc}>Precio: Mayor a menor</option>
                            <option value={SortOption.PriceAsc}>Precio: Menor a mayor</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio hasta: <span className="font-bold text-brand-orange">${priceRange}</span></label>
                        <input
                            type="range"
                            id="price"
                            min="0"
                            max={maxPrice}
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2 accent-brand-orange"
                        />
                    </div>

                    {/* Stock Toggle */}
                    <div className="flex items-center pt-2">
                        <input
                            id="inStock"
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) => setInStockOnly(e.target.checked)}
                            className="h-4 w-4 text-brand-orange border-gray-300 dark:border-gray-600 rounded focus:ring-brand-orange bg-white dark:bg-gray-800"
                        />
                        <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            Solo en stock
                        </label>
                    </div>
                </div>
            </div>
        </aside>
    );
};
