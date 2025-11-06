
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Product, Category, CategoryItem, SiteConfig, SliderItem } from './types';
import { apiCall } from './lib/api';
import { MobileMenu } from './components/MobileMenu';
import { preloadImages } from './lib/utils';
import { FooterSkeleton, HeaderSkeleton } from './components/skeletons';
import { SpinnerIcon } from './components/icons';

export interface AppContextType {
    allProducts: Product[];
    categories: CategoryItem[];
    categoryMap: Map<number, string>;
    siteConfig: SiteConfig | null;
    sliderItems: SliderItem[];
    isLoading: boolean;
}

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [categoryMap, setCategoryMap] = useState(new Map<number, string>());
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
    const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);
    
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });
    
    const location = useLocation();
    const isProductDetailView = location.pathname.startsWith('/producto/');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const handleThemeSwitch = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        if (isProductDetailView) {
            setIsHeaderVisible(true);
            return;
        }
        const controlHeaderVisibility = () => {
            const currentScrollY = window.scrollY;
            const headerHeight = 80;
            if (currentScrollY > headerHeight && currentScrollY > lastScrollY.current) {
                setIsHeaderVisible(false);
            } else {
                setIsHeaderVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', controlHeaderVisibility);
        return () => window.removeEventListener('scroll', controlHeaderVisibility);
    }, [isProductDetailView]);

    const fetchAllData = useCallback(async (isBackgroundRefresh = false) => {
        if (!isBackgroundRefresh) setIsLoading(true);
        setError(null);
        try {
            const useCache = !isBackgroundRefresh;
            const [configRes, catData, prodData, sliderData] = await Promise.all([
                apiCall<{ data: SiteConfig }>('/rrm/v1/configuraciones', {}, useCache),
                apiCall<any[]>('/rrm/v1/categorias', {}, useCache),
                apiCall<any[]>('/rrm/v1/catalogo/list', {}, useCache),
                apiCall<any>('/rrm/v1/configuraciones/slider', {}, useCache),
            ]);

            if (!configRes || !configRes.data) throw new Error('No se pudo cargar la configuración.');
            const config = configRes.data;
            setSiteConfig(config);
            document.title = config.page_name || 'E-commerce';
            const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (favicon && config.favicon_url) favicon.href = config.favicon_url;

            if (!catData) throw new Error('No se pudieron cargar las categorías.');
            const newCatMap = new Map<number, string>();
            const mappedCats: CategoryItem[] = catData
                .filter((c: any) => c.activo === '1')
                .map((c: any) => {
                    const id = parseInt(c.id, 10);
                    if (isNaN(id)) return null;
                    newCatMap.set(id, c.nombre);
                    return { id, name: c.nombre, imageUrl: c.imagen_url || '' };
                }).filter((c): c is CategoryItem => c !== null);
            setCategoryMap(newCatMap);
            const allCatImg = mappedCats.length > 0 ? mappedCats[Math.floor(Math.random() * mappedCats.length)].imageUrl : '';
            const allCategory: CategoryItem = { id: 'all' as any, name: 'Todas', imageUrl: allCatImg };
            setCategories([allCategory, ...mappedCats]);

            if (!prodData) throw new Error('No se pudieron cargar los productos.');
            const mappedProds: Product[] = prodData.map((p: any) => {
                const catIds: number[] = Array.isArray(p.categorias) ? p.categorias : [];
                const catNames: string[] = catIds.map(id => newCatMap.get(id)).filter((n): n is string => !!n);
                return {
                    id: Number(p.id), name: p.nombre || 'N/A',
                    description: p.descripcion?.replace(/<p>|<\/p>/g, '') || 'Sin descripción.',
                    price: parseFloat(p.precio) || 0, sku: p.sku,
                    categories: catNames.length > 0 ? catNames : ['Sin categoría'],
                    imageUrls: [p.imagen_url || `https://picsum.photos/seed/${p.id}/600/800`],
                    inStock: p.stock !== null && Number(p.stock) > 0,
                    featured: p.destacado === '1', createdAt: p.created_at || new Date().toISOString(),
                };
            });
            setProducts(mappedProds);

            let sliderItemsArray: any[] | undefined;
            if (Array.isArray(sliderData?.data)) sliderItemsArray = sliderData.data;
            else if (Array.isArray(sliderData)) sliderItemsArray = sliderData;

            if (sliderItemsArray) {
                const mappedSlider: SliderItem[] = sliderItemsArray.map((item: any) => {
                    if (!item || typeof item !== 'object') return null;
                    const id = parseInt(item.index, 10);
                    if (isNaN(id)) return null;
                    const isContentValid = item.description && (typeof item.description.content === 'string' || Array.isArray(item.description.content));
                    if (!isContentValid || typeof item.description.type !== 'string') return null;
                    return { id, title: item.title || '', description: { type: item.description.type, content: item.description.content }, imageUrl: item.image_url || '', active: item.active === true };
                }).filter((item): item is SliderItem => item !== null);
                setSliderItems(mappedSlider);
                preloadImages(mappedSlider.map(s => s.imageUrl));
            } else {
                 setSliderItems([]);
            }

            preloadImages([...mappedProds.flatMap(p => p.imageUrls), ...mappedCats.map(c => c.imageUrl)]);
            
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
            setError(`No se pudieron cargar los datos. ${msg}`);
            console.error("Fallo al obtener los datos:", e);
        } finally {
            if (!isBackgroundRefresh) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData(false);
    }, [fetchAllData]);

    useEffect(() => {
        const intervalId = setInterval(() => fetchAllData(true), 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [fetchAllData]);

    const outletContext: AppContextType = {
        allProducts: products,
        categories,
        categoryMap,
        siteConfig,
        sliderItems,
        isLoading
    };

    return (
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light flex flex-col">
            {isLoading ? <HeaderSkeleton /> : (
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
                {error ? (
                    <div className="text-center py-20 container mx-auto px-4">
                        <h2 className="text-2xl font-semibold text-red-500">Error de Carga</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
                    </div>
                ) : (
                    <Outlet context={outletContext} />
                )}
            </main>
            
            {isLoading ? <FooterSkeleton /> : <Footer siteConfig={siteConfig} />}
        </div>
    );
};

export default App;