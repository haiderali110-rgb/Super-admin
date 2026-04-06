import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css';
import { appendPersistedUser, createUser } from '../api/superAdminApi';
import type { SuperAdminUser } from '../api/superAdminApi';

const AddInterpreterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', gender: '', language: '', skill: '', role: 'Interpreter', requestType: 'New Interpreter',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newUser: Omit<SuperAdminUser, 'id'> = {
      name: form.name || 'Interpreter User',
      email: form.email || 'interpreter@example.com',
      phone: form.phone || '+1 555 000 0000',
      role: 'Interpreter',
      extension: String(100 + Math.floor(Math.random() * 900)),
      language: form.language || 'English',
      status: 'Active',
    };

    try {
      await createUser(newUser);
      window.alert('Interpreter request submitted successfully');
    } catch (error) {
      appendPersistedUser({ id: Date.now().toString(), ...newUser });
      window.alert('Could not reach server, saved locally');
    }

    navigate('/super-admin/users');
  };

  return (
    <div className="page-content">
      <div className="view-header">
        <h2>Add New Interpreter / CSR</h2>
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
              placeholder="name@example.com"
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
            <label className="form-label">Request Type</label>
            <select
              className="form-select"
              value={form.requestType}
              onChange={(e) => handleChange('requestType', e.target.value)}
            >
              <option>New Interpreter</option>
              <option>New CSR</option>
            </select>
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
              <option>Arabic</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Skill</label>
            <select
              className="form-select"
              value={form.skill}
              onChange={(e) => handleChange('skill', e.target.value)}
              required
            >
              <option value="">Select skill</option>
              <option>Customer Support</option>
              <option>Technical Support</option>
              <option>Language Interpretation</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Request Gender</label>
            <select
              className="form-select"
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Any</option>
            </select>
          </div>

          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            <button type="submit" className="btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInterpreterPage;
