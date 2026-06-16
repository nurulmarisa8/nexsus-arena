import React, { useState, useEffect } from 'react';
import { Filter, Plus, Video, CheckSquare, Loader2, X, ShieldCheck, Activity, AlertCircle } from 'lucide-react';
import { matchesAPI, tournamentsAPI, teamsAPI } from '../../services/api';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Modal: Buat Match Baru
───────────────────────────────────────────── */
function CreateMatchModal({ onClose, onCreated }) {
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ tournament_id: '', team1_id: '', team2_id: '', match_date: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([tournamentsAPI.list(), teamsAPI.list()])
      .then(([tRes, tmRes]) => {
        setTournaments(Array.isArray(tRes.data) ? tRes.data : []);
        setTeams(Array.isArray(tmRes.data) ? tmRes.data : []);
      })
      .catch(() => toast.error('Gagal memuat data'))
      .finally(() => setFetching(false));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.tournament_id) e.tournament_id = 'Pilih turnamen';
    if (!form.team1_id) e.team1_id = 'Pilih Tim 1';
    if (!form.team2_id) e.team2_id = 'Pilih Tim 2';
    if (form.team1_id && form.team2_id && form.team1_id === form.team2_id) {
      e.team2_id = 'Tim 1 dan Tim 2 tidak boleh sama';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        tournament_id: Number(form.tournament_id),
        team1_id: Number(form.team1_id),
        team2_id: Number(form.team2_id),
        match_date: form.match_date || null,
      };
      const res = await matchesAPI.create(payload);
      toast.success('Match berhasil dibuat!');
      onCreated(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal membuat match');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.6rem 1rem', fontSize: '0.85rem', width: '100%', outline: 'none', borderRadius: 2 };
  const errStyle = { color: '#ff5252', fontSize: '0.72rem', marginTop: 4 };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ width: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #162f62' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>
            Create New Match
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        {fetching ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Loader2 size={28} className="animate-spin" style={{ color: '#f5c518' }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6, letterSpacing: '0.05em' }}>TOURNAMENT *</label>
              <select style={{ ...inputStyle }} value={form.tournament_id} onChange={e => setForm(p => ({ ...p, tournament_id: e.target.value }))}>
                <option value="">— Select Tournament —</option>
                {tournaments.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
              {errors.tournament_id && <p style={errStyle}>{errors.tournament_id}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6, letterSpacing: '0.05em' }}>TEAM 1 *</label>
                <select style={{ ...inputStyle }} value={form.team1_id} onChange={e => setForm(p => ({ ...p, team1_id: e.target.value }))}>
                  <option value="">— Select —</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                {errors.team1_id && <p style={errStyle}>{errors.team1_id}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6, letterSpacing: '0.05em' }}>TEAM 2 *</label>
                <select style={{ ...inputStyle }} value={form.team2_id} onChange={e => setForm(p => ({ ...p, team2_id: e.target.value }))}>
                  <option value="">— Select —</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                {errors.team2_id && <p style={errStyle}>{errors.team2_id}</p>}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6, letterSpacing: '0.05em' }}>MATCH DATE (Optional)</label>
              <input
                type="datetime-local"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                value={form.match_date}
                onChange={e => setForm(p => ({ ...p, match_date: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: '1px solid #162f62', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {loading ? 'Creating...' : 'Create Match'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Modal: Input Skor Pertandingan
   Flowchart: Validasi → Perbandingan Skor → Tentukan Pemenang → Update DB
───────────────────────────────────────────── */
function ScoreModal({ match, onClose, onUpdated }) {
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Step 4: Validasi Input (Decision)
  const validate = () => {
    const e = {};
    const s1 = score1.trim();
    const s2 = score2.trim();
    if (s1 === '' || s2 === '') {
      e.general = 'Format skor tidak valid: skor tidak boleh kosong';
      return e;
    }
    if (!/^\d+$/.test(s1) || !/^\d+$/.test(s2)) {
      e.general = 'Format skor tidak valid: skor harus berupa angka bulat';
      return e;
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Step 4: Validasi
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return; // Alur Tidak Valid — kembali ke input
    }

    setLoading(true);
    try {
      // Step 5-7: Submit ke backend → backend compare skor, tentukan pemenang, update status=finished
      const res = await matchesAPI.submitScore(match.id, {
        score_team1: Number(score1),
        score_team2: Number(score2),
      });
      // Step 8: Pesan Keberhasilan
      toast.success('Hasil pertandingan berhasil disimpan!');
      onUpdated(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal menyimpan skor');
    } finally {
      setLoading(false);
    }
  };

  const numInput = {
    background: '#060d1f', border: '1px solid #162f62', color: '#f5c518',
    textAlign: 'center', width: 80, padding: '0.75rem 0.5rem',
    fontSize: '2rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800,
    outline: 'none', borderRadius: 2,
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ width: 440 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #162f62' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>
            Input Skor Pertandingan
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
            MATCH ID #{match.id} — {match.tournament_name}
          </div>

          {/* Score Input */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: 8 }}>{match.team1_name}</div>
              <input
                type="number"
                min="0"
                style={{ ...numInput, border: errors.general ? '1px solid #ff5252' : '1px solid #162f62' }}
                value={score1}
                onChange={e => { setScore1(e.target.value); setErrors({}); }}
                placeholder="0"
                autoFocus
                id="score1-input"
              />
            </div>

            <div style={{ fontSize: '1.5rem', color: '#475569', fontWeight: 700, marginTop: 20 }}>VS</div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: 8 }}>{match.team2_name}</div>
              <input
                type="number"
                min="0"
                style={{ ...numInput, border: errors.general ? '1px solid #ff5252' : '1px solid #162f62' }}
                value={score2}
                onChange={e => { setScore2(e.target.value); setErrors({}); }}
                placeholder="0"
                id="score2-input"
              />
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.3)', padding: '0.75rem 1rem', borderRadius: 4, marginBottom: '1rem' }}>
              <AlertCircle size={14} color="#ff5252" />
              <span style={{ fontSize: '0.8rem', color: '#ff5252' }}>{errors.general}</span>
            </div>
          )}

          <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            ⚠️ Setelah skor disimpan, sistem akan otomatis menentukan pemenang dan mengubah status match menjadi <strong style={{ color: '#69f0ae' }}>Finished</strong>.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: '1px solid #162f62', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckSquare size={14} />}
              {loading ? 'Saving...' : 'Confirm Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Komponen Utama
───────────────────────────────────────────── */
export default function MatchManagement() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [scoreModal, setScoreModal] = useState(null); // match object
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await matchesAPI.list(params);
      // Normalize: backend uses 'pending' as default, we show it as 'upcoming'
      const normalized = (Array.isArray(res.data) ? res.data : []).map(m => ({
        ...m,
        status: m.status === 'pending' ? 'upcoming' : m.status,
      }));
      setMatches(normalized);
    } catch (err) {
      toast.error('Gagal memuat data matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, [statusFilter]);

  const handleMatchCreated = (newMatch) => {
    setMatches(prev => [newMatch, ...prev]);
  };

  const handleScoreUpdated = (updatedMatch) => {
    setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
  };

  const statusBadge = (status) => {
    const map = {
      live: { label: 'LIVE', bg: 'rgba(255,82,82,0.15)', color: '#ff5252' },
      in_progress: { label: 'IN PROGRESS', bg: 'rgba(255,82,82,0.1)', color: '#ff5252' },
      upcoming: { label: 'UPCOMING', bg: 'rgba(79,195,247,0.1)', color: '#4fc3f7' },
      finished: { label: 'FINISHED', bg: 'rgba(105,240,174,0.1)', color: '#69f0ae' },
    };
    const s = map[status] || map.upcoming;
    return (
      <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.5rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em', borderRadius: 2 }}>
        {s.label}
      </span>
    );
  };

  const liveMatches = matches.filter(m => ['live', 'in_progress'].includes(m.status));
  const finishedMatches = matches.filter(m => m.status === 'finished');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

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
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setFilterOpen(p => !p)}
              style={{ background: '#0a1628', border: '1px solid #162f62', color: '#94a3b8', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <Filter size={14} /> FILTER {statusFilter && `(${statusFilter})`}
            </button>
            {filterOpen && (
              <div style={{ position: 'absolute', top: '110%', right: 0, background: '#0d1f3c', border: '1px solid #162f62', borderRadius: 4, zIndex: 100, minWidth: 160 }}>
                {['', 'upcoming', 'live', 'in_progress', 'finished'].map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                    style={{ display: 'block', width: '100%', padding: '0.65rem 1rem', background: statusFilter === s ? 'rgba(245,197,24,0.1)' : 'transparent', border: 'none', color: statusFilter === s ? '#f5c518' : '#94a3b8', textAlign: 'left', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                    {s === '' ? 'All Matches' : s.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            id="create-match-btn"
          >
            <Plus size={14} /> CREATE MATCH
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#f5c518' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* Left Column: Matches List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Live / In Progress */}
            {liveMatches.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '1rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif' }}>
                    <Video size={16} color="#ff5252" /> LIVE MATCHES
                  </h2>
                  <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '0.2rem 0.65rem', fontSize: '0.6rem', color: '#ff5252', letterSpacing: '0.05em', fontWeight: 700 }}>
                    {liveMatches.length} ACTIVE
                  </div>
                </div>
                {liveMatches.map(m => <MatchCard key={m.id} match={m} onScore={() => setScoreModal(m)} statusBadge={statusBadge} />)}
              </div>
            )}

            {/* Upcoming */}
            {upcomingMatches.length > 0 && (
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '1rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', marginBottom: '1rem' }}>
                  <Activity size={16} color="#4fc3f7" /> UPCOMING MATCHES
                </h2>
                {upcomingMatches.map(m => <MatchCard key={m.id} match={m} onScore={() => setScoreModal(m)} statusBadge={statusBadge} />)}
              </div>
            )}

            {/* Empty */}
            {matches.length === 0 && (
              <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '3rem', textAlign: 'center' }}>
                <Activity size={40} color="#162f62" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#475569', fontSize: '0.9rem' }}>Belum ada match. Klik "CREATE MATCH" untuk membuat pertandingan baru.</p>
              </div>
            )}
          </div>

          {/* Right Column: Finished / Validated Results */}
          <div style={{ background: '#0a1628', border: '1px solid #162f62', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #112650', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif' }}>
                <CheckSquare size={16} color="#f5c518" /> VALIDATED RESULTS
              </h2>
              <span style={{ fontSize: '0.65rem', color: '#475569' }}>{finishedMatches.length} matches</span>
            </div>

            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 480, overflowY: 'auto' }}>
              {finishedMatches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#475569', fontSize: '0.8rem' }}>
                  Belum ada match yang selesai.
                </div>
              ) : (
                finishedMatches.map(m => (
                  <div key={m.id} style={{ background: '#060d1f', border: '1px solid #112650', padding: '1rem', borderRadius: 2 }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
                      MATCH #{m.id} · {m.tournament_name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', color: m.winner_name === m.team1_name ? '#f5c518' : '#e2e8f0', fontWeight: 700 }}>
                        {m.team1_name}
                      </span>
                      <span style={{ background: '#162f62', color: '#f5c518', fontSize: '0.75rem', padding: '0.15rem 0.5rem', fontWeight: 800, fontFamily: 'Rajdhani, sans-serif' }}>
                        {m.score_team1}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: m.winner_name === m.team2_name ? '#f5c518' : '#94a3b8', fontWeight: m.winner_name === m.team2_name ? 700 : 400 }}>
                        {m.team2_name}
                      </span>
                      <span style={{ background: '#112650', color: '#64748b', fontSize: '0.75rem', padding: '0.15rem 0.5rem', fontWeight: 800, fontFamily: 'Rajdhani, sans-serif' }}>
                        {m.score_team2}
                      </span>
                    </div>
                    {m.winner_name && (
                      <div style={{ marginTop: 6, fontSize: '0.65rem', color: '#f5c518', letterSpacing: '0.05em' }}>
                        🏆 Winner: {m.winner_name}
                      </div>
                    )}
                    {!m.winner_name && <div style={{ marginTop: 6, fontSize: '0.65rem', color: '#475569' }}>Draw</div>}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateMatchModal onClose={() => setShowCreateModal(false)} onCreated={handleMatchCreated} />
      )}
      {scoreModal && (
        <ScoreModal match={scoreModal} onClose={() => setScoreModal(null)} onUpdated={handleScoreUpdated} />
      )}
    </div>
  );
}

