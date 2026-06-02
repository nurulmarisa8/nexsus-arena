import React, { useState } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Trophy, Swords, Users, Settings, LogOut,
  Gamepad2, Bell, ChevronDown, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
  { icon: Trophy, label: 'Tournaments', to: '/admin/tournaments' },
  { icon: Swords, label: 'Match Scoring', to: '/admin/matches' },
  { icon: Users, label: 'Participants', to: '/admin/participants' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-navy-900 border-r border-navy-700 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <div style={{
              width: 32, height: 32, background: 'linear-gradient(135deg, #f5c518, #d4a800)',
              borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Gamepad2 size={18} color="#060d1f" />
            </div>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f5c518', letterSpacing: '0.05em' }}>
              NEXUS ARENA
            </span>
          </div>
        </div>

        {/* Profile */}
        <div className="px-4 py-4 border-b border-navy-700">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, background: 'linear-gradient(135deg, #162f62, #1a3a7a)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #f5c518', flexShrink: 0
            }}>
              <Shield size={18} color="#f5c518" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#e2e8f0', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                {user?.username?.toUpperCase() || 'ADMIN'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#f5c518', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Command Center
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid #112650' }}>
          <button className="nav-item" onClick={handleLogout} style={{ color: '#ff5252' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{
          height: 56, background: '#0a1628', borderBottom: '1px solid #112650',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 1.5rem', gap: 16, flexShrink: 0
        }}>
          <button style={{
            background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
            padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center',
            transition: 'color 0.15s'
          }}>
            <Bell size={18} />
          </button>
          <div style={{ width: 1, height: 20, background: '#112650' }} />
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            ADMIN • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', background: '#060d1f' }}>
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
