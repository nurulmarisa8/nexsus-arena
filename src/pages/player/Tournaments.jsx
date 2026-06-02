import React, { useState } from 'react';
import { Trophy, Filter, Search, ChevronDown, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TOURNAMENTS = [
  {
    id: 1, name: 'Ignition Cup Qualifiers', game: 'Valorant', icon: '🔫',
    status: 'registration_open', registeredTeams: 12, maxTeams: 32,
    prizePool: '$15,000', startDate: 'Jun 5, 2025', region: 'Global', format: '5v5 Double Elim',
    description: 'Open qualifiers for the Ignition Cup. Top 8 advance to finals.',
  },
  {
    id: 2, name: 'Nexus Championship S2', game: 'Apex Legends', icon: '🎯',
    status: 'registration_open', registeredTeams: 4, maxTeams: 16,
    prizePool: '$30,000', startDate: 'Jun 15, 2025', region: 'NA', format: 'Squad BR',
    description: 'Season 2 of the premier Nexus Arena championship circuit.',
  },
  {
    id: 3, name: 'Rookie Rising Cup', game: 'League of Legends', icon: '⚔️',
    status: 'registration_open', registeredTeams: 8, maxTeams: 16,
    prizePool: '$5,000', startDate: 'Jun 20, 2025', region: 'EU', format: '5v5 Single Elim',
    description: 'Tournament for teams with rating under 2000. Perfect for new teams.',
  },
  {
    id: 4, name: 'Apex Predator Series Q3', game: 'Apex Legends', icon: '🎯',
    status: 'upcoming', registeredTeams: 0, maxTeams: 20,
    prizePool: '$50,000', startDate: 'Jul 1, 2025', region: 'NA', format: 'Squad BR',
    description: 'Quarterly flagship tournament. Registration opens June 15.',
  },
];

const statusConfig = {
  registration_open: { label: 'REGISTRATION OPEN', cls: 'badge-open' },
  upcoming: { label: 'UPCOMING', cls: 'badge-upcoming' },
  live: { label: 'LIVE', cls: 'badge-live' },
  finished: { label: 'FINISHED', cls: 'badge-finished' },
};

export default function Tournaments() {
  const { user } = useAuth();
  const hasTeam = !!user?.teamName;
  const [registering, setRegistering] = useState(null);
  const [registered, setRegistered] = useState([]);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('All');

  const games = ['All', ...new Set(TOURNAMENTS.map(t => t.game))];

  const filtered = TOURNAMENTS.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.game.toLowerCase().includes(search.toLowerCase());
    const matchGame = gameFilter === 'All' || t.game === gameFilter;
    return matchSearch && matchGame;
  });

  const handleRegister = async (tournament) => {
    if (!hasTeam) { toast.error('Kamu harus memiliki tim terlebih dahulu!'); return; }
    if (tournament.status !== 'registration_open') { toast.error('Registrasi belum dibuka.'); return; }
    setRegistering(tournament.id);
    await new Promise(r => setTimeout(r, 1000));
    setRegistering(null);
    setRegistered(prev => [...prev, tournament.id]);
    toast.success(`Tim "${user.teamName}" berhasil terdaftar di ${tournament.name}!`);
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
          Available Tournaments
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Browse and register your team for upcoming competitive events.</p>
      </div>

      {/* No team alert */}
      {!hasTeam && (
        <div style={{
          padding: '1rem 1.25rem', marginBottom: '1.5rem',
          background: 'rgba(255,82,82,0.06)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 8,
          fontSize: '0.85rem', color: '#94a3b8',
        }}>
          ⚠️ <strong style={{ color: '#ff5252' }}>Kamu belum memiliki tim.</strong> Buat tim di <strong>Team Hub</strong> untuk bisa mendaftar turnamen.
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            className="input-field"
            placeholder="Search tournament..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
            id="tournament-search"
          />
        </div>
        <select
          className="input-field"
          style={{ width: 'auto', padding: '0.5rem 2.5rem 0.5rem 1rem', fontSize: '0.85rem' }}
          value={gameFilter}
          onChange={e => setGameFilter(e.target.value)}
        >
          {games.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Tournament Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(t => {
          const st = statusConfig[t.status];
          const isRegistered = registered.includes(t.id);
          const isRegistering = registering === t.id;
          const canRegister = t.status === 'registration_open' && hasTeam && !isRegistered;
          const progress = (t.registeredTeams / t.maxTeams) * 100;

          return (
            <div key={t.id} className="card card-hover" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              {/* Accent line */}
              {t.status === 'registration_open' && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'linear-gradient(180deg, #69f0ae, #4fc3f7)' }} />
              )}

              <div style={{ display: 'flex', gap: '1rem', paddingLeft: t.status === 'registration_open' ? '0.875rem' : 0, flexWrap: 'wrap' }}>
                {/* Icon */}
                <div style={{ width: 52, height: 52, background: '#112650', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  {t.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0', margin: 0 }}>
                      {t.name}
                    </h3>
                    <span className={`badge ${st.cls}`}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 6 }}>
                    {t.game} · {t.format} · {t.region} · Starts {t.startDate}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{t.description}</p>

                  {/* Progress */}
                  <div style={{ marginTop: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginBottom: 5 }}>
                      <span>Registration Progress</span>
                      <span style={{ color: '#f5c518', fontWeight: 600 }}>{t.registeredTeams} / {t.maxTeams} teams</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, minWidth: 140 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prize Pool</div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#f5c518' }}>{t.prizePool}</div>
                  </div>

                  {isRegistered ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: 'rgba(105,240,174,0.1)', border: '1px solid rgba(105,240,174,0.3)', borderRadius: 6, color: '#69f0ae', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif' }}>
                      <CheckCircle size={14} />
                      REGISTERED
                    </div>
                  ) : (
                    <button
                      className={canRegister ? 'btn-primary' : 'btn-secondary'}
                      disabled={!canRegister || isRegistering}
                      onClick={() => handleRegister(t)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem',
                        opacity: (t.status !== 'registration_open' || !hasTeam) ? 0.5 : 1,
                      }}
                      id={`register-tournament-${t.id}`}
                    >
                      {isRegistering
                        ? <><Loader2 size={14} className="animate-spin" /> Registering...</>
                        : t.status !== 'registration_open'
                          ? 'Registration Closed'
                          : !hasTeam
                            ? 'Need a Team'
                            : '+ Register Team'
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
          <Trophy size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p>No tournaments found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
