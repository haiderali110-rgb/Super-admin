import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css';
import { appendPersistedUser, createUser } from '../api/superAdminApi';
import type { SuperAdminUser } from '../api/superAdminApi';

const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', enterprise: '', language: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newUser: Omit<SuperAdminUser, 'id'> = {
      name: form.name || 'Customer User',
      email: form.email || 'customer@example.com',
      phone: form.phone || '+1 555 000 0000',
      role: 'Customer',
      extension: String(100 + Math.floor(Math.random() * 900)),
      language: form.language || 'English',
      status: 'Active',
    };

    try {
      await createUser(newUser);
      window.alert('New customer added successfully');
    } catch (error) {
      appendPersistedUser({ id: Date.now().toString(), ...newUser });
      window.alert('Could not reach server, saved locally');
    }

    navigate('/super-admin/users');
  };

  return (
    <div className="page-content">
      <div className="view-header">
        <h2>Add New Customer</h2>
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
              placeholder="customer@example.com"
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
            <label className="form-label">Enterprise</label>
            <input
              className="form-input"
              value={form.enterprise}
              onChange={(e) => handleChange('enterprise', e.target.value)}
              placeholder="Enter enterprise name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Language</label>
            <select
              className="form-select"
              value={form.language}
              onChange={(e) => handleChange('language', e.target.value)}
              required
            >
              <option value="">Select language</option>
              <option>English</option>
              <option>Spanish</option>
              <option>German</option>
            </select>
          </div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            <button type="submit" className="btn-primary">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerPage;
