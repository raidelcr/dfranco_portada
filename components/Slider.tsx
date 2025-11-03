import React, { useState, useEffect, useRef } from 'react';
import { SliderItem } from '../types';

interface SliderProps {
    items: SliderItem[];
}

export const Slider: React.FC<SliderProps> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const timerRef = useRef<number | null>(null);
    const hasSetInitialIndex = useRef(false);

    // This effect sets the initial slide based on the `active` flag from the data.
    // It runs only once when the items are first loaded.
    useEffect(() => {
        if (items.length > 0 && !hasSetInitialIndex.current) {
            const activeIndex = items.findIndex(item => item.active);
            if (activeIndex !== -1) {
                setCurrentIndex(activeIndex);
            }
            hasSetInitialIndex.current = true;
        }
    }, [items]);

    const goToSlide = (index: number) => {
        if (index === currentIndex || isAnimating) return;
        
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsAnimating(false);
        }, 500); // Duración de la animación de desvanecimiento del texto
    };

    useEffect(() => {
        if (items.length <= 1) return;

        timerRef.current = window.setTimeout(() => {
            setIsAnimating(true); // 1. Inicia la animación de salida (desvanece el texto)
            setTimeout(() => {
                // 2. Después de que el texto se desvanece, cambia la diapositiva
                setCurrentIndex(prev => (prev + 1) % items.length);
                setIsAnimating(false); // 3. Restablece el estado para la nueva diapositiva
            }, 500); // Debe coincidir con la duración de la transición de opacidad
        }, 20000);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [currentIndex, items.length]);

    if (items.length === 0) {
        return null;
    }
    
    const renderDescription = (item: SliderItem) => {
        const { type, content } = item.description;

        if (type === 'list') {
            const lines = Array.isArray(content) ? content : String(content).split('\n');
            return (
                <ul className="list-disc list-inside text-left space-y-1">
                    {lines.map((line, i) => (
                        <li key={i}>{line.replace(/\r/g, '')}</li>
                    ))}
                </ul>
            );
        }

        const textContent = Array.isArray(content) ? content.join(' ') : content;
        return <p>{textContent}</p>;
    };

    return (
        <div className="relative w-full h-72 md:h-80 lg:h-96 overflow-hidden">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className="absolute inset-0 transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
                >
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    
                    <div className={`absolute inset-y-0 left-0 bg-black/70 flex flex-col justify-center items-start text-left p-6 sm:p-8 w-full sm:w-1/2 lg:w-1/3 xl:max-w-md transition-opacity duration-500 ease-in-out ${
                        isAnimating && index === currentIndex ? 'opacity-0' : 'opacity-100'
                    }`}>
                        <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-white text-left">{item.title}</h2>
                        
                        <div className="mt-2 text-sm sm:text-base lg:text-lg text-white/90">
                           {renderDescription(item)}
                        </div>
                    </div>
                </div>
            ))}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-brand-orange' : 'bg-white/50 hover:bg-white/75'}`}
                        aria-label={`Ir a la imagen ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};