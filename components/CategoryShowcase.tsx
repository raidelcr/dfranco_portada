
import React, { useRef } from 'react';
import { CategoryItem } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CategoryShowcaseProps {
    categories: CategoryItem[];
    selectedCategory: number | 'all';
    onSelectCategory: (category: number | 'all') => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.6;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };
    
    return (
        <div className="bg-white dark:bg-brand-dark">
            <div className="container mx-auto px-4 pt-8 pb-4 relative">
                <div 
                    ref={scrollContainerRef}
                    className="flex items-start gap-4 md:gap-8 overflow-x-auto pb-4 -mx-4 px-4 snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id as any)}
                            className="flex flex-col items-center justify-center text-center group flex-shrink-0 w-24"
                            aria-pressed={selectedCategory === category.id}
                        >
                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 p-1 transition-all duration-300 group-hover:border-brand-orange/50 ${selectedCategory === category.id ? 'border-brand-orange' : 'border-gray-200 dark:border-gray-700'}`}>
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <span className={`mt-2 text-sm md:text-base font-medium transition-colors duration-300 ${selectedCategory === category.id ? 'text-brand-orange' : 'text-gray-600 dark:text-gray-300 group-hover:text-brand-dark dark:group-hover:text-white'}`}>
                                {category.name}
                            </span>
                        </button>
                    ))}
                </div>
                
                 <div className="hidden md:flex justify-center mt-4">
                     <div className="flex items-center gap-4">
                         <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full border border-gray-300 bg-white/80 dark:bg-gray-800/80 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow"
                            aria-label="Desplazar categorías a la izquierda"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full border border-gray-300 bg-white/80 dark:bg-gray-800/80 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow"
                            aria-label="Desplazar categorías a la derecha"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};
