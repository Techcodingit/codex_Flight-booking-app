import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { createTicketPdf } from '../utils/pdf.js';

const router = express.Router();
router.use(requireAuth);

function pnr() {
  return `PNR${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

router.get('/', async (req, res) => {
  const result = await pool.query(
    `SELECT b.*, n.name AS nominee_name
       FROM bookings b
       LEFT JOIN nominees n ON b.nominee_id = n.id
      WHERE b.user_id=$1
      ORDER BY b.created_at DESC`,
    [req.user.id]
  );
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { nomineeId, from, to, airline, fare, travelDate } = req.body;
  const result = await pool.query(
    `INSERT INTO bookings (user_id, nominee_id, pnr, from_airport, to_airport, airline, fare, travel_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.user.id, nomineeId || null, pnr(), from, to, airline, fare, travelDate]
  );
  res.status(201).json(result.rows[0]);
});

router.get('/:id/ticket', async (req, res) => {
  const result = await pool.query(
    `SELECT b.*, n.name AS nominee_name
       FROM bookings b
       LEFT JOIN nominees n ON b.nominee_id = n.id
      WHERE b.id=$1 AND b.user_id=$2`,
    [req.params.id, req.user.id]
  );
  const booking = result.rows[0];
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const pdf = await createTicketPdf(booking);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${booking.pnr}.pdf"`);
  res.send(pdf);
});

export default router;
