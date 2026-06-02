import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Eye, EyeOff, Loader2, Swords, Trophy, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.username}!`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/player/dashboard');
    } catch (err) {
      setError(err.message); 
    }
  };

  const quickLogin = async (type) => {
    setError('');
    try {
      const creds = type === 'admin'
        ? { email: 'admin@nexusarena.gg', password: 'admin123' }
        : { email: 'player@nexusarena.gg', password: 'player123' };
      setForm(creds);
      const user = await login(creds.email, creds.password);
      toast.success(`Welcome, ${user.username}!`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/player/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#060d1f', display: 'flex',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(22,47,98,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(245,197,24,0.05) 0%, transparent 40%)',
    }}>
      {/* Left Panel — Branding */}
      <div style={{
        flex: 1, display: 'none', flexDirection: 'column', justifyContent: 'center',
        padding: '3rem 4rem', borderRight: '1px solid #112650',
        background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 100%)',
        position: 'relative', overflow: 'hidden',
      }}
        className="lg-flex"
      >
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          backgroundImage: 'linear-gradient(rgba(79,195,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '3rem' }}>
            <div style={{
              width: 48, height: 48, background: 'linear-gradient(135deg, #f5c518, #d4a800)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(245,197,24,0.3)'
            }}>
              <Gamepad2 size={26} color="#060d1f" />
            </div>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#f5c518', letterSpacing: '0.05em' }}>
              NEXUS ARENA
            </span>
          </div>

          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2, marginBottom: '1rem' }}>
            The Ultimate<br />
            <span style={{ color: '#f5c518' }}>E-Sports</span><br />
            Battle Ground
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 340 }}>
            Manage tournaments, track matches, and compete with the best players across all regions.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
            {[
              { icon: Trophy, value: '256+', label: 'Tournaments' },
              { icon: Users, value: '8,941', label: 'Players' },
              { icon: Swords, value: '1,432', label: 'Matches' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Icon size={14} color="#f5c518" />
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#e2e8f0' }}>{value}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '2rem 2.5rem',
      }}>
        {/* Mobile logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem' }}>
          <div style={{
            width: 36, height: 36, background: 'linear-gradient(135deg, #f5c518, #d4a800)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Gamepad2 size={20} color="#060d1f" />
          </div>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#f5c518', letterSpacing: '0.05em' }}>
            NEXUS ARENA
          </span>
        </div>

        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>
          Sign In
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Access your command center
        </p>

        {/* Quick Login Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
          <button type="button" onClick={() => quickLogin('admin')} className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}>
            🛡 Demo Admin
          </button>
          <button type="button" onClick={() => quickLogin('player')} className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}>
            🎮 Demo Player
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: 1, background: '#112650' }} />
          <span style={{ fontSize: '0.7rem', color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or sign in manually</span>
          <div style={{ flex: 1, height: 1, background: '#112650' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Email or Username</label>
            <input
              className={`input-field ${error ? 'error' : ''}`}
              type="text"
              placeholder="admin@nexusarena.gg"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              id="login-email"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`input-field ${error ? 'error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                id="login-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
              borderRadius: 6, padding: '0.625rem 1rem', color: '#ff5252', fontSize: '0.8rem',
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            id="login-submit"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</> : 'Sign In →'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#f5c518', textDecoration: 'none', fontWeight: 600 }}>
            Register Now
          </Link>
        </p>

        {/* Hint */}
        <div style={{
          marginTop: '2rem', padding: '0.875rem', background: '#0d1f3c',
          border: '1px solid #112650', borderRadius: 8,
        }}>
          <p style={{ fontSize: '0.7rem', color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Demo Credentials</p>
          <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.8 }}>
            <div>Admin: <span style={{ color: '#94a3b8' }}>admin@nexusarena.gg / admin123</span></div>
            <div>Player: <span style={{ color: '#94a3b8' }}>player@nexusarena.gg / player123</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
