import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Swords, Star, Calendar, ChevronRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const recentMatches = [
  { id: '#AX-988', opponent: 'Phantom X', schedule: 'Today, 14:00 EST', status: 'upcoming', result: null },
  { id: '#AX-981', opponent: 'Iron Veil', schedule: 'Yesterday, 18:00 EST', status: 'finished', result: 'win', score: '3-1' },
  { id: '#AX-975', opponent: 'Luna Six', schedule: '2 days ago', status: 'finished', result: 'loss', score: '1-3' },
];

const upcomingTournaments = [
  { name: 'Ignition Cup Qualifiers', game: 'Valorant', date: 'Jun 5, 2025', prize: '$15,000', slots: '12/32', open: true },
  { name: 'Nexus Championship S2', game: 'Apex Legends', date: 'Jun 15, 2025', prize: '$30,000', slots: '0/16', open: true },
];

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
  const hasTeam = !!user?.teamName;

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0' }}>
            Welcome back, <span style={{ color: '#f5c518' }}>{user?.username || 'Player'}</span>
          </h1>
          {hasTeam && <span className="badge badge-verified">{user.teamName}</span>}
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{user?.division || 'Vanguard Division'} · Season IV Active</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard icon={Trophy} label="Tournament Wins" value="3" color="#f5c518" />
        <StatCard icon={Swords} label="Matches Played" value="24" color="#4fc3f7" />
        <StatCard icon={TrendingUp} label="Win Rate" value="62%" color="#69f0ae" sub="+5% this season" />
        <StatCard icon={Star} label="Rating" value="1,847" color="#e040fb" />
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
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.875rem' }}>
                    vs <span style={{ color: '#f5c518' }}>{m.opponent}</span>
                    {m.score && <span style={{ marginLeft: 8, fontFamily: 'Rajdhani, sans-serif', color: '#94a3b8' }}>{m.score}</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 2 }}>{m.schedule}</div>
                </div>
                <span className={`badge ${m.status === 'upcoming' ? 'badge-upcoming' : 'badge-finished'}`}>
                  {m.status === 'upcoming' ? 'UPCOMING' : 'FINISHED'}
                </span>
              </div>
            ))}
          </div>
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
        </div>
      </div>
    </div>
  );
}
