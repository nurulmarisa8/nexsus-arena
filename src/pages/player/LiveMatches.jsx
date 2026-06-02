import React, { useState } from 'react';
import { Eye, Filter, Radio, Zap } from 'lucide-react';

const featuredMatch = {
  id: 'AX-992', team1: 'OMEGA SQUAD', team2: 'VOID WALKERS',
  series: 'CHAMPIONSHIP SERIES', map: 'NEON DISTRICT',
  viewers: '142.5K', score: null, status: 'live',
};

const otherMatches = [
  { id: 1, team1: 'ZENITH', team2: 'TITAN', series: 'Regional Quarter-Finals', viewers: '12.8K', score: null },
  { id: 2, team1: 'LUNA SIX', team2: 'NOVA', series: 'Amateur Open League', viewers: '8.2K', score: null },
  { id: 3, team1: 'PHANTOM X', team2: null, series: null, viewers: '24.9K', score: '12-09', featured: true },
  { id: 4, team1: 'APEX ONE', team2: 'ECHO', series: 'Showmatch Series', viewers: '31.5K', score: null },
];

const footerStats = [
  { label: 'Total Active Matches', value: '124', color: '#e2e8f0' },
  { label: 'Global Viewers', value: '2,410,293', color: '#f5c518' },
  { label: 'Network Latency', value: '14ms', sub: 'OPTIMAL', color: '#69f0ae' },
  { label: 'Current Season', value: 'VANGUARD IV', color: '#e2e8f0' },
];

export default function LiveMatches() {
  const [sort, setSort] = useState('VIEWERS');

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', fontWeight: 700, color: '#ff5252', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <span className="live-dot" /> GLOBAL BROADCAST
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 900, color: '#e2e8f0', letterSpacing: '0.02em', marginBottom: 6, textTransform: 'uppercase' }}>
              Current Engagements
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: 520 }}>
              Real-time telemetry and visual feeds from ongoing Tier-1 sanctioned matches across the Vanguard Division.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}>
              <Filter size={13} /> Filter
            </button>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}>
              <Zap size={13} /> Sort: {sort}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Featured Match */}
        <div style={{
          borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer',
          background: 'linear-gradient(180deg, #0d1f3c 0%, #060d1f 100%)',
          border: '1px solid #162f62',
          minHeight: 340,
        }}>
          {/* Placeholder visual */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15,
            background: 'radial-gradient(ellipse at center, #4fc3f7 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(79,195,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.03) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />
          {/* Mock screen grid */}
          <div style={{
            position: 'absolute', inset: 0, display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)',
            gap: 4, padding: '1.5rem', paddingBottom: '5rem', opacity: 0.4,
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                background: `hsl(${180 + i * 30}, 40%, 15%)`,
                borderRadius: 4, border: '1px solid rgba(79,195,247,0.1)',
              }} />
            ))}
          </div>

          {/* Live badge & viewers */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-live" style={{ fontSize: '0.7rem' }}>
              <span className="live-dot" style={{ width: 6, height: 6 }} /> LIVE
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#94a3b8' }}>
              <Eye size={12} /> {featuredMatch.viewers}
            </span>
          </div>

          {/* Bottom info */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem',
            background: 'linear-gradient(0deg, rgba(6,13,31,0.95) 0%, transparent 100%)',
          }}>
            <div style={{ fontSize: '0.7rem', color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {featuredMatch.series} • MAP: {featuredMatch.map}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 900, color: '#e2e8f0' }}>
                <span style={{ color: '#f5c518' }}>{featuredMatch.team1}</span>
                <span style={{ color: '#475569', margin: '0 8px' }}>vs</span>
                <span>{featuredMatch.team2}</span>
              </div>
              <button className="btn-primary" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                Spectate Match
              </button>
            </div>
          </div>
        </div>

        {/* Phantom X featured card */}
        <div style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid #162f62', background: '#0d1f3c', minHeight: 340 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(79,195,247,0.05) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#94a3b8' }}>
            <Eye size={12} /> 24.9K
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem', background: 'linear-gradient(0deg, rgba(6,13,31,0.95) 0%, transparent 100%)' }}>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 900, color: '#e2e8f0', marginBottom: 4 }}>PHANTOM X</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span className="live-dot" />
              <span style={{ fontSize: '0.7rem', color: '#ff5252', fontWeight: 600 }}>LIVE SCORE: 12 — 09</span>
            </div>
            <button className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', textAlign: 'center' }}>
              SPECTATE
            </button>
          </div>
        </div>
      </div>

      {/* Other matches grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {otherMatches.filter(m => !m.featured).map(m => (
          <div key={m.id} style={{
            borderRadius: 10, overflow: 'hidden', position: 'relative', cursor: 'pointer',
            background: '#0d1f3c', border: '1px solid #112650',
          }}>
            {/* Mock thumbnail */}
            <div style={{
              height: 140, background: `linear-gradient(135deg, hsl(${210 + m.id * 40}, 30%, 10%), hsl(${210 + m.id * 40}, 25%, 8%))`,
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ opacity: 0.3, color: '#4fc3f7', fontSize: '2rem' }}>⚡</div>
              <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem', color: '#94a3b8' }}>
                <Eye size={10} /> {m.viewers}
              </div>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', marginBottom: 2, fontSize: '0.9rem' }}>
                {m.team1}{m.team2 ? ` VS ${m.team2}` : ''}
              </div>
              {m.series && <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{m.series}</div>}
              <button className="btn-secondary" style={{ width: '100%', fontSize: '0.7rem', padding: '0.375rem' }}>
                SPECTATE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
        padding: '1.25rem', background: '#0a1628', borderRadius: 10, border: '1px solid #112650',
      }}>
        {footerStats.map(s => (
          <div key={s.label}>
            <div style={{ fontSize: '0.6rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: s.color }}>
              {s.value}
              {s.sub && <span style={{ marginLeft: 6, fontSize: '0.65rem', color: '#69f0ae', fontWeight: 600 }}>{s.sub}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
