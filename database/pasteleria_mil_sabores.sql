-- ========================================================
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

INSERT INTO categorias (id, codigo, nombre, descripcion, imagen) VALUES (1, 'cat-1', 'Tortas Cuadradas', 'Formatos clásicos familiares para compartir y celebrar', 'img/torta-tres-leches-cuadrada.png');
INSERT INTO categorias (id, codigo, nombre, descripcion, imagen) VALUES (2, 'cat-2', 'Tortas Circulares', 'Redondas tradicionales, decoradas con esmero artesanal', 'img/torta-amor-lucuma.png');
INSERT INTO categorias (id, codigo, nombre, descripcion, imagen) VALUES (3, 'cat-3', 'Postres Individuales', 'Porciones justas para el antojo dulce del día', 'img/pie-de-limon.png');
INSERT INTO categorias (id, codigo, nombre, descripcion, imagen) VALUES (4, 'cat-4', 'Productos Sin Azúcar', 'Endulzados con alulosa natural, ideales para cuidarse', 'img/torta-chocolate-sin-azucar.png');
INSERT INTO categorias (id, codigo, nombre, descripcion, imagen) VALUES (5, 'cat-5', 'Pastelería Tradicional', 'Chilenitos, empolvados, alfajores y strudel de receta centenaria', 'img/alfajores-hojarasca.png');
INSERT INTO categorias (id, codigo, nombre, descripcion, imagen) VALUES (6, 'cat-6', 'Productos Sin Gluten', '100% libres de gluten con certificación y sabor inigualable', 'img/cheesecake-frutos-rojos.png');
INSERT INTO categorias (id, codigo, nombre, descripcion, imagen) VALUES (7, 'cat-7', 'Productos Veganos', 'Sin ingredientes de origen animal, suaves y deliciosos', 'img/torta-vegana-trufa-cacao.png');
INSERT INTO categorias (id, codigo, nombre, descripcion, imagen) VALUES (8, 'cat-8', 'Tortas Especiales', 'Creaciones únicas para bodas, aniversarios y grandes eventos', 'img/torta-primavera.png');

