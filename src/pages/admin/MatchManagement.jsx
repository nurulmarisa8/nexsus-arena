import React from 'react';
import { Filter, RefreshCw, Video, CheckSquare, ShieldCheck, RadioTower } from 'lucide-react';

export default function MatchManagement() {
  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', maxWidth: 1400, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '0.25rem' }}>
            Match Scoring
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
            Manage live results and validate completed matches.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#0a1628', border: '1px solid #162f62', color: '#94a3b8', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Filter size={14} /> FILTER
          </button>
          <button className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={14} /> SYNC DATA
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Live Matches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif' }}>
              <Video size={18} color="#ff5252" /> LIVE MATCHES
            </h2>
            <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '0.25rem 0.75rem', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
              3 ACTIVE
            </div>
          </div>

          {/* Match Card 1: In Progress */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ background: '#112650', padding: '0.25rem 0.5rem', fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '0.1em' }}>MATCH ID: #9926-A</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 2 }}>
                  <div style={{ width: 6, height: 6, background: '#ff5252', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.6rem', color: '#ff5252', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>GRAND FINALS - BO5</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              {/* Team 1 */}
              <div style={{ background: '#060d1f', border: '1px solid #112650', padding: '1.5rem', width: 220, textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, margin: '0 auto 1rem auto' }}>
                  <ShieldCheck size={48} color="#f5c518" />
                </div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>Neon Vipers</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em' }}>SEED 1</div>
              </div>

              {/* Score Center */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#060d1f', border: '1px solid #162f62', padding: '0.5rem 1rem' }}>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', width: 40, textAlign: 'center' }}>2</span>
                  <span style={{ fontSize: '1.5rem', color: '#475569', margin: '0 0.5rem' }}>-</span>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', width: 40, textAlign: 'center' }}>1</span>
                </div>
                <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem' }}>
                  UPDATE SCORE
                </button>
              </div>

              {/* Team 2 */}
              <div style={{ background: '#060d1f', border: '1px solid #112650', padding: '1.5rem', width: 220, textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, margin: '0 auto 1rem auto' }}>
                  {/* Faux icon for team 2 */}
                  <svg viewBox="0 0 24 24" width="48" height="48" stroke="#4fc3f7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                </div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>Quantum Flux</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em' }}>SEED 4</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>GAME 4 IN PROGRESS</div>
              <div style={{ flex: 1, height: 4, background: '#112650', borderRadius: 2 }}>
                <div style={{ width: '65%', height: '100%', background: '#f5c518', borderRadius: 2 }}></div>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#f5c518', fontWeight: 700, letterSpacing: '0.05em' }}>35:12</div>
            </div>
          </div>

          {/* Match Card 2: Awaiting Resolution */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ background: '#112650', padding: '0.25rem 0.5rem', fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '0.1em' }}>MATCH ID: #9928-B</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-block', background: 'rgba(79, 195, 247, 0.1)', border: '1px solid rgba(79, 195, 247, 0.3)', color: '#4fc3f7', padding: '0.2rem 0.5rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 2 }}>
                  AWAITING RESOLUTION
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>SEMI FINALS - BO3</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', width: 220, textAlign: 'center', background: '#060d1f', border: '1px solid #112650', padding: '1.5rem' }}>
                Crimson Dawn
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '3rem', fontWeight: 800, color: '#ffffff' }}>2</span>
                <span style={{ fontSize: '2rem', color: '#475569', margin: '0 0.5rem' }}>-</span>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '3rem', fontWeight: 800, color: '#94a3b8' }}>0</span>
              </div>

              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#94a3b8', width: 220, textAlign: 'center', background: '#060d1f', border: '1px solid #112650', padding: '1.5rem' }}>
                Void Walkers
              </div>
            </div>

            {/* Resolution Bar */}
            <div style={{ background: '#060d1f', border: '1px dashed #162f62', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em' }}>MATCH CONCLUDED. SELECT WINNER:</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ background: 'transparent', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.5rem 1.5rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>CRIMSON DAWN</button>
                <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckSquare size={14} /> CONFIRM RESULT
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Validated Results */}
        <div style={{ background: '#0a1628', border: '1px solid #162f62', display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #112650', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '1rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif' }}>
              <CheckSquare size={18} color="#f5c518" /> VALIDATED RESULTS
            </h2>
            <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </button>
          </div>

          <div style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '1rem' }}>PENDING BROADCAST APPROVAL</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Validated Match 1 */}
              <div style={{ background: '#060d1f', border: '1px solid #112650', padding: '1rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>MATCH #9925-Q</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>Team Alpha</span>
                  <span style={{ background: '#162f62', color: '#f5c518', fontSize: '0.7rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>3</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Omega Squad</span>
                  <span style={{ background: '#112650', color: '#64748b', fontSize: '0.7rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>1</span>
                </div>
              </div>

              {/* Validated Match 2 */}
              <div style={{ background: '#060d1f', border: '1px solid #112650', padding: '1rem' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>MATCH #9926-Q</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>Cyber Punks</span>
                  <span style={{ background: '#162f62', color: '#f5c518', fontSize: '0.7rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>2</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Glitch Mob</span>
                  <span style={{ background: '#112650', color: '#64748b', fontSize: '0.7rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>0</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.5rem', borderTop: '1px solid #112650', marginTop: 'auto' }}>
            <button style={{ background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', width: '100%', padding: '0.75rem', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'border-color 0.2s' }}>
              PUSH ALL TO BROADCAST <RadioTower size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
