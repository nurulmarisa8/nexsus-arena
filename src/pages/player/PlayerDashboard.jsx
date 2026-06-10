import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Swords, Star, Calendar, ChevronRight, TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { statsAPI, matchesAPI, tournamentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

function StatCard({ icon: Icon, label, value, color = '#f5c518', sub }) {
  return (
    <div className="card" style={{ padding: '1.125rem', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, background: `${color}18`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.7rem', color, fontWeight: 600, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function PlayerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasTeam = !!(user?.teamName || user?.team_name || user?.team_id);

  const [playerStats, setPlayerStats] = useState({
    tournamentWins: '0',
    matchesPlayed: '0',
    winRate: '0%',
    winRateSub: null,
    rating: '0',
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch player stats
        if (user?.id) {
          try {
            const statsRes = await statsAPI.player(user.id);
            const d = statsRes.data;
            setPlayerStats({
              tournamentWins: String(d.tournament_wins ?? d.tournamentWins ?? 0),
              matchesPlayed: String(d.matches_played ?? d.matchesPlayed ?? 0),
              winRate: d.win_rate ?? d.winRate ?? '0%',
              winRateSub: d.win_rate_change ?? d.winRateChange ?? null,
              rating: String(d.rating ?? 0),
            });
          } catch (err) {
            // Stats may not be available, use defaults
          }
        }

        // Fetch recent matches
        try {
          const matchesRes = await matchesAPI.list();
          const matchData = Array.isArray(matchesRes.data) ? matchesRes.data : (matchesRes.data.matches || matchesRes.data.data || []);
          setRecentMatches(matchData.slice(0, 3).map(m => ({
            id: m.id ? `#${m.id}` : (m.match_id ? `#${m.match_id}` : ''),
            opponent: m.team2_name || m.team2?.name || m.opponent || m.teams?.[1] || 'Unknown',
            schedule: m.schedule || m.scheduled_at || m.start_time || '',
            status: m.status || 'upcoming',
            result: m.result || null,
            score: m.score_display || (m.score_team1 != null && m.score_team2 != null ? `${m.score_team1}-${m.score_team2}` : null),
          })));
        } catch (err) {
          // Matches may not be available
        }

        // Fetch upcoming tournaments
        try {
          const tourRes = await tournamentsAPI.list();
          const tourData = Array.isArray(tourRes.data) ? tourRes.data : (tourRes.data.tournaments || tourRes.data.data || []);
          const open = tourData
            .filter(t => t.status === 'registration_open' || t.status === 'upcoming')
            .slice(0, 2);
          setUpcomingTournaments(open.map(t => ({
            name: t.name || t.title || '',
            game: t.game?.name || t.game_name || '',
            date: t.start_date || t.startDate || t.date || '',
            prize: t.prize_pool || t.prizePool || 'TBD',
            slots: `${t.registered_teams ?? t.registeredTeams ?? 0}/${t.max_teams ?? t.maxTeams ?? 0}`,
            open: t.status === 'registration_open',
          })));
        } catch (err) {
          // Tournaments may not be available
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#475569' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0' }}>
            Welcome back, <span style={{ color: '#f5c518' }}>{user?.username || 'Player'}</span>
          </h1>
          {hasTeam && <span className="badge badge-verified">{user?.teamName || user?.team_name || 'Team'}</span>}
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{user?.division || 'Vanguard Division'} · Season IV Active</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard icon={Trophy} label="Tournament Wins" value={playerStats.tournamentWins} color="#f5c518" />
        <StatCard icon={Swords} label="Matches Played" value={playerStats.matchesPlayed} color="#4fc3f7" />
        <StatCard icon={TrendingUp} label="Win Rate" value={playerStats.winRate} color="#69f0ae" sub={playerStats.winRateSub} />
        <StatCard icon={Star} label="Rating" value={playerStats.rating} color="#e040fb" />
      </div>

      {/* Banner if no team */}
      {!hasTeam && (
        <div style={{
          padding: '1.25rem 1.5rem', marginBottom: '1.75rem',
          background: 'linear-gradient(135deg, rgba(245,197,24,0.08), rgba(245,197,24,0.03))',
          border: '1px solid rgba(245,197,24,0.25)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#f5c518', fontSize: '1rem', marginBottom: 4 }}>
              🏆 You don't have a team yet
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Create or join a team to participate in tournaments</div>
          </div>
          <button className="btn-primary" onClick={() => navigate('/player/team')}>
            Create Team →
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Recent Matches */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.05em' }}>
              Your Recent Matches
            </h2>
            <button onClick={() => navigate('/player/live')} style={{ fontSize: '0.7rem', color: '#f5c518', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em', fontWeight: 600 }}>
              VIEW ALL →
            </button>
          </div>
          {recentMatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#475569', fontSize: '0.85rem' }}>
              No recent matches found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentMatches.map(m => (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem',
                  background: '#0a1628', borderRadius: 8, border: '1px solid #112650',
                }}>
                  {m.status === 'finished' && (
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: m.result === 'win' ? 'rgba(105,240,174,0.1)' : 'rgba(255,82,82,0.1)',
                      border: `1px solid ${m.result === 'win' ? 'rgba(105,240,174,0.3)' : 'rgba(255,82,82,0.3)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.75rem',
                      color: m.result === 'win' ? '#69f0ae' : '#ff5252',
                    }}>
                      {m.result?.toUpperCase()}
                    </div>
                  )}
                  {m.status === 'upcoming' && (
                    <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={16} color="#f5c518" />
                    </div>
                  )}
                  {m.status === 'in_progress' && (
                    <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Swords size={16} color="#ff5252" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.875rem' }}>
                      vs <span style={{ color: '#f5c518' }}>{m.opponent}</span>
                      {m.score && <span style={{ marginLeft: 8, fontFamily: 'Rajdhani, sans-serif', color: '#94a3b8' }}>{m.score}</span>}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 2 }}>{m.schedule}</div>
                  </div>
                  <span className={`badge ${m.status === 'upcoming' ? 'badge-upcoming' : m.status === 'in_progress' ? 'badge-live' : 'badge-finished'}`}>
                    {m.status === 'upcoming' ? 'UPCOMING' : m.status === 'in_progress' ? 'IN PROGRESS' : 'FINISHED'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tournaments */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.05em' }}>
              Open Tournaments
            </h2>
            <button onClick={() => navigate('/player/tournaments')} style={{ fontSize: '0.7rem', color: '#f5c518', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
              SEE ALL →
            </button>
          </div>
          {upcomingTournaments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#475569', fontSize: '0.85rem' }}>
              No open tournaments at the moment.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingTournaments.map(t => (
                <div key={t.name} className="card-hover" style={{
                  padding: '0.875rem', background: '#0a1628',
                  border: '1px solid #112650', borderRadius: 8, cursor: 'pointer',
                }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', marginBottom: 4, fontSize: '0.9rem' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: 8 }}>{t.game} · {t.date}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.8rem', color: '#f5c518', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif' }}>{t.prize}</div>
                    <span style={{ fontSize: '0.65rem', color: '#475569' }}>{t.slots} teams</span>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/player/tournaments')}
                    disabled={!hasTeam}
                    style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.75rem', opacity: hasTeam ? 1 : 0.5 }}
                  >
                    {hasTeam ? 'Register Team →' : 'Need a Team First'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
