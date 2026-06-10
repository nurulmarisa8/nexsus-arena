import React, { useState, useEffect, useRef } from 'react';
import { Download, Plus, Search, Filter, ChevronLeft, ChevronRight, Gamepad2, Zap, Shield, AlertTriangle, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { teamsAPI, usersAPI } from '../../services/api';

const statusMap = {
  verified: { label: 'VERIFIED', cls: 'badge-verified' },
  pending: { label: 'PENDING', cls: 'badge-pending' },
  suspended: { label: 'SUSPENDED', cls: 'badge-suspended' },
};

const regions = ['All Regions', 'NA East', 'NA West', 'EU West', 'EU East', 'Asia Pacific'];
const statuses = ['All Statuses', 'verified', 'pending', 'suspended'];
const statusChangeOptions = ['verified', 'pending', 'suspended'];

export default function ParticipantsMgmt() {
  const [activeTab, setActiveTab] = useState('Teams');
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [teamsData, setTeamsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Status dropdown state
  const [manageDropdown, setManageDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await teamsAPI.list();
        const data = Array.isArray(res.data) ? res.data : (res.data.teams || res.data.data || []);
        setTeamsData(data.map(t => ({
          id: t.id,
          name: t.name || '',
          icon: t.icon || t.logo || '🎮',
          captain: t.captain || t.captain_name || (t.captain_username ? `@${t.captain_username}` : ''),
          region: t.region || '',
          wins: t.wins ?? t.total_wins ?? 0,
          status: t.status || 'pending',
        })));
      } catch (err) {
        toast.error('Failed to load teams');
      } finally {
        setLoadingTeams(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await usersAPI.list();
        const data = Array.isArray(res.data) ? res.data : (res.data.users || res.data.data || []);
        setUsersData(data.map(u => ({
          id: u.id,
          username: u.username || '',
          email: u.email || '',
          region: u.region || '',
          team: u.team || u.team_name || '',
          joined: u.joined || u.created_at || u.joined_at || '',
          status: u.status || 'pending',
        })));
      } catch (err) {
        toast.error('Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchTeams();
    fetchUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setManageDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const isLoading = activeTab === 'Teams' ? loadingTeams : loadingUsers;

  const handleManage = (item) => {
    setManageDropdown(manageDropdown === item.id ? null : item.id);
  };

  const handleStatusChange = async (item, newStatus) => {
    try {
      if (activeTab === 'Teams') {
        await teamsAPI.updateStatus(item.id, newStatus);
        setTeamsData(prev => prev.map(t => t.id === item.id ? { ...t, status: newStatus } : t));
      } else {
        await usersAPI.updateStatus(item.id, newStatus);
        setUsersData(prev => prev.map(u => u.id === item.id ? { ...u, status: newStatus } : u));
      }
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
    setManageDropdown(null);
  };

  const handleExport = async () => {
    try {
      const res = await usersAPI.exportCSV();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
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
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <Loader2 size={28} className="animate-spin" style={{ color: '#475569' }} />
            </div>
          ) : activeTab === 'Teams' ? (
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
                  const st = statusMap[team.status] || statusMap.pending;
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
                        <div style={{ position: 'relative' }}>
                          <button
                            className="btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.875rem', color: '#f5c518', borderColor: 'rgba(245,197,24,0.3)' }}
                            onClick={() => handleManage(team)}
                            id={`manage-team-${team.id}`}
                          >
                            Manage
                          </button>
                          {manageDropdown === team.id && (
                            <div ref={dropdownRef} style={{
                              position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 50,
                              background: '#0d1f3c', border: '1px solid #162f62', borderRadius: 8,
                              padding: '0.5rem 0', minWidth: 150, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                            }}>
                              {statusChangeOptions.map(s => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(team, s)}
                                  style={{
                                    display: 'block', width: '100%', padding: '0.5rem 1rem', background: 'none',
                                    border: 'none', color: team.status === s ? '#f5c518' : '#94a3b8',
                                    fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer',
                                    fontFamily: 'Rajdhani, sans-serif', fontWeight: team.status === s ? 700 : 500,
                                  }}
                                  onMouseEnter={e => e.target.style.background = 'rgba(245,197,24,0.08)'}
                                  onMouseLeave={e => e.target.style.background = 'none'}
                                >
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                  {team.status === s && ' ✓'}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
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
                  const st = statusMap[user.status] || statusMap.pending;
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
                        <div style={{ position: 'relative' }}>
                          <button
                            className="btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.875rem', color: '#f5c518', borderColor: 'rgba(245,197,24,0.3)' }}
                            onClick={() => handleManage(user)}
                            id={`manage-user-${user.id}`}
                          >
                            Manage
                          </button>
                          {manageDropdown === user.id && (
                            <div ref={dropdownRef} style={{
                              position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 50,
                              background: '#0d1f3c', border: '1px solid #162f62', borderRadius: 8,
                              padding: '0.5rem 0', minWidth: 150, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                            }}>
                              {statusChangeOptions.map(s => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(user, s)}
                                  style={{
                                    display: 'block', width: '100%', padding: '0.5rem 1rem', background: 'none',
                                    border: 'none', color: user.status === s ? '#f5c518' : '#94a3b8',
                                    fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer',
                                    fontFamily: 'Rajdhani, sans-serif', fontWeight: user.status === s ? 700 : 500,
                                  }}
                                  onMouseEnter={e => e.target.style.background = 'rgba(245,197,24,0.08)'}
                                  onMouseLeave={e => e.target.style.background = 'none'}
                                >
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                  {user.status === s && ' ✓'}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderTop: '1px solid #112650' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {currentData.length > 0
                ? `Showing ${((page - 1) * perPage) + 1} to ${Math.min(page * perPage, currentData.length)} of ${currentData.length} entries`
                : 'No entries found'
              }
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
        )}
      </div>
    </div>
  );
}
