import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

router.post('/', async (req, res) => {
  const { subject, message } = req.body;
  const result = await pool.query(
    'INSERT INTO support_queries (user_id, subject, message) VALUES ($1,$2,$3) RETURNING *',
    [req.user.id, subject, message]
  );
  res.status(201).json({ id: result.rows[0].id, status: 'received' });
});

export default router;
