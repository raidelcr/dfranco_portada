
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Slider } from '../components/Slider';
import { DesktopFilters, Autocomplete } from '../components/Filters';
import { ProductGrid } from '../components/ProductGrid';
import { Product, SortOption, ViewMode, CategoryItem, SliderItem } from '../types';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { GridIcon, ListIcon, LayoutDashboardIcon, XIcon } from '../components/icons';
import { CategoryShowcaseSkeleton, ProductGridSkeleton, SliderSkeleton } from '../components/skeletons';
import { AppContextType } from '../App';


const FilterControls: React.FC<{
    searchTerm: string, setSearchTerm: (v: string) => void,
    sortOption: SortOption, setSortOption: (v: SortOption) => void,
    priceRange: { min: number, max: number }, setPriceRange: (v: React.SetStateAction<{min: number, max: number}>) => void, maxPrice: number,
    inStockOnly: boolean, setInStockOnly: (v: boolean) => void,
    suggestions: string[],
    categories: CategoryItem[],
    selectedCategory: number | 'all',
    setSelectedCategory: (v: number | 'all') => void
}> = ({ searchTerm, setSearchTerm, sortOption, setSortOption, priceRange, setPriceRange, maxPrice, inStockOnly, setInStockOnly, suggestions, categories, selectedCategory, setSelectedCategory }) => (
    <div className="space-y-6">
        <div>
            <div className="relative mt-1">
                <Autocomplete
                    id="search-mobile"
                    value={searchTerm}
                    onChange={setSearchTerm}
                    suggestions={suggestions}
                    placeholder="Sofá, cocina, butaca..."
                />
            </div>
        </div>
        <div>
             <label htmlFor="category-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
            <select
                id="category-mobile"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full mt-1 py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"
            >
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="sort-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por</label>
            <select
                id="sort-mobile"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full mt-1 py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"
            >
                <option value={SortOption.Newest}>Más reciente</option>
                <option value={SortOption.PriceDesc}>Precio: Mayor a menor</option>
                <option value={SortOption.PriceAsc}>Precio: Menor a mayor</option>
            </select>
        </div>
        <div>
             <label htmlFor="price-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio: <span className="font-bold text-brand-orange">${priceRange.min} - ${priceRange.max}</span></label>
             <div className="mt-2 space-y-2">
                <div>
                    <label htmlFor="price-min-mobile" className="text-xs text-gray-600 dark:text-gray-400">Mínimo</label>
                    <input type="range" id="price-min-mobile" min="0" max={maxPrice} value={priceRange.min} onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.min(Number(e.target.value), prev.max) }))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer mt-1 accent-brand-orange" />
                </div>
                <div>
                     <label htmlFor="price-max-mobile" className="text-xs text-gray-600 dark:text-gray-400">Máximo</label>
                    <input type="range" id="price-max-mobile" min="0" max={maxPrice} value={priceRange.max} onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(Number(e.target.value), prev.min) }))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer mt-1 accent-brand-orange" />
                </div>
            </div>
        </div>
        <div className="flex items-center pt-2">
            <input id="inStock-mobile" type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-4 w-4 text-brand-orange border-gray-300 dark:border-gray-600 rounded focus:ring-brand-orange bg-white dark:bg-gray-800" />
            <label htmlFor="inStock-mobile" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Solo en stock</label>
        </div>
    </div>
);


