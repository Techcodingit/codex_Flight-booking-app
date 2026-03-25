import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const requiredDomain = process.env.ALLOWED_EMAIL_DOMAIN;

  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });
  if (!email.endsWith(`@${requiredDomain}`)) {
    return res.status(400).json({ error: `Use official email (@${requiredDomain})` });
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email',
      [name, email.toLowerCase(), hash]
    );
    return res.status(201).json(result.rows[0]);
  } catch {
    return res.status(409).json({ error: 'User already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;
