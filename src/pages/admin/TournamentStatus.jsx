import React, { useState, useEffect } from 'react';
import { Filter, Plus, Settings, ChevronDown, Gamepad2, Target, ChevronRight, X, Loader2, AlertCircle, Trophy, Swords } from 'lucide-react';
import { tournamentsAPI, gamesAPI } from '../../services/api';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Modal: Buat Turnamen Baru (Include → Pilih Game)
───────────────────────────────────────────── */
function CreateTournamentModal({ games, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', game_id: '', prize_pool: '', max_teams: 16,
    description: '', format: '', region: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Nama turnamen wajib diisi';
    if (!form.game_id) e.game_id = 'Pilih game terlebih dahulu (required by use case)';
    if (!form.prize_pool.trim()) e.prize_pool = 'Prize pool wajib diisi';
    if (!form.max_teams || form.max_teams < 2) e.max_teams = 'Minimal 2 tim';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await tournamentsAPI.create({
        title: form.title.trim(),
        game_id: Number(form.game_id),
        prize_pool: form.prize_pool.trim(),
        max_teams: Number(form.max_teams),
        description: form.description || null,
        format: form.format || null,
        region: form.region || null,
      });
      toast.success('Turnamen berhasil dibuat!');
      onCreated(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal membuat turnamen');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0',
    padding: '0.6rem 1rem', fontSize: '0.85rem', width: '100%', outline: 'none', borderRadius: 2,
  };
  const errStyle = { color: '#ff5252', fontSize: '0.72rem', marginTop: 4 };
  const labelStyle = { display: 'block', fontSize: '0.7rem', color: '#94a3b8', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ width: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #162f62', position: 'sticky', top: 0, background: '#0d1f3c', zIndex: 1 }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>
            Create New Tournament
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Step 1: Pilih Game (<<include>>) */}
          <div style={{ background: 'rgba(245,197,24,0.05)', border: '1px solid rgba(245,197,24,0.2)', padding: '0.75rem 1rem', borderRadius: 2, marginBottom: 4 }}>
            <div style={{ fontSize: '0.65rem', color: '#f5c518', letterSpacing: '0.08em', marginBottom: 6 }}>
              ⚡ USE CASE: Kelola Turnamen «include» Kelola Data Game
            </div>
            <label style={labelStyle}>Pilih Game *</label>
            <select
              style={{ ...inputStyle, border: errors.game_id ? '1px solid #ff5252' : '1px solid #162f62' }}
              value={form.game_id}
              onChange={e => setForm(p => ({ ...p, game_id: e.target.value }))}
            >
              <option value="">— Pilih Game Terlebih Dahulu —</option>
              {games.map(g => <option key={g.id} value={g.id}>{g.name} ({g.genre})</option>)}
            </select>
            {errors.game_id && <p style={errStyle}><AlertCircle size={12} style={{ display: 'inline', marginRight: 4 }} />{errors.game_id}</p>}
          </div>

          <div>
            <label style={labelStyle}>Nama Turnamen *</label>
            <input
              style={{ ...inputStyle, border: errors.title ? '1px solid #ff5252' : '1px solid #162f62' }}
              placeholder="e.g. Valorant Champions Series"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            />
            {errors.title && <p style={errStyle}>{errors.title}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Prize Pool *</label>
              <input
                style={{ ...inputStyle, border: errors.prize_pool ? '1px solid #ff5252' : '1px solid #162f62' }}
                placeholder="e.g. $10,000"
                value={form.prize_pool}
                onChange={e => setForm(p => ({ ...p, prize_pool: e.target.value }))}
              />
              {errors.prize_pool && <p style={errStyle}>{errors.prize_pool}</p>}
            </div>
            <div>
              <label style={labelStyle}>Max Teams *</label>
              <input
                type="number" min={2} max={128}
                style={{ ...inputStyle, border: errors.max_teams ? '1px solid #ff5252' : '1px solid #162f62' }}
                value={form.max_teams}
                onChange={e => setForm(p => ({ ...p, max_teams: e.target.value }))}
              />
              {errors.max_teams && <p style={errStyle}>{errors.max_teams}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Format</label>
              <select style={inputStyle} value={form.format} onChange={e => setForm(p => ({ ...p, format: e.target.value }))}>
                <option value="">— Select —</option>
                <option>Single Elimination</option>
                <option>Double Elimination</option>
                <option>Round Robin</option>
                <option>Swiss</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Region</label>
              <select style={inputStyle} value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))}>
                <option value="">— Select —</option>
                <option>NA East</option>
                <option>EU West</option>
                <option>Asia Pacific</option>
                <option>Global</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Deskripsi singkat turnamen..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: '1px solid #162f62', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {loading ? 'Creating...' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Status Dropdown inline ─── */
function StatusDropdown({ tournament, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statuses = ['upcoming', 'registration_open', 'live', 'finished'];
  const statusLabel = { upcoming: 'UPCOMING', registration_open: 'REG OPEN', live: 'LIVE', finished: 'FINISHED' };
  const statusColor = { upcoming: '#4fc3f7', registration_open: '#f5c518', live: '#ff5252', finished: '#69f0ae' };

  const handleChange = async (newStatus) => {
    setOpen(false);
    if (newStatus === tournament.status) return;
    setLoading(true);
    try {
      const res = await tournamentsAPI.update(tournament.id, { status: newStatus });
      toast.success(`Status berhasil diubah ke ${newStatus}`);
      onUpdate(res.data);
    } catch (err) {
      toast.error('Gagal mengubah status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(p => !p)}
        disabled={loading}
        style={{
          background: '#060d1f', border: '1px solid #162f62', padding: '0.4rem 0.75rem',
          fontSize: '0.72rem', color: statusColor[tournament.status] || '#e2e8f0',
          display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700,
        }}
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : (statusLabel[tournament.status] || tournament.status.toUpperCase())}
        <ChevronDown size={12} color="#64748b" />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', right: 0, background: '#0d1f3c', border: '1px solid #162f62', borderRadius: 4, zIndex: 100, minWidth: 160 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => handleChange(s)}
              style={{
                display: 'block', width: '100%', padding: '0.6rem 1rem',
                background: tournament.status === s ? 'rgba(245,197,24,0.1)' : 'transparent',
                border: 'none', color: statusColor[s] || '#94a3b8', textAlign: 'left',
                fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600,
              }}>
              {statusLabel[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Komponen Utama
───────────────────────────────────────────── */
export default function TournamentStatus() {
  const [tournaments, setTournaments] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, gRes] = await Promise.all([tournamentsAPI.list(), gamesAPI.list()]);
      setTournaments(Array.isArray(tRes.data) ? tRes.data : []);
      setGames(Array.isArray(gRes.data) ? gRes.data : []);
    } catch (err) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreated = (t) => setTournaments(prev => [t, ...prev]);
  const handleUpdated = (t) => setTournaments(prev => prev.map(x => x.id === t.id ? t : x));

  const statusBadgeStyle = (status) => {
    const map = {
      live: { bg: '#f5c518', color: '#060d1f' },
      registration_open: { bg: '#f5c518', color: '#060d1f' },
      upcoming: { bg: '#112650', color: '#4fc3f7' },
      finished: { bg: 'rgba(105,240,174,0.15)', color: '#69f0ae' },
    };
    return map[status] || map.upcoming;
  };

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
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary"
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          id="create-tournament-btn"
        >
          <Plus size={16} /> NEW TOURNAMENT
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#f5c518' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start', maxWidth: 900 }}>

          {/* Left: Tournaments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tournaments.length === 0 ? (
              <div style={{ background: '#0a1628', border: '1px solid #162f62', padding: '3rem', textAlign: 'center' }}>
                <Trophy size={40} color="#162f62" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                  Belum ada turnamen. Klik "NEW TOURNAMENT" untuk membuat.
                </p>
              </div>
            ) : (
              tournaments.map(t => {
                const progress = t.max_teams > 0 ? Math.min((t.registered_teams / t.max_teams) * 100, 100) : 0;
                const sb = statusBadgeStyle(t.status);
                return (
                  <div key={t.id} style={{ background: '#0a1628', border: '1px solid #162f62', borderTop: '3px solid #f5c518', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ background: sb.bg, color: sb.color, padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em', borderRadius: 2 }}>
                          {t.status === 'live' && <span style={{ display: 'inline-block', width: 6, height: 6, background: '#ff5252', borderRadius: '50%', marginRight: 4 }} />}
                          {t.status.replace('_', ' ').toUpperCase()}
                        </div>
                        {t.game && (
                          <div style={{ background: '#112650', color: '#94a3b8', padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', borderRadius: 2 }}>
                            {t.game.name.toUpperCase()}
                          </div>
                        )}
                      </div>
                      {/* Ubah Status Turnamen */}
                      <StatusDropdown tournament={t} onUpdate={handleUpdated} />
                    </div>

                    <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                      {t.title}
                    </h2>

                    {t.description && (
                      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.6 }}>{t.description}</p>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid #112650', paddingBottom: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>REGISTERED TEAMS</div>
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                          {t.registered_teams} / {t.max_teams}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>FORMAT</div>
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#f5c518' }}>
                          {t.format || '—'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>PRIZE POOL</div>
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                          {t.prize_pool}
                        </div>
                      </div>
                    </div>

                    {/* Registration Progress */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginBottom: 5 }}>
                        <span>Registration Progress</span>
                        <span style={{ color: '#f5c518', fontWeight: 700 }}>{Math.round(progress)}%</span>
                      </div>
                      <div style={{ height: 4, background: '#112650', borderRadius: 2 }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: '#f5c518', borderRadius: 2, transition: 'width 0.4s' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: '#475569' }}>
                        {t.region && `📍 ${t.region}`}
                        {t.start_date && ` · ${new Date(t.start_date).toLocaleDateString('id-ID')}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>


        </div>
      )}

      {showCreate && (
        <CreateTournamentModal games={games} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}