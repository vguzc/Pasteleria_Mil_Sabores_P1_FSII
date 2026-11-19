import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_USERS } = await import('../src/services/db.js');

  let sql = `-- ========================================================
-- BASE DE DATOS: pasteleria_mil_sabores_db
-- Asignatura: DSY1104 - Desarrollo Fullstack II (Duoc UC)
-- Evaluacion Parcial N 3
-- Motor: MySQL (XAMPP / MariaDB)
-- ========================================================

CREATE DATABASE IF NOT EXISTS pasteleria_mil_sabores_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pasteleria_mil_sabores_db;

-- 1. Limpieza de tablas
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS detalle_ordenes;
DROP TABLE IF EXISTS ordenes;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Tabla de Roles
CREATE TABLE roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO roles (id, nombre) VALUES
(1, 'ROLE_ADMINISTRADOR'),
(2, 'ROLE_VENDEDOR'),
(3, 'ROLE_CLIENTE');

-- 3. Tabla de Usuarios
-- Contraseñas con hash BCrypt:
-- 'admin123'  -> $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
-- 'venta123'  -> $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a
-- 'clave123'  -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
CREATE TABLE usuarios (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100),
  correo VARCHAR(150) NOT NULL UNIQUE,
  clave VARCHAR(255) NOT NULL,
  rol_id BIGINT NOT NULL,
  rut VARCHAR(20),
  fecha_nacimiento VARCHAR(20),
  telefono VARCHAR(30),
  direccion VARCHAR(255),
  departamento VARCHAR(50),
  region VARCHAR(100),
  comuna VARCHAR(100),
  indicaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO usuarios (id, codigo, nombre, apellidos, correo, clave, rol_id, rut, fecha_nacimiento, direccion, departamento, region, comuna, indicaciones) VALUES
(1, 'USR001', 'Administrador', 'Duoc UC', 'admin@duoc.cl', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 1, '12.345.678-5', '1985-05-15', 'Av. Providencia 1200', 'Oficina 402', 'Región Metropolitana de Santiago', 'Providencia', NULL),
(2, 'USR002', 'Carlos', 'Vendedor Mil Sabores', 'vendedor@milsabores.cl', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 2, '15.678.901-2', '1990-08-20', 'Apoquindo 4500', 'Local 12', 'Región Metropolitana de Santiago', 'Las Condes', NULL),
(3, 'USR003', 'Pedro', 'Hacker', 'pedro.hacker20@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '19.456.789-K', '1998-11-04', 'Los Crisantemos, Edificio Norte', 'Depto 603', 'Región Metropolitana de Santiago', 'Cerrillos', 'El martes no estaremos en el depto, pero puede dejárselo con el conserje.'),
(4, 'USR004', 'Camila', 'González', 'prueba1@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '18.123.456-7', '1970-02-14', 'Los Leones 890', 'Depto 304', 'Región Metropolitana de Santiago', 'Providencia', 'Dejar en conserjería si no atiendo el timbre.');

-- 4. Tabla de Categorias
CREATE TABLE categorias (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255)
) ENGINE=InnoDB;

`;

  const catMap = {};
  INITIAL_CATEGORIES.forEach((c, idx) => {
    catMap[c.nombre] = idx + 1;
    const desc = (c.descripcion || '').replace(/'/g, "''");
    const nombre = c.nombre.replace(/'/g, "''");
    sql += `INSERT INTO categorias (id, codigo, nombre, descripcion, imagen) VALUES (${idx + 1}, '${c.id}', '${nombre}', '${desc}', '${c.imagen}');\n`;
  });

  sql += `\n-- 5. Tabla de Productos\nCREATE TABLE productos (\n  id BIGINT AUTO_INCREMENT PRIMARY KEY,\n  codigo VARCHAR(20) UNIQUE,\n  nombre VARCHAR(150) NOT NULL,\n  descripcion TEXT,\n  precio INT NOT NULL,\n  precio_anterior INT,\n  stock INT NOT NULL DEFAULT 10,\n  categoria_id BIGINT NOT NULL,\n  imagen VARCHAR(255),\n  destacado BOOLEAN DEFAULT FALSE,\n  en_oferta BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON UPDATE CASCADE\n) ENGINE=InnoDB;\n\n`;

  INITIAL_PRODUCTS.forEach((p, idx) => {
    const catId = catMap[p.categoria] || 1;
    const desc = (p.descripcion || '').replace(/'/g, "''");
    const nombre = p.nombre.replace(/'/g, "''");
    const precioAnt = p.precioAnterior !== undefined && p.precioAnterior !== null ? p.precioAnterior : 'NULL';
    const dest = p.destacado ? 1 : 0;
    const oferta = p.enOferta ? 1 : 0;
    sql += `INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (${idx + 1}, '${p.id}', '${nombre}', '${desc}', ${p.precio}, ${precioAnt}, ${p.stock}, ${catId}, '${p.imagen}', ${dest}, ${oferta});\n`;
  });

  sql += `\n-- 6. Tabla de Ordenes de Compra\nCREATE TABLE ordenes (\n  id BIGINT AUTO_INCREMENT PRIMARY KEY,\n  numero_orden VARCHAR(50) NOT NULL UNIQUE,\n  usuario_id BIGINT NOT NULL,\n  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,\n  subtotal INT NOT NULL,\n  descuento INT DEFAULT 0,\n  iva INT NOT NULL,\n  envio INT DEFAULT 0,\n  total INT NOT NULL,\n  estado VARCHAR(50) DEFAULT 'Pagada',\n  metodo_pago VARCHAR(50),\n  metodo_entrega VARCHAR(50),\n  direccion_despacho VARCHAR(255),\n  comuna_despacho VARCHAR(100),\n  sucursal_retiro VARCHAR(100),\n  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE\n) ENGINE=InnoDB;\n\n-- 7. Tabla de Detalle de Ordenes\nCREATE TABLE detalle_ordenes (\n  id BIGINT AUTO_INCREMENT PRIMARY KEY,\n  orden_id BIGINT NOT NULL,\n  producto_id BIGINT NOT NULL,\n  nombre_producto VARCHAR(150) NOT NULL,\n  precio_unitario INT NOT NULL,\n  cantidad INT NOT NULL,\n  subtotal INT NOT NULL,\n  FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,\n  FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE\n) ENGINE=InnoDB;\n`;

  const outDir = path.resolve(__dirname, '../database');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, 'pasteleria_mil_sabores.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log('Script SQL generado con exito en:', outPath);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
