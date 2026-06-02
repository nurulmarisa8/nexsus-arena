import React, { useState } from 'react';
import {
  Gamepad2, Radio, Users, Swords, TrendingUp, ExternalLink,
  Plus, Edit3, Server, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Total Games', value: '1,432', change: '+12%', changeUp: true, icon: Gamepad2 },
  { label: 'Active Matches', value: '24', live: true, icon: Radio },
  { label: 'Registered Teams', value: '256', icon: Users },
  { label: 'Active Users', value: '8,941', change: '+4%', changeUp: true, icon: TrendingUp },
];

const recentMatches = [
  { id: '#AX-992', teams: ['Cloud9', 'Fnatic'], schedule: 'Today, 14:00 EST', status: 'in_progress' },
  { id: '#AX-993', teams: ['Team Liquid', 'Navi'], schedule: 'Today, 16:30 EST', status: 'upcoming' },
  { id: '#AX-991', teams: ['G2 Esports', 'Vitality'], schedule: 'Yesterday, 20:00 EST', status: 'finished' },
  { id: '#AX-990', teams: ['FaZe Clan', 'Astralis'], schedule: 'Yesterday, 17:00 EST', status: 'finished' },
];

const serverSchedules = [
  { time: '16:30 EST', region: 'NA-EAST', title: 'Quarter Finals Group A', server: 'US-E-01', active: true },
  { time: '19:00 EST', region: 'EU-WEST', title: 'Quarter Finals Group B', server: 'EU-W-04', active: false },
  { time: 'Tomorrow, 14:00 EST', region: 'NA-WEST', title: 'Semi Finals Match 1', server: 'US-W-02', active: false },
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
                {value}
              </span>
              {change && (
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
        </div>

        {/* Server Schedules */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.05em' }}>
              Server Schedules
            </h2>
          </div>
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
          <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem', fontSize: '0.75rem', textAlign: 'center' }}>
            Manage Infrastructure
          </button>
        </div>
      </div>
    </div>
  );
}
