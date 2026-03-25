import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import flightRoutes from './routes/flights.js';
import bookingRoutes from './routes/bookings.js';
import nomineeRoutes from './routes/nominees.js';
import supportRoutes from './routes/support.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/nominees', nomineeRoutes);
app.use('/api/support', supportRoutes);

const port = process.env.PORT || 5000;

initDb()
  .then(() => app.listen(port, () => console.log(`API listening on ${port}`)))
  .catch((err) => {
    console.error('Failed to initialize database', err);
    process.exit(1);
  });
