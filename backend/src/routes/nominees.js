import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM nominees WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { name, relation } = req.body;
  const result = await pool.query(
    'INSERT INTO nominees (user_id, name, relation) VALUES ($1,$2,$3) RETURNING *',
    [req.user.id, name, relation]
  );
  res.status(201).json(result.rows[0]);
});

export default router;
