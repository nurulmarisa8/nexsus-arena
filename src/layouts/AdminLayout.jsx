import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Trophy, Settings, CalendarDays,
  Bell, User, Wallet, Activity, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', to: '/admin/dashboard' },
  { icon: Users, label: 'Participants', to: '/admin/users' },
  { icon: Trophy, label: 'Tournaments', to: '/admin/tournaments' },
  { icon: Activity, label: 'Match Scoring', to: '/admin/matches' },
];

const topNav = [];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#060d1f', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: 250, flexShrink: 0, background: '#0d1f3c',
        borderRight: '1px solid #162f62', display: 'flex', flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #162f62' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#f5c518', letterSpacing: '0.05em' }}>
              NEXUS ARENA
            </span>
          </div>
        </div>

        {/* Admin Profile */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #162f62' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, background: 'linear-gradient(135deg, #162f62, #1a3a7a)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #f5c518', flexShrink: 0, overflow: 'hidden'
            }}>
              <ShieldIcon />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#e2e8f0', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                ADMINISTRATOR
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || 'SYSTEM CONTROL'}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                padding: '0.75rem 1rem',
                borderRadius: '0',
                borderLeft: isActive ? '3px solid #f5c518' : '3px solid transparent',
                backgroundColor: isActive ? 'rgba(245, 197, 24, 0.1)' : 'transparent',
                color: isActive ? '#f5c518' : '#94a3b8',
                display: 'flex', alignItems: 'center', gap: 12,
                textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600
              })}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Settings (Bottom) */}
        <div style={{ padding: '1rem', borderTop: '1px solid #162f62', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <NavLink
            to="/admin/settings"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              padding: '0.75rem 1rem',
              borderRadius: '0',
              borderLeft: isActive ? '3px solid #f5c518' : '3px solid transparent',
              backgroundColor: isActive ? 'rgba(245, 197, 24, 0.1)' : 'transparent',
              color: isActive ? '#f5c518' : '#94a3b8',
              display: 'flex', alignItems: 'center', gap: 12,
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
            })}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={logout}
            style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '0',
              borderLeft: '3px solid transparent',
              borderTop: 'none', borderRight: 'none', borderBottom: 'none',
              background: 'transparent', color: '#94a3b8',
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Nav Bar */}
        <header style={{
          height: 64, background: '#0a1628', borderBottom: '1px solid #162f62',
          display: 'flex', alignItems: 'center', padding: '0 2rem', gap: 32, flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: 24, flex: 1 }}>
            {topNav.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                style={({ isActive }) => ({
                  fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em',
                  fontFamily: 'Rajdhani, sans-serif',
                  color: isActive ? '#f5c518' : '#94a3b8',
                  textDecoration: 'none', padding: '1.25rem 0',
                  borderBottom: isActive ? '3px solid #f5c518' : '3px solid transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                  display: 'flex', alignItems: 'center', height: '100%'
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button 
              onClick={() => toast('No new notifications', { icon: '🔔', style: { background: '#0a1628', color: '#e2e8f0', border: '1px solid #162f62' } })}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6 }}
              id="admin-notif-btn"
            >
              <Bell size={18} />
            </button>
            <div 
              onClick={() => navigate('/admin/settings')}
              style={{
                width: 32, height: 32, background: 'linear-gradient(135deg, #162f62, #1a3a7a)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #112650', cursor: 'pointer'
              }}
              title="Admin Settings"
            >
              <User size={16} color="#4fc3f7" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', background: '#060d1f' }}>
          <div className="animate-fade-in" style={{ height: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function ShieldIcon({ small }) {
  const size = small ? 16 : 24;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
