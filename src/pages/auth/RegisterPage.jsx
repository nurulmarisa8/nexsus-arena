import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, AtSign, Lock, Users, Shield, Gamepad2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3) e.username = 'Username minimal 3 karakter';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email tidak valid';
    if (!form.password || form.password.length < 6) e.password = 'Password minimal 6 karakter';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      // Backend currently takes username, email, password. Team registration is handled separately.
      await register({ username: form.username, email: form.email, password: form.password });
      toast.success('Account created! Welcome to Nexus Arena!');
      navigate('/player/dashboard');
    } catch (err) {
      setErrors({ global: err.message });
    }
  };

  const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="auth-bg-navy" style={{
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '0'
    }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem', borderBottom: '1px solid #112650', backgroundColor: '#060d1f', zIndex: 10 }}>
        <div style={{ fontSize: '0.65rem', color: '#475569', alignSelf: 'flex-end', letterSpacing: '0.05em' }}>
          © 2024 NEXUS ARENA GLOBAL TOURNAMENTS. ALL RIGHTS RESERVED.
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        gap: '4rem',
        flexWrap: 'wrap'
      }}>
        
        {/* Left Column - Marketing */}
        <div style={{ flex: '1 1 400px', maxWidth: 500 }}>
          <div style={{ 
            display: 'inline-block', 
            background: '#e11d48', 
            color: 'white', 
            padding: '0.35rem 0.75rem', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            letterSpacing: '0.1em',
            fontFamily: 'Rajdhani, sans-serif',
            marginBottom: '1.5rem',
            borderRadius: '2px'
          }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, background: 'white', borderRadius: '50%', marginRight: 8, verticalAlign: 'middle' }}></span>
            PRE-SEASON ENROLLMENT
          </div>

          <h1 style={{ 
            fontFamily: 'Rajdhani, sans-serif', 
            fontSize: '4.5rem', 
            fontWeight: 800, 
            lineHeight: 0.9, 
            color: '#ffffff',
            marginBottom: '1.5rem',
            textTransform: 'uppercase'
          }}>
            JOIN THE<br />
            <span style={{ color: '#f5c518' }}>NEXUS<br />ARENA</span>
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '85%' }}>
            Secure your unique pilot handle and start competing in global high-stakes E-sports tournaments.
          </p>

          <div style={{ height: 1, background: '#162f62', marginBottom: '2rem', maxWidth: '85%' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Shield color="#f5c518" size={24} />
              <span style={{ color: '#e2e8f0', fontSize: '1rem' }}>Encrypted Player Data Protection</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Gamepad2 color="#f5c518" size={24} />
              <span style={{ color: '#e2e8f0', fontSize: '1rem' }}>Instant Tournament Access</span>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div style={{ flex: '1 1 400px', maxWidth: 480 }}>
          <div className="auth-box" style={{ padding: '2.5rem', borderRadius: '4px' }}>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              
              {/* Username Field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <label className="label" style={{ margin: 0, color: '#e2e8f0' }}>USERNAME</label>
                  <span style={{ fontSize: '0.65rem', color: '#ff7675', letterSpacing: '0.05em', fontWeight: 600 }}>*REQUIRED</span>
                </div>
                <div className="input-icon-wrapper">
                  <User />
                  <input 
                    className={`input-field ${errors.username ? 'error' : ''}`} 
                    type="text" 
                    placeholder="Enter your pilot handle" 
                    value={form.username} 
                    onChange={update('username')} 
                  />
                </div>
                {errors.username && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: 4 }}>{errors.username}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="label" style={{ marginBottom: '0.375rem', color: '#e2e8f0' }}>EMAIL ADDRESS</label>
                <div className="input-icon-wrapper">
                  <AtSign />
                  <input 
                    className={`input-field ${errors.email ? 'error' : ''}`} 
                    type="email" 
                    placeholder="name@domain.com" 
                    value={form.email} 
                    onChange={update('email')} 
                  />
                </div>
                {errors.email && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: 4 }}>{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className="label" style={{ marginBottom: '0.375rem', color: '#e2e8f0' }}>PASSWORD</label>
                <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: 16, height: 16, pointerEvents: 'none' }} />
                  <input 
                    className={`input-field ${errors.password ? 'error' : ''}`} 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={update('password')} 
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} 
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4, zIndex: 2 }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: 4 }}>{errors.password}</p>}
              </div>



              {errors.global && (
                <div style={{ background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: 4, padding: '0.5rem 0.75rem', color: '#ff5252', fontSize: '0.8rem' }}>
                  {errors.global}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: '1rem', color: '#060d1f' }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'CREATE ACCOUNT'} 
                {!loading && <ChevronRight size={18} />}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Already part of the Nexus? </span>
              <Link to="/login" style={{ color: '#f5c518', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>Login instead</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Connection Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', alignSelf: 'flex-end', padding: '1.5rem 3rem' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: 4, height: 16, background: '#f5c518' }} />
          <div style={{ width: 4, height: 16, background: '#f5c518' }} />
          <div style={{ width: 4, height: 16, background: '#475569' }} />
        </div>
      </div>
    </div>
  );
}
