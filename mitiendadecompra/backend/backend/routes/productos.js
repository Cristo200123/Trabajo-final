const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/productos  -> acepta query params: q, categoria, minPrecio, maxPrecio, envio, condicion, sort, page, limit
router.get('/', async (req, res) => {
  try {
    const { q, categoria, minPrecio, maxPrecio, envio, condicion, sort, page=1, limit=20 } = req.query;
    let params = [];
    let where = [];

    if (q) { where.push("(p.nombre LIKE ?)"); params.push('%'+q+'%'); }
    if (categoria) { where.push("c.nombre = ?"); params.push(categoria); }
    if (minPrecio) { where.push("p.precio >= ?"); params.push(minPrecio); }
    if (maxPrecio) { where.push("p.precio <= ?"); params.push(maxPrecio); }
    if (envio === 'true') { where.push("p.envio_gratis = 1"); }
    if (condicion) { where.push("p.condicion = ?"); params.push(condicion); }

    let whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';
    let orderSQL = '';
    if (sort) {
      if (sort === 'precio_asc') orderSQL = 'ORDER BY p.precio ASC';
      if (sort === 'precio_desc') orderSQL = 'ORDER BY p.precio DESC';
    }

    const offset = (page - 1) * limit;
    const sql = `
      SELECT p.*, c.nombre as categoria, v.nombre as vendedor
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN vendedores v ON p.vendedor_id = v.id
      ${whereSQL}
      ${orderSQL}
      LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre as categoria, v.nombre as vendedor, v.calificacion, v.contacto, v.ubicacion
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       LEFT JOIN vendedores v ON p.vendedor_id = v.id
       WHERE p.id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
