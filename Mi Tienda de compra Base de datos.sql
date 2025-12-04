CREATE DATABASE Mitiendadecompra;
USE Mitiendadecompra;

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    descripcion TEXT,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(200)
);

CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE carrito_detalle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT,
    producto_id INT,
    cantidad INT,
    FOREIGN KEY (carrito_id) REFERENCES carrito(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    UNIQUE(usuario_id, producto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE ventas_detalle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT,
    precio DECIMAL(10,2),
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

INSERT INTO categorias (nombre) VALUES
('Tecnología'),
('Hogar'),
('Deportes'),
('Ropa'),
('Accesorios'),
('Gaming'),
('Electrodomésticos'),
('Herramientas'),
('Jardín'),
('Otros');

INSERT INTO productos (nombre, precio, stock, descripcion, categoria_id) VALUES
('Mouse Gamer RGB', 1200, 15, 'Mouse óptico RGB', 1),
('Teclado Mecánico', 3500, 10, 'Teclado azul mecánico', 1),
('Silla Gamer', 25000, 5, 'Silla ergonómica', 6),
('Licuadora', 4500, 8, 'Licuadora 1.5L', 7),
('Zapatillas Running', 5800, 20, 'Para entrenamiento', 3),
('Remera Oversize', 950, 30, 'Remera algodón', 4),
('Auriculares Bluetooth', 2300, 18, 'Inalámbricos', 1),
('Taladro Percutor', 7900, 12, 'Taladro industrial', 8),
('Set Jardinería', 1600, 25, 'Kit 4 piezas', 9),
('Power Bank 20000mAh', 3100, 22, 'Cargador portátil', 1);

INSERT INTO usuarios (nombre, email, password) VALUES
('Lucas', 'lucas@example.com', '1234'),
('Ana', 'ana@example.com', '1234'),
('Martina', 'martina@example.com', '1234'),
('Jorge', 'jorge@example.com', '1234'),
('Sofía', 'sofia@example.com', '1234'),
('Gonzalo', 'gonzalo@example.com', '1234'),
('Kevin', 'kevin@example.com', '1234'),
('Lucía', 'lucia@example.com', '1234'),
('Mario', 'mario@example.com', '1234'),
('Florencia', 'flor@example.com', '1234');

INSERT INTO favoritos (usuario_id, producto_id) VALUES
(1,1),(1,2),(2,3),(3,2),(4,5),(5,7),(6,1),(7,9),(8,8),(9,4);

INSERT INTO comentarios (usuario_id, producto_id, comentario) VALUES
(1,1,'Muy buen producto'),
(2,3,'Excelente calidad'),
(3,2,'Me encantó'),
(4,5,'Muy cómodo'),
(5,7,'Sonido perfecto'),
(6,1,'Buena relación precio/calidad'),
(7,9,'Útil para el jardín'),
(8,8,'Muy potente'),
(9,4,'Buen rendimiento'),
(10,6,'La tela es suave');