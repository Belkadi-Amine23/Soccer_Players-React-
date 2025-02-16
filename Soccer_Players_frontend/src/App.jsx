import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import PlayerTable from "./components/PlayerTable";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./components/AdminDashboard";
import AdminCheck from "./components/AdminCheck";
import UserTeam from "./components/UserTeam";
import PlayerRatings from "./components/PlayerRatings";
import PlayerForm from "./components/PlayerForm";
import UserDashboard from "./components/UserDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Route Admin */}
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminCheck>
                <AdminDashboard />
              </AdminCheck>
            </PrivateRoute>
          } />

          {/* Routes Utilisateur */}
          <Route path="/my-team" element={
            <PrivateRoute>
              <UserTeam />
            </PrivateRoute>
          } />

          <Route path="/ratings" element={
            <PrivateRoute>
              <PlayerRatings />
            </PrivateRoute>
          } />

          {/* Route par défaut */}
          <Route path="/" element={
            <PrivateRoute>
              <PlayerTable />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;
