import React, { useState, useEffect } from 'react';
import { Plus, UserPlus, LogOut, Users, Loader2, X, Upload, Shield, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teamsAPI } from '../../services/api';
import toast from 'react-hot-toast';

function CreateTeamForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', logoUrl: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 3) e.name = 'Nama tim minimal 3 karakter';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await teamsAPI.create({ name: form.name, logo_url: form.logoUrl || null });
      toast.success(`Tim "${form.name}" berhasil dibuat!`);
      onCreated(res.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal membuat tim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>
        Create Your Team
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Start competing by creating your own team. You'll be set as captain.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="label">Team Name *</label>
          <input
            className={`input-field ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Void Walkers"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            id="team-name-input"
          />
          {errors.name && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: 4 }}>{errors.name}</p>}
        </div>

        <div>
          <label className="label">Team Logo URL (Optional)</label>
          <div style={{ position: 'relative' }}>
            <Upload size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input
              className="input-field"
              placeholder="https://example.com/logo.png"
              value={form.logoUrl}
              onChange={e => setForm(p => ({ ...p, logoUrl: e.target.value }))}
              style={{ paddingLeft: '2.25rem' }}
              id="team-logo-input"
            />
          </div>
          <p style={{ fontSize: '0.7rem', color: '#475569', marginTop: 4 }}>Paste a URL to your team logo image</p>
        </div>

        {/* Logo Preview */}
        {form.logoUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem', background: '#0a1628', borderRadius: 8, border: '1px solid #112650' }}>
            <img 
              key={form.logoUrl}
              src={form.logoUrl} 
              alt="logo preview" 
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #162f62', backgroundColor: '#060d1f' }} 
              onError={e => { e.target.src = 'https://via.placeholder.com/48/060d1f/475569?text=Logo'; }} 
            />
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0' }}>{form.name || 'Team Name'}</div>
              <div style={{ fontSize: '0.7rem', color: '#475569' }}>Logo Preview</div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          id="create-team-submit"
        >
          {loading ? <><Loader2 size={14} className="animate-spin" /> Creating Team...</> : <><Plus size={14} /> Create Team</>}
        </button>
      </form>
    </div>
  );
}

function AddMemberModal({ teamId, onClose, onAdd }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!username.trim()) { setError('Nama tidak boleh kosong'); return; }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      onAdd(username.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal menambahkan member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ width: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #162f62' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', fontSize: '1rem' }}>
            Add Team Member
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleAdd} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Player Name</label>
            <input
              className={`input-field ${error ? 'error' : ''}`}
              placeholder="Enter name"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              autoFocus
              id="add-member-input"
            />
            {error && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: 4 }}>{error}</p>}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#475569' }}>Player will be added directly to the team roster.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamHub() {
  const { user, updateUser } = useAuth();
  const [hasTeam, setHasTeam] = useState(!!user?.team_id);
  const [teamData, setTeamData] = useState(null);
  const [members, setMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);

  const fetchTeam = async () => {
    if (!user?.team_id) return;
    setLoadingTeam(true);
    try {
      const res = await teamsAPI.get(user.team_id);
      setTeamData(res.data);
      setMembers(res.data.members || []);
      setHasTeam(true);
    } catch (err) {
      console.error('Failed to fetch team', err);
    } finally {
      setLoadingTeam(false);
    }
  };

  useEffect(() => {
    if (user?.team_id) {
      fetchTeam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.team_id]);

  const handleTeamCreated = (team) => {
    setHasTeam(true);
    setTeamData(team);
    setMembers(team.members || []);
    updateUser({ team_id: team.id, teamName: team.name });
  };

  const handleLeaveTeam = async () => {
    try {
      await teamsAPI.leave(user.team_id);
      setHasTeam(false);
      setTeamData(null);
      setMembers([]);
      updateUser({ team_id: null, teamName: null });
      setShowLeaveConfirm(false);
      toast.success('You have left the team.');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal keluar dari tim');
    }
  };

  const handleRemoveMember = async (memberId, userId) => {
    try {
      await teamsAPI.removeMember(user.team_id, userId);
      setMembers(prev => prev.filter(m => m.user_id !== userId));
      toast.success('Member removed from team.');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Gagal menghapus member');
    }
  };

  if (loadingTeam) {
    return (
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#f5c518' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
          Team Hub
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Manage your team roster and invite players to compete together.</p>
      </div>

      {!hasTeam ? (
        /* No Team — Show Create Form */
        <div className="card" style={{ padding: '2rem', maxWidth: 600 }}>
          <CreateTeamForm onCreated={handleTeamCreated} />
        </div>
      ) : (
        /* Has Team — Show Roster */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>
          {/* Main Roster Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#f5c518', textTransform: 'uppercase' }}>
                    {teamData?.name || user?.teamName}
                  </h2>
                  <span className="badge badge-verified">{teamData?.status === 'verified' ? 'Verified' : teamData?.status || 'Verified'}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>{members.length} members • {teamData?.region || 'NA East'}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" onClick={() => setShowAddMember(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }} id="add-member-btn">
                  <UserPlus size={14} />
                  Add Member
                </button>
              </div>
            </div>

            {/* Roster List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {members.map(member => (
                <div key={member.id || member.user_id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem',
                  background: '#0a1628', borderRadius: 8, border: '1px solid #112650',
                  transition: 'border-color 0.15s',
                }}
                  className="card-hover"
                >
                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: member.role === 'captain' ? 'rgba(245,197,24,0.1)' : 'rgba(22,47,98,0.8)',
                    border: `1px solid ${member.role === 'captain' ? 'rgba(245,197,24,0.3)' : '#162f62'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {member.role === 'captain' ? <Crown size={18} color="#f5c518" /> : <Users size={16} color="#4fc3f7" />}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, color: '#e2e8f0', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>
                        @{member.username}
                      </span>
                      {member.role === 'captain' && (
                        <span style={{ fontSize: '0.6rem', background: 'rgba(245,197,24,0.15)', color: '#f5c518', border: '1px solid rgba(245,197,24,0.3)', borderRadius: 4, padding: '1px 6px', fontWeight: 700, letterSpacing: '0.06em' }}>
                          CAPTAIN
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: member.status === 'verified' ? '#69f0ae' : '#475569', display: 'inline-block' }} />
                      {member.status === 'verified' ? 'Active' : member.status || 'Active'}
                    </div>
                  </div>
                  {/* Remove button (not for captain) */}
                  {member.role !== 'captain' && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.user_id)}
                      style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                      title="Remove member"
                      id={`remove-member-${member.user_id}`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}


            </div>
          </div>

          {/* Team Actions Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Team Stats
              </h3>
              {[
                { label: 'Total Wins', value: String(teamData?.wins || 0) },
                { label: 'Members', value: String(members.length) },
                { label: 'Region', value: teamData?.region || 'NA East' },
                { label: 'Status', value: teamData?.status || 'verified' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #112650' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.label}</span>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', textTransform: 'capitalize' }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Danger Zone */}
            <div className="card" style={{ padding: '1.25rem', border: '1px solid rgba(255,82,82,0.2)' }}>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#ff5252', fontSize: '0.85rem', marginBottom: '0.75rem', letterSpacing: '0.06em' }}>
                DANGER ZONE
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                Leaving the team will remove you from the roster permanently.
              </p>
              {!showLeaveConfirm ? (
                <button className="btn-danger" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => setShowLeaveConfirm(true)} id="leave-team-btn">
                  <LogOut size={14} />
                  Leave Team
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: '0.75rem', color: '#ff5252', fontWeight: 600 }}>Are you sure?</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" onClick={() => setShowLeaveConfirm(false)} style={{ flex: 1, fontSize: '0.75rem' }}>Cancel</button>
                    <button className="btn-danger" onClick={handleLeaveTeam} style={{ flex: 1, fontSize: '0.75rem' }} id="confirm-leave-btn">Confirm</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          teamId={user.team_id}
          onClose={() => setShowAddMember(false)}
          onAdd={(username) => {
            if (username) {
              setMembers(prev => [...prev, {
                id: Date.now(),
                user_id: Date.now() + 1,
                username: username,
                role: 'member',
                status: 'verified'
              }]);
              toast.success(`${username} berhasil ditambahkan!`);
            }
          }}
        />
      )}
    </div>
  );
}
