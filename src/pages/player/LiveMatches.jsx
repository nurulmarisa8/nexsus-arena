import React, { useState, useEffect } from 'react';
import { Eye, Filter, Radio, Zap, Loader2 } from 'lucide-react';
import { matchesAPI, statsAPI } from '../../services/api';

export default function LiveMatches() {
  const [sort, setSort] = useState('VIEWERS');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState({
    totalMatches: '—', globalViewers: '—', latency: '14ms', season: 'VANGUARD IV',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [liveRes, statsRes] = await Promise.all([
          matchesAPI.live(),
          statsAPI.admin().catch(() => null),
        ]);
        setMatches(liveRes.data || []);
        if (statsRes?.data) {
          setGlobalStats({
            totalMatches: String(statsRes.data.active_matches || 0),
            globalViewers: '2,410,293',
            latency: '14ms',
            season: 'VANGUARD IV',
          });
        }
      } catch (err) {
        console.error('Failed to fetch live matches', err);
        // Fallback: try to get all matches
        try {
          const res = await matchesAPI.list();
          setMatches(res.data || []);
        } catch (e) {
          console.error('Failed to fetch any matches', e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredMatch = matches.length > 0 ? matches[0] : null;
  const otherMatches = matches.slice(1);

  const footerStats = [
    { label: 'Total Active Matches', value: String(matches.length), color: '#e2e8f0' },
    { label: 'Global Viewers', value: globalStats.globalViewers, color: '#f5c518' },
    { label: 'Network Latency', value: globalStats.latency, sub: 'OPTIMAL', color: '#69f0ae' },
    { label: 'Current Season', value: globalStats.season, color: '#e2e8f0' },
  ];

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#f5c518' }} />
      </div>
    );
  }

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

      {matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
          <Radio size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#64748b' }}>No Live Matches</p>
          <p style={{ fontSize: '0.85rem' }}>Check back soon for upcoming engagements.</p>
        </div>
      ) : (
        <>
          {/* Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: featuredMatch && otherMatches.length > 0 ? '1fr 280px' : '1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Featured Match */}
            {featuredMatch && (
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
                    <Eye size={12} /> {Math.floor(Math.random() * 150) + 10}K
                  </span>
                </div>

                {/* Bottom info */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem',
                  background: 'linear-gradient(0deg, rgba(6,13,31,0.95) 0%, transparent 100%)',
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {featuredMatch.tournament_name || 'CHAMPIONSHIP SERIES'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 900, color: '#e2e8f0' }}>
                      <span style={{ color: '#f5c518' }}>{(featuredMatch.team1_name || 'TEAM 1').toUpperCase()}</span>
                      <span style={{ color: '#475569', margin: '0 8px' }}>vs</span>
                      <span>{(featuredMatch.team2_name || 'TEAM 2').toUpperCase()}</span>
                    </div>
                    <button className="btn-primary" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      Spectate Match
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Second featured card */}
            {otherMatches.length > 0 && (
              <div style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid #162f62', background: '#0d1f3c', minHeight: 340 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(79,195,247,0.05) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#94a3b8' }}>
                  <Eye size={12} /> {Math.floor(Math.random() * 30) + 5}K
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem', background: 'linear-gradient(0deg, rgba(6,13,31,0.95) 0%, transparent 100%)' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 900, color: '#e2e8f0', marginBottom: 4 }}>
                    {(otherMatches[0].team1_name || 'TEAM').toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span className="live-dot" />
                    <span style={{ fontSize: '0.7rem', color: '#ff5252', fontWeight: 600 }}>
                      LIVE SCORE: {otherMatches[0].score_team1 || 0} — {otherMatches[0].score_team2 || 0}
                    </span>
                  </div>
                  <button className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', textAlign: 'center' }}>
                    SPECTATE
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Other matches grid */}
          {otherMatches.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {otherMatches.slice(1).map((m, idx) => (
                <div key={m.id || idx} style={{
                  borderRadius: 10, overflow: 'hidden', position: 'relative', cursor: 'pointer',
                  background: '#0d1f3c', border: '1px solid #112650',
                }}>
                  {/* Mock thumbnail */}
                  <div style={{
                    height: 140, background: `linear-gradient(135deg, hsl(${210 + idx * 40}, 30%, 10%), hsl(${210 + idx * 40}, 25%, 8%))`,
                    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ opacity: 0.3, color: '#4fc3f7', fontSize: '2rem' }}>⚡</div>
                    <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem', color: '#94a3b8' }}>
                      <Eye size={10} /> {Math.floor(Math.random() * 50) + 5}K
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', marginBottom: 2, fontSize: '0.9rem' }}>
                      {(m.team1_name || 'TEAM 1').toUpperCase()} VS {(m.team2_name || 'TEAM 2').toUpperCase()}
                    </div>
                    {m.tournament_name && <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{m.tournament_name}</div>}
                    <button className="btn-secondary" style={{ width: '100%', fontSize: '0.7rem', padding: '0.375rem' }}>
                      SPECTATE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

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
