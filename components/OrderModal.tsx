import React, { useState, useEffect, useCallback } from 'react';
import { Product, SiteConfig } from '../types';
import { apiCall } from '../lib/api';
import { XIcon, UploadIcon, SpinnerIcon, CheckIcon, AlertTriangleIcon, WhatsappIcon } from './icons';

interface OrderModalProps {
    product: Product;
    mode: 'personalizar' | 'encargar';
    isOpen: boolean;
    onClose: () => void;
    siteConfig: SiteConfig | null;
}

type ModalStatus = 'form' | 'loading' | 'success' | 'error';

interface CreatePedidoResponse {
    pedido_id: string;
    whatsapp_html: string;
    whatsapp_url: string;
    mode: 'auto_open' | 'button';
}

interface UploadConfigData {
    max_file_size: number;
    allowed_mimes: string[];
    nonce: string;
}


export const OrderModal: React.FC<OrderModalProps> = ({ product, mode, isOpen, onClose, siteConfig }) => {
    const [status, setStatus] = useState<ModalStatus>('form');
    const [loadingMessage, setLoadingMessage] = useState('Enviando solicitud...');
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        details: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageSelection, setImageSelection] = useState({
        preview: '',
        name: '',
        error: '',
    });
    const [uploadConfig, setUploadConfig] = useState<UploadConfigData | null>(null);
    const [isConfigLoading, setIsConfigLoading] = useState(true);

    const [pedidoData, setPedidoData] = useState<CreatePedidoResponse | null>(null);
    const [error, setError] = useState<string>('');

    const resetState = useCallback(() => {
        setStatus('form');
        setLoadingMessage('Enviando solicitud...');
        setFormData({ customer_name: '', customer_email: '', customer_phone: '', details: '' });
        setImageFile(null);
        setImageSelection({ preview: '', name: '', error: '' });
        setPedidoData(null);
        setError('');
        setUploadConfig(null);
        setIsConfigLoading(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            resetState();
            document.body.style.overflow = 'hidden';

            const fetchUploadConfig = async () => {
                if (mode !== 'personalizar') {
                    setIsConfigLoading(false);
                    return;
                }
                
                setIsConfigLoading(true);
                setError('');
                try {
                    const response: { success: boolean; data: UploadConfigData } = await apiCall('/rrm/v1/upload-config', {}, false);
                    if (response.success && response.data) {
                        setUploadConfig(response.data);
                    } else {
                        throw new Error('No se pudo cargar la configuración para subir archivos.');
                    }
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Error desconocido.';
                    setError(`Error de configuración: ${errorMessage} No se pueden subir imágenes.`);
                    setUploadConfig(null);
                } finally {
                    setIsConfigLoading(false);
                }
            };

            fetchUploadConfig();

        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, mode, resetState]);

    useEffect(() => {
        if (status === 'success' && pedidoData?.mode === 'auto_open' && pedidoData?.whatsapp_url) {
            const timer = setTimeout(() => {
                window.open(pedidoData.whatsapp_url, '_blank', 'noopener,noreferrer');
            }, 1500);
            
            return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
        }
    }, [status, pedidoData]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file) {
            setImageFile(null);
            setImageSelection({ preview: '', name: '', error: '' });
            return;
        }

        if (!uploadConfig) {
             setImageSelection({ preview: '', name: '', error: 'La configuración de subida no está disponible.' });
             return;
        }

        if (file.size > uploadConfig.max_file_size) {
            const maxSizeMB = (uploadConfig.max_file_size / 1024 / 1024).toFixed(1);
            setImageSelection({ preview: '', name: '', error: `El archivo es muy grande (máx ${maxSizeMB}MB).` });
            e.target.value = '';
            return;
        }
        
        if (!uploadConfig.allowed_mimes.includes(file.type)) {
            setImageSelection({ preview: '', name: '', error: 'Tipo de archivo no válido.' });
            e.target.value = '';
            return;
        }
        
        setImageFile(file);
        setImageSelection({
            preview: URL.createObjectURL(file),
            name: file.name,
            error: '',
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatus('loading');

        try {
            let referenceImageUrl: string | null = null;

            if (mode === 'personalizar' && imageFile) {
                if (!uploadConfig || !uploadConfig.nonce) {
                    throw new Error('No se pudo obtener la autorización para subir la imagen.');
                }
                
                setLoadingMessage('Subiendo imagen de referencia...');
                const mediaFormData = new FormData();
                mediaFormData.append('image', imageFile, imageFile.name);
                mediaFormData.append('nonce', uploadConfig.nonce);

                const mediaResponse: any = await apiCall(
                    '/rrm/v1/upload-image',
                    { method: 'POST', body: mediaFormData },
                    false
                );
                
                let imageUrl: string | undefined;
                if (typeof mediaResponse === 'string') {
                    imageUrl = mediaResponse;
                } else if (mediaResponse?.url) {
                    imageUrl = mediaResponse.url;
                } else if (mediaResponse?.success && mediaResponse?.data?.url) {
                    imageUrl = mediaResponse.data.url;
                }

                if (!imageUrl) {
                    throw new Error('La imagen de referencia no pudo ser subida. El servidor no devolvió una URL válida.');
                }
                referenceImageUrl = imageUrl;
            }

            setLoadingMessage('Registrando tu pedido...');
            
            const submissionPayload: { [key: string]: any } = {
                product_id: String(product.id),
                request_type: mode === 'personalizar' ? 'Personalizar' : 'Encargar',
                product_name: product.name,
                customer_name: formData.customer_name,
                customer_email: formData.customer_email,
                customer_phone: formData.customer_phone,
            };

            if (mode === 'personalizar') {
                submissionPayload.details = formData.details;
                if (referenceImageUrl) {
                    submissionPayload.image_url = referenceImageUrl;
                }
            }
            
            const createResponse: { success: boolean, data?: CreatePedidoResponse, message?: string } = await apiCall(
                `/rrm/v1/pedidos`, 
                {
                    method: 'POST',
                    body: JSON.stringify(submissionPayload),
                }, 
                false
            );

            if (createResponse.success && createResponse.data) {
                setPedidoData(createResponse.data);
                setStatus('success');
            } else {
                const serverMessage = createResponse.message || 'No se pudo enviar la solicitud.';
                throw new Error(serverMessage);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
            setError(`Error: ${errorMessage}. Por favor, inténtelo de nuevo.`);
            setStatus('error');
        }
    };
    
    if (!isOpen) return null;

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                        <SpinnerIcon className="w-12 h-12 text-brand-orange" />
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{loadingMessage}</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center p-4 md:p-8">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto">
                            <CheckIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>

                        {pedidoData?.whatsapp_html && (
                            <div dangerouslySetInnerHTML={{ __html: pedidoData.whatsapp_html }} />
                        )}

                        <button onClick={onClose} className="mt-6 w-full bg-gray-200 dark:bg-gray-700 text-brand-dark dark:text-brand-light font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Cerrar
                        </button>
                    </div>
                );
             case 'error':
                return (
                    <div className="text-center p-4 md:p-8">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-2xl font-bold mt-4 text-brand-dark dark:text-brand-light">Error en la solicitud</h3>
                        <p className="mt-2 text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/30 p-3 rounded-md">{error}</p>
                        <button onClick={() => setStatus('form')} className="mt-8 w-full bg-brand-dark text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-800 transition-colors">
                            Volver al formulario
                        </button>
                    </div>
                );
            case 'form':
                const title = mode === 'personalizar' ? 'Personalizar Producto' : 'Encargar Producto';
                const inputClasses = "w-full mt-1 py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange";
                return (
                    <>
                        <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-brand-dark dark:text-brand-light">{title}</h2>
                            <button onClick={onClose} aria-label="Cerrar modal">
                                <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto">
                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <img src={product.imageUrls[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                                <div>
                                    <h3 className="font-bold text-brand-dark dark:text-brand-light">{product.name}</h3>
                                    {product.price > 0 && <p className="text-brand-orange font-semibold">${product.price.toFixed(2)}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo *</label>
                                    <input type="text" id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleInputChange} required className={inputClasses} />
                                </div>
                                <div>
                                    <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono *</label>
                                    <input type="tel" id="customer_phone" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} required className={inputClasses} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email (Opcional)</label>
                                <input type="email" id="customer_email" name="customer_email" value={formData.customer_email} onChange={handleInputChange} className={inputClasses} />
                            </div>

                            {mode === 'personalizar' && (
                                <>
                                    <div>
                                        <label htmlFor="image_upload_personalizar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen de referencia (Opcional)</label>
                                        {isConfigLoading ? (
                                            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md h-[162px]">
                                                <div className="flex flex-col items-center gap-2 text-center">
                                                    <SpinnerIcon className="h-8 w-8 text-gray-400" />
                                                    <p className="text-sm text-gray-500">Cargando...</p>
                                                </div>
                                            </div>
                                        ) : !uploadConfig ? (
                                             <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20 border-dashed rounded-md h-[162px]">
                                                <div className="flex flex-col items-center gap-2 text-center">
                                                    <AlertTriangleIcon className="h-8 w-8 text-red-400" />
                                                    <p className="text-sm text-red-600 dark:text-red-300">Error al cargar la configuración de subida.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                                <div className="space-y-1 text-center">
                                                    {imageSelection.preview ? (
                                                        <img src={imageSelection.preview} alt="Vista previa" className="mx-auto h-24 w-auto rounded-md" />
                                                    ) : (
                                                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    )}
                                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                        <label htmlFor="image_upload_personalizar" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-brand-orange hover:text-orange-600 focus-within:outline-none">
                                                            <span>Sube un archivo</span>
                                                            <input id="image_upload_personalizar" name="image_upload" type="file" className="sr-only" onChange={handleFileChange} accept={uploadConfig.allowed_mimes.join(',')} />
                                                        </label>
                                                        <p className="pl-1">o arrastra y suelta</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Archivos permitidos hasta {(uploadConfig.max_file_size / 1024 / 1024).toFixed(1)}MB</p>
                                                </div>
                                            </div>
                                        )}
                                        {imageSelection.name && <div className="mt-2 text-sm text-green-600 dark:text-green-400 text-center">Archivo: {imageSelection.name}</div>}
                                        {imageSelection.error && <div className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{imageSelection.error}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detalles de personalización *</label>
                                        <textarea id="details" name="details" rows={4} value={formData.details} onChange={handleInputChange} required className={inputClasses} placeholder="Describe cómo quieres personalizar el producto..."></textarea>
                                    </div>
                                </>
                            )}
                            
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-lg flex items-start gap-3 text-sm">
                                <WhatsappIcon className="w-8 h-8 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                <span>Después de enviar tu solicitud, se te dirigirá a <strong>WHATSAPP</strong> para finalizar los detalles con nuestro comercial.</span>
                            </div>

                             {error && <p className="text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
                             
                            <div className="pt-4 flex items-center gap-4">
                                <button type="button" onClick={onClose} className="w-full bg-transparent border-2 border-gray-300 dark:border-gray-600 text-brand-dark dark:text-brand-light font-bold py-3 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" className="w-full bg-brand-orange text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center">
                                    Enviar solicitud
                                </button>
                            </div>
                        </form>
                    </>
                );
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
                {renderContent()}
            </div>
        </div>
    );
};