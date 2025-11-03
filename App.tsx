

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Slider } from './components/Slider';
import { DesktopFilters, Autocomplete } from './components/Filters';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { Product, SortOption, Category, ViewMode, CategoryItem, SiteConfig, SliderItem } from './types';
import { CategoryShowcase } from './components/CategoryShowcase';
import { GridIcon, ListIcon, LayoutDashboardIcon, XIcon } from './components/icons';
import { ProductDetail } from './components/ProductDetail';
import { apiCall } from './lib/api';
import { MobileMenu } from './components/MobileMenu';
import { preloadImages } from './lib/utils';
import { CategoryShowcaseSkeleton, FooterSkeleton, HeaderSkeleton, ProductGridSkeleton, SliderSkeleton, ProductDetailSkeleton } from './components/skeletons';

const FilterControls: React.FC<{
    searchTerm: string, setSearchTerm: (v: string) => void,
    sortOption: SortOption, setSortOption: (v: SortOption) => void,
    priceRange: number, setPriceRange: (v: number) => void, maxPrice: number,
    inStockOnly: boolean, setInStockOnly: (v: boolean) => void,
    suggestions: string[],
}> = ({ searchTerm, setSearchTerm, sortOption, setSortOption, priceRange, setPriceRange, maxPrice, inStockOnly, setInStockOnly, suggestions }) => (
    <div className="space-y-6">
        {/* Search */}
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
        {/* Sort */}
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
        {/* Price Range */}
        <div>
            <label htmlFor="price-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio hasta: <span className="font-bold text-brand-orange">${priceRange}</span></label>
            <input
                type="range"
                id="price-mobile"
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
                id="inStock-mobile"
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 text-brand-orange border-gray-300 dark:border-gray-600 rounded focus:ring-brand-orange bg-white dark:bg-gray-800"
            />
            <label htmlFor="inStock-mobile" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Solo en stock
            </label>
        </div>
    </div>
);

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [categoryMap, setCategoryMap] = useState(new Map<number, string>());
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
    const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [priceRange, setPriceRange] = useState<number>(1500);
    const [inStockOnly, setInStockOnly] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<SortOption>(SortOption.Newest);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 12;

    const productListContainerRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // State for hiding header on scroll
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);
    
    // Theme state
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });
    
    const isProductDetailView = !!selectedProduct;

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
    
    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
    };
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedProduct]);

    const handleThemeSwitch = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        // Always show header in detail view and reset scroll logic
        if (isProductDetailView) {
            setIsHeaderVisible(true);
            return;
        }

        const controlHeaderVisibility = () => {
            const currentScrollY = window.scrollY;
            const headerHeight = 80; // Corresponds to h-20 class

            if (currentScrollY > headerHeight && currentScrollY > lastScrollY.current) {
                // Scrolling down
                setIsHeaderVisible(false);
            } else {
                // Scrolling up or at the top
                setIsHeaderVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', controlHeaderVisibility);
        return () => window.removeEventListener('scroll', controlHeaderVisibility);
    }, [isProductDetailView]);

    const fetchAllData = useCallback(async (isBackgroundRefresh = false) => {
        if (!isBackgroundRefresh) {
            setIsLoading(true);
        }
        setError(null);
        try {
            const useCacheForRequest = !isBackgroundRefresh;
            const [configResponse, categoriesData, productsData, sliderData] = await Promise.all([
                apiCall<{ data: SiteConfig }>('/rrm/v1/configuraciones', {}, useCacheForRequest),
                apiCall<any[]>('/rrm/v1/categorias', {}, useCacheForRequest),
                apiCall<any[]>('/rrm/v1/catalogo/list', {}, useCacheForRequest),
                apiCall<any>('/rrm/v1/configuraciones/slider', {}, useCacheForRequest),
            ]);

            // 1. Process Site Configuration
            if (!configResponse || !configResponse.data) throw new Error('No se pudo cargar la configuración del sitio.');
            const config = configResponse.data;
            setSiteConfig(config);
            document.title = config.page_name || 'E-commerce';
            const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (favicon) favicon.href = config.favicon_url;
            else if (config.favicon_url) {
                const newFavicon = document.createElement('link');
                newFavicon.rel = 'icon';
                newFavicon.href = config.favicon_url;
                document.head.appendChild(newFavicon);
            }

            // 2. Process Categories
            if (!categoriesData) throw new Error('No se pudieron cargar las categorías.');
            const newCategoryMap = new Map<number, string>();
            const mappedCategories: CategoryItem[] = categoriesData
                .filter((c: any) => c.activo === '1') // Filter for active categories
                .map((c: any) => {
                    const categoryId = parseInt(c.id, 10);
                    if (isNaN(categoryId)) return null;
                    newCategoryMap.set(categoryId, c.nombre);
                    return { id: categoryId, name: c.nombre, imageUrl: c.imagen_url || 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg' };
                }).filter((c): c is CategoryItem => c !== null);
            setCategoryMap(newCategoryMap);
            let allCategoryImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
            if (mappedCategories.length > 0) {
                const randomIndex = Math.floor(Math.random() * mappedCategories.length);
                allCategoryImage = mappedCategories[randomIndex].imageUrl;
            }
            const allCategory: CategoryItem = { id: 'all' as any, name: 'Todas', imageUrl: allCategoryImage };
            setCategories([allCategory, ...mappedCategories]);

            // 3. Process Products
            if (!productsData) throw new Error('No se pudieron cargar los productos.');
            const mappedProducts: Product[] = productsData.map((p: any) => {
                const categoryIds: number[] = Array.isArray(p.categorias) ? p.categorias : [];
                const categoryNames: string[] = categoryIds.map(id => newCategoryMap.get(id)).filter((name): name is string => !!name);
                return {
                    id: Number(p.id),
                    name: p.nombre || 'Nombre no disponible',
                    description: p.descripcion?.replace(/<p>|<\/p>/g, '') || 'Sin descripción.',
                    price: parseFloat(p.precio) || 0,
                    sku: p.sku,
                    categories: categoryNames.length > 0 ? categoryNames : ['Sin categoría'],
                    imageUrls: [p.imagen_url || `https://picsum.photos/seed/${p.id}/600/800`],
                    inStock: p.stock !== null && Number(p.stock) > 0,
                    featured: p.destacado === '1',
                    createdAt: p.created_at || new Date().toISOString(),
                };
            });
            setProducts(mappedProducts);

            // 4. Process Slider
            let sliderItemsArray: any[] | undefined;
            if (Array.isArray(sliderData)) sliderItemsArray = sliderData;
            else if (sliderData && typeof sliderData === 'object' && sliderData !== null) {
                if (Array.isArray(sliderData.data)) sliderItemsArray = sliderData.data;
                else {
                    const arrayKey = Object.keys(sliderData).find(key => Array.isArray(sliderData[key]));
                    if (arrayKey) sliderItemsArray = sliderData[arrayKey];
                }
            }
            if (!sliderItemsArray) {
                console.warn('No se encontraron datos de slider válidos.', sliderData);
                setSliderItems([]);
            } else {
                const mappedSliderItems: SliderItem[] = sliderItemsArray.map((item: any) => {
                    if (!item || typeof item !== 'object') return null;
                    const id = parseInt(item.index, 10);
                    if (isNaN(id)) return null;
                    const isContentValid = item.description && (typeof item.description.content === 'string' || Array.isArray(item.description.content));
                    if (!isContentValid || typeof item.description.type !== 'string') return null;
                    return { id, title: item.title || '', description: { type: item.description.type, content: item.description.content }, imageUrl: item.image_url || 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg', active: item.active === true };
                }).filter((item): item is SliderItem => item !== null);
                setSliderItems(mappedSliderItems);

                // 5. Preload images for better performance
                const imageUrlsToPreload = [
                    ...mappedProducts.flatMap(p => p.imageUrls),
                    ...mappedCategories.map(c => c.imageUrl),
                    ...mappedSliderItems.map(s => s.imageUrl),
                    allCategory.imageUrl
                ].filter(Boolean); // Filter out any null/undefined/empty URLs
                preloadImages(imageUrlsToPreload);
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
            setError(`No se pudieron cargar los datos. ${errorMessage} Por favor, inténtelo de nuevo más tarde.`);
            console.error("Fallo al obtener los datos:", e);
        } finally {
            if (!isBackgroundRefresh) {
                setIsLoading(false);
            }
        }
    }, []);

    // Effect for initial data load
    useEffect(() => {
        fetchAllData(false);
    }, [fetchAllData]);

    // Effect for background auto-refresh every 5 minutes
    useEffect(() => {
        const refreshInterval = 5 * 60 * 1000; // 5 minutes
        const intervalId = setInterval(() => {
            console.log('Buscando actualizaciones en segundo plano...');
            fetchAllData(true);
        }, refreshInterval);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [fetchAllData]);

    const maxPrice = useMemo(() => {
        if (products.length === 0) return 1500;
        const prices = products.map(p => p.price).filter(p => p > 0);
        if (prices.length === 0) return 1500;
        return Math.ceil(Math.max(...prices));
    }, [products]);

    const searchSuggestions = useMemo(() => {
        if (searchTerm.trim().length < 2) {
            return [];
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return products
            .filter(p => p.name.toLowerCase().includes(lowerCaseSearchTerm))
            .map(p => p.name)
            .slice(0, 5); // Limit to 5 suggestions
    }, [searchTerm, products]);

    useEffect(() => {
        setPriceRange(maxPrice);
    }, [maxPrice]);

    useEffect(() => {
        let tempProducts = [...products];

        if (searchTerm) {
            tempProducts = tempProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (selectedCategory !== 'all') {
            const categoryName = categoryMap.get(selectedCategory);
            if (categoryName) {
                 tempProducts = tempProducts.filter(p => p.categories.includes(categoryName));
            }
        }
        
        tempProducts = tempProducts.filter(p => p.price <= priceRange);
        
        if (inStockOnly) {
            tempProducts = tempProducts.filter(p => p.inStock);
        }

        switch (sortOption) {
            case SortOption.PriceAsc: tempProducts.sort((a, b) => a.price - b.price); break;
            case SortOption.PriceDesc: tempProducts.sort((a, b) => b.price - a.price); break;
            case SortOption.Newest: default: tempProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        }

        setFilteredProducts(tempProducts);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [searchTerm, selectedCategory, priceRange, inStockOnly, sortOption, products, categoryMap]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (!isProductDetailView) {
            productListContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage, isProductDetailView]);
    
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
    
    const renderContent = () => {
        if (error) {
            return (
                 <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold text-red-500">Error</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
                </div>
            )
        }

        return (
             <div className="md:flex md:gap-8">
                <DesktopFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    inStockOnly={inStockOnly}
                    setInStockOnly={setInStockOnly}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    maxPrice={maxPrice}
                    suggestions={searchSuggestions}
                />
                <div className="w-full mt-8 md:mt-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                        <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                            Mostrando <span className="font-semibold text-brand-dark dark:text-brand-light">{paginatedProducts.length}</span> de <span className="font-semibold text-brand-dark dark:text-brand-light">{filteredProducts.length}</span> productos
                        </p>
                            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg self-end sm:self-auto">
                            <button 
                                onClick={() => setViewMode('grid')} 
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white'}`}
                                aria-label="Vista de cuadrícula"
                                aria-pressed={viewMode === 'grid'}
                            >
                                <GridIcon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white'}`}
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
                        onProductSelect={handleProductSelect}
                    />
                </div>
            </div>
        )
    }

    const ProductListPage = (
        <>
            {/* Sub-header for mobile actions */}
            <div className={`md:hidden sticky bg-white/95 dark:bg-brand-dark/95 backdrop-blur-sm shadow-sm transition-all duration-300 ease-in-out z-30 ${isHeaderVisible ? 'top-20' : 'top-0'}`}>
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <button
                        onClick={() => setIsFilterDropdownVisible(!isFilterDropdownVisible)}
                        className="relative flex items-center justify-center w-24 h-6 text-sm font-medium text-brand-dark dark:text-brand-light transition-colors duration-300"
                        aria-expanded={isFilterDropdownVisible}
                        aria-controls="mobile-filter-dropdown"
                    >
                        <span className={`absolute inset-0 flex items-center justify-left gap-2 transition-all duration-300 ease-in-out ${isFilterDropdownVisible ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'}`} aria-hidden="true">
                            <LayoutDashboardIcon className="w-5 h-5" />
                            <span>Filtrar</span>
                        </span>
                        <span className={`absolute inset-0 flex items-center justify-left transition-all duration-300 ease-in-out ${isFilterDropdownVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`} aria-hidden="true">
                            <XIcon className="w-5 h-5" />
                        </span>
                    </button>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>

            {/* Mobile Filter Dropdown */}
            {isFilterDropdownVisible && (
                 <>
                    <div 
                        className="fixed inset-0 z-20 md:hidden" 
                        onClick={() => setIsFilterDropdownVisible(false)} 
                        aria-hidden="true"
                    ></div>
                    <div 
                        id="mobile-filter-dropdown"
                        className={`md:hidden fixed left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl z-30 rounded-b-lg p-6 animate-fade-in-down transition-all duration-300 ease-in-out ${isHeaderVisible ? 'top-[120px]' : 'top-[46px]'}`}
                    >
                        <FilterControls 
                            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                            sortOption={sortOption} setSortOption={setSortOption}
                            priceRange={priceRange} setPriceRange={setPriceRange} maxPrice={maxPrice}
                            inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                            suggestions={searchSuggestions}
                        />
                    </div>
                </>
            )}
            
            {isLoading ? <SliderSkeleton /> : <Slider items={sliderItems} />}

            {isLoading ? (
                <CategoryShowcaseSkeleton />
            ) : (
                <CategoryShowcase 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(catId) => {
                        setSelectedCategory(catId);
                        closeAllOverlays();
                    }}
                />
            )}

            <div ref={productListContainerRef} className="container mx-auto px-4 md:mt-4 w-full">
               {isLoading ? <ProductGridSkeleton /> : renderContent()}
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light flex flex-col">
            {isLoading ? (
                <HeaderSkeleton />
            ) : (
                <Header 
                    siteConfig={siteConfig}
                    onMenuToggle={() => setIsMenuVisible(!isMenuVisible)}
                    isProductDetailView={isProductDetailView}
                    isVisible={isHeaderVisible}
                    theme={theme}
                    onThemeToggle={handleThemeSwitch}
                />
            )}
            
            <MobileMenu
                siteConfig={siteConfig}
                isVisible={isMenuVisible}
                onClose={() => setIsMenuVisible(false)}
                theme={theme}
                onThemeToggle={handleThemeSwitch}
            />

            <main className="flex-grow">
                {selectedProduct ? (
                     <ProductDetail
                        product={selectedProduct}
                        onBack={() => setSelectedProduct(null)}
                        allProducts={products}
                        categoryMap={categoryMap}
                        siteConfig={siteConfig}
                        onProductSelect={handleProductSelect}
                    />
                ) : (
                    ProductListPage
                )}
            </main>
            
            {isLoading ? <FooterSkeleton /> : <Footer siteConfig={siteConfig} />}
        </div>
    );
};

export default App;
