import React, { useState, useEffect } from 'react';
import { Trophy, ChevronRight, Loader2 } from 'lucide-react';
import { tournamentsAPI } from '../../services/api';

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
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingBracket, setLoadingBracket] = useState(false);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await tournamentsAPI.list();
        const data = res.data || [];
        setTournaments(data);
        if (data.length > 0) {
          setSelectedTournament(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch tournaments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;
    const fetchBracket = async () => {
      setLoadingBracket(true);
      try {
        const res = await tournamentsAPI.brackets(selectedTournament);
        setBracket(res.data);
      } catch (err) {
        console.error('Failed to fetch bracket', err);
        setBracket(null);
      } finally {
        setLoadingBracket(false);
      }
    };
    fetchBracket();
  }, [selectedTournament]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#f5c518' }} />
      </div>
    );
  }

  const selectedName = tournaments.find(t => t.id === selectedTournament)?.title || 'Tournament';

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
          Tournament Brackets
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Track progression across all rounds of the {selectedName}.</p>
      </div>

      {/* Tournament Selector */}
      {tournaments.length > 1 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <select
            className="input-field"
            style={{ width: 'auto', padding: '0.5rem 2.5rem 0.5rem 1rem', fontSize: '0.85rem' }}
            value={selectedTournament || ''}
            onChange={e => setSelectedTournament(Number(e.target.value))}
          >
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
      )}

      {loadingBracket ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <Loader2 size={24} className="animate-spin" style={{ color: '#f5c518' }} />
        </div>
      ) : !bracket || !bracket.rounds || bracket.rounds.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Trophy size={40} style={{ color: '#475569', marginBottom: '1rem', opacity: 0.3 }} />
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No bracket data available for this tournament yet.</p>
          <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: 4 }}>Brackets will appear once matches are scheduled.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
