export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: Category;
    imageUrl: string;
    inStock: boolean;
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