-- 5. Tabla de Productos
CREATE TABLE productos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio INT NOT NULL,
  precio_anterior INT,
  stock INT NOT NULL DEFAULT 10,
  categoria_id BIGINT NOT NULL,
  imagen VARCHAR(255),
  destacado BOOLEAN DEFAULT FALSE,
  en_oferta BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (1, 'TC001', 'Torta Tres Leches Cuadrada', 'Bizcocho esponjoso remojado en combinación de tres leches, cubierto con fino merengue italiano.', 24990, 28990, 10, 1, 'img/torta-tres-leches-cuadrada.png', 1, 1);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (2, 'TC002', 'Torta Cuadrada Mil Sabores', 'La especialidad insignia de nuestro taller. Bizcocho esponjoso remojado en almíbar de ron añejo y licor de naranja con manjar casero, nueces y crema pastelera.', 28990, NULL, 10, 1, 'img/torta-mil-sabores.png', 1, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (3, 'TC003', 'Torta Amor Manjar Lúcuma Circular', 'Capas de hojarasca crujiente rellenadas con manjar artesanal, crema de lúcuma fresca y suave crema pastelera.', 26990, 31990, 8, 2, 'img/torta-amor-lucuma.png', 1, 1);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (4, 'TC004', 'Torta de Zanahoria', 'Bizcocho húmedo de zanahoria fresca con especia de canela, nueces crocantes y frosting cremoso de queso crema y vainilla.', 27490, NULL, 6, 2, 'img/torta-zanahoria.png', 0, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (5, 'PI001', 'Pie de Limón Individual', 'Base crocante de galleta mantequilla, crema suave de limón natural y copo de merengue dorado al soplete.', 3490, 4200, 25, 3, 'img/pie-de-limon.png', 0, 1);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (6, 'PI002', 'Rollito de Canela', 'Masa suave y esponjosa enrollada con canela de Ceylán, azúcar rubia y abundante glaseado suave de mantequilla.', 3490, NULL, 18, 3, 'img/rollito-canela.png', 0, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (7, 'SA001', 'Torta Chocolate Sin Azúcar', 'Bizcocho de cacao 70% endulzado con alulosa y stevia, rellenado con ganache de chocolate sin azúcar añadida.', 28990, 32990, 4, 4, 'img/torta-chocolate-sin-azucar.png', 1, 1);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (8, 'SA002', 'Pie de Limón Sin Azúcar', 'Base crocante de harina de almendras y avena, crema suave de limón natural endulzada con alulosa.', 24990, NULL, 8, 4, 'img/pie-de-limon-sin-azucar.png', 0, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (9, 'PT001', 'Pack 6 Alfajores Tradicionales', 'Deliciosos alfajores tradicionales de hojarasca fina rellenados generosamente con abundante manjar casero.', 5990, 6990, 20, 5, 'img/alfajores-hojarasca.png', 0, 1);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (10, 'PT002', 'Caja 12 Empolvados Caseros', 'Esponjosos empolvados chilenos rellenos de manjar casero suave y espolvoreados con azúcar flor finísima.', 6990, NULL, 15, 5, 'img/empolvados-caseros.png', 0, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (11, 'PT005', 'Strudel de Manzana Tradicional', 'Tradicional strudel artesanal hojaldrado relleno de manzanas horneadas, canela de Ceylán, nueces y pasas al ron.', 4990, 5990, 5, 5, 'img/strudel-manzana.png', 1, 1);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (12, 'SG001', 'Cheesecake Frutos Rojos Sin Gluten', 'Cheesecake horneado con base libre de gluten (harina de almendras) y salsa artesanal de frutos del bosque.', 27990, NULL, 5, 6, 'img/cheesecake-frutos-rojos.png', 1, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (13, 'SG002', 'Galletas Surtidas Sin Gluten', 'Variedad artesanal de galletas horneadas libres de gluten con chispas de chocolate belga y mantequilla.', 8990, NULL, 15, 6, 'img/galletas-sin-gluten.png', 0, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (14, 'PV001', 'Torta Vegana Trufa y Cacao', 'Elaborada sin ingredientes animales. Bizcocho húmedo de cacao con crema de trufa a base de leche de coco.', 29990, 34990, 3, 7, 'img/torta-vegana-trufa-cacao.png', 0, 1);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (15, 'PV002', 'Mousse Zanahoria y Naranja Vegano', 'Suave mousse 100% vegetal elaborado con leche de almendras, zanahoria y ralladura de naranja orgánica.', 4290, NULL, 12, 7, 'img/mousse-zanahoria-vegano.png', 0, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (16, 'TE001', 'Torta Especial de Primavera', 'Bizcocho ligero de vainilla y maracuyá relleno de mousseline de pistacho, frutos del bosque y flores comestibles.', 34990, NULL, 6, 8, 'img/torta-primavera.png', 1, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (17, 'TE002', 'Torta Personalizada de Bodas y Eventos', 'Diseño elegante de dos pisos para celebraciones memorables. Decorada a mano con flores comestibles.', 39990, NULL, 3, 8, 'img/torta-bodas-eventos.png', 0, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (18, 'PT003', 'Empanada de Pino Tradicional', 'Clásica empanada chilena de horno, rellena de jugoso pino de vacuno picado a cuchillo, huevo duro y aceituna.', 3290, 3790, 30, 5, 'img/empanada-pino.png', 1, 1);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (19, 'PT004', 'Empanada de Queso de Horno', 'Masa casera dorada de mantequilla, rellena con abundante queso mantecoso de fundo derretido.', 2990, NULL, 25, 5, 'img/empanada-queso.png', 0, 0);
INSERT INTO productos (id, codigo, nombre, descripcion, precio, precio_anterior, stock, categoria_id, imagen, destacado, en_oferta) VALUES (20, 'SG003', 'Empanada de Pino Sin Gluten', 'Edición artesanal libre de gluten con tradicional pino de vacuno y aceituna.', 3690, 4190, 20, 6, 'img/empanada-sin-gluten.png', 1, 1);

-- 6. Tabla de Ordenes de Compra
CREATE TABLE ordenes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  numero_orden VARCHAR(50) NOT NULL UNIQUE,
  usuario_id BIGINT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  subtotal INT NOT NULL,
  descuento INT DEFAULT 0,
  iva INT NOT NULL,
  envio INT DEFAULT 0,
  total INT NOT NULL,
  estado VARCHAR(50) DEFAULT 'Pagada',
  metodo_pago VARCHAR(50),
  metodo_entrega VARCHAR(50),
  direccion_despacho VARCHAR(255),
  comuna_despacho VARCHAR(100),
  sucursal_retiro VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 7. Tabla de Detalle de Ordenes
CREATE TABLE detalle_ordenes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  orden_id BIGINT NOT NULL,
  producto_id BIGINT NOT NULL,
  nombre_producto VARCHAR(150) NOT NULL,
  precio_unitario INT NOT NULL,
  cantidad INT NOT NULL,
  subtotal INT NOT NULL,
  FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE
) ENGINE=InnoDB;
