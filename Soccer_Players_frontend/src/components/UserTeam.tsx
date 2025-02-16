import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

export default function UserTeam() {
  interface Player {
    id: number;
    name: string;
    position: string;
  }

  const [team, setTeam] = useState<Player[]>([]);

  const handleRemovePlayer = (playerId) => {
    setTeam(team.filter(p => p.id !== playerId));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mon équipe type (11 joueurs)
      </Typography>
      
      <Grid container spacing={3}>
        {team.map(player => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{player.name}</Typography>
                <Typography>Poste: {player.position}</Typography>
                <IconButton 
                  onClick={() => handleRemovePlayer(player.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}