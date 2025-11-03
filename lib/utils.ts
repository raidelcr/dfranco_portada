
/**
 * Precarga un array de URLs de imágenes en el caché del navegador.
 * Crea un objeto Image para cada URL, lo que provoca que el navegador
 * solicite y almacene en caché la imagen para futuras peticiones.
 * @param urls Un array de strings con las URLs de las imágenes a precargar.
 */
export const preloadImages = (urls: string[]): void => {
    // Usamos un Set para asegurarnos de que no procesamos la misma URL dos veces.
    const uniqueUrls = new Set(urls);

    uniqueUrls.forEach((url) => {
        if (url) {
            const img = new Image();
            img.src = url;
        }
    });
};
