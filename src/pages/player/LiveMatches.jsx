import React, { useState } from 'react';
import { Eye, Filter, SlidersHorizontal, X, Wifi } from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Spectate Modal ─── */
function SpectateModal({ match, onClose }) {
  if (!match) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0a1628', border: '1px solid #162f62',
          width: '100%', maxWidth: 640, padding: '2rem', position: 'relative',
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
          <X size={18} />
        </button>

        {/* Live badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
          <div style={{ width: 8, height: 8, background: '#ff5252', borderRadius: '50%' }} />
          <span style={{ fontSize: '0.65rem', color: '#ff5252', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE SPECTATOR MODE</span>
        </div>

        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
          <span style={{ color: '#f5c518' }}>{match.teamA}</span>
          <span style={{ color: '#475569', margin: '0 0.75rem' }}>vs</span>
          {match.teamB}
        </h2>
        <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          {match.meta}
        </div>

        {/* Simulated stream placeholder */}
        <div style={{
          height: 300, background: 'linear-gradient(135deg, #060d1f 0%, #0a1628 100%)',
          border: '1px solid #162f62', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', position: 'relative',
        }}>
          <Wifi size={48} color="#162f62" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>Live Stream Feed</div>
          <div style={{ fontSize: '0.7rem', color: '#162f62' }}>Connecting to broadcast server...</div>
          {/* Score overlay */}
          <div style={{
            position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)', padding: '0.5rem 2rem',
            display: 'flex', alignItems: 'center', gap: '1.5rem',
          }}>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              {match.scoreA}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#ff5252', fontWeight: 700 }}>LIVE</span>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              {match.scoreB}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, background: '#060d1f', border: '1px solid #112650', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#475569', letterSpacing: '0.1em', marginBottom: 4 }}>VIEWERS</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, color: '#e2e8f0' }}>{match.viewers}</div>
          </div>
          <div style={{ flex: 1, background: '#060d1f', border: '1px solid #112650', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#475569', letterSpacing: '0.1em', marginBottom: 4 }}>LATENCY</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, color: '#69f0ae' }}>14ms</div>
          </div>
          <div style={{ flex: 1, background: '#060d1f', border: '1px solid #112650', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#475569', letterSpacing: '0.1em', marginBottom: 4 }}>QUALITY</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, color: '#4fc3f7' }}>1080p</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveMatches() {
  const [spectating, setSpectating] = useState(null);
  const [sortBy, setSortBy] = useState('viewers');

  const openSpectate = (match) => setSpectating(match);

  const matches = [
    {
      id: 'featured',
      teamA: 'OMEGA SQUAD', teamB: 'VOID WALKERS',
      scoreA: 7, scoreB: 5,
      meta: 'CHAMPIONSHIP SERIES • MAP: NEON DISTRICT',
      viewers: '142.5K',
      img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop',
      featured: true,
    },
    {
      id: 'phantom',
      teamA: 'PHANTOM X', teamB: 'APEX CORE',
      scoreA: 12, scoreB: 9,
      meta: 'REGIONAL SEMI-FINALS',
      viewers: '24.1K',
      img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop',
      featured: false,
    },
    {
      id: 'zenith',
      teamA: 'ZENITH', teamB: 'TITAN',
      scoreA: 3, scoreB: 4,
      meta: 'REGIONAL QUARTER-FINALS',
      viewers: '12.8K',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'luna',
      teamA: 'LUNA SIX', teamB: 'NOVA',
      scoreA: 8, scoreB: 8,
      meta: 'AMATEUR OPEN LEAGUE',
      viewers: '8.2K',
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'apex',
      teamA: 'APEX ONE', teamB: 'ECHO',
      scoreA: 15, scoreB: 11,
      meta: 'SHOWMATCH SERIES',
      viewers: '31.5K',
      img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop',
    },
  ];

  const [featured, secondary, ...bottomMatches] = matches;

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', maxWidth: 1400, margin: '0 auto' }}>

      <SpectateModal match={spectating} onClose={() => setSpectating(null)} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 6, height: 6, background: '#ff5252', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.65rem', color: '#ff5252', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              GLOBAL BROADCAST
            </span>
          </div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '0.02em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Current Engagements
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Real-time telemetry and visual feeds from ongoing Tier-1 sanctioned matches across the Vanguard Division.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => { setSortBy(s => s === 'viewers' ? 'live' : 'viewers'); toast.success(`Sorted by: ${sortBy === 'viewers' ? 'LIVE' : 'VIEWERS'}`); }}
            style={{ background: '#0a1628', border: '1px solid #162f62', color: '#94a3b8', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            id="sort-matches-btn"
          >
            <SlidersHorizontal size={14} /> SORT: {sortBy.toUpperCase()}
          </button>
          <button
            onClick={() => toast.success('Filter panel — coming soon!')}
            style={{ background: '#0a1628', border: '1px solid #162f62', color: '#94a3b8', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            id="filter-matches-btn"
          >
            <Filter size={14} /> FILTER
          </button>
        </div>
      </div>

      {/* Main Grid: Top Row (2/3 + 1/3) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Featured Match */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 320, background: `url(${featured.img}) center/cover`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#ff5252', color: 'white', padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 700, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 4, height: 4, background: 'white', borderRadius: '50%' }} /> LIVE
              </div>
              <div style={{ background: 'rgba(0,0,0,0.6)', color: '#e2e8f0', padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 600, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={12} /> {featured.viewers}
              </div>
            </div>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#112650' }}>
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                <span style={{ color: '#f5c518' }}>{featured.teamA}</span>
                <span style={{ color: '#64748b', fontSize: '1rem', margin: '0 0.5rem' }}>vs</span>
                {featured.teamB}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{featured.meta}</div>
            </div>
            <button
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}
              onClick={() => openSpectate(featured)}
              id="spectate-featured"
            >
              SPECTATE MATCH
            </button>
          </div>
        </div>

        {/* Secondary Featured Match */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 200, background: `url(${secondary.img}) center/cover`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: '#e2e8f0', padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 600, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> {secondary.viewers}
            </div>
          </div>
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                <span style={{ color: '#f5c518' }}>{secondary.teamA}</span> <span style={{ color: '#475569', fontSize: '1rem' }}>vs</span> {secondary.teamB}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                <div style={{ width: 6, height: 6, background: '#ff5252', borderRadius: '50%' }} />
                <span style={{ fontSize: '0.65rem', color: '#ff5252', fontWeight: 700, letterSpacing: '0.05em' }}>
                  LIVE SCORE: {secondary.scoreA} - {secondary.scoreB}
                </span>
              </div>
            </div>
            <button
              style={{ background: 'transparent', border: '1px solid #162f62', color: '#e2e8f0', width: '100%', padding: '0.6rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => openSpectate(secondary)}
              id="spectate-secondary"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,197,24,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              SPECTATE
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Row (3 items) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {bottomMatches.map((m) => (
          <div key={m.id} style={{ background: '#0a1628', border: '1px solid #162f62', overflow: 'hidden' }}>
            <div style={{ height: 160, background: `url(${m.img}) center/cover`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', color: '#e2e8f0', padding: '0.2rem 0.5rem', fontSize: '0.6rem', fontWeight: 600, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={10} /> {m.viewers}
              </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                <span style={{ color: '#f5c518' }}>{m.teamA}</span> <span style={{ color: '#475569', fontSize: '0.85rem' }}>vs</span> {m.teamB}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.05em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>{m.meta}</div>
              <button
                style={{ background: 'transparent', border: '1px solid #162f62', color: '#e2e8f0', width: '100%', padding: '0.5rem', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => openSpectate(m)}
                id={`spectate-${m.id}`}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,197,24,0.08)'; e.currentTarget.style.borderColor = 'rgba(245,197,24,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#162f62'; }}
              >
                SPECTATE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>TOTAL ACTIVE MATCHES</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>5</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>GLOBAL VIEWERS</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#f5c518' }}>219,100</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>NETWORK LATENCY</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            14ms <span style={{ fontSize: '0.65rem', color: '#69f0ae', marginLeft: 8 }}>OPTIMAL</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>CURRENT SEASON</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>VANGUARD IV</div>
        </div>
      </div>

    </div>
  );
}
