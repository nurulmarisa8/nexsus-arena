import React, { useState, useEffect } from 'react';
import {
  Gamepad2, Radio, Users, Swords, TrendingUp, ExternalLink,
  Plus, Edit3, Server, ChevronRight, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { statsAPI, matchesAPI, serversAPI } from '../../services/api';
import toast from 'react-hot-toast';

const defaultStats = [
  { label: 'Total Games', value: '0', change: null, changeUp: false, icon: Gamepad2 },
  { label: 'Active Matches', value: '0', live: true, icon: Radio },
  { label: 'Registered Teams', value: '0', icon: Users },
  { label: 'Active Users', value: '0', change: null, changeUp: false, icon: TrendingUp },
];

function StatusBadge({ status }) {
  const map = {
    in_progress: { label: 'IN PROGRESS', cls: 'badge-live' },
    upcoming: { label: 'UPCOMING', cls: 'badge-upcoming' },
    finished: { label: 'FINISHED', cls: 'badge-finished' },
  };
  const { label, cls } = map[status] || map.finished;
  return (
    <span className={`badge ${cls}`}>
      {status === 'in_progress' && <span className="live-dot" style={{ width: 6, height: 6 }} />}
      {label}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultStats);
  const [recentMatches, setRecentMatches] = useState([]);
  const [serverSchedules, setServerSchedules] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingServers, setLoadingServers] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsAPI.admin();
        const d = res.data;
        setStats([
          { label: 'Total Games', value: String(d.total_games ?? d.totalGames ?? 0), change: d.games_change ?? d.gamesChange ?? null, changeUp: (d.games_change_up ?? d.gamesChangeUp ?? true), icon: Gamepad2 },
          { label: 'Active Matches', value: String(d.active_matches ?? d.activeMatches ?? 0), live: true, icon: Radio },
          { label: 'Registered Teams', value: String(d.registered_teams ?? d.registeredTeams ?? 0), icon: Users },
          { label: 'Active Users', value: String(d.active_users ?? d.activeUsers ?? 0), change: d.users_change ?? d.usersChange ?? null, changeUp: (d.users_change_up ?? d.usersChangeUp ?? true), icon: TrendingUp },
        ]);
      } catch (err) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchMatches = async () => {
      try {
        const res = await matchesAPI.list({ limit: 4 });
        const data = Array.isArray(res.data) ? res.data : (res.data.matches || res.data.data || []);
        setRecentMatches(data.slice(0, 4).map(m => ({
          id: m.id ? `#${m.id}` : (m.match_id || ''),
          teams: [
            m.team1_name || m.team1?.name || m.teams?.[0] || 'Team 1',
            m.team2_name || m.team2?.name || m.teams?.[1] || 'Team 2',
          ],
          schedule: m.schedule || m.scheduled_at || m.start_time || '',
          status: m.status || 'upcoming',
        })));
      } catch (err) {
        toast.error('Failed to load recent matches');
      } finally {
        setLoadingMatches(false);
      }
    };

    const fetchServers = async () => {
      try {
        const res = await serversAPI.list();
        const data = Array.isArray(res.data) ? res.data : (res.data.servers || res.data.data || []);
        setServerSchedules(data.map(s => ({
          time: s.time || s.scheduled_time || '',
          region: s.region || '',
          title: s.title || s.name || '',
          server: s.server || s.server_name || s.server_id || '',
          active: s.active ?? s.is_active ?? false,
        })));
      } catch (err) {
        toast.error('Failed to load server schedules');
      } finally {
        setLoadingServers(false);
      }
    };

    fetchStats();
    fetchMatches();
    fetchServers();
  }, []);

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            Command Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Live data feed for current active season.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={() => navigate('/admin/tournaments')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Edit3 size={14} />
            Update Tournament Status
          </button>
          <button className="btn-primary" onClick={() => navigate('/admin/matches')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} />
            Create Match
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {stats.map(({ label, value, change, changeUp, live, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              {label}
              {live && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ff5252' }}>
                  <span className="live-dot" style={{ width: 6, height: 6 }} /> LIVE
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#e2e8f0' }}>
                {loadingStats ? <Loader2 size={24} className="animate-spin" style={{ color: '#475569' }} /> : value}
              </span>
              {change && !loadingStats && (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: changeUp ? '#69f0ae' : '#ff5252' }}>
                  {change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Recent Matches */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.05em' }}>
              Recent Matches
            </h2>
            <button
              onClick={() => navigate('/admin/matches')}
              style={{ fontSize: '0.7rem', color: '#f5c518', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              VIEW ALL <ExternalLink size={12} />
            </button>
          </div>

          {loadingMatches ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
              <Loader2 size={24} className="animate-spin" style={{ color: '#475569' }} />
            </div>
          ) : recentMatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#475569', fontSize: '0.85rem' }}>
              No recent matches found.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Match ID</th>
                  <th>Teams</th>
                  <th>Schedule</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMatches.map(match => (
                  <tr key={match.id} style={{ cursor: 'pointer' }}>
                    <td>
                      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                        {match.id}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#f5c518', fontWeight: 600 }}>{match.teams[0]}</span>
                      <span style={{ color: '#475569', margin: '0 4px', fontSize: '0.75rem' }}>vs</span>
                      <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{match.teams[1]}</span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{match.schedule}</td>
                    <td><StatusBadge status={match.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Server Schedules */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.05em' }}>
              Server Schedules
            </h2>
          </div>
          {loadingServers ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
              <Loader2 size={24} className="animate-spin" style={{ color: '#475569' }} />
            </div>
          ) : serverSchedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#475569', fontSize: '0.85rem' }}>
              No server schedules found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {serverSchedules.map((s, i) => (
                <div key={i} style={{
                  padding: '0.875rem',
                  background: s.active ? 'rgba(245,197,24,0.07)' : '#0a1628',
                  border: `1px solid ${s.active ? 'rgba(245,197,24,0.25)' : '#112650'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                  className="card-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.7rem', color: s.active ? '#f5c518' : '#64748b', fontWeight: 600 }}>{s.time}</span>
                    <span style={{ fontSize: '0.65rem', color: '#475569', background: '#112650', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.06em' }}>{s.region}</span>
                  </div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#e2e8f0', marginBottom: 4 }}>
                    {s.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#475569' }}>
                    <Server size={11} />
                    Server: {s.server}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem', fontSize: '0.75rem', textAlign: 'center' }}>
            Manage Infrastructure
          </button>
        </div>
      </div>
    </div>
  );
}
