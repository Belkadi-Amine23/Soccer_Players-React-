import React, { useState, useEffect } from 'react';
import { Box, Typography, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

export default function PlayerRatings() {
  const [players, setPlayers] = useState<{ id: number; name: string; rating: number; }[]>([]);

  const handleRatingChange = async (playerId, newValue) => {
    await axios.patch(`/api/players/${playerId}/rating`, { rating: newValue });
    // Mettre à jour l'état local
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notation des Joueurs
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Joueur</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map(player => (
              <TableRow key={player.id}>
                <TableCell>{player.name}</TableCell>
                <TableCell>
                  <Rating
                    value={player.rating}
                    onChange={(e, newValue) => handleRatingChange(player.id, newValue)}
                    precision={0.5}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}