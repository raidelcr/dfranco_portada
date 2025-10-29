
import React, { useState, useEffect } from 'react';

interface SliderItem {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
}

interface SliderProps {
    items: SliderItem[];
}

export const Slider: React.FC<SliderProps> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const timer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentIndex, items.length]);

    return (
        <div className="relative w-full h-56 md:h-80 lg:h-96 overflow-hidden">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-4">
                        <h2 className="text-2xl md:text-4xl font-bold text-white">{item.title}</h2>
                        <p className="mt-2 text-md md:text-lg text-white/90">{item.subtitle}</p>
                    </div>
                </div>
            ))}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-brand-orange' : 'bg-white/50 hover:bg-white/75'}`}
                        aria-label={`Ir a la imagen ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
