const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/comentarios/:productoId
router.get('/:productoId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.nombre as usuario FROM comentarios c
       LEFT JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.producto_id = ? ORDER BY c.fecha DESC`, [req.params.productoId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error' });
  }
});

// POST /api/comentarios/:productoId
router.post('/:productoId', async (req, res) => {
  try {
    const { usuario_id, comentario } = req.body;
    const producto_id = req.params.productoId;
    if (!usuario_id || !comentario) return res.status(400).json({ error: 'Faltan datos' });
    const [result] = await pool.query(
      'INSERT INTO comentarios (usuario_id, producto_id, comentario) VALUES (?, ?, ?)',
      [usuario_id, producto_id, comentario]
    );
    res.json({ id: result.insertId, usuario_id, producto_id, comentario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error' });
  }
});

module.exports = router;
