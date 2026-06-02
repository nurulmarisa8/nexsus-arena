import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3) e.username = 'Username minimal 3 karakter';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email tidak valid';
    if (!form.password || form.password.length < 6) e.password = 'Password minimal 6 karakter';
    if (form.password !== form.confirm) e.confirm = 'Password tidak cocok';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      toast.success('Account created! Welcome to Nexus Arena!');
      navigate('/player/dashboard');
    } catch (err) {
      setErrors({ global: err.message });
    }
  };

  const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div style={{
      minHeight: '100vh', background: '#060d1f', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      backgroundImage: 'radial-gradient(ellipse at 30% 70%, rgba(22,47,98,0.3) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f5c518, #d4a800)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gamepad2 size={20} color="#060d1f" />
          </div>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#f5c518', letterSpacing: '0.05em' }}>NEXUS ARENA</span>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>
            Create Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
            Join the tournament ecosystem
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Username</label>
              <input className={`input-field ${errors.username ? 'error' : ''}`} type="text" placeholder="ShadowStep" value={form.username} onChange={update('username')} id="reg-username" />
              {errors.username && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: 4 }}>{errors.username}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <input className={`input-field ${errors.email ? 'error' : ''}`} type="email" placeholder="you@nexusarena.gg" value={form.email} onChange={update('email')} id="reg-email" />
              {errors.email && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: 4 }}>{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className={`input-field ${errors.password ? 'error' : ''}`} type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={update('password')} id="reg-password" style={{ paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: 4 }}>{errors.password}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input className={`input-field ${errors.confirm ? 'error' : ''}`} type="password" placeholder="Repeat password" value={form.confirm} onChange={update('confirm')} id="reg-confirm" />
              {errors.confirm && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: 4 }}>{errors.confirm}</p>}
            </div>

            {errors.global && (
              <div style={{ background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: 6, padding: '0.625rem 1rem', color: '#ff5252', fontSize: '0.8rem' }}>
                ⚠ {errors.global}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} id="reg-submit">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : 'Create Account →'}
            </button>
          </form>

          <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#f5c518', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
