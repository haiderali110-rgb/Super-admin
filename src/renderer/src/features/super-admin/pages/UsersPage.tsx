import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import { Filter, Edit3, Trash2, ChevronDown, ChevronRight, ChevronLeft, X } from 'lucide-react';
import './user.css';
import { fetchUsers, createUser, deleteUser, appendPersistedUser, loadPersistedUsers, removePersistedUser } from '../api/authService.ts';

// 1. Fixed: Added missing Interface definition
interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Interpreter' | 'CSR' | 'Manager' | 'Customer';
  extension: string;
  language: string;
  status: 'Active' | 'Inactive';
}

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [createDialog, setCreateDialog] = useState<'interpreter' | 'csr' | 'manager' | 'customer' | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  // 2. Fixed: Users state with correct Type
  const [users, setUsers] = useState<SuperAdminUser[]>([]);

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Any',
    language: '',
    skill: '',
    department: '',
    enterprise: '',
  });

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const resetCreateForm = () => {
    setCreateForm({
      name: '', email: '', phone: '', gender: 'Any',
      language: '', skill: '', department: '', enterprise: '',
    });
  };

  const handleCreateChange = (field: keyof typeof createForm, value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildNewUser = (dialog: typeof createDialog): SuperAdminUser => {
    const role = dialog === 'interpreter' ? 'Interpreter' : dialog === 'csr' ? 'CSR' : dialog === 'manager' ? 'Manager' : 'Customer';
    const extension = String(100 + Math.floor(Math.random() * 900));
    const language = createForm.language || 'English';

    return {
      id: Date.now().toString(),
      name: createForm.name || `${role} User`,
      email: createForm.email || `${role.toLowerCase()}@example.com`,
      phone: createForm.phone || '+1 555 000 0000',
      role: role as any,
      extension,
      language,
      status: 'Active',
    };
  };

  const handleCreateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!createDialog) return;
    
    const newUser = buildNewUser(createDialog);
    try {
      const apiUser = await createUser(newUser);
      setUsers((current) => [apiUser, ...current]);
      setToast(`User created successfully`);
    } catch (error) {
      appendPersistedUser(newUser);
      setUsers((current) => [newUser, ...current]);
      setToast(`Request submitted offline`);
    }
    setCreateDialog(null);
    resetCreateForm();
  };

  // UI Helper Functions
  const createLabel = (dialog: typeof createDialog) => {
    if (dialog === 'interpreter') return 'Add New Interpreter';
    if (dialog === 'csr') return 'Add New CSR';
    if (dialog === 'manager') return 'Add New Manager';
    if (dialog === 'customer') return 'Add New Customer';
    return '';
  };

  const handleCreateOpen = (dialog: typeof createDialog) => {
    setCreateDialog(dialog);
    setShowCreateDropdown(false);
  };

  const handleCloseModal = () => {
    setCreateDialog(null);
    resetCreateForm();
  };

  // Rendering Helpers
  const renderModalField = (label: string, field: keyof typeof createForm, placeholder: string, type = 'text') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        value={createForm[field]}
        onChange={(e) => handleCreateChange(field, e.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );

  const renderModalSelect = (label: string, field: keyof typeof createForm, options: string[]) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={createForm[field]}
        onChange={(e) => handleCreateChange(field, e.target.value)}
        required
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  useEffect(() => {
    const storedUsers = loadPersistedUsers();
    fetchUsers()
      .then((received) => {
        setUsers(storedUsers.length > 0 ? [...storedUsers, ...received] : received);
      })
      .catch(() => {
        if (storedUsers.length > 0) setUsers(storedUsers);
      });
  }, []);

  return (
    <div className="page-content">
      {/* Modal */}
      {createDialog && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{createLabel(createDialog)}</h3>
              <button className="icon-button" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form className="form-grid" onSubmit={handleCreateSubmit}>
              {renderModalField('Full Name', 'name', 'Enter name')}
              {renderModalField('Email', 'email', 'email@example.com', 'email')}
              {renderModalField('Phone', 'phone', '+92...')}
              {createDialog !== 'customer' && renderModalSelect('Language', 'language', ['English', 'Spanish', 'French'])}
              <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="view-header">
        <h2>Users</h2>
        <div className="header-actions">
          <button className="btn-create" onClick={() => setShowCreateDropdown(!showCreateDropdown)}>
            Create New User <ChevronDown size={18} />
          </button>
          {showCreateDropdown && (
            <div className="dropdown-menu">
              <div className="menu-item" onClick={() => handleCreateOpen('interpreter')}>New Interpreter</div>
              <div className="menu-item" onClick={() => handleCreateOpen('csr')}>New CSR</div>
              <div className="menu-item" onClick={() => handleCreateOpen('manager')}>New Manager</div>
              <div className="menu-item" onClick={() => handleCreateOpen('customer')}>New Customer</div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Role</th>
              <th>Extension</th><th>Status</th><th>Edit</th><th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.extension}</td>
                <td>
                  <span className={`badge ${user.status.toLowerCase()}`}>{user.status}</span>
                </td>
                <td><Edit3 size={18} className="icon-edit" onClick={() => navigate(`/super-admin/edit/${user.role.toLowerCase()}`)} /></td>
                <td><Trash2 size={18} className="icon-delete" onClick={() => handleDeleteUser(user.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;