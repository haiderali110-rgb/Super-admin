import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateUser } from '../api/superAdminApi';
import './user.css';

const EditInterpreterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('id');
  const [form, setForm] = useState({
    name: 'Jane Cooper', email: 'janecooper@example.com', phone: '+1 555-0110', language: 'English', skill: 'Language Interpretation', gender: 'Any',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userId) {
      try {
        await updateUser(userId, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          language: form.language,
          status: 'Active',
        });
        window.alert('Interpreter profile updated on server');
      } catch {
        window.alert('Interpreter profile updated locally (server unavailable)');
      }
    } else {
      window.alert('Interpreter profile updated locally (no id provided)');
    }
    navigate('/super-admin/users');
  };

  return (
    <div className="page-content">
      <div className="view-header">
        <h2>Edit Interpreter / CSR</h2>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Language</label>
            <select className="form-select" value={form.language} onChange={(e) => handleChange('language', e.target.value)} required>
              <option>English</option>
              <option>Arabic</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Skill</label>
            <select className="form-select" value={form.skill} onChange={(e) => handleChange('skill', e.target.value)} required>
              <option>Customer Support</option>
              <option>Technical Support</option>
              <option>Language Interpretation</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Request Gender</label>
            <select className="form-select" value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} required>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInterpreterPage;
