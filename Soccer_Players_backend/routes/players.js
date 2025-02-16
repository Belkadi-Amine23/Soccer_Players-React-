import express from 'express';
import Player from '../models/Player.js';
import { authMiddleware } from '../middleware/auth.js'; // Importez authMiddleware


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

// Créer un joueur (POST)
router.post('/', async (req, res) => {
  try {
    const newPlayer = await Player.create(req.body);
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un joueur (PUT)
router.put('/:id', async (req, res) => {
  try {
    const updatedPlayer = await Player.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un joueur (DELETE)
router.delete('/', async (req, res) => {
    try {
        const { ids } = req.body; // Récupérer les IDs depuis le corps de la requête

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Veuillez fournir un ou plusieurs IDs valides' });
        }

        // Supprimer les joueurs qui ont un `id` correspondant dans la liste
        const result = await Player.deleteMany({ id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Aucun joueur trouvé avec ces IDs' });
        }

        res.json({ message: `${result.deletedCount} joueur(s) supprimé(s) avec succès` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id/rating', authMiddleware, async (req, res) => {
  try {
    const player = await Player.findOneAndUpdate(
      { id: req.params.id },
      { $set: { rating: req.body.rating } },
      { new: true }
    );
    res.json(player);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;