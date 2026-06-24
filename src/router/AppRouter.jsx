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
import AdminSettings from '../pages/admin/AdminSettings';

// Player Pages
import PlayerDashboard from '../pages/player/PlayerDashboard';
import TeamHub from '../pages/player/TeamHub';
import Tournaments from '../pages/player/Tournaments';
import Brackets from '../pages/player/Brackets';
import PlayerSettings from '../pages/player/PlayerSettings';
import MatchScoring from '../pages/player/MatchScoring';
import ProRankings from '../pages/player/ProRankings';

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
          <Route path="/admin/users" element={<ParticipantsMgmt />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Player Routes — role: player */}
      <Route element={<ProtectedRoute requiredRole="player" />}>
        <Route element={<PlayerLayout />}>
          <Route path="/player/dashboard" element={<PlayerDashboard />} />
          <Route path="/player/team" element={<TeamHub />} />
          <Route path="/player/tournaments" element={<Tournaments />} />
          <Route path="/player/brackets" element={<Brackets />} />
          <Route path="/player/settings" element={<PlayerSettings />} />
          <Route path="/player/scoring" element={<MatchScoring />} />
          <Route path="/player/rankings" element={<ProRankings />} />
        </Route>
      </Route>  

      {/* Default redirects */}
      <Route path="/" element={<CatchAll />} />
      <Route path="*" element={<CatchAll />} />
    </Routes>
  );
}
