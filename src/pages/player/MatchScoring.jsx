import React, { useState, useEffect } from 'react';
import { Loader2, Trophy, Calendar, Clock, ShieldCheck, Activity } from 'lucide-react';
import { matchesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/* ─── Status Badge ─── */
function StatusBadge({ status }) {
  const map = {
    live: { label: 'LIVE', bg: 'rgba(255,82,82,0.15)', color: '#ff5252', dot: true },
    in_progress: { label: 'IN PROGRESS', bg: 'rgba(255,82,82,0.1)', color: '#ff5252', dot: true },
    upcoming: { label: 'UPCOMING', bg: 'rgba(79,195,247,0.1)', color: '#4fc3f7', dot: false },
    finished: { label: 'FINISHED', bg: 'rgba(105,240,174,0.1)', color: '#69f0ae', dot: false },
  };
  const s = map[status] || map.upcoming;
  return (
    <span style={{
      background: s.bg, color: s.color, padding: '0.2rem 0.6rem',
      fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
      borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      {s.dot && <span style={{ width: 5, height: 5, background: '#ff5252', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />}
      {s.label}
    </span>
  );
}

/* ─── Match Card ─── */
function MatchCard({ match, myTeamId }) {
  const isMyTeam1 = match.team1_id === myTeamId;
  const isMyTeam2 = match.team2_id === myTeamId;
  const myTeamName = isMyTeam1 ? match.team1_name : isMyTeam2 ? match.team2_name : null;
  const opponentName = isMyTeam1 ? match.team2_name : isMyTeam2 ? match.team1_name : null;
  const myScore = isMyTeam1 ? match.score_team1 : match.score_team2;
  const oppScore = isMyTeam1 ? match.score_team2 : match.score_team1;
  const iWon = match.winner_name && myTeamName && match.winner_name === myTeamName;
  const iLost = match.winner_name && myTeamName && match.winner_name !== myTeamName;
  const isDraw = match.status === 'finished' && !match.winner_name;

  return (
    <div style={{
      background: '#0a1628',
      border: `1px solid ${iWon ? 'rgba(105,240,174,0.3)' : iLost ? 'rgba(255,82,82,0.2)' : '#162f62'}`,
      borderLeft: `4px solid ${iWon ? '#69f0ae' : iLost ? '#ff5252' : isDraw ? '#f5c518' : '#162f62'}`,
      padding: '1.25rem',
      transition: 'border-color 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusBadge status={match.status} />
          <span style={{ fontSize: '0.65rem', color: '#475569', letterSpacing: '0.05em' }}>
            {match.tournament_name}
          </span>
        </div>
        {match.status === 'finished' && (
          <span style={{
            fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.06em', padding: '0.2rem 0.6rem', borderRadius: 2,
            background: iWon ? 'rgba(105,240,174,0.15)' : iLost ? 'rgba(255,82,82,0.1)' : 'rgba(245,197,24,0.1)',
            color: iWon ? '#69f0ae' : iLost ? '#ff5252' : '#f5c518',
          }}>
            {iWon ? '🏆 WIN' : iLost ? 'LOSS' : 'DRAW'}
          </span>
        )}
      </div>

      {/* Teams & Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Team 1 */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ marginBottom: 8 }}>
            <ShieldCheck size={28} color={match.team1_id === myTeamId ? '#f5c518' : '#4fc3f7'} />
          </div>
          <div style={{
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 800,
            color: match.team1_id === myTeamId ? '#f5c518' : '#94a3b8',
            fontSize: '0.95rem', letterSpacing: '0.02em',
          }}>
            {match.team1_name}
            {match.team1_id === myTeamId && (
              <span style={{ display: 'block', fontSize: '0.55rem', color: '#f5c518', letterSpacing: '0.1em', marginTop: 2 }}>YOUR TEAM</span>
            )}
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#060d1f', border: '1px solid #162f62', padding: '0.5rem 1rem' }}>
            <span style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 800,
              color: match.status === 'finished' ? '#ffffff' : '#475569', width: 36, textAlign: 'center',
            }}>
              {match.score_team1}
            </span>
            <span style={{ fontSize: '1rem', color: '#475569' }}>–</span>
            <span style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 800,
              color: match.status === 'finished' ? '#ffffff' : '#475569', width: 36, textAlign: 'center',
            }}>
              {match.score_team2}
            </span>
          </div>
          {match.status === 'upcoming' && (
            <div style={{ fontSize: '0.6rem', color: '#475569', marginTop: 4, letterSpacing: '0.06em' }}>SCHEDULED</div>
          )}
        </div>

        {/* Team 2 */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ marginBottom: 8 }}>
            <ShieldCheck size={28} color={match.team2_id === myTeamId ? '#f5c518' : '#4fc3f7'} />
          </div>
          <div style={{
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 800,
            color: match.team2_id === myTeamId ? '#f5c518' : '#94a3b8',
            fontSize: '0.95rem', letterSpacing: '0.02em',
          }}>
            {match.team2_name}
            {match.team2_id === myTeamId && (
              <span style={{ display: 'block', fontSize: '0.55rem', color: '#f5c518', letterSpacing: '0.1em', marginTop: 2 }}>YOUR TEAM</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer info */}
      {(match.match_date || match.winner_name) && (
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #112650', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {match.match_date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.65rem', color: '#475569' }}>
              <Calendar size={12} />
              {new Date(match.match_date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          )}
          {match.winner_name && (
            <div style={{ fontSize: '0.65rem', color: '#f5c518', letterSpacing: '0.05em', fontWeight: 700 }}>
              🏆 Winner: {match.winner_name}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Komponen Utama
───────────────────────────────────────────── */
export default function MatchScoring() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my'); // 'my' | 'all'
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await matchesAPI.list();
        // Normalize: backend uses 'pending' as default, show as 'upcoming'
        const data = (Array.isArray(res.data) ? res.data : []).map(m => ({
          ...m,
          status: m.status === 'pending' ? 'upcoming' : m.status,
        }));
        setAllMatches(data);

        // Filter matches that involve user's team
        if (user?.team_id) {
          const myMatches = data.filter(m =>
            m.team1_id === user.team_id || m.team2_id === user.team_id
          );
          setMatches(myMatches);
        } else {
          setMatches([]);
        }
      } catch (err) {
        toast.error('Gagal memuat data matches');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [user?.team_id]);

  const displayMatches = (activeTab === 'my' ? matches : allMatches)
    .filter(m => !statusFilter || m.status === statusFilter);

  const myLive = matches.filter(m => ['live', 'in_progress'].includes(m.status)).length;
  const myUpcoming = matches.filter(m => m.status === 'upcoming').length;
  const myFinished = matches.filter(m => m.status === 'finished').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '2.5rem', flex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '0.25rem' }}>
              MATCH SCORING
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Lihat jadwal dan hasil pertandingan tim kamu.
            </p>
          </div>
          {myLive > 0 && (
            <div style={{ background: '#0a1628', border: '1px solid rgba(255,82,82,0.3)', borderRadius: 4, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 6, height: 6, background: '#ff5252', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff5252', letterSpacing: '0.1em' }}>{myLive} MATCH LIVE</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        {user?.team_id && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'LIVE NOW', value: myLive, color: '#ff5252', icon: Activity },
              { label: 'UPCOMING', value: myUpcoming, color: '#4fc3f7', icon: Clock },
              { label: 'COMPLETED', value: myFinished, color: '#69f0ae', icon: Trophy },
            ].map(s => (
              <div key={s.label} style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <s.icon size={20} color={s.color} />
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#475569', letterSpacing: '0.1em', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab & Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #162f62' }}>
            {[
              { key: 'my', label: `My Matches (${matches.length})` },
              { key: 'all', label: `All Matches (${allMatches.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                background: 'none', border: 'none', padding: '0.5rem 1.25rem',
                fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                color: activeTab === t.key ? '#f5c518' : '#64748b',
                borderBottom: activeTab === t.key ? '3px solid #f5c518' : '3px solid transparent',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          <select
            style={{ background: '#0a1628', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.45rem 1rem', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="in_progress">In Progress</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        {/* No Team Warning */}
        {!user?.team_id && activeTab === 'my' && (
          <div style={{ background: 'rgba(245,197,24,0.06)', border: '1px solid rgba(245,197,24,0.2)', padding: '1.25rem', borderRadius: 4, marginBottom: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            ⚠️ <strong style={{ color: '#f5c518' }}>Kamu belum bergabung ke tim.</strong> Buat atau bergabung ke tim di Team Hub untuk melihat jadwal pertandingan timmu.
          </div>
        )}

        {/* Match List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#f5c518' }} />
          </div>
        ) : displayMatches.length === 0 ? (
          <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '3rem', textAlign: 'center' }}>
            <Calendar size={40} color="#162f62" style={{ marginBottom: '1rem' }} />
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              {activeTab === 'my'
                ? 'Belum ada pertandingan untuk tim kamu.'
                : 'Belum ada match yang tersedia.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {displayMatches.map(m => (
              <MatchCard key={m.id} match={m} myTeamId={user?.team_id} />
            ))}
          </div>
        )}
      </div>


    </div>
  );
}
