export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: Category;
    imageUrls: string[];
    inStock: boolean;
    featured: boolean;
    createdAt: string; // ISO 8601 date string
}

export type Category = 'Electrónicos' | 'Ropa' | 'Hogar' | 'Libros';

export interface CategoryItem {
    id: Category | 'all';
    name: string;
    imageUrl: string;
}

export enum SortOption {
    Newest = 'newest',
    PriceAsc = 'price-asc',
    PriceDesc = 'price-desc',
}

export type ViewMode = 'grid' | 'list';