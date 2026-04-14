import React, { useEffect, useState } from 'react';
import { Edit3, Trash2, ChevronDown, Eye, EyeOff } from 'lucide-react';
import './user.css';
import {
  fetchUsersWithStatus,
  deleteUser,
  loadPersistedUsers,
  removePersistedUser,
  appendPersistedUser,
  updateUser,
} from '../api/superAdminApi';
import type { SuperAdminUser } from '../api/superAdminApi';

const UsersPage: React.FC = () => {
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [createDialog, setCreateDialog] = useState<'interpreter' | 'csr' | 'manager' | 'customer' | null>(null);
  const [tempRole, setTempRole] = useState<'interpreter' | 'csr' | 'manager' | 'customer' | null>(null);
  const [editingUser, setEditingUser] = useState<SuperAdminUser | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [users, setUsers] = useState<SuperAdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showRoleFilter, setShowRoleFilter] = useState(false);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [createForm, setCreateForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: 'Male',
    language: '', skills: '', extension: '', password: '', confirmPassword: '', status: true,
  });

  // ── Show Toast Helper ──
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Load Users on Mount ──
  useEffect(() => {
    const storedUsers = loadPersistedUsers();
    setIsLoading(true);

    fetchUsersWithStatus()
      .then((result) => {
        // Merge: persisted local users + API users (deduplicated)
        const combined = [...storedUsers, ...result.users];
        const deduped = combined.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        setUsers(deduped);

        // ── Console Output ──
        if (result.ok) {
          console.log(
            '%c[UsersPage] ✅ API Success',
            'color: #22c55e; font-weight: bold;',
            {
              statusCode: result.statusCode,
              source: result.source,
              message: result.message,
              totalLoaded: deduped.length,
            }
          );
          showToast(`${result.message}`, 'success');
        } else {
          console.warn(
            '%c[UsersPage] ⚠️ API Failed — Using Fallback',
            'color: #f59e0b; font-weight: bold;',
            {
              source: result.source,
              message: result.message,
              totalLoaded: deduped.length,
            }
          );
          showToast(result.message, 'error');
        }
      })
      .catch((err) => {
        console.error(
          '%c[UsersPage] ❌ Unexpected Error',
          'color: #ef4444; font-weight: bold;',
          err
        );
        setUsers(storedUsers);
        showToast('Unexpected error loading users.', 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

   
  const handleCancelClick = () => {
    setTempRole(createDialog);
    setCreateDialog(null);
    setShowCancelConfirm(true);
  };

  const confirmCancelUser = () => {
    setShowCancelConfirm(false);
    setTempRole(null);
    setEditingUser(null);
    resetForm();
  };

  const continueEditing = () => {
    setCreateDialog(tempRole);
    setShowCancelConfirm(false);
  };

  const resetForm = () => {
    setCreateForm({
      firstName: '', lastName: '', email: '', phone: '', gender: 'Male',
      language: '', skills: '', extension: '', password: '', confirmPassword: '', status: true,
    });
  };

  // ── Create / Update Submit ──
  const handleCreateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Password match check (only for create)
    if (!editingUser && createForm.password !== createForm.confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    const role = editingUser
      ? editingUser.role
      : createDialog
        ? createDialog.charAt(0).toUpperCase() + createDialog.slice(1)
        : 'User';

    const userPayload: Omit<SuperAdminUser, 'id'> = {
      name: `${createForm.firstName} ${createForm.lastName}`.trim(),
      email: createForm.email,
      phone: createForm.phone,
      role,
      extension: createForm.extension,
      language: createForm.language || 'English',
      status: createForm.status ? 'Active' : 'Inactive',
      gender: createForm.gender,
    };

    if (editingUser) {
      // ── Update existing user ──
      const updated = await updateUser(editingUser.id, userPayload);
      setUsers((current) =>
        current.map((u) => (u.id === editingUser.id ? updated : u))
      );
      console.log('%c[UsersPage] ✏️ User Updated', 'color: #6366f1;', updated);
    } else {
      // ── Create new user (persist locally) ──
      const newUser: SuperAdminUser = {
        id: `local-${Date.now()}`,
        ...userPayload,
      };
      appendPersistedUser(newUser);
      setUsers((current) => [newUser, ...current]);
      console.log('%c[UsersPage] ➕ User Created', 'color: #22c55e;', newUser);
    }

    setCreateDialog(null);
    setEditingUser(null);
    resetForm();
    setShowSuccessModal(true);
  };

  // ── Delete User ──
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      removePersistedUser(id);
      setUsers((current) => current.filter((user) => user.id !== id));
      console.log('%c[UsersPage] 🗑️ User Deleted', 'color: #ef4444;', { id });
      showToast('User deleted successfully.', 'success');
    } catch (error) {
      console.error('[UsersPage] Delete failed', error);
      showToast('Failed to delete user.', 'error');
    }
  };

  // ── Filter ──
  const filteredUsers =
    roleFilter === 'all'
      ? users
      : users.filter((u) => u.role.toLowerCase() === roleFilter.toLowerCase());

 
  return (
    <div className="page-content">
      {/* ── Toast ── */}
      {toast && (
        <div
          className="toast-message"
          style={{
            backgroundColor: toast.type === 'error' ? '#ef4444' : '#22c55e',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {createDialog && (
        <div className="modal-backdrop">
          <div className="modal-panel" style={{ maxWidth: '750px', borderRadius: '12px', padding: '0' }}>
            <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ fontWeight: '700', margin: 0 }}>
                {editingUser ? `Edit ${editingUser.role}` : `Add New ${createDialog.toUpperCase()}`}
              </h3>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ padding: '25px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="Courtney" value={createForm.firstName} onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" placeholder="Alex" value={createForm.lastName} onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" placeholder="+1 3456789101" value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="example@mail.com" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={createForm.gender} onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Extension</label>
                  <input className="form-input" placeholder="Extension" value={createForm.extension} onChange={(e) => setCreateForm({ ...createForm, extension: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select className="form-select" value={createForm.language} onChange={(e) => setCreateForm({ ...createForm, language: e.target.value })}>
                    <option value="">Select Language</option>
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Spanish</option>
                    <option>Arabic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Interpreting Skills</label>
                  <select className="form-select" value={createForm.skills} onChange={(e) => setCreateForm({ ...createForm, skills: e.target.value })}>
                    <option value="">Select Skills</option>
                    <option>Medical</option>
                    <option>Legal</option>
                  </select>
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Password</label>
                  <input
                    className="form-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    required={!editingUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                  </button>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    className="form-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={createForm.confirmPassword}
                    onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
                    required={!editingUser}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <span>Active</span>
                    <label className="switch">
                      <input type="checkbox" checked={createForm.status} onChange={(e) => setCreateForm({ ...createForm, status: e.target.checked })} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, height: '45px' }} onClick={handleCancelClick}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, height: '45px' }}>
                  {editingUser ? 'Update' : 'Create'} {createDialog}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Cancel Confirm Modal ── */}
      {showCancelConfirm && (
        <div className="modal-backdrop" style={{ zIndex: 1200 }}>
          <div className="modal-panel" style={{ maxWidth: '400px', textAlign: 'center', borderRadius: '12px', padding: '30px' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
              {editingUser ? 'Cancel Editing' : 'Cancel User Creation'}
            </h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
              Are you sure you want to cancel? Any unsaved changes will be lost.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1, height: '42px' }} onClick={confirmCancelUser}>Yes, Cancel</button>
              <button className="btn-primary" style={{ flex: 1, height: '42px', backgroundColor: '#EF4444' }} onClick={continueEditing}>Continue Editing</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal ── */}
      {showSuccessModal && (
        <div className="modal-backdrop" style={{ zIndex: 1200 }}>
          <div className="modal-panel" style={{ maxWidth: '350px', textAlign: 'center', borderRadius: '12px', padding: '30px' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
              User {editingUser ? 'Updated' : 'Created'} Successfully
            </h3>
            <button
              className="btn-primary"
              style={{ width: '100%', height: '45px' }}
              onClick={() => { setShowSuccessModal(false); setEditingUser(null); }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="view-header">
        <h2>Users {!isLoading && <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 400 }}>({filteredUsers.length})</span>}</h2>
        <div className="header-actions">
          {/* Role Filter */}
          <div className="dropdown-container">
            <div className="filter-select-box" onClick={() => setShowRoleFilter(!showRoleFilter)}>
              <span>{roleFilter === 'all' ? 'All' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}</span>
              <ChevronDown size={16} />
            </div>
            {showRoleFilter && (
              <div className="dropdown-menu">
                {['all', 'interpreter', 'csr', 'customer', 'manager'].map((role) => (
                  <div
                    key={role}
                    className={`menu-item ${roleFilter === role ? 'active-blue' : ''}`}
                    onClick={() => { setRoleFilter(role); setShowRoleFilter(false); }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create User */}
          <div style={{ position: 'relative' }}>
            <button className="btn-create" onClick={() => setShowCreateDropdown(!showCreateDropdown)}>
              Create New User <ChevronDown size={18} />
            </button>
            {showCreateDropdown && (
              <div className="dropdown-menu">
                {['interpreter', 'csr', 'manager', 'customer'].map((type) => (
                  <div
                    key={type}
                    className="menu-item"
                    onClick={() => { setCreateDialog(type as any); setShowCreateDropdown(false); setEditingUser(null); resetForm(); }}
                  >
                    New {type.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="table-card">
        <div className="table-container">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
              No users found.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td><span className="role-badge-new">{user.role}</span></td>
                    <td><span className={`badge ${user.status.toLowerCase()}`}>{user.status}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="actions-cell">
                        <button
                          className="action-btn-new edit-btn-new"
                          onClick={() => {
                            setEditingUser(user);
                            setCreateDialog(user.role.toLowerCase() as any);
                            const [first, ...rest] = user.name.split(' ');
                            setCreateForm({
                              ...createForm,
                              firstName: first,
                              lastName: rest.join(' '),
                              email: user.email,
                              phone: user.phone,
                              extension: user.extension || '',
                              language: user.language || '',
                              gender: user.gender || 'Male',
                              status: user.status === 'Active',
                              password: '',
                              confirmPassword: '',
                              skills: '',
                            });
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="action-btn-new delete-btn-new"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
