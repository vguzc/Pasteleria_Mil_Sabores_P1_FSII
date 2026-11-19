/**
 * PASTELERÍA MIL SABORES — src/services/api.js
 * Cliente HTTP REST para comunicación con el Backend Spring Boot y JWT.
 * Evaluación Parcial N° 3 (DSY1104 - Duoc UC)
 */

const API_BASE_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'mil_sabores_jwt_token';

export const tokenStorage = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.warn('Error guardando token JWT', e);
    }
  },
  remove: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.warn('Error eliminando token JWT', e);
    }
  }
};

/**
 * Función base para peticiones HTTP con inyección automática de Bearer Token
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  const token = tokenStorage.get();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    // Si no está autorizado y tenemos token, podría haber expirado
    if (response.status === 401 && token) {
      console.warn('Token JWT expirado o inválido. Cerrando sesión...');
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMsg = (data && data.mensaje) || (typeof data === 'string' ? data : `Error HTTP ${response.status}`);
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`[API ERROR] ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// SERVICIOS DE AUTENTICACIÓN (JWT)
// -------------------------------------------------------------
export const authApi = {
  async login(correo, clave) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, clave })
    });
    if (data.token) {
      tokenStorage.set(data.token);
    }
    return data;
  },

  async registro(usuarioData) {
    const data = await request('/auth/registro', {
      method: 'POST',
      body: JSON.stringify(usuarioData)
    });
    if (data.token) {
      tokenStorage.set(data.token);
    }
    return data;
  },

  async me() {
    return await request('/auth/me');
  },

  logout() {
    tokenStorage.remove();
  }
};

// -------------------------------------------------------------
// SERVICIOS DE PRODUCTOS (CRUD)
// -------------------------------------------------------------
export const productosApi = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.categoria) query.append('categoria', params.categoria);
    if (params.destacados) query.append('destacados', 'true');
    if (params.ofertas) query.append('ofertas', 'true');
    if (params.q) query.append('q', params.q);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return await request(`/productos${qs}`);
  },

  async getById(id) {
    return await request(`/productos/${id}`);
  },

  async create(productoData) {
    return await request('/productos', {
      method: 'POST',
      body: JSON.stringify(productoData)
    });
  },

  async update(id, productoData) {
    return await request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productoData)
    });
  },

  async delete(id) {
    return await request(`/productos/${id}`, {
      method: 'DELETE'
    });
  }
};

// -------------------------------------------------------------
// SERVICIOS DE CATEGORÍAS (CRUD)
// -------------------------------------------------------------
export const categoriasApi = {
  async getAll() {
    return await request('/categorias');
  },

  async getById(id) {
    return await request(`/categorias/${id}`);
  },

  async create(categoriaData) {
    return await request('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoriaData)
    });
  },

  async update(id, categoriaData) {
    return await request(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoriaData)
    });
  },

  async delete(id) {
    return await request(`/categorias/${id}`, {
      method: 'DELETE'
    });
  }
};

// -------------------------------------------------------------
// SERVICIOS DE ÓRDENES Y VENTAS
// -------------------------------------------------------------
export const ordenesApi = {
  async create(ordenData) {
    return await request('/ordenes', {
      method: 'POST',
      body: JSON.stringify(ordenData)
    });
  },

  async getAll() {
    return await request('/ordenes');
  },

  async getById(id) {
    return await request(`/ordenes/${id}`);
  }
};

// -------------------------------------------------------------
// SERVICIOS DE USUARIOS (ADMINISTRACIÓN)
// -------------------------------------------------------------
export const usuariosApi = {
  async getAll() {
    return await request('/usuarios');
  },

  async getById(id) {
    return await request(`/usuarios/${id}`);
  },

  async update(id, usuarioData) {
    return await request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuarioData)
    });
  },

  async delete(id) {
    return await request(`/usuarios/${id}`, {
      method: 'DELETE'
    });
  }
};

export default {
  auth: authApi,
  productos: productosApi,
  categorias: categoriasApi,
  ordenes: ordenesApi,
  usuarios: usuariosApi,
  tokenStorage
};
