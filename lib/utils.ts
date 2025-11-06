
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

/**
 * Convierte un texto a un formato 'slug' amigable para URLs.
 * Ej: "Sofá Moderno con Acentos" -> "sofa-moderno-con-acentos"
 * @param text El texto a convertir.
 * @returns El texto en formato slug.
 */
export const slugify = (text: string): string => {
  if (!text) return '';
  
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}