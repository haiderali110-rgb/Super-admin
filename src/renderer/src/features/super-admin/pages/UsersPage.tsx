import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import { Filter, Edit3, Trash2, ChevronDown, ChevronRight, ChevronLeft, X } from 'lucide-react';
import './user.css';
import { fetchUsers, createUser, deleteUser, appendPersistedUser, loadPersistedUsers, removePersistedUser } from '../api/superAdminApi';
import type { SuperAdminUser } from '../api/superAdminApi';
const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [createDialog, setCreateDialog] = useState<'interpreter' | 'csr' | 'manager' | 'customer' | null>(null);
  const [toast, setToast] = useState<string | null>(null);
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
      name: '',
      email: '',
      phone: '',
      gender: 'Any',
      language: '',
      skill: '',
      department: '',
      enterprise: '',
    });
  };

  const handleCreateChange = (field: keyof typeof createForm, value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildNewUser = (dialog: typeof createDialog): SuperAdminUser => {
    const role =
      dialog === 'interpreter'
        ? 'Interpreter'
        : dialog === 'csr'
        ? 'CSR'
        : dialog === 'manager'
        ? 'Manager'
        : 'Customer';

    const extension = String(100 + Math.floor(Math.random() * 900));
    const language = createForm.language || (dialog === 'customer' ? 'English' : 'English');

    return {
      id: Date.now().toString(),
      name: createForm.name || `${role} User`,
      email: createForm.email || `${role.toLowerCase()}@example.com`,
      phone: createForm.phone || '+1 555 000 0000',
      role,
      extension,
      language,
      status: 'Active',
    };
  };

  const handleCreateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!createDialog) return;
    const label = createDialog === 'interpreter'
      ? 'Interpreter'
      : createDialog === 'csr'
      ? 'CSR'
      : createDialog === 'manager'
      ? 'Manager'
      : 'Customer';

    const newUser = buildNewUser(createDialog);
    try {
      const apiUser = await createUser({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        extension: newUser.extension,
        language: newUser.language,
        status: newUser.status,
      });
      setUsers((current) => [apiUser, ...current]);
      setToast(`${label} request submitted`);
    } catch (error) {
      appendPersistedUser(newUser);
      setUsers((current) => [newUser, ...current]);
      setToast(`${label} request submitted offline`);
    }
    setCreateDialog(null);
    resetCreateForm();
  };

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

  const handleBackdropClick = () => {
    setCreateDialog(null);
  };

  const handleCloseModal = () => {
    setCreateDialog(null);
    resetCreateForm();
  };

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

  const renderCreateFields = () => {
    if (!createDialog) return null;
    return (
      <>
        {renderModalField('Full Name', 'name', 'Enter full name')}
        {renderModalField('Email Address', 'email', 'name@example.com', 'email')}
        {renderModalField('Phone Number', 'phone', '+92 300 0000000')}
        {createDialog !== 'customer' && renderModalSelect('Preferred Language', 'language', ['English', 'Arabic', 'Spanish', 'French'])}
        {createDialog === 'interpreter' && renderModalSelect('Skill', 'skill', ['Customer Support', 'Technical Support', 'Language Interpretation'])}
        {createDialog === 'csr' && renderModalSelect('Skill', 'skill', ['Customer Support', 'Complaint Handling', 'Escalation Support'])}
        {createDialog === 'manager' && renderModalSelect('Department', 'department', ['Operations', 'Customer Success', 'Logistics'])}
        {createDialog === 'customer' && renderModalField('Enterprise', 'enterprise', 'Enter enterprise name')}
        {createDialog !== 'customer' && createDialog !== 'manager' && renderModalSelect('Request Gender', 'gender', ['Male', 'Female', 'Any'])}
        {createDialog === 'manager' && renderModalSelect('Gender', 'gender', ['Male', 'Female', 'Other'])}
        <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
          <button type="button" className="btn-secondary" onClick={handleCloseModal}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Submit
          </button>
        </div>
      </>
    );
  };

  const renderCreateModal = () =>
    createDialog ? (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{createLabel(createDialog)}</h3>
            <button type="button" className="icon-button close-button" onClick={handleCloseModal}>
              <X size={20} />
            </button>
          </div>
          <form className="form-grid" onSubmit={handleCreateSubmit}>
            {renderCreateFields()}
          </form>
        </div>
      </div>
    ) : null;

  const [users, setUsers] = useState<SuperAdminUser[]>([
    {
      id: '1',
      name: 'Jane Cooper',
      email: 'janecooper@example.com',
      phone: '+1 555-0110',
      role: 'Interpreter',
      extension: '492',
      language: 'French',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Wade Warren',
      email: 'warren.wade@example.com',
      phone: '+1 555-0110',
      role: 'CSR',
      extension: '798',
      language: '---',
      status: 'Inactive',
    },
    {
      id: '3',
      name: 'Esther Howard',
      email: 'esshterhoward@example.com',
      phone: '+1 555-0110',
      role: 'Interpreter',
      extension: '877',
      language: 'German',
      status: 'Active',
    },
  ]);

  useEffect(() => {
    const storedUsers = loadPersistedUsers();
    fetchUsers()
      .then((received) => {
        if (storedUsers.length > 0) {
          setUsers([...storedUsers, ...received]);
        } else {
          setUsers(received);
        }
      })
      .catch(() => {
        if (storedUsers.length > 0) {
          setUsers(storedUsers);
        }
      });
  }, []);

  const handleFilterClick = (path: string) => {
    navigate(path);
    setShowFilterDropdown(false);
  };

  const handleEditUser = (id: string) => {
    const user = users.find((item) => item.id === id);
    if (!user) return;

    const editRoute =
      user.role === 'Interpreter'
        ? '/super-admin/edit/interpreter'
        : user.role === 'CSR'
        ? '/super-admin/edit/csr'
        : user.role === 'Manager'
        ? '/super-admin/edit/manager'
        : '/super-admin/users';

    navigate(editRoute);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await deleteUser(id);
    } catch {
      removePersistedUser(id);
    }

    setUsers((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="page-content">
      {renderCreateModal()}
      <div className="view-header">
        <h2>User</h2>
        <div className="header-actions">
          <div className="dropdown-container">
            <div className="filter-select-box" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
              <span>All</span>
              <Filter size={19} />
            </div>
            {showFilterDropdown && (
              <div className="dropdown-menu filter-menu">
                <div className="menu-item" onClick={() => setShowFilterDropdown(false)}>All</div>
                
                <div 
                  className="menu-item active-blue" 
                  onClick={() => handleFilterClick('/super-admin/history/interpreter')}
                >
                  Interpreter <ChevronRight size={14} />
                </div> 
                <div 
                  className="menu-item" 
                  onClick={() => handleFilterClick('/super-admin/history/csr')}
                >
                  CSR
                </div>
                
                <div className="menu-item">Customer</div>
                <div className="menu-item">Web Manager</div>
              </div>
            )}
          </div>
          <div className="dropdown-container">
            <button className="btn-create" onClick={() => setShowCreateDropdown(!showCreateDropdown)}>
              Create New User <ChevronDown size={18} />
            </button>
            {showCreateDropdown && (
              <div className="dropdown-menu create-menu">
                <div className="menu-item header-item">Create New</div>
                <div className="menu-item" onClick={() => handleCreateOpen('interpreter')}>
                  New Interpreter
                </div>
                <div className="menu-item" onClick={() => handleCreateOpen('csr')}>
                  New CSR
                </div>
                <div className="menu-item" onClick={() => handleCreateOpen('manager')}>
                  New Manager
                </div>
                <div className="menu-item" onClick={() => handleCreateOpen('customer')}>
                  New Customer
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Role</th>
              <th>Extension</th><th>Language</th><th>Status</th>
              <th>Edit</th><th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.extension}</td>
                <td>{user.language}</td>
                <td>
                  <span className={`badge ${user.status.toLowerCase()}`}>
                    <span className="dot"></span> {user.status}
                  </span> 
                </td>
                <td>
                  <button type="button" className="icon-button" onClick={() => handleEditUser(user.id)}>
                    <Edit3 size={18} className="icon-edit" />
                  </button>
                </td>
                <td>
                  <button type="button" className="icon-button" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 size={18} className="icon-delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-footer">
         <button className="pg-arrow"><ChevronLeft size={18} /></button>
         <button className="pg-num active">1</button>
         <button className="pg-num">2</button>
         <button className="pg-arrow"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
};

export default UsersPage;