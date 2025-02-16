import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import Player from '../models/Player.js';
import User from '../models/User.js';

const router = express.Router();

// Statistiques Admin
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const playersStats = await Player.aggregate([
      {
        $group: {
          _id: null,
          totalPlayers: { $sum: 1 },
          averageAge: { $avg: "$age" },
          totalGoals: { $sum: "$goals" }
        }
      }
    ]);

    const usersStats = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    res.json({
      players: playersStats[0],
      users: usersStats
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;