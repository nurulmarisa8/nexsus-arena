import React from 'react';
import { Search } from 'lucide-react';

export default function ProRankings() {
  const topTeams = [
    { rank: 2, name: 'VORTEX KINGS', sub: 'PREMIER LEAGUE', winRate: '78.4%', points: '12,450', img: 'https://api.dicebear.com/7.x/bottts/svg?seed=vortex' },
    { rank: 1, name: 'ZEPHYR ELITE', sub: 'WORLD CHAMPIONS', winRate: '84.2%', points: '15,820', img: 'https://api.dicebear.com/7.x/bottts/svg?seed=zephyr' },
    { rank: 3, name: 'NEON TITANS', sub: 'CHALLENGER TIER', winRate: '72.1%', points: '11,200', img: 'https://api.dicebear.com/7.x/bottts/svg?seed=neon' },
  ];

  const leaderboard = [
    { rank: '04', tag: 'CY', name: 'Cyber Ghosts', player: 'H. TAKAHASHI', region: 'Asia-Pacific', winRate: 68.5, matches: '1,284', points: '9,840' },
    { rank: '05', tag: 'RS', name: 'Rising Suns', player: 'K. JØRGENSEN', region: 'Europe', winRate: 65.2, matches: '942', points: '8,210' },
    { rank: '06', tag: 'AV', name: 'Apex Void', player: 'M. ROSSI', region: 'North America', winRate: 61.9, matches: '2,150', points: '7,950' },
    { rank: '07', tag: 'DS', name: 'Dark Star', player: 'A. PETROV', region: 'Europe', winRate: 59.4, matches: '1,830', points: '7,400' },
  ];

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', maxWidth: 1200, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <div style={{ background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.3)', color: '#ff5252', padding: '0.3rem 0.75rem', fontSize: '0.65rem', fontWeight: 700, borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '1rem', letterSpacing: '0.1em' }}>
            <div style={{ width: 6, height: 6, background: '#ff5252', borderRadius: '50%' }}></div> SEASON 4 LIVE
          </div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1 }}>
            GLOBAL PRO RANKINGS
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'transparent', border: '1px solid #162f62', color: '#94a3b8', padding: '0.6rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer' }}>
            ALL TIME
          </button>
          <button className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem', borderRadius: 0 }}>
            CURRENT SEASON
          </button>
        </div>
      </div>

      {/* Podium */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '2rem', marginBottom: '4rem' }}>
        
        {/* Rank 2 */}
        <div style={{ width: 260, position: 'relative', zIndex: 1, paddingBottom: '1rem' }}>
          <div style={{ position: 'absolute', right: '-1rem', top: '1rem', fontSize: '10rem', fontWeight: 900, color: 'rgba(22, 47, 98, 0.3)', fontFamily: 'Rajdhani, sans-serif', lineHeight: 0.8, zIndex: -1 }}>2</div>
          <div style={{ width: 80, height: 80, background: '#0a1628', border: '1px solid #94a3b8', padding: '0.5rem', marginBottom: '1rem' }}>
             <img src={topTeams[0].img} alt="Rank 2" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#e2e8f0', marginBottom: 2 }}>{topTeams[0].name}</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>{topTeams[0].sub}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: 4 }}>WIN RATE</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#f5c518' }}>{topTeams[0].winRate}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: 4 }}>POINTS</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#e2e8f0' }}>{topTeams[0].points}</div>
            </div>
          </div>
        </div>

        {/* Rank 1 */}
        <div style={{ width: 300, background: '#0a1628', border: '2px solid #f5c518', padding: '2rem', position: 'relative', zIndex: 2, boxShadow: '0 0 40px rgba(245, 197, 24, 0.15)' }}>
          <div style={{ position: 'absolute', right: '1rem', top: '2rem', fontSize: '12rem', fontWeight: 900, color: 'rgba(245, 197, 24, 0.1)', fontFamily: 'Rajdhani, sans-serif', lineHeight: 0.8, zIndex: 0 }}>1</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: 100, height: 100, background: '#060d1f', border: '2px solid #f5c518', padding: '0.5rem', marginBottom: '1.5rem' }}>
              <img src={topTeams[1].img} alt="Rank 1" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 900, color: '#f5c518', lineHeight: 1, marginBottom: '0.5rem' }}>
              ZEPHYR<br/>ELITE
            </div>
            <div style={{ fontSize: '0.7rem', color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2rem' }}>
              {topTeams[1].sub}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: 4 }}>WIN RATE</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{topTeams[1].winRate}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: 4 }}>POINTS</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{topTeams[1].points}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rank 3 */}
        <div style={{ width: 260, position: 'relative', zIndex: 1, paddingBottom: '1rem' }}>
          <div style={{ position: 'absolute', right: '-1rem', top: '1rem', fontSize: '10rem', fontWeight: 900, color: 'rgba(22, 47, 98, 0.3)', fontFamily: 'Rajdhani, sans-serif', lineHeight: 0.8, zIndex: -1 }}>3</div>
          <div style={{ width: 80, height: 80, background: '#0a1628', border: '1px solid #ff5252', padding: '0.5rem', marginBottom: '1rem' }}>
             <img src={topTeams[2].img} alt="Rank 3" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#e2e8f0', marginBottom: 2 }}>{topTeams[2].name}</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>{topTeams[2].sub}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: 4 }}>WIN RATE</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#4fc3f7' }}>{topTeams[2].winRate}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: 4 }}>POINTS</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#e2e8f0' }}>{topTeams[2].points}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Leaderboard Table */}
      <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 700 }}>
            GLOBAL LEADERBOARD (RANK 4 - 100)
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search team or player..." style={{ background: '#060d1f', border: '1px solid #112650', color: '#e2e8f0', padding: '0.5rem 1rem 0.5rem 2rem', fontSize: '0.75rem', width: 240 }} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #112650' }}>
              <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>RANK</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>NAME</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>REGION</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>WIN RATE</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>MATCHES</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>POINTS</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #112650', cursor: 'pointer' }}>
                <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: '#94a3b8' }}>{row.rank}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 24, height: 24, background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>{row.tag}</div>
                    <div>
                      <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>{row.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.65rem', marginTop: 2 }}>{row.player}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>{row.region}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 60, height: 4, background: '#112650', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${row.winRate}%`, height: '100%', background: '#f5c518' }}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 600 }}>{row.winRate}%</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>{row.matches}</td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#f5c518' }}>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Placeholder */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: '1.5rem' }}>
          <button style={{ background: '#060d1f', border: '1px solid #112650', color: '#64748b', padding: '0.25rem 0.75rem', cursor: 'pointer' }}>&lt;</button>
          <button style={{ background: '#f5c518', border: '1px solid #f5c518', color: '#060d1f', padding: '0.25rem 0.75rem', fontWeight: 700, cursor: 'pointer' }}>1</button>
          <button style={{ background: '#060d1f', border: '1px solid #112650', color: '#94a3b8', padding: '0.25rem 0.75rem', cursor: 'pointer' }}>2</button>
          <button style={{ background: '#060d1f', border: '1px solid #112650', color: '#94a3b8', padding: '0.25rem 0.75rem', cursor: 'pointer' }}>3</button>
          <button style={{ background: '#060d1f', border: '1px solid #112650', color: '#64748b', padding: '0.25rem 0.75rem', cursor: 'pointer' }}>&gt;</button>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', padding: '0 0.5rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#475569', letterSpacing: '0.1em' }}>NEXUS ARENA // OFFICIAL RANKING SYSTEM V4.2.0</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#475569', letterSpacing: '0.1em' }}>DATA INTEGRITY CHECK: PASSED</div>
          <div style={{ fontSize: '0.65rem', color: '#475569', letterSpacing: '0.1em' }}>NEXT UPDATE: 14:00 UTC</div>
        </div>
      </div>

    </div>
  );
}
