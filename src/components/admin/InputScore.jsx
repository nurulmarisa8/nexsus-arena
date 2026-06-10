import React, { useState } from 'react';
import { X, Trophy, AlertCircle, CheckCircle2, Swords, Loader2 } from 'lucide-react';
import { matchesAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * InputScore — Modal untuk input skor match dengan validasi dan auto-determine winner
 * 
 * Props:
 *  match   - object { id, teams: [team1, team2], tournament, team1_name, team2_name, tournament_name }
 *  onClose - callback untuk menutup modal
 *  onSubmit- callback(payload) setelah validasi berhasil
 */
export default function InputScore({ match, onClose, onSubmit }) {
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const team1Name = match.teams ? match.teams[0] : match.team1_name || 'Team 1';
  const team2Name = match.teams ? match.teams[1] : match.team2_name || 'Team 2';
  const matchId = match.id;
  const tournamentName = match.tournament || match.tournament_name || '';

  // ─── Validation Logic ───────────────────────────────────────────────────────
  const validateScores = () => {
    const errs = {};

    // Check empty
    if (score1 === '' || score1 === null) {
      errs.score1 = 'Skor tidak boleh kosong';
    }
    if (score2 === '' || score2 === null) {
      errs.score2 = 'Skor tidak boleh kosong';
    }

    if (Object.keys(errs).length) return errs;

    // Check format — must be valid non-negative integer
    const s1 = Number(score1);
    const s2 = Number(score2);

    if (!Number.isInteger(s1) || s1 < 0 || isNaN(s1) || score1.includes('.')) {
      errs.score1 = 'Format skor tidak valid';
    }
    if (!Number.isInteger(s2) || s2 < 0 || isNaN(s2) || score2.includes('.')) {
      errs.score2 = 'Format skor tidak valid';
    }

    return errs;
  };

  // ─── Auto-determine Winner ───────────────────────────────────────────────
  const determineWinner = (s1, s2) => {
    if (s1 > s2) return { winner: team1Name, loser: team2Name, winnerIdx: 0 };
    if (s2 > s1) return { winner: team2Name, loser: team1Name, winnerIdx: 1 };
    return { winner: null, loser: null, winnerIdx: -1 }; // Draw
  };

  // ─── Preview Handler ─────────────────────────────────────────────────────
  const handlePreview = () => {
    const errs = validateScores();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setPreview(null);
      return;
    }
    setErrors({});
    const s1 = parseInt(score1, 10);
    const s2 = parseInt(score2, 10);
    const result = determineWinner(s1, s2);
    setPreview({ score1: s1, score2: s2, ...result });
  };

  // ─── Submit Handler ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    // Re-validate before submit
    const errs = validateScores();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const s1 = parseInt(score1, 10);
      const s2 = parseInt(score2, 10);
      const result = determineWinner(s1, s2);

      // Call real API
      await matchesAPI.submitScore(matchId, {
        score_team1: s1,
        score_team2: s2,
      });

      // Payload for parent callback
      const payload = {
        matchId: matchId,
        score_team1: s1,
        score_team2: s2,
        winner_team_name: result.winner,
        is_draw: result.winnerIdx === -1,
        status: 'finished',
        finished_at: new Date().toISOString(),
      };

      if (onSubmit) await onSubmit(payload);
      setSubmitted(true);
      toast.success(`Match ${matchId} berhasil diselesaikan!`);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal menyimpan skor. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ width: 520 }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid #162f62',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: 'rgba(245,197,24,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,197,24,0.2)' }}>
              <Swords size={16} color="#f5c518" />
            </div>
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', fontSize: '1rem' }}>
                Input Match Score
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Match {matchId} • {tournamentName}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {submitted ? (
            /* Success State */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <CheckCircle2 size={48} color="#69f0ae" style={{ marginBottom: '1rem' }} />
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
                Score Submitted!
              </div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                Match status has been updated to <span style={{ color: '#69f0ae', fontWeight: 600 }}>FINISHED</span>
              </div>
            </div>
          ) : (
            <>
              {/* Teams Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, padding: '1rem', background: '#0a1628', borderRadius: 8, border: '1px solid #112650', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f5c518', marginBottom: 2 }}>
                    {team1Name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#475569' }}>TEAM 1</div>
                </div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: '1.1rem', color: '#162f62', flexShrink: 0 }}>VS</div>
                <div style={{ flex: 1, padding: '1rem', background: '#0a1628', borderRadius: 8, border: '1px solid #112650', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#4fc3f7', marginBottom: 2 }}>
                    {team2Name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#475569' }}>TEAM 2</div>
                </div>
              </div>

              {/* Score Inputs */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                {/* Score Team 1 */}
                <div style={{ flex: 1 }}>
                  <label className="label" style={{ color: '#f5c518' }}>
                    Score — {team1Name}
                  </label>
                  <input
                    id="score-team1"
                    className={`input-field ${errors.score1 ? 'error' : ''}`}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={score1}
                    onChange={e => { setScore1(e.target.value); setErrors(p => ({ ...p, score1: '' })); setPreview(null); }}
                    style={{ textAlign: 'center', fontSize: '1.5rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}
                  />
                  {errors.score1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, color: '#ff5252', fontSize: '0.75rem' }}>
                      <AlertCircle size={12} />
                      {errors.score1}
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div style={{ paddingTop: '1.8rem', fontSize: '1rem', color: '#475569', fontWeight: 700 }}>:</div>

                {/* Score Team 2 */}
                <div style={{ flex: 1 }}>
                  <label className="label" style={{ color: '#4fc3f7' }}>
                    Score — {team2Name}
                  </label>
                  <input
                    id="score-team2"
                    className={`input-field ${errors.score2 ? 'error' : ''}`}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={score2}
                    onChange={e => { setScore2(e.target.value); setErrors(p => ({ ...p, score2: '' })); setPreview(null); }}
                    style={{ textAlign: 'center', fontSize: '1.5rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}
                  />
                  {errors.score2 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, color: '#ff5252', fontSize: '0.75rem' }}>
                      <AlertCircle size={12} />
                      {errors.score2}
                    </div>
                  )}
                </div>
              </div>

              {/* Validation info */}
              <div style={{ fontSize: '0.7rem', color: '#475569', marginBottom: '1.25rem', padding: '0.5rem 0.75rem', background: '#0a1628', borderRadius: 6, border: '1px solid #112650' }}>
                ℹ Skor harus berupa angka bulat non-negatif (0, 1, 2, ...). Sistem akan otomatis menentukan pemenang berdasarkan skor tertinggi.
              </div>

              {/* Preview Result */}
              {preview && (
                <div style={{
                  padding: '1rem', marginBottom: '1.25rem',
                  background: preview.winnerIdx === -1 ? 'rgba(245,197,24,0.05)' : 'rgba(105,240,174,0.05)',
                  border: `1px solid ${preview.winnerIdx === -1 ? 'rgba(245,197,24,0.25)' : 'rgba(105,240,174,0.25)'}`,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Preview Result
                  </div>
                  {/* Score display */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: 900, color: preview.winnerIdx === 0 ? '#69f0ae' : '#475569' }}>
                      {preview.score1}
                    </span>
                    <span style={{ color: '#162f62', fontFamily: 'Rajdhani, sans-serif', fontWeight: 900 }}>—</span>
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: 900, color: preview.winnerIdx === 1 ? '#69f0ae' : '#475569' }}>
                      {preview.score2}
                    </span>
                  </div>
                  {/* Winner */}
                  {preview.winnerIdx !== -1 ? (
                    <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Trophy size={14} color="#f5c518" />
                      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#f5c518', fontSize: '0.9rem' }}>
                        {preview.winner} WINS
                      </span>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#f5c518', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.9rem' }}>
                      DRAW — No winner determined
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn-secondary"
                  onClick={handlePreview}
                  style={{ flex: 1 }}
                  id="preview-score-btn"
                >
                  Preview Result
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting || !preview}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  id="submit-score-btn"
                >
                  {submitting
                    ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                    : <><CheckCircle2 size={14} /> Confirm Score</>
                  }
                </button>
              </div>

              {!preview && (
                <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#475569', marginTop: 8 }}>
                  Klik "Preview Result" untuk verifikasi sebelum konfirmasi
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
