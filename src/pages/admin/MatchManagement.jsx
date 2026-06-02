import React, { useState } from 'react';
import { Plus, Filter, Trophy, Clock, CheckCircle } from 'lucide-react';
import InputScore from '../../components/admin/InputScore';
import toast from 'react-hot-toast';

const initialMatches = [
  { id: '#AX-994', teams: ['Omega Squad', 'Void Walkers'], teamIds: [1, 2], tournament: 'Championship Series', schedule: 'Today, 18:00 EST', status: 'upcoming', score: null, winner: null },
  { id: '#AX-993', teams: ['Team Liquid', 'Navi'], teamIds: [3, 4], tournament: 'Apex Predator Series', schedule: 'Today, 16:30 EST', status: 'upcoming', score: null, winner: null },
  { id: '#AX-992', teams: ['Cloud9', 'Fnatic'], teamIds: [5, 6], tournament: 'Ignition Cup', schedule: 'Today, 14:00 EST', status: 'in_progress', score: null, winner: null },
  { id: '#AX-991', teams: ['G2 Esports', 'Vitality'], teamIds: [7, 8], tournament: 'Apex Predator Series', schedule: 'Yesterday, 20:00 EST', status: 'finished', score: { t1: 3, t2: 1 }, winner: 'G2 Esports' },
  { id: '#AX-990', teams: ['FaZe Clan', 'Astralis'], teamIds: [9, 10], tournament: 'Ignition Cup', schedule: 'Yesterday, 17:00 EST', status: 'finished', score: { t1: 2, t2: 2 }, winner: null },
];

const statusMap = {
  upcoming: { label: 'UPCOMING', cls: 'badge-upcoming' },
  in_progress: { label: 'IN PROGRESS', cls: 'badge-live', dot: true },
  finished: { label: 'FINISHED', cls: 'badge-finished' },
};

const tabs = ['All', 'Upcoming', 'In Progress', 'Finished'];

export default function MatchManagement() {
  const [matches, setMatches] = useState(initialMatches);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMatch, setSelectedMatch] = useState(null);

  const filtered = matches.filter(m => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return m.status === 'upcoming';
    if (activeTab === 'In Progress') return m.status === 'in_progress';
    if (activeTab === 'Finished') return m.status === 'finished';
    return true;
  });

  const handleScoreSubmit = (payload) => {
    setMatches(prev => prev.map(m =>
      m.id === payload.matchId
        ? {
          ...m,
          status: 'finished',
          score: { t1: payload.score_team1, t2: payload.score_team2 },
          winner: payload.winner_team_name,
        }
        : m
    ));
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
                const st = statusMap[match.status];
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
        </div>
      </div>

      {/* InputScore Modal */}
      {selectedMatch && (
        <InputScore
          match={selectedMatch}
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
