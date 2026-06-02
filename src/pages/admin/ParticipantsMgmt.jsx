import React, { useState } from 'react';
import { Download, Plus, Search, Filter, ChevronLeft, ChevronRight, Gamepad2, Zap, Shield, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const teamsData = [
  { id: 1, name: 'Void Walkers', icon: '🎮', captain: '@ShadowStep', region: 'NA East', wins: 142, status: 'verified' },
  { id: 2, name: 'Crimson Surge', icon: '⚡', captain: '@RedViper', region: 'EU West', wins: 89, status: 'verified' },
  { id: 3, name: 'Aegis Protocol', icon: '🛡', captain: '@TitanBlock', region: 'Asia Pacific', wins: 12, status: 'pending' },
  { id: 4, name: 'Neon Syndicate', icon: '🎯', captain: '@GlitchUser', region: 'NA West', wins: 205, status: 'suspended' },
  { id: 5, name: 'Phantom X', icon: '👻', captain: '@SpecterAim', region: 'EU East', wins: 67, status: 'verified' },
  { id: 6, name: 'Iron Veil', icon: '⚔️', captain: '@BladeMaster', region: 'NA East', wins: 34, status: 'pending' },
];

const usersData = [
  { id: 1, username: 'ShadowStep', email: 'shadow@nexus.gg', region: 'NA East', team: 'Void Walkers', joined: '2024-01-15', status: 'verified' },
  { id: 2, username: 'RedViper', email: 'red@nexus.gg', region: 'EU West', team: 'Crimson Surge', joined: '2024-02-03', status: 'verified' },
  { id: 3, username: 'TitanBlock', email: 'titan@nexus.gg', region: 'Asia Pacific', team: 'Aegis Protocol', joined: '2024-03-20', status: 'pending' },
  { id: 4, username: 'GlitchUser', email: 'glitch@nexus.gg', region: 'NA West', team: 'Neon Syndicate', joined: '2023-11-08', status: 'suspended' },
];

const statusMap = {
  verified: { label: 'VERIFIED', cls: 'badge-verified' },
  pending: { label: 'PENDING', cls: 'badge-pending' },
  suspended: { label: 'SUSPENDED', cls: 'badge-suspended' },
};

const regions = ['All Regions', 'NA East', 'NA West', 'EU West', 'EU East', 'Asia Pacific'];
const statuses = ['All Statuses', 'verified', 'pending', 'suspended'];

export default function ParticipantsMgmt() {
  const [activeTab, setActiveTab] = useState('Teams');
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filterData = (data) => data.filter(item => {
    const searchLower = search.toLowerCase();
    const matchSearch = !search ||
      (item.name || item.username || '').toLowerCase().includes(searchLower) ||
      (item.captain || item.email || '').toLowerCase().includes(searchLower);
    const matchRegion = regionFilter === 'All Regions' || item.region === regionFilter;
    const matchStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
    return matchSearch && matchRegion && matchStatus;
  });

  const teams = filterData(teamsData);
  const users = filterData(usersData);
  const currentData = activeTab === 'Teams' ? teams : users;
  const totalPages = Math.ceil(currentData.length / perPage);
  const paginated = currentData.slice((page - 1) * perPage, page * perPage);

  const handleManage = (item) => {
    toast.success(`Managing ${item.name || item.username}...`);
  };

  const handleExport = () => {
    toast.success('Exporting CSV...');
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            Manage Platform Participants
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>View, edit, and moderate teams and users across all regions.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} />
            Export CSV
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} />
            Add New
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="card">
        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 1.25rem', borderBottom: '1px solid #112650', gap: 0 }}>
          {['Teams', 'Users'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{
              padding: '0.875rem 1.25rem', border: 'none', cursor: 'pointer', background: 'none',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em',
              color: activeTab === tab ? '#f5c518' : '#64748b',
              borderBottom: activeTab === tab ? '2px solid #f5c518' : '2px solid transparent',
              transition: 'all 0.15s', marginBottom: -1,
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, padding: '1rem 1.25rem', alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid #112650' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}>
            <Filter size={14} />
          </div>
          <select
            className="input-field"
            style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.8rem' }}
            value={regionFilter}
            onChange={e => { setRegionFilter(e.target.value); setPage(1); }}
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            className="input-field"
            style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.8rem' }}
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input
              className="input-field"
              placeholder="Search name or ID..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft: '2.25rem', fontSize: '0.8rem' }}
              id="participants-search"
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {activeTab === 'Teams' ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Captain</th>
                  <th>Region</th>
                  <th>Total Wins</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(team => {
                  const st = statusMap[team.status];
                  return (
                    <tr key={team.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, background: '#112650', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                            {team.icon}
                          </div>
                          <span style={{ fontWeight: 700, color: '#e2e8f0', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>
                            {team.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{team.captain}</td>
                      <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{team.region}</td>
                      <td>
                        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2e8f0', fontSize: '1rem' }}>{team.wins}</span>
                      </td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.875rem', color: '#f5c518', borderColor: 'rgba(245,197,24,0.3)' }}
                          onClick={() => handleManage(team)}
                          id={`manage-team-${team.id}`}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Region</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(user => {
                  const st = statusMap[user.status];
                  return (
                    <tr key={user.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: '#e2e8f0', fontFamily: 'Rajdhani, sans-serif' }}>
                          @{user.username}
                        </span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{user.email}</td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{user.region}</td>
                      <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{user.team || '—'}</td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.875rem', color: '#f5c518', borderColor: 'rgba(245,197,24,0.3)' }}
                          onClick={() => handleManage(user)}
                          id={`manage-user-${user.id}`}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderTop: '1px solid #112650' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, currentData.length)} of {currentData.length} entries
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: '0.35rem 0.6rem', background: '#0a1628', border: '1px solid #112650', borderRadius: 6, color: page === 1 ? '#475569' : '#94a3b8', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              style={{ padding: '0.35rem 0.6rem', background: '#0a1628', border: '1px solid #112650', borderRadius: 6, color: (page === totalPages || totalPages === 0) ? '#475569' : '#94a3b8', cursor: (page === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
