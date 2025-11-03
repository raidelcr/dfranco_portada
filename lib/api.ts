/**
 * Este módulo centraliza las llamadas a la API de WordPress,
 * incorporando manejo de nonces para seguridad, un sistema de caché
 * para mejorar el rendimiento, y un manejo de errores robusto.
 */

// Define la forma del objeto de configuración global que se espera en window
declare global {
    interface Window {
        RRM_API_CONFIG?: {
            baseUrl: string;
            nonce: string;
        };
    }
}

// Caché en memoria para almacenar las respuestas de la API.
const cache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

/**
 * Obtiene la configuración de la API desde el objeto global `window` en tiempo de ejecución.
 * Esto asegura que se capturen los valores correctos incluso si el script que los define
 * se carga de forma asíncrona.
 * @returns Un objeto con la baseUrl y el nonce de la API.
 */
const getApiConfig = () => {
    const defaultConfig = {
        baseUrl: 'https://dfrancomobiliariocuba.com/wp-json',
        nonce: ''
    };

    if (typeof window !== 'undefined' && window.RRM_API_CONFIG) {
        return {
            baseUrl: window.RRM_API_CONFIG.baseUrl || defaultConfig.baseUrl,
            nonce: window.RRM_API_CONFIG.nonce || defaultConfig.nonce,
        };
    }
    
    // Si RRM_API_CONFIG no está disponible, se usan los valores por defecto.
    // Esto podría pasar en desarrollo o si hay un error de carga.
    console.warn('Advertencia: No se encontró la configuración de RRM_API_CONFIG. Usando valores por defecto.');
    return defaultConfig;
};

/**
 * Realiza una llamada a un endpoint de la API.
 * @param endpoint El endpoint de la API al que llamar (ej. '/rrm/v1/catalogo/list') o una URL completa.
 * @param options Opciones adicionales para la solicitud fetch.
 * @param useCache Si es true, intentará devolver datos de la caché antes de hacer una nueva solicitud.
 * @param expectedResponseType El tipo de respuesta esperado ('json' o 'text'). Por defecto es 'json'.
 * @returns La respuesta de la API en formato JSON o texto.
 */
export async function apiCall<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    useCache = true,
    expectedResponseType: 'json' | 'text' = 'json'
): Promise<T> {
    const isGetRequest = !options.method || options.method.toUpperCase() === 'GET';
    const cacheKey = endpoint;

    // Si es una solicitud GET y se debe usar la caché, intentar devolver datos cacheados.
    // La caché solo funciona para respuestas JSON.
    if (isGetRequest && useCache && expectedResponseType === 'json') {
        const cachedItem = cache[cacheKey];
        if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_DURATION) {
            return cachedItem.data as T;
        }
    }

    const { baseUrl, nonce } = getApiConfig();
    let url: string;

    // Si el endpoint es una URL completa (como para el endpoint de medios de WP), úsala directamente.
    if (endpoint.startsWith('http')) {
        url = endpoint;
    } else {
        // Construye la URL usando el prefijo estándar /wp-json/ para permalinks "bonitos".
        url = `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    }
    
    const headers: HeadersInit = {
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (nonce) {
        headers['X-WP-Nonce'] = nonce;
    }

    const config: RequestInit = {
        ...options,
        credentials: 'omit',
        headers,
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            // Intenta leer el cuerpo del error como texto, luego intenta parsearlo como JSON.
            const errorBody = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorBody);
            } catch (e) {
                // Si no es JSON, usa el texto del cuerpo o el statusText.
                errorData = { message: errorBody || response.statusText };
            }
            throw new Error(`Error HTTP ${response.status}: ${errorData.message || 'No se pudo obtener una respuesta detallada del servidor.'}`);
        }
        
        let data;
        if (expectedResponseType === 'text') {
            data = await response.text();
        } else {
            // El tipo por defecto es 'json'
            data = await response.json();
        }

        if (isGetRequest && useCache && expectedResponseType === 'json') {
            cache[cacheKey] = { data, timestamp: Date.now() };
        }
        
        return data as T;
    } catch (error) {
        console.error(`Fallo en la llamada API a la URL: ${url}`, error);
        
        if (error instanceof Error && (error.message.includes('Failed to fetch') || error instanceof TypeError)) {
            throw new Error('Error de conexión. Por favor, verifica tu conexión a internet.');
        }

        throw error;
    }
}