import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AtSign, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [savePassword, setSavePassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
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
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/player/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-bg-navy" style={{
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background decoration lines */}
      <div style={{ position: 'absolute', left: '4rem', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center', fontSize: '0.6rem', color: '#162f62', letterSpacing: '0.2em', whiteSpace: 'nowrap', fontFamily: 'Rajdhani, sans-serif' }}>
        SYSTEM STATUS : OPTIMAL
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
        
        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#f5c518', letterSpacing: '0.05em', fontStyle: 'italic', margin: 0 }}>
            NEXUS ARENA
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.25rem' }}>
            <div style={{ height: 1, width: 40, background: '#f5c518' }} />
            <span style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.15em', fontWeight: 600 }}>VANGUARD DIVISION</span>
            <div style={{ height: 1, width: 40, background: '#f5c518' }} />
          </div>
        </div>

        {/* Login Box */}
        <div className="auth-box" style={{ padding: '2.5rem', borderRadius: '4px' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
            LOGIN
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Initialize session for competitive access.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <label className="label" style={{ margin: 0, color: '#e2e8f0' }}>EMAIL ADDRESS</label>
                <span style={{ fontSize: '0.65rem', color: '#475569', letterSpacing: '0.05em', fontWeight: 600 }}>REQUIRED</span>
              </div>
              <div className="input-icon-wrapper">
                <AtSign />
                <input
                  className={`input-field ${error ? 'error' : ''}`}
                  type="email"
                  placeholder="commander@nexus.gg"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                  id="login-email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <label className="label" style={{ margin: 0, color: '#e2e8f0' }}>PASSWORD</label>
                <a href="#" style={{ fontSize: '0.65rem', color: '#f5c518', textDecoration: 'none', letterSpacing: '0.05em', fontWeight: 600 }}>RECOVER ACCESS</a>
              </div>
              <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: 16, height: 16, pointerEvents: 'none' }} />
                <input
                  className={`input-field ${error ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  id="login-password"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4,
                    zIndex: 2,
                  }}
                  id="toggle-password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Save Password Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '-0.5rem' }}>
              <input 
                type="checkbox" 
                id="save-password" 
                checked={savePassword}
                onChange={(e) => setSavePassword(e.target.checked)}
                style={{
                  accentColor: '#f5c518',
                  width: '14px',
                  height: '14px',
                  cursor: 'pointer',
                  background: '#0a1628',
                  border: '1px solid #162f62'
                }} 
              />
              <label htmlFor="save-password" style={{ fontSize: '0.75rem', color: '#64748b', cursor: 'pointer' }}>
                Save Password
              </label>
            </div>

            {error && (
              <div style={{
                background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
                borderRadius: 4, padding: '0.5rem 0.75rem', color: '#ff5252', fontSize: '0.8rem',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: '0.5rem', color: '#060d1f' }}
              id="login-submit"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'LOGIN'} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

        </div>

        {/* Footer Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0 0.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
            New recruit?{' '}
            <Link to="/register" style={{ color: '#f5c518', textDecoration: 'none', fontWeight: 600 }}>
              Register Account
            </Link>
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.65rem', color: '#475569', letterSpacing: '0.1em' }}>
            <Link to="#" style={{ color: 'inherit', textDecoration: 'none' }}>TERMS</Link>
            <Link to="#" style={{ color: 'inherit', textDecoration: 'none' }}>PRIVACY</Link>
          </div>
        </div>

        {/* Development Quick Login Options (Hidden in production mockup, but kept for usability) */}
        <div style={{ marginTop: '3rem', opacity: 0.5, borderTop: '1px solid #162f62', paddingTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => quickLogin('admin')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.7rem', cursor: 'pointer' }}>[ Demo Admin ]</button>
          <button onClick={() => quickLogin('player')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.7rem', cursor: 'pointer' }}>[ Demo Player ]</button>
        </div>

      </div>
    </div>
  );
}
