import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Trophy, Swords, BarChart3,
  Settings, LogOut, Gamepad2, Bell, Monitor, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/player/dashboard' },
  { icon: Users, label: 'Team Hub', to: '/player/team' },
  { icon: Trophy, label: 'Brackets', to: '/player/brackets' },
  { icon: Monitor, label: 'Live Matches', to: '/player/live' },
  { icon: Settings, label: 'Settings', to: '/player/settings' },
];

const topNav = [
  { label: 'Tournaments', to: '/player/tournaments' },
  { label: 'Live Matches', to: '/player/live' },
  { label: 'Pro Rankings', to: '/player/brackets' },
];

export default function PlayerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#060d1f', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, background: '#0a1628',
        borderRight: '1px solid #112650', display: 'flex', flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1.25rem', borderBottom: '1px solid #112650' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

        {/* Player Profile */}
        <div style={{ padding: '1rem 1rem', borderBottom: '1px solid #112650' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, background: 'linear-gradient(135deg, #162f62, #1a3a7a)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #162f62', flexShrink: 0
            }}>
              <User size={18} color="#4fc3f7" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#e2e8f0', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                PLAYER PROFILE
              </div>
              <div style={{ fontSize: '0.65rem', color: '#4fc3f7', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.division || 'VANGUARD DIVISION'}
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
        {/* Top Nav Bar */}
        <header style={{
          height: 56, background: '#0a1628', borderBottom: '1px solid #112650',
          display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: 32, flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: 8, flex: 1 }}>
            {topNav.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em',
                  textTransform: 'uppercase', fontFamily: 'Rajdhani, sans-serif',
                  color: isActive ? '#f5c518' : '#94a3b8',
                  textDecoration: 'none', padding: '4px 12px', borderRadius: 6,
                  borderBottom: isActive ? '2px solid #f5c518' : '2px solid transparent',
                  transition: 'color 0.15s',
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6, borderRadius: 6 }}>
              <Bell size={18} />
            </button>
            <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6, borderRadius: 6 }}>
              <Monitor size={18} />
            </button>
            <div style={{
              width: 32, height: 32, background: 'linear-gradient(135deg, #162f62, #1a3a7a)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #f5c518', cursor: 'pointer'
            }}>
              <User size={16} color="#f5c518" />
            </div>
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
