import express from 'express';
import Player from '../models/Player.js';

const router = express.Router();

// Récupérer les joueurs avec pagination et tri
router.get('/', async (req, res) => {
  const { page = 1, pageSize = 5, sort = 'id', order = 'asc', filter = '' } = req.query;
  
  try {
    const query = {};
    if(filter) {
      query.$or = [
        { name: { $regex: filter, $options: 'i' } },
        { nationality: { $regex: filter, $options: 'i' } }
      ];
    }

    const [players, total] = await Promise.all([
      Player.find(query)
        .sort({ [sort]: order === 'asc' ? 1 : -1 })
        .skip((page - 1) * pageSize)
        .limit(Number(pageSize)),
      Player.countDocuments(query)
    ]);

    res.json({
      players: players.map(p => ({
        id: p.id,
        name: p.name,
        age: p.age,
        nationality: p.nationality,
        goals: p.goals
      })),
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer des joueurs
router.delete('/', async (req, res) => {
  try {
    await Player.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ message: 'Players deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;