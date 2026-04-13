import React, { useEffect, useState } from 'react';
import { Edit3, Trash2, X, Plus, ChevronDown } from 'lucide-react';
import './user.css'; 

interface Language {
  _id: string;
  language: string;
  languageGroup: string;
  normalCallRate: number;
  emergencyCallRate: number;
}

const LanguagesPage: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    language: '', languageGroup: '', normalCallRate: '', emergencyCallRate: ''
  });

  useEffect(() => {
    const mockData: Language[] = [
      { _id: '1', language: 'Persian', languageGroup: 'Middle East', normalCallRate: 10, emergencyCallRate: 10.5 },
      { _id: '2', language: 'French', languageGroup: 'Europe', normalCallRate: 10, emergencyCallRate: 10.5 },
      { _id: '3', language: 'Urdu', languageGroup: 'Asian', normalCallRate: 10, emergencyCallRate: 10.5 },
    ];
    setLanguages(mockData);
  }, []);

  const handleOpenEdit = (lang: Language) => {
    setEditingLang(lang);
    setFormData({
      language: lang.language,
      languageGroup: lang.languageGroup,
      normalCallRate: lang.normalCallRate.toString(),
      emergencyCallRate: lang.emergencyCallRate.toString()
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLang(null);
    setFormData({ language: '', languageGroup: '', normalCallRate: '', emergencyCallRate: '' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateData = {
      language: formData.language,
      languageGroup: formData.languageGroup,
      normalCallRate: parseFloat(formData.normalCallRate) || 0,
      emergencyCallRate: parseFloat(formData.emergencyCallRate) || 0
    };

    if (editingLang) {
      setLanguages(languages.map(l => l._id === editingLang._id ? { ...l, ...rateData } : l));
      setToast('Language updated successfully');
    } else {
      setLanguages([...languages, { _id: Date.now().toString(), ...rateData }]);
      setToast('Language added successfully');
    }
    handleCloseModal();
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setLanguages(languages.filter(l => l._id !== deleteConfirmId));
      setToast('Language deleted successfully');
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="page-content">
      {toast && <div className="toast-message">{toast}</div>}

      {/* --- Add / Edit Language Modal --- */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel" style={{ maxWidth: '450px', borderRadius: '12px', padding: '0' }}>
            <div className="modal-header" style={{ padding: '20px', borderBottom: 'none' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#1a2b4b' }}>
                {editingLang ? 'Edit Language' : 'Add New Language'}
              </h3>
              <button className="close-button" onClick={handleCloseModal} style={{ background: 'none' }}>
                <X size={20} color="#999" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} style={{ padding: '0 25px 25px 25px' }}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Language</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-select" 
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', appearance: 'none' }}
                  >
                    <option value="">Select Language</option>
                    <option value="German">German</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Persian">Persian</option>
                    <option value="Urdu">Urdu</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '15px', pointerEvents: 'none', color: '#666' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Language Group</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-select" 
                    value={formData.languageGroup}
                    onChange={(e) => setFormData({...formData, languageGroup: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', appearance: 'none' }}
                  >
                    <option value="">Select Group</option>
                    <option value="Europe">Europe</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Asian">Asian</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '15px', pointerEvents: 'none', color: '#666' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Normal Call Rate (per minute)</label>
                <input 
                  className="form-input" 
                  type="text"
                  placeholder="10$"
                  value={formData.normalCallRate}
                  onChange={(e) => setFormData({...formData, normalCallRate: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label className="form-label">Emergency Call Rate (per minute)</label>
                <input 
                  className="form-input" 
                  type="text"
                  placeholder="10.5$"
                  value={formData.emergencyCallRate}
                  onChange={(e) => setFormData({...formData, emergencyCallRate: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: '#5c8de1', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}
              >
                {editingLang ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation --- */}
      {deleteConfirmId && (
        <div className="modal-backdrop">
          <div className="modal-panel" style={{ maxWidth: '400px', textAlign: 'center', borderRadius: '12px', padding: '30px' }}>
            <h3 style={{ color: '#1a2b4b', marginBottom: '10px' }}>Delete Language Confirmation</h3>
            <p style={{ color: '#666', marginBottom: '25px' }}>This will permanently remove the selected language.</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={confirmDelete} style={{ background: '#ff5c5c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Yes, Delete it</button>
              <button onClick={() => setDeleteConfirmId(null)} style={{ background: '#fff', color: '#666', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>No, Keep it</button>
            </div>
          </div>
        </div>
      )}

      <div className="view-header">
        <h2>Language & Rate</h2>
        <button className="btn-create" onClick={() => setIsModalOpen(true)}>
           Add New Language <Plus size={18} />
        </button>
      </div>

      <div className="table-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Language</th>
                <th>Language Group</th>
                {/* RATES COLUMN ADDED HERE */}
                <th>Call Rate (per minute)</th>
                <th>Edit</th>
                <th>Delete Language</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((item) => (
                <tr key={item._id}>
                  <td>{item.language}</td>
                  <td>{item.languageGroup}</td>
                  {/* DISPLAYING NORMAL & EMERGENCY RATES */}
                  <td style={{ fontWeight: '500' }}>
                    <div style={{ fontSize: '14px' }}>Normal: {item.normalCallRate}$</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Emergency: {item.emergencyCallRate}$</div>
                  </td>
                  <td>
                    <button className="action-btn-new edit-btn-new" onClick={() => handleOpenEdit(item)}>
                      <Edit3 size={16} />
                    </button>
                  </td>
                  <td>
                    <button className="action-btn-new delete-btn-new" onClick={() => setDeleteConfirmId(item._id)} style={{ color: '#ff5c5c' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LanguagesPage;