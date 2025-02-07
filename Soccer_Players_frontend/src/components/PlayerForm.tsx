import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

interface Player {
  id: string;
  name: string;
  age: number;
  nationality: string;
  goals: number;
}

interface PlayerFormProps {
  open: boolean;
  onClose: () => void;
  player?: Player | null; // Accepter Player ou null
  onSave: (player: any) => void;
}

export default function PlayerForm({ open, onClose, player, onSave }: PlayerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    nationality: '',
    goals: ''
  });

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        age: player.age.toString(),
        nationality: player.nationality,
        goals: player.goals.toString()
      });
    } else {
      setFormData({
        name: '',
        age: '',
        nationality: '',
        goals: ''
      });
    }
  }, [player]);

  const handleSubmit = () => {
    const newPlayer = {
      ...formData,
      age: Number(formData.age),
      goals: Number(formData.goals)
    };
    onSave(newPlayer);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{player ? 'Edit Player' : 'Add New Player'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Nationality"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Goals"
            type="number"
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}