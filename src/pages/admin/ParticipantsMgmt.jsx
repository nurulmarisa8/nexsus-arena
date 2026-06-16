import React, { useState, useEffect } from 'react';
import { Download, Search, Loader2, Shield, Users, AlertCircle, ChevronDown } from 'lucide-react';
import { usersAPI, teamsAPI } from '../../services/api';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Status Badge
───────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    verified: { bg: 'rgba(79,195,247,0.15)', color: '#4fc3f7', border: 'rgba(79,195,247,0.3)', label: 'VERIFIED' },
    pending: { bg: 'rgba(245,197,24,0.15)', color: '#f5c518', border: 'rgba(245,197,24,0.3)', label: 'PENDING' },
    suspended: { bg: 'rgba(255,82,82,0.15)', color: '#ff5252', border: 'rgba(255,82,82,0.3)', label: 'SUSPENDED' },
  };
  const s = map[status?.toLowerCase()] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: '0.2rem 0.6rem', fontSize: '0.6rem', fontWeight: 700,
      letterSpacing: '0.05em', borderRadius: 2,
    }}>
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Status Action Dropdown
───────────────────────────────────────────── */
function ActionDropdown({ userId, currentStatus, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (newStatus) => {
    setOpen(false);
    if (newStatus === currentStatus) return;
    setLoading(true);
    try {
      await usersAPI.updateStatus(userId, newStatus);
      toast.success(`Status diubah ke ${newStatus}`);
      onUpdated(userId, newStatus);
    } catch (err) {
      toast.error('Gagal mengubah status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(p => !p)}
        disabled={loading}
        style={{
          background: 'transparent', border: '1px solid #f5c518', color: '#f5c518',
          padding: '0.35rem 0.875rem', fontSize: '0.7rem', fontWeight: 600,
          cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : 'Manage'}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '110%', background: '#0d1f3c', border: '1px solid #162f62', borderRadius: 4, zIndex: 100, minWidth: 140 }}>
          {['verified', 'pending', 'suspended'].map(s => (
            <button
              key={s}
              onClick={() => handle(s)}
              style={{
                display: 'block', width: '100%', padding: '0.5rem 0.875rem', background: 'transparent',
                border: 'none', textAlign: 'left', fontSize: '0.78rem', cursor: 'pointer',
                color: s === 'suspended' ? '#ff5252' : s === 'verified' ? '#4fc3f7' : '#f5c518',
                fontWeight: 600,
              }}
            >
              Set {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamActionDropdown({ teamId, currentStatus, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (newStatus) => {
    setOpen(false);
    if (newStatus === currentStatus) return;
    setLoading(true);
    try {
      await teamsAPI.updateStatus(teamId, newStatus);
      toast.success(`Status tim diubah ke ${newStatus}`);
      onUpdated(teamId, newStatus);
    } catch (err) {
      toast.error('Gagal mengubah status tim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(p => !p)}
        disabled={loading}
        style={{
          background: 'transparent', border: '1px solid #f5c518', color: '#f5c518',
          padding: '0.35rem 0.875rem', fontSize: '0.7rem', fontWeight: 600,
          cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : 'Manage'}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '110%', background: '#0d1f3c', border: '1px solid #162f62', borderRadius: 4, zIndex: 100, minWidth: 140 }}>
          {['verified', 'pending', 'suspended'].map(s => (
            <button
              key={s}
              onClick={() => handle(s)}
              style={{
                display: 'block', width: '100%', padding: '0.5rem 0.875rem', background: 'transparent',
                border: 'none', textAlign: 'left', fontSize: '0.78rem', cursor: 'pointer',
                color: s === 'suspended' ? '#ff5252' : s === 'verified' ? '#4fc3f7' : '#f5c518',
                fontWeight: 600,
              }}
            >
              Set {s.charAt(0).toUpperCase() + s.slice(1)}
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
export default function ParticipantsMgmt() {
  const [activeTab, setActiveTab] = useState('Teams');
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, uRes] = await Promise.all([teamsAPI.list(), usersAPI.list()]);
      setTeams(Array.isArray(tRes.data) ? tRes.data : []);
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);
    } catch (err) {
      toast.error('Gagal memuat data participants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdated = (userId, newStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleTeamStatusUpdated = (teamId, newStatus) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, status: newStatus } : t));
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await usersAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export CSV berhasil!');
    } catch (err) {
      toast.error('Gagal export CSV');
    } finally {
      setExporting(false);
    }
  };

  // Filter
  const filteredTeams = teams.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || t.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredUsers = users.filter(u => {
    const matchSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || u.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  // Get captain name for team
  const getCaptain = (team) => {
    const captain = team.members?.find(m => m.role === 'captain');
    return captain ? `@${captain.username}` : '—';
  };

  const thStyle = { textAlign: 'left', padding: '0.875rem 1.25rem', fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 };
  const tdStyle = { padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '1px solid #112650' };

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '0.25rem' }}>
            Manage Platform Participants
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
            View, edit, and moderate teams and users across all regions.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          style={{ background: '#0a1628', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          id="export-csv-btn"
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #162f62', marginBottom: '2rem' }}>
        {[
          { label: 'Teams', icon: Shield, count: teams.length },
          { label: 'Users', icon: Users, count: users.length },
        ].map(tab => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            style={{
              background: 'none', border: 'none', padding: '0 0 0.75rem 0',
              fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
              color: activeTab === tab.label ? '#f5c518' : '#64748b',
              borderBottom: activeTab === tab.label ? '3px solid #f5c518' : '3px solid transparent',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <tab.icon size={16} />
            {tab.label}
            <span style={{ fontSize: '0.7rem', background: '#112650', color: '#94a3b8', padding: '0.1rem 0.4rem', borderRadius: 10 }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ background: '#0a1628', border: '1px solid #162f62', borderRadius: 4 }}>

        {/* Toolbar */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #112650', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <select
              style={{ background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.5rem 1rem', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: '#060d1f', border: '1px solid #162f62', color: '#e2e8f0', padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.8rem', width: 260, outline: 'none' }}
              id="participants-search"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#f5c518' }} />
          </div>
        ) : activeTab === 'Teams' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #112650' }}>
                <th style={thStyle}>TEAM NAME</th>
                <th style={thStyle}>CAPTAIN</th>
                <th style={thStyle}>REGION</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>MEMBERS</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>WINS</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>STATUS</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '2.5rem', color: '#475569' }}>
                    <AlertCircle size={24} style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                    Tidak ada team ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTeams.map(team => (
                  <tr key={team.id} style={{ borderBottom: '1px solid #112650' }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: 32, height: 32, background: '#060d1f', border: '1px solid #162f62', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                          {team.logo_url
                            ? <img src={team.logo_url} alt={team.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://via.placeholder.com/32/060d1f/475569?text=T'; }} />
                            : <Shield size={16} color="#94a3b8" />
                          }
                        </div>
                        <span style={{ color: '#e2e8f0', fontWeight: 600, fontFamily: 'Rajdhani, sans-serif' }}>{team.name}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>{getCaptain(team)}</td>
                    <td style={tdStyle}>{team.region || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#ffffff' }}>
                      {team.members?.length || 0}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                      {team.wins || 0}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <StatusBadge status={team.status} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <TeamActionDropdown teamId={team.id} currentStatus={team.status} onUpdated={handleTeamStatusUpdated} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          // Users Tab
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #112650' }}>
                <th style={thStyle}>USERNAME</th>
                <th style={thStyle}>EMAIL</th>
                <th style={thStyle}>ROLE</th>
                <th style={thStyle}>TEAM</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>REGION</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>STATUS</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '2.5rem', color: '#475569' }}>
                    <AlertCircle size={24} style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #112650' }}>
                    <td style={tdStyle}>
                      <span style={{ color: '#e2e8f0', fontWeight: 600, fontFamily: 'Rajdhani, sans-serif' }}>@{user.name}</span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.8rem' }}>{user.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: user.role === 'admin' ? 'rgba(245,197,24,0.1)' : 'rgba(79,195,247,0.08)',
                        color: user.role === 'admin' ? '#f5c518' : '#4fc3f7',
                        padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', borderRadius: 2,
                      }}>
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>{user.team_name || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{user.region || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <StatusBadge status={user.status} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      {user.role !== 'admin' && (
                        <ActionDropdown userId={user.id} currentStatus={user.status} onUpdated={handleStatusUpdated} />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #112650' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Showing {activeTab === 'Teams' ? filteredTeams.length : filteredUsers.length} entries
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{ background: 'none', border: '1px solid #162f62', color: '#94a3b8', padding: '0.3rem 0.75rem', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
          >
            Refresh
          </button>
        </div>

      </div>
    </div>
  );
}
