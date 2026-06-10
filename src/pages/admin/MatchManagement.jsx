import React, { useState, useEffect } from 'react';
import { Plus, Filter, Trophy, Clock, CheckCircle, Loader2 } from 'lucide-react';
import InputScore from '../../components/admin/InputScore';
import toast from 'react-hot-toast';
import { matchesAPI } from '../../services/api';

const statusMap = {
  upcoming: { label: 'UPCOMING', cls: 'badge-upcoming' },
  in_progress: { label: 'IN PROGRESS', cls: 'badge-live', dot: true },
  finished: { label: 'FINISHED', cls: 'badge-finished' },
};

const tabs = ['All', 'Upcoming', 'In Progress', 'Finished'];

export default function MatchManagement() {
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const res = await matchesAPI.list();
      const data = Array.isArray(res.data) ? res.data : (res.data.matches || res.data.data || []);
      setMatches(data.map(m => ({
        id: m.id ? `#${m.id}` : (m.match_id ? `#${m.match_id}` : ''),
        rawId: m.id || m.match_id,
        teams: [
          m.team1_name || m.team1?.name || m.teams?.[0] || 'Team 1',
          m.team2_name || m.team2?.name || m.teams?.[1] || 'Team 2',
        ],
        teamIds: [
          m.team1_id || m.team1?.id || m.teamIds?.[0] || null,
          m.team2_id || m.team2?.id || m.teamIds?.[1] || null,
        ],
        tournament: m.tournament || m.tournament_name || m.tournament?.name || '',
        schedule: m.schedule || m.scheduled_at || m.start_time || '',
        status: m.status || 'upcoming',
        score: m.score ? m.score : (m.score_team1 != null && m.score_team2 != null ? { t1: m.score_team1, t2: m.score_team2 } : null),
        winner: m.winner || m.winner_name || m.winner_team_name || null,
      })));
    } catch (err) {
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const filtered = matches.filter(m => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return m.status === 'upcoming';
    if (activeTab === 'In Progress') return m.status === 'in_progress';
    if (activeTab === 'Finished') return m.status === 'finished';
    return true;
  });

  const handleScoreSubmit = async (payload) => {
    try {
      await matchesAPI.submitScore(payload.matchId, {
        score_team1: payload.score_team1,
        score_team2: payload.score_team2,
      });
      await fetchMatches();
    } catch (err) {
      toast.error('Failed to submit score via API, updating locally');
      setMatches(prev => prev.map(m =>
        m.id === payload.matchId || m.rawId === payload.matchId
          ? {
            ...m,
            status: 'finished',
            score: { t1: payload.score_team1, t2: payload.score_team2 },
            winner: payload.winner_team_name,
          }
          : m
      ));
    }
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            Match Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Schedule, monitor, and finalize match results.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} /> Filter
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Create Match
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Matches', value: matches.length, icon: Trophy, color: '#f5c518' },
          { label: 'In Progress', value: matches.filter(m => m.status === 'in_progress').length, icon: Clock, color: '#ff5252' },
          { label: 'Finished', value: matches.filter(m => m.status === 'finished').length, icon: CheckCircle, color: '#69f0ae' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, background: `${color}15`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="card">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '0.875rem 1.25rem', borderBottom: '1px solid #112650' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.375rem 0.875rem', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em',
              background: activeTab === tab ? 'rgba(245,197,24,0.1)' : 'none',
              color: activeTab === tab ? '#f5c518' : '#64748b',
              borderBottom: activeTab === tab ? '2px solid #f5c518' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <Loader2 size={28} className="animate-spin" style={{ color: '#475569' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#475569', fontSize: '0.85rem' }}>
              No matches found.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Match ID</th>
                  <th>Teams</th>
                  <th>Tournament</th>
                  <th>Schedule</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(match => {
                  const st = statusMap[match.status] || statusMap.upcoming;
                  return (
                    <tr key={match.id}>
                      <td>
                        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0' }}>{match.id}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: '#f5c518', fontWeight: 600 }}>{match.teams[0]}</span>
                          <span style={{ color: '#475569', fontSize: '0.7rem' }}>vs</span>
                          <span style={{ color: '#cbd5e1' }}>{match.teams[1]}</span>
                        </div>
                        {match.winner && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontSize: '0.7rem', color: '#69f0ae' }}>
                            <Trophy size={10} />
                            Winner: {match.winner}
                          </div>
                        )}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{match.tournament}</td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{match.schedule}</td>
                      <td>
                        {match.score ? (
                          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', fontSize: '1rem' }}>
                            {match.score.t1} — {match.score.t2}
                          </span>
                        ) : (
                          <span style={{ color: '#475569', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${st.cls}`}>
                          {st.dot && <span className="live-dot" style={{ width: 6, height: 6 }} />}
                          {st.label}
                        </span>
                      </td>
                      <td>
                        {match.status !== 'finished' ? (
                          <button
                            className="btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem' }}
                            onClick={() => setSelectedMatch(match)}
                            id={`input-score-${match.id}`}
                          >
                            Input Score
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#475569' }}>Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* InputScore Modal */}
      {selectedMatch && (
        <InputScore
          match={{
            ...selectedMatch,
            id: selectedMatch.rawId || selectedMatch.id,
          }}
          onClose={() => setSelectedMatch(null)}
          onSubmit={(payload) => {
            handleScoreSubmit(payload);
            setSelectedMatch(null);
          }}
        />
      )}
    </div>
  );
}