/* ─── Match Card Component ─── */
function MatchCard({ match, onScore, statusBadge }) {
  return (
    <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '1.25rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ background: '#112650', padding: '0.2rem 0.6rem', fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '0.1em' }}>
          MATCH #{match.id}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {statusBadge(match.status)}
          <span style={{ fontSize: '0.65rem', color: '#475569' }}>{match.tournament_name}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        {/* Team 1 */}
        <div style={{ background: '#060d1f', border: '1px solid #112650', padding: '1rem 1.5rem', flex: 1, textAlign: 'center' }}>
          <ShieldCheck size={28} color="#f5c518" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{match.team1_name}</div>
        </div>

        {/* Score Center */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#060d1f', border: '1px solid #162f62', padding: '0.5rem 1rem' }}>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#ffffff', width: 32, textAlign: 'center' }}>
              {match.score_team1}
            </span>
            <span style={{ fontSize: '1.25rem', color: '#475569', margin: '0 0.5rem' }}>–</span>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#ffffff', width: 32, textAlign: 'center' }}>
              {match.score_team2}
            </span>
          </div>
          {match.status !== 'finished' && (
            <button
              className="btn-primary"
              onClick={onScore}
              style={{ padding: '0.4rem 1.25rem', fontSize: '0.7rem', whiteSpace: 'nowrap' }}
              id={`score-match-${match.id}`}
            >
              INPUT SKOR
            </button>
          )}
          {match.status === 'finished' && match.winner_name && (
            <div style={{ fontSize: '0.65rem', color: '#f5c518', fontWeight: 700, textAlign: 'center' }}>
              🏆 {match.winner_name}
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div style={{ background: '#060d1f', border: '1px solid #112650', padding: '1rem 1.5rem', flex: 1, textAlign: 'center' }}>
          <ShieldCheck size={28} color="#4fc3f7" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{match.team2_name}</div>
        </div>
      </div>

      {match.match_date && (
        <div style={{ fontSize: '0.65rem', color: '#475569', textAlign: 'center' }}>
          📅 {new Date(match.match_date).toLocaleString('id-ID')}
        </div>
      )}
    </div>
  );
}
