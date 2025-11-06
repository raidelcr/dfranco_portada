
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<HomePage />} />
                    <Route path="producto/:slug" element={<ProductDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);