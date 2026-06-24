import React, { useState, useEffect } from 'react';
import { PenSquare, Plus, Server, Loader2, RefreshCw } from 'lucide-react';
import { statsAPI, matchesAPI, serversAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, matchesRes, serversRes] = await Promise.all([
        statsAPI.admin(),
        matchesAPI.list(),
        serversAPI.list(),
      ]);
      setStats(statsRes.data);
      // Sort by id desc to get most recent
      const allMatches = Array.isArray(matchesRes.data) ? matchesRes.data : [];
      setRecentMatches(allMatches.slice(-8).reverse());
      setServers(Array.isArray(serversRes.data) ? serversRes.data.slice(0, 4) : []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const statusBadge = (status) => {
    const map = {
      live: { label: 'LIVE', bg: 'rgba(255,82,82,0.15)', color: '#ff5252', border: 'rgba(255,82,82,0.3)' },
      in_progress: { label: 'IN PROGRESS', bg: 'rgba(255,82,82,0.1)', color: '#ff5252', border: 'rgba(255,82,82,0.2)' },
      upcoming: { label: 'UPCOMING', bg: 'rgba(79,195,247,0.1)', color: '#4fc3f7', border: 'rgba(79,195,247,0.3)' },
      finished: { label: 'FINISHED', bg: 'rgba(105,240,174,0.1)', color: '#69f0ae', border: 'rgba(105,240,174,0.3)' },
    };
    const s = map[status] || map.upcoming;
    return (
      <span style={{
        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        padding: '0.2rem 0.5rem', fontSize: '0.6rem', fontWeight: 700,
        letterSpacing: '0.05em', borderRadius: 2,
      }}>{s.label}</span>
    );
  };

  const fmt = (n) => n !== undefined ? String(n) : '—';

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '0.25rem' }}>
            Command Overview
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
            Live data feed for current active season.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={fetchAll}
            disabled={loading}
            style={{ background: '#0a1628', border: '1px solid #162f62', color: '#94a3b8', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> REFRESH
          </button>
          <button
            onClick={() => navigate('/admin/tournaments')}
            style={{ background: '#0a1628', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <PenSquare size={14} /> Update Tournament Status
          </button>
          <button
            onClick={() => navigate('/admin/matches')}
            className="btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Create Match
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120, marginBottom: '2.5rem' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#f5c518' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>

          {/* Card 2 - Active Matches */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ACTIVE MATCHES</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, background: '#ff5252', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '0.6rem', color: '#ff5252', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE</span>
              </div>
            </div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{fmt(stats?.active_matches)}</div>
          </div>

          {/* Card 3 - Registered Teams */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>REGISTERED TEAMS</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{fmt(stats?.registered_teams)}</div>
          </div>

          {/* Card 4 - Active Users */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>ACTIVE USERS</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{fmt(stats?.active_users)}</span>
              <span style={{ fontSize: '0.75rem', color: '#4fc3f7', fontWeight: 700 }}>verified</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Recent Matches Table */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #112650', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>RECENT MATCHES</h2>
            <button onClick={() => navigate('/admin/matches')} style={{ background: 'none', border: '1px solid #162f62', color: '#94a3b8', padding: '0.3rem 0.75rem', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}>
              View All
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <Loader2 size={24} className="animate-spin" style={{ color: '#475569' }} />
            </div>
          ) : recentMatches.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
              No matches yet. <button onClick={() => navigate('/admin/matches')} style={{ background: 'none', border: 'none', color: '#f5c518', cursor: 'pointer', fontWeight: 700 }}>Create one →</button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #112650' }}>
                  {['MATCH', 'TOURNAMENT', 'SCORE', 'STATUS'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1.25rem', fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentMatches.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #112650' }}>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', fontSize: '0.85rem' }}>
                        {m.team1_name} vs {m.team2_name}
                      </div>
                      {m.winner_name && (
                        <div style={{ fontSize: '0.65rem', color: '#f5c518', marginTop: 2 }}>Winner: {m.winner_name}</div>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>{m.tournament_name}</td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                        {m.score_team1} – {m.score_team2}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>{statusBadge(m.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Server Schedules */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #112650', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Server size={16} color="#f5c518" /> SERVER SCHEDULES
            </h2>
          </div>
          <div style={{ padding: '1rem' }}>
            {loading ? (
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <Loader2 size={20} className="animate-spin" style={{ color: '#475569' }} />
              </div>
            ) : servers.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#475569', fontSize: '0.8rem' }}>No server schedules.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {servers.map(sv => (
                  <div key={sv.id} style={{ background: '#060d1f', border: `1px solid ${sv.active ? '#162f62' : '#0d1a2f'}`, padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em' }}>{sv.time}</span>
                      {sv.active && <div style={{ width: 6, height: 6, background: '#69f0ae', borderRadius: '50%' }} />}
                    </div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: sv.active ? '#e2e8f0' : '#475569', fontSize: '0.9rem' }}>{sv.title}</div>
                    <div style={{ fontSize: '0.65rem', color: '#475569', letterSpacing: '0.05em' }}>{sv.region} · {sv.server}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
