import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Slider } from './components/Slider';
import { Filters } from './components/Filters';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { MOCK_PRODUCTS, SLIDER_ITEMS, CATEGORIES_DATA } from './constants';
import { Product, SortOption, Category } from './types';
import { CategoryShowcase } from './components/CategoryShowcase';
import { SearchIcon, GridIcon, ListIcon } from './components/icons';

const FilterControls: React.FC<{
    searchTerm: string, setSearchTerm: (v: string) => void,
    sortOption: SortOption, setSortOption: (v: SortOption) => void,
    priceRange: number, setPriceRange: (v: number) => void, maxPrice: number,
    inStockOnly: boolean, setInStockOnly: (v: boolean) => void
}> = ({ searchTerm, setSearchTerm, sortOption, setSortOption, priceRange, setPriceRange, maxPrice, inStockOnly, setInStockOnly }) => (
    <div className="space-y-6">
        {/* Search */}
        <div>
            <label htmlFor="search-mobile" className="block text-sm font-medium text-gray-700">Buscar producto</label>
            <div className="relative mt-1">
                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                    type="text"
                    id="search-mobile"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Smartphone, camiseta..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-700 rounded-md focus:ring-brand-orange focus:border-brand-orange bg-white"
                />
            </div>
        </div>
        {/* Sort */}
        <div>
            <label htmlFor="sort-mobile" className="block text-sm font-medium text-gray-700">Ordenar por</label>
            <select
                id="sort-mobile"
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
            <label htmlFor="price-mobile" className="block text-sm font-medium text-gray-700">Precio hasta: <span className="font-bold text-brand-orange">${priceRange}</span></label>
            <input
                type="range"
                id="price-mobile"
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
                id="inStock-mobile"
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange"
            />
            <label htmlFor="inStock-mobile" className="ml-2 block text-sm text-gray-900">
                Solo en stock
            </label>
        </div>
    </div>
);

type ViewMode = 'grid' | 'list';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [priceRange, setPriceRange] = useState<number>(1500);
    const [inStockOnly, setInStockOnly] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<SortOption>(SortOption.Newest);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 12;

    useEffect(() => {
        setProducts(MOCK_PRODUCTS);
    }, []);

    const maxPrice = useMemo(() => {
        if (MOCK_PRODUCTS.length === 0) return 100;
        return Math.ceil(Math.max(...MOCK_PRODUCTS.map(p => p.price)));
    }, []);

    useEffect(() => {
        setPriceRange(maxPrice);
    }, [maxPrice]);

    useEffect(() => {
        let tempProducts = [...products];
        if (searchTerm) tempProducts = tempProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (selectedCategory !== 'all') tempProducts = tempProducts.filter(p => p.category === selectedCategory);
        tempProducts = tempProducts.filter(p => p.price <= priceRange);
        if (inStockOnly) tempProducts = tempProducts.filter(p => p.inStock);

        switch (sortOption) {
            case SortOption.PriceAsc: tempProducts.sort((a, b) => a.price - b.price); break;
            case SortOption.PriceDesc: tempProducts.sort((a, b) => b.price - a.price); break;
            case SortOption.Newest: default: tempProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        }

        setFilteredProducts(tempProducts);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [searchTerm, selectedCategory, priceRange, inStockOnly, sortOption, products]);
    
    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }, [currentPage, filteredProducts]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const closeAllOverlays = () => {
        setIsMenuVisible(false);
        setIsFilterDropdownVisible(false);
    }

    return (
        <div className="min-h-screen bg-brand-light text-brand-dark flex flex-col">
            <Header 
                onMenuToggle={() => setIsMenuVisible(!isMenuVisible)}
                onFilterToggle={() => setIsFilterDropdownVisible(!isFilterDropdownVisible)} 
            />

            {/* Mobile Filter Dropdown */}
            {isFilterDropdownVisible && (
                 <>
                    <div 
                        className="fixed inset-0 z-20 md:hidden" 
                        onClick={() => setIsFilterDropdownVisible(false)} 
                        aria-hidden="true"
                    ></div>
                    <div className="md:hidden fixed top-16 left-4 right-4 bg-white/90 backdrop-blur-sm shadow-xl z-30 rounded-b-lg p-6 animate-fade-in-down">
                        <FilterControls 
                            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                            sortOption={sortOption} setSortOption={setSortOption}
                            priceRange={priceRange} setPriceRange={setPriceRange} maxPrice={maxPrice}
                            inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                        />
                    </div>
                </>
            )}
            
            <Slider items={SLIDER_ITEMS} />

            <CategoryShowcase 
                categories={CATEGORIES_DATA}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    closeAllOverlays();
                }}
            />

            <div className="container mx-auto px-4 md:mt-4 flex-grow w-full">
                <div className="md:flex md:gap-8">
                    <Filters
                        isVisible={isMenuVisible}
                        onClose={() => setIsMenuVisible(false)}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        inStockOnly={inStockOnly}
                        setInStockOnly={setInStockOnly}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        maxPrice={maxPrice}
                    />
                    <main className="w-full mt-8 md:mt-0">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                            <p className="hidden sm:block text-sm text-gray-500">
                                Mostrando <span className="font-semibold text-brand-dark">{paginatedProducts.length}</span> de <span className="font-semibold text-brand-dark">{filteredProducts.length}</span> productos
                            </p>
                             <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg self-end sm:self-auto">
                                <button 
                                    onClick={() => setViewMode('grid')} 
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-brand-orange' : 'text-gray-500 hover:text-brand-dark'}`}
                                    aria-label="Vista de cuadrícula"
                                    aria-pressed={viewMode === 'grid'}
                                >
                                    <GridIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-brand-orange' : 'text-gray-500 hover:text-brand-dark'}`}
                                    aria-label="Vista de lista"
                                    aria-pressed={viewMode === 'list'}
                                >
                                    <ListIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <ProductGrid
                            products={paginatedProducts}
                            viewMode={viewMode}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onNextPage={handleNextPage}
                            onPrevPage={handlePrevPage}
                        />
                    </main>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default App;
