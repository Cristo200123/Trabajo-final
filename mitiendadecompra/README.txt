MiTiendaDeCompra/
│
├── index.html
├── login.html
├── registro.html
├── carrito.html
├── producto.html          (si lo agregaste)
│
├── style.css
├── app.js                
│
├── img/
│   ├── logo.png
│   ├── noimage.png
│   └── (otras imágenes)
│
├── api/                  
│   ├── config.php
│   ├── getProducts.php
│   ├── getProduct.php
│   ├── login.php
│   ├── registro.php
│   ├── createOrder.php
│   ├── addFavorite.php
│   ├── removeFavorite.php
│   ├── getFavorites.php
│   ├── addComment.php
│   ├── getComments.php
│   └── (otros endpoints)
│
├── backend/              
│   ├── package.json
│   └── server.js
│   
│       
│       
│
├── database/
│   ├── Mi Tienda de compra Base de datos.sql
│   └── backups/
│       └── (archivos de respaldo)
│
├── scripts/
│   └── operador.sh        
│
├── .gitignore
└── README.md























🛒 Mi Tienda de Compra – Proyecto Full Stack

Este proyecto es una tienda online desarrollada utilizando HTML, CSS, JavaScript, PHP, MySQL y Node.js.
El sistema permite administrar productos, gestionar usuarios, manejar un carrito de compras, y utilizar un microservicio dedicado para comentarios.

✔ Primer Sprint – Logrado

Sentencias DDL completas para creación de tablas y relaciones.

Datos reales de prueba en todas las tablas.

Proyecto versionado en GitHub con commits claros.

Estructura HTML semántica.

Diseño básico de la tienda.

Visualización de productos usando fetch + JavaScript.

Carrito de compras: agregar, eliminar, modificar cantidad.

Validación de formularios y mensajes de error.

✔ Segundo Sprint – Logrado

Conexión al motor de base de datos via PDO.

Visualización dinámica de productos desde el servidor.

Búsqueda por nombre, categoría, disponibilidad.

Filtros avanzados: precio mínimo/máximo, categoría, orden, disponibilidad.

Render dinámico actualizado con JS.

✔ Tercer Sprint – Logrado

Sistema dinámico de stock (descuenta al comprar).

Sistema de favoritos por usuario.

Microservicio de comentarios en Node.js (puerto 3001).

Página detallada de producto.

Opciones de envío configuradas dinámicamente.

✔ Sistemas Operativos

Configuración de red local.

Script del operador (operador.sh) con backup, chequeos y logs.

Servidor de base de datos en la nube (ClearDB/PlanetScale).

Despliegue continuo (CD) usando Render.

Certificados SSL proporcionados automáticamente por la plataforma.

