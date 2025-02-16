import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TableSortLabel,
  TablePagination,
  TextField,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import PlayerForm from './PlayerForm'; // Assurez-vous d'importer le composant PlayerForm
import { Link } from 'react-router-dom';

interface Player {
  id: string;
  name: string;
  age: number;
  nationality: string;
  goals: number;
}

type SortKey = 'name' | 'age' | 'nationality' | 'goals' | 'id';

interface User {
  role: string;
}

export default function SoccerPlayersTable() {
  const [data, setData] = useState<Player[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<SortKey>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Ajoutez l'état pour l'utilisateur

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/players', window.location.origin);
      url.searchParams.append('page', String(page + 1));
      url.searchParams.append('pageSize', String(rowsPerPage));
      url.searchParams.append('sort', orderBy);
      url.searchParams.append('order', order);
      url.searchParams.append('filter', filter);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch');
      
      const { players, total } = await response.json();
      setData(players);
      setTotal(total);
    } catch (err) {
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, orderBy, order, filter]);

  useEffect(() => {
    fetchPlayers();
    // Simuler la récupération de l'utilisateur connecté
    setUser({ role: 'admin' }); // Remplacez par la logique réelle pour récupérer l'utilisateur
  }, [fetchPlayers]);

  const handleRequestSort = (property: SortKey) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleDeleteSelected = async () => {
    try {
      console.log('Selected IDs:', selected); // Log des IDs sélectionnés
      const response = await fetch('/api/players', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected })
      });

      if (!response.ok) throw new Error('Delete failed');
      
      await fetchPlayers();
      setSelected([]);
    } catch (err) {
      console.error('Error deleting players:', err);
    }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // New states for form handling
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // New function to handle saving player
  const handleSavePlayer = async (playerData: any) => {
    try {
      const url = selectedPlayer 
        ? `/api/players/${selectedPlayer.id}`
        : '/api/players';
      
      const method = selectedPlayer ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: playerData
      });

      if (response.status === 200 || response.status === 201) {
        // Handle successful save
        console.log('Player saved successfully:', response.data);
        // Close the form and reset selected player
        setFormOpen(false);
        setSelectedPlayer(null);
        // Optionally, refresh the player list
        fetchPlayers();
      }
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const logout = () => {
    // Ajoutez la logique de déconnexion ici
    console.log('User logged out');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Paper sx={{
        width: '100%',
        maxWidth: '1200px',
        mb: 2,
        my: 8,
        borderRadius: '12px',
        boxShadow: 3,
        overflow: 'hidden',
      }}>
        <Box sx={{ p: 2, backgroundColor: 'gray', color: 'black' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="div">
              Soccer Players
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
  {user?.role === 'admin' && (
    <Button component={Link} to="/admin" variant="contained">
      Dashboard Admin
    </Button>
  )}
  <Button component={Link} to="/my-team" variant="contained">
    Mon équipe
  </Button>
  <Button component={Link} to="/ratings" variant="contained">
    Noter les joueurs
  </Button>
</Box>
          </Box>
        </Box>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Filter"
            value={filter}
            onChange={handleFilterChange}
            sx={{ mb: 2, borderRadius: '8px', boxShadow: 1 }}
          />
          
          <TableContainer>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={selected.length > 0 && selected.length < data.length}
                        checked={data.length > 0 && selected.length === data.length}
                        onChange={handleSelectAllClick}
                        inputProps={{ 'aria-label': 'select all players' }}
                      />
                    </TableCell>
                    {['id', 'name', 'age', 'nationality', 'goals'].map((headCell) => (
                      <TableCell key={headCell} sortDirection={orderBy === headCell ? order : false}>
                        <TableSortLabel
                          active={orderBy === headCell}
                          direction={orderBy === headCell ? order : 'asc'}
                          onClick={() => handleRequestSort(headCell as SortKey)}
                        >
                          {headCell.charAt(0).toUpperCase() + headCell.slice(1)}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    <TableCell>Actions</TableCell> {/* New column for actions */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${row.id}`;

                    return (
                      <TableRow
                        hover
                        onClick={() => handleClick(row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.id}
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.age}</TableCell>
                        <TableCell>{row.nationality}</TableCell>
                        <TableCell>{row.goals}</TableCell>
                        <TableCell>
                          {user?.role === 'admin' && (
                            <Button 
                              variant="outlined" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlayer(row);
                                setFormOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
            {user?.role === 'admin' && (
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteSelected}
                disabled={selected.length === 0 || loading}
                sx={{ width: '200px', borderRadius: '8px', marginBottom: 5 }}
              >
                Delete Selected
              </Button>
            )}
          </Box>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: '1px solid #ccc' }}
          />
        </Box>
      </Paper>
      {user?.role === 'admin' && (
        <PlayerForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          player={selectedPlayer}
          onSave={handleSavePlayer}
        />
      )}
    </Box>
  );
}