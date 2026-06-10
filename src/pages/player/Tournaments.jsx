import React, { useState, useEffect } from 'react';
import { Trophy, Filter, Search, ChevronDown, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { tournamentsAPI } from '../../services/api';

const statusConfig = {
  registration_open: { label: 'REGISTRATION OPEN', cls: 'badge-open' },
  upcoming: { label: 'UPCOMING', cls: 'badge-upcoming' },
  live: { label: 'LIVE', cls: 'badge-live' },
  finished: { label: 'FINISHED', cls: 'badge-finished' },
};

export default function Tournaments() {
  const { user } = useAuth();
  const hasTeam = !!(user?.teamName || user?.team_name || user?.team_id);
  const [registering, setRegistering] = useState(null);
  const [registered, setRegistered] = useState([]);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('All');
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await tournamentsAPI.list();
        const data = Array.isArray(res.data) ? res.data : (res.data.tournaments || res.data.data || []);
        setTournaments(data.map(t => ({
          id: t.id,
          name: t.name || t.title || '',
          game: t.game?.name || t.game_name || '',
          icon: t.icon || '🎮',
          status: t.status || 'upcoming',
          registeredTeams: t.registered_teams ?? t.registeredTeams ?? 0,
          maxTeams: t.max_teams ?? t.maxTeams ?? 16,
          prizePool: t.prize_pool ?? t.prizePool ?? 'TBD',
          startDate: t.start_date ?? t.startDate ?? t.date ?? '',
          region: t.region || 'Global',
          format: t.format || '',
          description: t.description || '',
          isRegistered: t.is_registered ?? t.isRegistered ?? false,
        })));
        // Track already-registered tournaments
        const alreadyRegistered = data
          .filter(t => t.is_registered || t.isRegistered)
          .map(t => t.id);
        setRegistered(alreadyRegistered);
      } catch (err) {
        toast.error('Failed to load tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const games = ['All', ...new Set(tournaments.map(t => t.game).filter(Boolean))];

  const filtered = tournaments.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.game.toLowerCase().includes(search.toLowerCase());
    const matchGame = gameFilter === 'All' || t.game === gameFilter;
    return matchSearch && matchGame;
  });

  const handleRegister = async (tournament) => {
    if (!hasTeam) { toast.error('Kamu harus memiliki tim terlebih dahulu!'); return; }
    if (tournament.status !== 'registration_open') { toast.error('Registrasi belum dibuka.'); return; }
    setRegistering(tournament.id);
    try {
      await tournamentsAPI.register(tournament.id);
      setRegistered(prev => [...prev, tournament.id]);
      toast.success(`Tim "${user?.teamName || user?.team_name || 'Your team'}" berhasil terdaftar di ${tournament.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mendaftar turnamen.');
    } finally {
      setRegistering(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#475569' }} />
      </div>
    );
  }

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
          const st = statusConfig[t.status] || statusConfig.upcoming;
          const isRegistered = registered.includes(t.id);
          const isRegistering = registering === t.id;
          const canRegister = t.status === 'registration_open' && hasTeam && !isRegistered;
          const progress = t.maxTeams > 0 ? (t.registeredTeams / t.maxTeams) * 100 : 0;

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
