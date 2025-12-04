const express = require('express');
const app = express();
const pool = require('./db');
const productosRouter = require('./routes/productos');
const comentariosRouter = require('./routes/comentarios');
const vendedoresRouter = require('./routes/vendedores');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use('/api/productos', productosRouter);
app.use('/api/comentarios', comentariosRouter);
app.use('/api/vendedores', vendedoresRouter);

app.use(express.static('../frontend')); 

const PORT = process.env.PORT || 3306;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
