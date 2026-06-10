import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import PlayerLayout from '../layouts/PlayerLayout';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import TournamentStatus from '../pages/admin/TournamentStatus';
import MatchManagement from '../pages/admin/MatchManagement';
import ParticipantsMgmt from '../pages/admin/ParticipantsMgmt';

// Player Pages
import PlayerDashboard from '../pages/player/PlayerDashboard';
import LiveMatches from '../pages/player/LiveMatches';
import TeamHub from '../pages/player/TeamHub';
import Tournaments from '../pages/player/Tournaments';
import Brackets from '../pages/player/Brackets';

function CatchAll() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/player/dashboard'} replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes — role: admin */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/tournaments" element={<TournamentStatus />} />
          <Route path="/admin/matches" element={<MatchManagement />} />
          <Route path="/admin/participants" element={<ParticipantsMgmt />} />
        </Route>
      </Route>

      {/* Player Routes — role: player */}
      <Route element={<ProtectedRoute requiredRole="player" />}>
        <Route element={<PlayerLayout />}>
          <Route path="/player/dashboard" element={<PlayerDashboard />} />
          <Route path="/player/live" element={<LiveMatches />} />
          <Route path="/player/team" element={<TeamHub />} />
          <Route path="/player/tournaments" element={<Tournaments />} />
          <Route path="/player/brackets" element={<Brackets />} />
        </Route>
      </Route>  

      {/* Default redirects */}
      <Route path="/" element={<CatchAll />} />
      <Route path="*" element={<CatchAll />} />
    </Routes>
  );
}
