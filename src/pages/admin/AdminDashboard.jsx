import React from 'react';
import { PenSquare, Plus, Server } from 'lucide-react';

export default function AdminDashboard() {
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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#0a1628', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <PenSquare size={14} /> Update Tournament Status
          </button>
          <button className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Create Match
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Card 1 */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>TOTAL GAMES</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>1,432</span>
            <span style={{ fontSize: '0.75rem', color: '#69f0ae', fontWeight: 700 }}>+12%</span>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ACTIVE MATCHES</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, background: '#ff5252', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.6rem', color: '#ff5252', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE</span>
            </div>
          </div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>24</div>
        </div>

        {/* Card 3 */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>REGISTERED TEAMS</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>256</div>
        </div>

        {/* Card 4 */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>ACTIVE USERS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>8,941</span>
            <span style={{ fontSize: '0.75rem', color: '#4fc3f7', fontWeight: 700 }}>+4%</span>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Recent Matches */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62' }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #112650' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.02em' }}>
              Recent Matches
            </h2>
            <button style={{ background: 'transparent', border: 'none', color: '#f5c518', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer' }}>
              VIEW ALL
            </button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #112650' }}>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>MATCH ID</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>TEAMS</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>SCHEDULE</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr style={{ borderBottom: '1px solid #112650' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: '#ffffff', fontWeight: 700 }}>#AX-992</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
                    Cloud9 <span style={{ color: '#64748b', margin: '0 0.25rem', fontSize: '0.75rem', fontWeight: 400 }}>vs</span> Fnatic
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Today, 14:00 EST</td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.3)', padding: '0.3rem 0.6rem', borderRadius: 2 }}>
                    <div style={{ width: 4, height: 4, background: '#ff5252', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.6rem', color: '#ff5252', fontWeight: 700, letterSpacing: '0.05em' }}>IN PROGRESS</span>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr style={{ borderBottom: '1px solid #112650' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: '#ffffff', fontWeight: 700 }}>#AX-993</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
                    Team Liquid <span style={{ color: '#64748b', margin: '0 0.25rem', fontSize: '0.75rem', fontWeight: 400 }}>vs</span> Navi
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Today, 16:30 EST</td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', border: '1px solid #f5c518', color: '#f5c518', padding: '0.3rem 0.6rem', borderRadius: 2 }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em' }}>UPCOMING</span>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr style={{ borderBottom: '1px solid #112650' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>#AX-991</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                    G2 Esports <span style={{ color: '#475569', margin: '0 0.25rem', fontSize: '0.75rem', fontWeight: 400 }}>vs</span> Vitality
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>Yesterday, 20:00 EST</td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', border: '1px solid #475569', color: '#64748b', padding: '0.3rem 0.6rem', borderRadius: 2 }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em' }}>FINISHED</span>
                  </div>
                </td>
              </tr>
              {/* Row 4 */}
              <tr style={{ borderBottom: '1px solid #112650' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>#AX-990</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                    FaZe Clan <span style={{ color: '#475569', margin: '0 0.25rem', fontSize: '0.75rem', fontWeight: 400 }}>vs</span> Astralis
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: '#64748b' }}>Yesterday, 17:00 EST</td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', border: '1px solid #475569', color: '#64748b', padding: '0.3rem 0.6rem', borderRadius: 2 }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em' }}>FINISHED</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Server Schedules */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #112650' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.02em' }}>
              Server Schedules
            </h2>
          </div>
          
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Event 1 */}
            <div style={{ borderLeft: '3px solid #f5c518', background: 'rgba(245, 197, 24, 0.05)', padding: '1rem', border: '1px solid #162f62', borderLeftWidth: '3px', borderLeftColor: '#f5c518' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: '#f5c518', fontWeight: 700, letterSpacing: '0.05em' }}>16:30 EST</span>
                <span style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.05em' }}>NA-EAST</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.25rem' }}>Quarter Finals Group A</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}><Server size={12} /> Server: US-E-01</div>
            </div>

            {/* Event 2 */}
            <div style={{ padding: '1rem', border: '1px solid #162f62' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>19:00 EST</span>
                <span style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.05em' }}>EU-WEST</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.25rem' }}>Quarter Finals Group B</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}><Server size={12} /> Server: EU-W-04</div>
            </div>

            {/* Event 3 */}
            <div style={{ padding: '1rem', border: '1px solid #162f62' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>Tomorrow, 14:00 EST</span>
                <span style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.05em' }}>NA-WEST</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.25rem' }}>Semi Finals Match 1</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}><Server size={12} /> Server: US-W-02</div>
            </div>

          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid #112650', textAlign: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', transition: 'color 0.2s' }}>
              Manage Infrastructure
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