const HomePage: React.FC = () => {
    const { allProducts, categories, categoryMap, sliderItems, isLoading } = useOutletContext<AppContextType>();
    
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
    const [inStockOnly, setInStockOnly] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<SortOption>(SortOption.Newest);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 12;

    const productListContainerRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    const maxPrice = useMemo(() => {
        if (allProducts.length === 0) return 1500;
        const prices = allProducts.map(p => p.price).filter(p => p > 0);
        return prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1500;
    }, [allProducts]);

    const searchSuggestions = useMemo(() => {
        if (searchTerm.trim().length < 2) return [];
        return allProducts
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(p => p.name)
            .slice(0, 5);
    }, [searchTerm, allProducts]);

    useEffect(() => {
        setPriceRange({min: 0, max: maxPrice});
    }, [maxPrice]);

    useEffect(() => {
        let tempProducts = [...allProducts];

        if (searchTerm) tempProducts = tempProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (selectedCategory !== 'all') {
            const categoryName = categoryMap.get(selectedCategory);
            if (categoryName) tempProducts = tempProducts.filter(p => p.categories.includes(categoryName));
        }
        tempProducts = tempProducts.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
        if (inStockOnly) tempProducts = tempProducts.filter(p => p.inStock);

        switch (sortOption) {
            case SortOption.PriceAsc: tempProducts.sort((a, b) => a.price - b.price); break;
            case SortOption.PriceDesc: tempProducts.sort((a, b) => b.price - a.price); break;
            default: tempProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        }
        setFilteredProducts(tempProducts);
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, priceRange, inStockOnly, sortOption, allProducts, categoryMap]);

    useEffect(() => {
        if (isInitialMount.current) isInitialMount.current = false;
        else productListContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [currentPage]);
    
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }, [currentPage, filteredProducts]);

    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(c => c + 1); };
    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(c => c - 1); };
    
    const renderContent = () => (
        <div className="md:flex md:gap-8">
            <DesktopFilters
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                priceRange={priceRange} setPriceRange={setPriceRange}
                inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                sortOption={sortOption} setSortOption={setSortOption} maxPrice={maxPrice}
                suggestions={searchSuggestions} categories={categories}
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
            />
            <div className="w-full mt-8 md:mt-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                    <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                        Mostrando <span className="font-semibold text-brand-dark dark:text-brand-light">{paginatedProducts.length}</span> de <span className="font-semibold text-brand-dark dark:text-brand-light">{filteredProducts.length}</span> productos
                    </p>
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg self-end sm:self-auto">
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white'}`}><GridIcon className="w-5 h-5" /></button>
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white'}`}><ListIcon className="w-5 h-5" /></button>
                    </div>
                </div>
                <ProductGrid
                    products={paginatedProducts} viewMode={viewMode}
                    currentPage={currentPage} totalPages={totalPages}
                    onNextPage={handleNextPage} onPrevPage={handlePrevPage}
                />
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <>
                <SliderSkeleton />
                <CategoryShowcaseSkeleton />
                <div className="container mx-auto px-4 md:mt-4 w-full">
                    <ProductGridSkeleton />
                </div>
            </>
        );
    }
    
    return (
        <>
            <div className="md:hidden sticky bg-white/95 dark:bg-brand-dark/95 backdrop-blur-sm shadow-sm transition-all duration-300 ease-in-out z-30 top-20">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <button onClick={() => setIsFilterDropdownVisible(v => !v)} className="relative flex items-center justify-center w-24 h-6 text-sm font-medium text-brand-dark dark:text-brand-light">
                        <span className={`absolute inset-0 flex items-center justify-left gap-2 transition-all duration-300 ${isFilterDropdownVisible ? 'opacity-0 -translate-y-3' : 'opacity-100'}`}><LayoutDashboardIcon className="w-5 h-5" /><span>Filtrar</span></span>
                        <span className={`absolute inset-0 flex items-center justify-left transition-all duration-300 ${isFilterDropdownVisible ? 'opacity-100' : 'opacity-0 translate-y-3'}`}><XIcon className="w-5 h-5" /></span>
                    </button>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white">Volver al inicio</button>
                </div>
            </div>

            {isFilterDropdownVisible && (
                 <>
                    <div className="fixed inset-0 z-20 md:hidden" onClick={() => setIsFilterDropdownVisible(false)} />
                    <div className="md:hidden fixed left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl z-30 rounded-b-lg p-6 animate-fade-in-down top-[120px]">
                        <FilterControls searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortOption={sortOption} setSortOption={setSortOption} priceRange={priceRange} setPriceRange={setPriceRange} maxPrice={maxPrice} inStockOnly={inStockOnly} setInStockOnly={setInStockOnly} suggestions={searchSuggestions} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                    </div>
                </>
            )}
            
            <Slider items={sliderItems} />
            <CategoryShowcase 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(catId) => {
                    setSelectedCategory(catId);
                    setIsFilterDropdownVisible(false);
                }}
            />

            <div ref={productListContainerRef} className="container mx-auto px-4 md:mt-4 w-full">
               {renderContent()}
            </div>
        </>
    );
};

export default HomePage;