
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ProductDetail } from '../components/ProductDetail';
import { Product } from '../types';
import { slugify } from '../lib/utils';
import { ProductDetailSkeleton } from '../components/skeletons';
import { AppContextType } from '../App';


const ProductDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { allProducts, siteConfig, categoryMap } = useOutletContext<AppContextType>();
    
    const product = useMemo(() => {
        if (!slug || allProducts.length === 0) return null;
        return allProducts.find(p => slugify(p.name) === slug) || null;
    }, [slug, allProducts]);

    const [isResolved, setIsResolved] = useState(false);

    useEffect(() => {
        if (allProducts.length > 0) {
            if (!product) {
                // Product not found, navigate back to home after a brief moment
                // This handles cases where data is loaded but the slug is invalid
                const timer = setTimeout(() => navigate('/', { replace: true }), 100);
                return () => clearTimeout(timer);
            }
            setIsResolved(true);
        }
    }, [slug, product, allProducts, navigate]);
    
    // Show skeleton if data is still resolving or product is not found yet
    if (!isResolved || !product) {
        return <ProductDetailSkeleton />;
    }
    
    return (
        <ProductDetail 
            product={product} 
            allProducts={allProducts} 
            categoryMap={categoryMap} 
            siteConfig={siteConfig} 
        />
    );
};

export default ProductDetailPage;
