import React from 'react';
import { CategoryItem, Category } from '../types';

interface CategoryShowcaseProps {
    categories: CategoryItem[];
    selectedCategory: Category | 'all';
    onSelectCategory: (category: Category | 'all') => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 pt-8 pb-4">
                <div className="flex items-start gap-4 md:gap-8 overflow-x-auto pb-4 -mx-4 px-4 snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className="flex flex-col items-center justify-center text-center group flex-shrink-0 w-24"
                            aria-pressed={selectedCategory === category.id}
                        >
                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 p-1 transition-all duration-300 group-hover:border-brand-orange/50 ${selectedCategory === category.id ? 'border-brand-orange' : 'border-gray-200'}`}>
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <span className={`mt-2 text-sm md:text-base font-medium transition-colors duration-300 ${selectedCategory === category.id ? 'text-brand-orange' : 'text-gray-600 group-hover:text-brand-dark'}`}>
                                {category.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};