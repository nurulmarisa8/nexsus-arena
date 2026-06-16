import React from 'react';
import { Save, Shield, Bell, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
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
                <Shield size={16} />
                General Configuration
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Platform Name</label>
                  <input className="input-field" defaultValue="NEXUS ARENA" />
                </div>
                <div>
                  <label className="label">Support Email</label>
                  <input className="input-field" defaultValue="support@nexusarena.com" type="email" />
                </div>
              </div>
            </div>

            <hr style={{ borderColor: '#112650' }} />

            {/* Notification Section */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f5c518', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                <Bell size={16} />
                Notifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#e2e8f0', fontSize: '0.85rem' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#f5c518' }} />
                  Email alerts for new user registrations
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#e2e8f0', fontSize: '0.85rem' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#f5c518' }} />
                  Notify on tournament status changes
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#e2e8f0', fontSize: '0.85rem' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#f5c518' }} />
                  System error reports
                </label>
              </div>
            </div>

            <hr style={{ borderColor: '#112650' }} />

            {/* Security Section */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f5c518', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                <Lock size={16} />
                Security & Access
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Current Password</label>
                  <input className="input-field" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input className="input-field" type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} color="#64748b" />
              Admin Profile
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Role:</span>
                <span style={{ color: '#f5c518', fontWeight: 600 }}>Super Admin</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Status:</span>
                <span style={{ color: '#69f0ae' }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Last Login:</span>
                <span>Today, 10:24 AM</span>
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
            <button className="btn-secondary" style={{ width: '100%', borderColor: '#ff5252', color: '#ff5252' }}>
              Purge System Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
