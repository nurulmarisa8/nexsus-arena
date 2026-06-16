import React from 'react';
import { Filter, Plus, Settings, ChevronDown, Gamepad2, Target, ChevronRight } from 'lucide-react';

export default function TournamentStatus() {
  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', maxWidth: 1400, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
            Tournament Status
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
            Manage active phases and configure game parameters.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#0a1628', border: '1px solid #162f62', color: '#94a3b8', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Filter size={14} /> FILTER
          </button>
          <button className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> NEW TOURNAMENT
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Tournaments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card 1 */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', borderTop: '3px solid #f5c518', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ background: '#f5c518', color: '#060d1f', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, background: '#ff5252', borderRadius: '50%' }}></div> LIVE
                </div>
                <div style={{ background: '#112650', color: '#94a3b8', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', borderRadius: 2 }}>
                  APEX LEGENDS
                </div>
              </div>
              <div style={{ background: '#060d1f', border: '1px solid #162f62', padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '2rem', cursor: 'pointer' }}>
                LIVE <ChevronDown size={14} color="#64748b" />
              </div>
            </div>

            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              APEX PREDATOR SERIES: NA FINALS
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #112650', paddingBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>REGISTERED TEAMS</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>20 / 20</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>CURRENT MATCH</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#f5c518' }}>Match 4</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>PRIZE POOL</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>$50,000</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <Settings size={14} /> CONFIG
              </button>
              <button style={{ background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.6rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                MANAGE TEAMS
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', borderTop: '3px solid #f5c518', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ background: '#f5c518', color: '#060d1f', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em', borderRadius: 2 }}>
                  REGISTRATION OPEN
                </div>
                <div style={{ background: '#112650', color: '#94a3b8', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', borderRadius: 2 }}>
                  VALORANT
                </div>
              </div>
              <div style={{ background: '#060d1f', border: '1px solid #162f62', padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '2rem', cursor: 'pointer' }}>
                REGISTRATION OPEN <ChevronDown size={14} color="#64748b" />
              </div>
            </div>

            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '2rem', textTransform: 'uppercase' }}>
              IGNITION CUP QUALIFIERS
            </h2>

            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #112650', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em' }}>REGISTRATION PROGRESS</div>
                <div style={{ fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 700 }}>12 / 32 TEAMS</div>
              </div>
              <div style={{ height: 6, background: '#112650', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '37.5%', height: '100%', background: '#f5c518' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button style={{ background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.6rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                EDIT DETAILS
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Game Titles */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em' }}>
              GAME TITLES
            </h2>
            <button style={{ background: '#f5c518', border: 'none', color: '#060d1f', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Plus size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ background: '#060d1f', border: '1px solid #112650', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Gamepad2 size={24} color="#94a3b8" />
                <div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 2 }}>APEX LEGENDS</div>
                  <div style={{ color: '#64748b', fontSize: '0.65rem' }}>Battle Royale • Squads</div>
                </div>
              </div>
              <ChevronRight size={16} color="#475569" />
            </div>

            <div style={{ background: '#060d1f', border: '1px solid #112650', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Target size={24} color="#94a3b8" />
                <div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 2 }}>VALORANT</div>
                  <div style={{ color: '#64748b', fontSize: '0.65rem' }}>Tac Shooter • 5v5</div>
                </div>
              </div>
              <ChevronRight size={16} color="#475569" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}