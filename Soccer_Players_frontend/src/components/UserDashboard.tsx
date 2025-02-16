import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mon Espace Utilisateur
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/my-team"
            fullWidth
            sx={{ p: 3 }}
          >
            Gérer mon équipe type
          </Button>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/ratings"
            fullWidth
            sx={{ p: 3 }}
          >
            Noter les joueurs
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}