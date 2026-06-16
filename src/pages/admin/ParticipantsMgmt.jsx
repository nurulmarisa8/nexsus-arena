import React, { useState } from 'react';
import { Download, Plus, Search, Filter, ChevronLeft, ChevronRight, Gamepad2, Shield, Zap } from 'lucide-react';

export default function ParticipantsMgmt() {
  const [activeTab, setActiveTab] = useState('Teams');

  const teams = [
    { name: 'Void Walkers', captain: '@ShadowStep', region: 'NA East', wins: 142, status: 'VERIFIED', icon: Gamepad2 },
    { name: 'Crimson Surge', captain: '@RedViper', region: 'EU West', wins: 89, status: 'VERIFIED', icon: Zap },
    { name: 'Aegis Protocol', captain: '@TitanBlock', region: 'Asia Pacific', wins: 12, status: 'PENDING', icon: Shield },
    { name: 'Neon Syndicate', captain: '@GlitchUser', region: 'NA West', wins: 205, status: 'SUSPENDED', icon: Gamepad2 },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'VERIFIED': return { background: 'rgba(79, 195, 247, 0.15)', color: '#4fc3f7', border: '1px solid rgba(79, 195, 247, 0.3)' };
      case 'PENDING': return { background: 'rgba(245, 197, 24, 0.15)', color: '#f5c518', border: '1px solid rgba(245, 197, 24, 0.3)' };
      case 'SUSPENDED': return { background: 'rgba(225, 29, 72, 0.15)', color: '#ff5252', border: '1px solid rgba(225, 29, 72, 0.3)' };
      default: return { background: '#112650', color: '#94a3b8', border: '1px solid #162f62' };
    }
  };

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', maxWidth: 1200, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '0.25rem' }}>
            Manage Platform Participants
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
            View, edit, and moderate teams and users across all regions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#0a1628', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Download size={14} /> Export CSV
          </button>
          <button className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #162f62', marginBottom: '2rem' }}>
        {['Teams', 'Users'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'none', border: 'none', padding: '0 0 0.75rem 0', 
              fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
              color: activeTab === tab ? '#f5c518' : '#64748b',
              borderBottom: activeTab === tab ? '3px solid #f5c518' : '3px solid transparent'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ background: '#0a1628', border: '1px solid #162f62', borderRadius: 4 }}>
        
        {/* Toolbar */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #112650' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Filter size={16} color="#64748b" />
            <select style={{ background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.5rem 2rem 0.5rem 1rem', fontSize: '0.8rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
              <option>All Regions</option>
              <option>NA East</option>
              <option>EU West</option>
            </select>
            <select style={{ background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.5rem 2rem 0.5rem 1rem', fontSize: '0.8rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
              <option>All Statuses</option>
              <option>Verified</option>
              <option>Pending</option>
            </select>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search name or ID..." style={{ background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.8rem', width: 260, outline: 'none' }} />
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #112650' }}>
              <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>TEAM NAME</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>CAPTAIN</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>REGION</th>
              <th style={{ textAlign: 'center', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>TOTAL WINS</th>
              <th style={{ textAlign: 'center', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>STATUS</th>
              <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #112650' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#060d1f', border: '1px solid #162f62', padding: '0.4rem', borderRadius: 4, display: 'flex' }}>
                      <team.icon size={16} color="#94a3b8" />
                    </div>
                    <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>{team.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>{team.captain}</td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>{team.region}</td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                  {team.wins}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                  <span style={{ ...getStatusStyle(team.status), padding: '0.2rem 0.6rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em', borderRadius: 2 }}>
                    {team.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: '1px solid #f5c518', color: '#f5c518', padding: '0.4rem 1rem', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Showing 1 to 4 of 24 entries
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronLeft size={16} /></button>
            <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={16} /></button>
          </div>
        </div>

      </div>
    </div>
  );
}
