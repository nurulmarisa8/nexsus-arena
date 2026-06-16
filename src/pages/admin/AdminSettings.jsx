import React, { useState } from 'react';
import { Save, Shield, Bell, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    platformName: 'NEXUS ARENA',
    supportEmail: 'support@nexusarena.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [notifs, setNotifs] = useState({
    registrations: true,
    tournamentStatus: true,
    systemErrors: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setSaving(true);
    try {
      // Simulate save (in a real app, call PATCH /api/auth/me or similar)
      await new Promise(r => setTimeout(r, 600));
      toast.success('Settings saved successfully!');
      setForm(p => ({ ...p, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#060d1f', border: '1px solid #162f62',
    color: '#e2e8f0', padding: '0.7rem 1rem', fontSize: '0.85rem', outline: 'none', borderRadius: 2,
  };
  const labelStyle = {
    display: 'block', fontSize: '0.7rem', color: '#94a3b8',
    letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6,
  };
  const pwdWrapper = { position: 'relative' };
  const eyeBtn = {
    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4, zIndex: 2,
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
          Platform Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Configure global parameters and administrative preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main Settings Form */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* General Section */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f5c518', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                <Shield size={16} /> General Configuration
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Platform Name</label>
                  <input
                    style={inputStyle}
                    value={form.platformName}
                    onChange={e => setForm(p => ({ ...p, platformName: e.target.value }))}
                    id="platform-name"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Support Email</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={form.supportEmail}
                    onChange={e => setForm(p => ({ ...p, supportEmail: e.target.value }))}
                    id="support-email"
                  />
                </div>
              </div>
            </div>

            <hr style={{ borderColor: '#112650' }} />

            {/* Notification Section */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f5c518', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                <Bell size={16} /> Notifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { key: 'registrations', label: 'Email alerts for new user registrations' },
                  { key: 'tournamentStatus', label: 'Notify on tournament status changes' },
                  { key: 'systemErrors', label: 'System error reports' },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#e2e8f0', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={notifs[key]}
                      onChange={e => setNotifs(p => ({ ...p, [key]: e.target.checked }))}
                      style={{ accentColor: '#f5c518', width: 15, height: 15, cursor: 'pointer' }}
                      id={`notif-${key}`}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <hr style={{ borderColor: '#112650' }} />

            {/* Security Section */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f5c518', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                <Lock size={16} /> Security & Access
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <div style={pwdWrapper}>
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: '2.5rem' }}
                      value={form.currentPassword}
                      onChange={e => setForm(p => ({ ...p, currentPassword: e.target.value }))}
                      id="current-password"
                    />
                    <button type="button" style={eyeBtn} onClick={() => setShowCurrent(p => !p)}>
                      {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <div style={pwdWrapper}>
                    <input
                      type={showNew ? 'text' : 'password'}
                      placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: '2.5rem' }}
                      value={form.newPassword}
                      onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
                      id="new-password"
                    />
                    <button type="button" style={eyeBtn} onClick={() => setShowNew(p => !p)}>
                      {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={inputStyle}
                    value={form.confirmPassword}
                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    id="confirm-password"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                id="save-settings-btn"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} color="#64748b" /> Admin Profile
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Username:</span>
                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{user?.name || user?.username || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Email:</span>
                <span style={{ color: '#e2e8f0', fontSize: '0.75rem' }}>{user?.email || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Role:</span>
                <span style={{ color: '#f5c518', fontWeight: 600 }}>Admin</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Status:</span>
                <span style={{ color: '#69f0ae' }}>{user?.status || 'Active'}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', background: 'rgba(255,82,82,0.05)', border: '1px solid rgba(255,82,82,0.2)' }}>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#ff5252', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Danger Zone
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Actions here can cause permanent data loss. Proceed with caution.
            </p>
            <button
              className="btn-secondary"
              style={{ width: '100%', borderColor: '#ff5252', color: '#ff5252' }}
              onClick={() => toast.error('Action disabled for safety.')}
              id="purge-logs-btn"
            >
              Purge System Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
