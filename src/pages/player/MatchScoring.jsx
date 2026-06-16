import React from 'react';

export default function MatchScoring() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      <div style={{ padding: '2.5rem', flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <div style={{ maxWidth: 600 }}>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
              LIVE MATCH SCORING
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Real-time match administration for the current Vanguard Season. All inputs are synchronized across the Arena broadcast network.
            </p>
          </div>
          <div style={{ background: '#0a1628', border: '1px solid #162f62', borderRadius: '4px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 6, height: 6, background: '#ff5252', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.1em' }}>4 MATCHES LIVE</span>
          </div>
        </div>

        {/* Match Cards Container */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          {/* Card 1: Grand Finals */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', borderRadius: '4px', width: 400, flexShrink: 0 }}>
            {/* Card Header */}
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #112650' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4fc3f7', letterSpacing: '0.1em' }}>GRAND FINALS • BO5</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SERVER: NA-WEST_04</div>
            </div>
            {/* Card Body */}
            <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* Team 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 64, height: 64, background: '#060d1f', border: '2px solid #f5c518', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Placeholder Logo */}
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=void" alt="Void Runners" style={{ width: 40, height: 40, opacity: 0.8 }} />
                </div>
                <div style={{ textAlign: 'center', color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>VOID<br/>RUNNERS</div>
              </div>

              {/* Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4rem', fontWeight: 800, color: '#f5c518', lineHeight: 1 }}>2</div>
                <div style={{ width: 12, height: 4, background: '#f5c518', borderRadius: '2px' }}></div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4rem', fontWeight: 800, color: '#f5c518', lineHeight: 1 }}>1</div>
              </div>

              {/* Team 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 64, height: 64, background: '#060d1f', border: '1px solid #162f62', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Placeholder Logo */}
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=omega" alt="Omega Sync" style={{ width: 40, height: 40, opacity: 0.8 }} />
                </div>
                <div style={{ textAlign: 'center', color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>OMEGA<br/>SYNC</div>
              </div>

            </div>
          </div>

          {/* Card 2: Semi Finals */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', borderRadius: '4px', width: 400, flexShrink: 0 }}>
            {/* Card Header */}
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #112650' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4fc3f7', letterSpacing: '0.1em' }}>SEMI FINALS • BO3</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SERVER: EU-CENTRAL_12</div>
            </div>
            {/* Card Body */}
            <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* Team 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 64, height: 64, background: '#060d1f', border: '1px solid #162f62', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=neon" alt="Neon Claw" style={{ width: 40, height: 40, opacity: 0.8 }} />
                </div>
                <div style={{ textAlign: 'center', color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>NEON<br/>CLAW</div>
              </div>

              {/* Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>0</div>
                <div style={{ width: 12, height: 4, background: '#ffffff', borderRadius: '2px' }}></div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>0</div>
              </div>

              {/* Team 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 64, height: 64, background: '#060d1f', border: '1px solid #162f62', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=strike" alt="Strike Zero" style={{ width: 40, height: 40, opacity: 0.8 }} />
                </div>
                <div style={{ textAlign: 'center', color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>STRIKE<br/>ZERO</div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Footer Status Bar */}
      <div style={{ background: '#0a1628', borderTop: '1px solid #162f62', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 6, height: 6, background: '#69f0ae', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em' }}>SYSTEM ONLINE</span>
          </div>
          <span style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em' }}>LATENCY: 14MS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em' }}>TERMINAL_ID: NEX_CC_882</span>
          <span style={{ fontSize: '0.65rem', color: '#475569', letterSpacing: '0.1em' }}>© 2024 NEXUS ARENA GLOBAL</span>
        </div>
      </div>

    </div>
  );
}
