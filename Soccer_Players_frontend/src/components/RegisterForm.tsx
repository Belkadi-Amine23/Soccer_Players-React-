import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axios.post('/api/auth/register', { email, password });
      setSuccess("Inscription réussie !");
      
      // Connexion automatique après l'inscription
      const { data } = await axios.post('/api/auth/login', { email, password });
      login(data.accessToken, data.refreshToken);
      
      // Redirige après 2 secondes
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Inscription échouée');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 25 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Inscription</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} required />
        <TextField fullWidth label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} required />
        <TextField fullWidth label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={{ mb: 2 }} required />
        <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>S'inscrire</Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Link href="#" onClick={() => navigate('/login')}>Déjà un compte ? Connectez-vous</Link>
        </Box>
      </form>
    </Box>
  );
}
