import React, { useState } from 'react';
import {
  Plus, Filter, ChevronDown, Edit3, Settings, Users, Gamepad2, ChevronRight, Radio
} from 'lucide-react';
import toast from 'react-hot-toast';

const initialTournaments = [
  {
    id: 1, game: 'Apex Legends', name: 'Apex Predator Series: NA Finals',
    status: 'live', registeredTeams: 20, maxTeams: 20, currentMatch: 'Match 4', prizePool: '$50,000',
  },
  {
    id: 2, game: 'Valorant', name: 'Ignition Cup Qualifiers',
    status: 'registration_open', registeredTeams: 12, maxTeams: 32, currentMatch: null, prizePool: '$15,000',
  },
  {
    id: 3, game: 'League of Legends', name: 'Nexus Championship Series',
    status: 'upcoming', registeredTeams: 0, maxTeams: 16, currentMatch: null, prizePool: '$30,000',
  },
];

const gameTitles = [
  { name: 'Apex Legends', genre: 'Battle Royale • Squads', icon: '🎯' },
  { name: 'Valorant', genre: 'Tac Shooter • 5v5', icon: '🔫' },
  { name: 'League of Legends', genre: 'MOBA • 5v5', icon: '⚔️' },
];

const statusLabels = {
  live: { label: 'LIVE', cls: 'badge-live', dot: true },
  registration_open: { label: 'REGISTRATION OPEN', cls: 'badge-open' },
  upcoming: { label: 'UPCOMING', cls: 'badge-upcoming' },
  finished: { label: 'FINISHED', cls: 'badge-finished' },
};

const statusOptions = ['live', 'registration_open', 'upcoming', 'finished'];

export default function TournamentStatus() {
  const [tournaments, setTournaments] = useState(initialTournaments);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newT, setNewT] = useState({ name: '', game: 'Apex Legends', maxTeams: 16, prizePool: '' });

  const handleStatusChange = (id, status) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    toast.success('Tournament status updated');
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newT.name.trim()) { toast.error('Tournament name required'); return; }
    setTournaments(prev => [...prev, {
      id: Date.now(), game: newT.game, name: newT.name,
      status: 'upcoming', registeredTeams: 0, maxTeams: parseInt(newT.maxTeams),
      currentMatch: null, prizePool: newT.prizePool || 'TBD',
    }]);
    setShowNewForm(false);
    setNewT({ name: '', game: 'Apex Legends', maxTeams: 16, prizePool: '' });
    toast.success('Tournament created!');
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            Tournament Status
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Manage active phases and configure game parameters.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} />
            Filter
          </button>
          <button className="btn-primary" onClick={() => setShowNewForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} />
            New Tournament
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Tournament Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* New Tournament Form */}
          {showNewForm && (
            <div className="card" style={{ padding: '1.5rem', border: '1px solid rgba(245,197,24,0.3)', animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#f5c518', marginBottom: '1rem', fontSize: '1rem' }}>
                + New Tournament
              </h3>
              <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Tournament Name</label>
                  <input className="input-field" value={newT.name} onChange={e => setNewT(p => ({ ...p, name: e.target.value }))} placeholder="Championship Series 2025" />
                </div>
                <div>
                  <label className="label">Game</label>
                  <select className="input-field" value={newT.game} onChange={e => setNewT(p => ({ ...p, game: e.target.value }))}>
                    {gameTitles.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Max Teams</label>
                  <input className="input-field" type="number" value={newT.maxTeams} onChange={e => setNewT(p => ({ ...p, maxTeams: e.target.value }))} min={2} max={128} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Prize Pool</label>
                  <input className="input-field" value={newT.prizePool} onChange={e => setNewT(p => ({ ...p, prizePool: e.target.value }))} placeholder="$10,000" />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Tournament</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowNewForm(false)} style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {tournaments.map(t => {
            const st = statusLabels[t.status];
            const progress = (t.registeredTeams / t.maxTeams) * 100;
            return (
              <div key={t.id} className="card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                {/* Top border accent for live */}
                {t.status === 'live' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #ff5252, #ff7675)' }} />
                )}
                {t.status === 'registration_open' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #69f0ae, #4fc3f7)' }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className={`badge ${st.cls}`}>
                      {st.dot && <span className="live-dot" style={{ width: 6, height: 6 }} />}
                      {st.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      {t.game}
                    </span>
                  </div>
                  {/* Status Dropdown */}
                  <select
                    className="input-field"
                    style={{ width: 'auto', padding: '0.3rem 2rem 0.3rem 0.6rem', fontSize: '0.7rem', background: '#0a1628' }}
                    value={t.status}
                    onChange={e => handleStatusChange(t.id, e.target.value)}
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '1rem', textTransform: 'uppercase' }}>
                  {t.name}
                </h2>

                {t.status === 'live' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    {[
                      { label: 'Registered Teams', value: `${t.registeredTeams} / ${t.maxTeams}` },
                      { label: 'Current Match', value: t.currentMatch, gold: true },
                      { label: 'Prize Pool', value: t.prizePool },
                    ].map(item => (
                      <div key={item.label}>
                        <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: item.gold ? '#f5c518' : '#e2e8f0' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginBottom: 6 }}>
                      <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Registration Progress</span>
                      <span style={{ color: '#f5c518', fontWeight: 600 }}>{t.registeredTeams} / {t.maxTeams} Teams</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-secondary" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Settings size={12} />
                    Config
                  </button>
                  <button className="btn-primary" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {t.status === 'live' ? <><Users size={12} /> Manage Teams</> : <><Edit3 size={12} /> Edit Details</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Game Titles Panel */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#f5c518', fontSize: '0.9rem', letterSpacing: '0.08em' }}>
              GAME TITLES
            </h3>
            <button style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.3)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5c518', cursor: 'pointer' }}>
              <Plus size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {gameTitles.map(g => (
              <div key={g.name} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem',
                background: '#0a1628', borderRadius: 8, cursor: 'pointer',
                border: '1px solid #112650', transition: 'border-color 0.15s',
              }}
                className="card-hover"
              >
                <div style={{ width: 34, height: 34, background: '#112650', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                  {g.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e2e8f0', fontFamily: 'Rajdhani, sans-serif' }}>{g.name}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{g.genre}</div>
                </div>
                <ChevronRight size={14} color="#475569" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
