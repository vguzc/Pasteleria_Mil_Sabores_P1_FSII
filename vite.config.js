import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Redirección automática de URLs legacy .html hacia las rutas limpias de la SPA de React
function legacyHtmlRedirectPlugin() {
  const routeMap = {
    'contacto': '/contacto',
    'productos': '/productos',
    'nosotros': '/nosotros',
    'blogs': '/blogs',
    'carrito': '/carrito',
    'login': '/login',
    'registro': '/registro',
    'mi-cuenta': '/mi-cuenta',
    'admin-home': '/admin',
    'admin-productos': '/admin/productos',
    'admin-usuarios': '/admin/usuarios',
    'vendedor-home': '/admin',
    'detalle-producto': '/productos',
    'detalle-blog-1': '/blogs',
    'detalle-blog-2': '/blogs',
    'receta-pasteles-belem': '/blogs'
  };

  return {
    name: 'legacy-html-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] || '';
        if (url.endsWith('.html') && url !== '/index.html') {
          const fileBase = url.replace(/^\//, '').replace(/\.html$/, '');
          const target = routeMap[fileBase] || '/';
          res.writeHead(302, { Location: target });
          return res.end();
        }
        next();
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), legacyHtmlRedirectPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
