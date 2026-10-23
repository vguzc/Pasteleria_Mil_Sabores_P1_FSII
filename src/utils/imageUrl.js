/**
 * Utilidad para normalizar rutas de imágenes y asegurar compatibilidad
 * con despliegues en GitHub Pages y subdirectorios.
 */
export function getAssetUrl(path) {
  if (!path || typeof path !== 'string') {
    return 'img/torta-mil-sabores.png';
  }
  // Enlaces externos o URIs data se respetan sin modificacion
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Si la ruta inicia con barra absoluta o punto-barra, normalizar a ruta relativa de repo
  let clean = path.replace(/^\.?\/+/, '');
  return clean;
}
