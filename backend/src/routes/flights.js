import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/airports', requireAuth, async (_, res) => {
  const result = await pool.query('SELECT * FROM airports ORDER BY city');
  res.json(result.rows);
});

router.get('/search', requireAuth, async (req, res) => {
  const { from, to, date } = req.query;
  const baseFare = 4800;
  const mock = [0, 1, 2].map((i) => ({
    id: `${from}-${to}-${i + 1}`,
    airline: i % 2 === 0 ? 'IndiGo' : 'Air India',
    flightNo: `6E${700 + i}`,
    departTime: `${9 + i}:30`,
    arriveTime: `${11 + i}:45`,
    from,
    to,
    date,
    fare: baseFare + i * 1300
  }));
  res.json(mock);
});

export default router;
