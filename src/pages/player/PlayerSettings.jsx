import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function PlayerSettings() {
  const { user, updateUser } = useAuth();
  
  // Local state for the form, initialized from the context
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
  });

  const [notifs, setNotifs] = useState({
    tournamentStarts: true,
    newChallenge: true,
    liveMatchAlerts: false,
    walletTransactions: true,
    promoOffers: false,
  });

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setForm({
        username: user.name || '',
        displayName: user.displayName || user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      });
      if (user.settings?.notifs) {
        setNotifs(user.settings.notifs);
      }
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.username,
        email: form.email,
      };
      if (form.newPassword) {
        if (form.newPassword.length < 6) {
          toast.error('Password minimal 6 karakter');
          return;
        }
        payload.password = form.newPassword;
      }
      const res = await authAPI.updateProfile(payload);
      
      // Update local context
      updateUser({ 
        ...form, 
        name: res.data.name, 
        email: res.data.email,
        settings: { notifs } 
      });
      toast.success('Profile updated successfully!');
      setForm(p => ({ ...p, newPassword: '' }));
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleDiscard = () => {
    if (user) {
      setForm({
        username: user.name || '',
        displayName: user.displayName || user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      });
      if (user.settings?.notifs) {
        setNotifs(user.settings.notifs);
      }
    }
    toast.error('Changes discarded');
  };

  const toggleNotif = (key) => {
    setNotifs(p => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#f5c518', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'Rajdhani, sans-serif' }}>
            COMMAND CENTER / PROFILE
          </div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1 }}>
            USER SETTINGS
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={handleDiscard} style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem', borderRadius: 0, borderColor: '#162f62', color: '#94a3b8' }}>
            DISCARD
          </button>
          <button className="btn-primary" onClick={handleSave} style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem', borderRadius: 0 }}>
            SAVE CHANGES
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start', maxWidth: 800 }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Account Information */}
          <div style={{ border: '2px solid #4fc3f7', padding: '0.5rem', background: '#0a1628' }}>
            <div style={{ border: '1px dashed #4fc3f7', padding: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'Rajdhani, sans-serif' }}>
                <User size={20} color="#f5c518" />
                Account Information
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ borderBottom: '1px dashed #162f62', paddingBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>GAMERTAG</label>
                    <input 
                      type="text" 
                      value={form.username}
                      onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                      style={{ width: '100%', background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.75rem 1rem', fontSize: '0.85rem' }} 
                    />
                  </div>
                  <div style={{ borderBottom: '1px dashed #162f62', paddingBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>DISPLAY NAME</label>
                    <input 
                      type="text" 
                      value={form.displayName}
                      onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
                      style={{ width: '100%', background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.75rem 1rem', fontSize: '0.85rem' }} 
                    />
                  </div>
                </div>

                <div style={{ borderBottom: '1px dashed #162f62', paddingBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>PRIMARY EMAIL</label>
                  <input 
                    type="email" 
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    style={{ width: '100%', background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.75rem 1rem', fontSize: '0.85rem' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>BIO / DESCRIPTION</label>
                  <textarea 
                    rows={3} 
                    value={form.bio}
                    onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    style={{ width: '100%', background: '#060d1f', border: '1px solid #162f62', color: '#94a3b8', padding: '0.75rem 1rem', fontSize: '0.85rem', resize: 'none', lineHeight: 1.6 }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '2rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'Rajdhani, sans-serif' }}>
              <Shield size={20} color="#f5c518" />
              Security & Access
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#060d1f', border: '1px solid #112650', padding: '1.25rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Update Password</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Change your password here. Leave blank to keep current password.</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>CURRENT PASSWORD</label>
                    <input 
                      type="password" 
                      value={form.currentPassword}
                      onChange={e => setForm(p => ({ ...p, currentPassword: e.target.value }))}
                      style={{ width: '100%', background: '#0a1628', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.75rem 1rem', fontSize: '0.85rem' }} 
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>NEW PASSWORD</label>
                    <input 
                      type="password" 
                      value={form.newPassword}
                      onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
                      style={{ width: '100%', background: '#0a1628', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.75rem 1rem', fontSize: '0.85rem' }} 
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>



      </div>
    </div>
  );
}
