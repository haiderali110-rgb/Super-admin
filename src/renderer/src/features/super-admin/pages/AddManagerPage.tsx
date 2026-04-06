import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css';
import { appendPersistedUser, createUser } from '../api/superAdminApi';
import type { SuperAdminUser } from '../api/superAdminApi';

const AddManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', department: '', language: '', gender: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newUser: Omit<SuperAdminUser, 'id'> = {
      name: form.name || 'Manager User',
      email: form.email || 'manager@example.com',
      phone: form.phone || '+1 555 000 0000',
      role: 'Manager',
      extension: String(100 + Math.floor(Math.random() * 900)),
      language: form.language || 'English',
      status: 'Active',
    };

    try {
      await createUser(newUser);
      window.alert('New manager request submitted successfully');
    } catch (error) {
      appendPersistedUser({ id: Date.now().toString(), ...newUser });
      window.alert('Could not reach server, saved locally');
    }

    navigate('/super-admin/users');
  };

  return (
    <div className="page-content">
      <div className="view-header">
        <h2>Add New Manager</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="manager@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              className="form-input"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+92 300 0000000"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
              required
            >
              <option value="">Select department</option>
              <option>Operations</option>
              <option>Customer Success</option>
              <option>Logistics</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Language</label>
            <select
              className="form-select"
              value={form.language}
              onChange={(e) => handleChange('language', e.target.value)}
              required
            >
              <option value="">Select language</option>
              <option>English</option>
              <option>Urdu</option>
              <option>Spanish</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            <button type="submit" className="btn-primary">
              Add Manager
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddManagerPage;
