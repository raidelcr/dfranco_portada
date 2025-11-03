export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku?: string;
    categories: Category[];
    imageUrls: string[];
    inStock: boolean;
    featured: boolean;
    createdAt: string; // ISO 8601 date string
}

export type Category = string;

export interface CategoryItem {
    id: number;
    name: string;
    imageUrl: string;
}

export enum SortOption {
    Newest = 'newest',
    PriceAsc = 'price-asc',
    PriceDesc = 'price-desc',
}

export type ViewMode = 'grid' | 'list';

export interface SiteConfig {
    logo_url: string;
    page_name: string;
    favicon_url: string;
    footer_copyright: string;
    menu_inicio: string;
    menu_servicios: string;
    menu_inspiracion: string;
    social_facebook: string;
    social_instagram: string;
    social_whatsapp: string;
    social_email: string;
}

export interface SliderItem {
    id: number;
    title: string;
    description: {
        type: 'paragraph' | 'list' | string;
        content: string | string[];
    };
    imageUrl: string;
    active: boolean;
}