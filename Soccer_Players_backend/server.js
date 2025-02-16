import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import playerRoutes from './routes/players.js';
import authRoutes from './routes/auth.js';
import { authMiddleware, adminMiddleware } from './middleware/auth.js';
import adminRoutes from './routes/admin.js';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());



app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, // Nécessaire pour les cookies
}));

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', authMiddleware, playerRoutes);
app.use('/api/admin', adminMiddleware, adminRoutes);

// Connexion MongoDB
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
