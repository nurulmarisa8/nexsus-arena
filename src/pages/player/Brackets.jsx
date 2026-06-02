import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';

const bracket = {
  name: 'Ignition Cup Qualifiers',
  rounds: [
    {
      name: 'Quarter Finals',
      matches: [
        { team1: 'Void Walkers', team2: 'Phantom X', score1: 3, score2: 1, winner: 0 },
        { team1: 'Crimson Surge', team2: 'Iron Veil', score1: 2, score2: 3, winner: 1 },
        { team1: 'Apex One', team2: 'Luna Six', score1: 3, score2: 0, winner: 0 },
        { team1: 'Zenith', team2: 'Nova', score1: 1, score2: 2, winner: 1 },
      ],
    },
    {
      name: 'Semi Finals',
      matches: [
        { team1: 'Void Walkers', team2: 'Iron Veil', score1: null, score2: null, winner: null },
        { team1: 'Apex One', team2: 'Nova', score1: null, score2: null, winner: null },
      ],
    },
    {
      name: 'Grand Final',
      matches: [
        { team1: 'TBD', team2: 'TBD', score1: null, score2: null, winner: null },
      ],
    },
  ],
};

function MatchCard({ match }) {
  return (
    <div style={{ background: '#0a1628', border: '1px solid #112650', borderRadius: 8, overflow: 'hidden', width: 200 }}>
      {[0, 1].map(i => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.625rem 0.875rem',
          background: match.winner === i ? 'rgba(105,240,174,0.06)' : 'transparent',
          borderBottom: i === 0 ? '1px solid #112650' : 'none',
        }}>
          <span style={{
            fontFamily: 'Rajdhani, sans-serif', fontWeight: match.winner === i ? 700 : 500,
            fontSize: '0.85rem',
            color: match.winner === i ? '#e2e8f0' : '#64748b',
          }}>
            {i === 0 ? match.team1 : match.team2}
          </span>
          <span style={{
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.9rem',
            color: match.winner === i ? '#69f0ae' : (match.score1 !== null ? '#475569' : '#2d3748'),
          }}>
            {match.winner !== null ? (i === 0 ? match.score1 : match.score2) : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Brackets() {
  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
          Tournament Brackets
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Track progression across all rounds of the {bracket.name}.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3rem', minWidth: 800 }}>
          {bracket.rounds.map((round, ri) => (
            <div key={ri} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Round label */}
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#f5c518', marginBottom: '1rem', textAlign: 'center',
                fontFamily: 'Rajdhani, sans-serif',
              }}>
                {round.name}
              </div>

              {/* Matches */}
              <div style={{
                display: 'flex', flexDirection: 'column',
                gap: ri === 0 ? '1rem' : ri === 1 ? '4.5rem' : '10rem',
                justifyContent: 'center',
                flex: 1,
              }}>
                {round.matches.map((match, mi) => (
                  <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MatchCard match={match} />
                    {ri < bracket.rounds.length - 1 && (
                      <ChevronRight size={14} color="#162f62" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Trophy */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
            <div style={{
              width: 60, height: 60, background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.3)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy size={28} color="#f5c518" />
            </div>
            <span style={{ fontSize: '0.65rem', color: '#f5c518', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.08em' }}>CHAMPION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
