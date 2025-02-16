import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: { role: string; isVerified?: boolean } | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  csrfToken: string | null;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ role: string; isVerified?: boolean } | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCsrfToken();
   
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/csrf-token', { withCredentials: true });
      setCsrfToken(data.csrfToken);
    } catch (err) {
      console.error('Échec de la récupération du jeton CSRF :', err);
    }
  };



  const login = async (accessToken: string, refreshToken: string) => {
    if (!accessToken) {
      console.error('Token is undefined');
      return;
    }
    const decoded = JSON.parse(atob(accessToken.split('.')[1]));
    setUser({ 
      role: decoded.role,
      isVerified: decoded.isVerified // Ajoutez cette ligne si disponible
    });
    // Redirection basée sur le rôle
    if (decoded.role === 'admin') {
      navigate('/admin');
    } else {
     navigate('/my-team'); // Nouvelle route pour les utilisateurs normaux
  }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true,
        headers: {
        'X-CSRF-Token': csrfToken || ''
        }
      });
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Erreur lors de la déconnexion :', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, csrfToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
