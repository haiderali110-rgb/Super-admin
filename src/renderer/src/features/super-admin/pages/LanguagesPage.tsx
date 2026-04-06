import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './user.css';
import { fetchLanguages } from '../api/superAdminApi';
import type { LanguageRate } from '../api/superAdminApi';
import { useLanguage, uiLabels } from '../../../contexts/LanguageContext';

type LanguageScreen = 'info' | 'add' | 'edit' | 'details' | 'notifications';

const LanguagesPage: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<LanguageScreen>('info');
  const [selectedLanguageRate, setSelectedLanguageRate] = useState<LanguageRate | null>(null);
  const [languages, setLanguages] = useState<LanguageRate[]>([
    { id: '1', language: 'English', ratePerMinute: '$0.55', status: 'Active' },
    { id: '2', language: 'Spanish', ratePerMinute: '$0.65', status: 'Active' },
    { id: '3', language: 'German', ratePerMinute: '$0.82', status: 'Inactive' },
    { id: '4', language: 'Urdu', ratePerMinute: '$0.50', status: 'Active' },
  ]);
  const [form, setForm] = useState({ language: '', ratePerMinute: '', status: 'Active' });

  const { language: selectedLanguage, setLanguage } = useLanguage();
  const labels = uiLabels[selectedLanguage]?.pages.languagesPage ?? uiLabels.English.pages.languagesPage;

  useEffect(() => {
    fetchLanguages()
      .then((data) => setLanguages(data))
      .catch(() => {
        
      });
  }, []);

  const openAddScreen = () => {
    setForm({ language: '', ratePerMinute: '', status: 'Active' });
    setSelectedLanguageRate(null);
    setCurrentScreen('add');
  };

  const openEditScreen = (item: LanguageRate) => {
    setForm({ language: item.language, ratePerMinute: item.ratePerMinute, status: item.status });
    setSelectedLanguageRate(item);
    setCurrentScreen('edit');
  };

  const openDetailsScreen = (item: LanguageRate) => {
    setSelectedLanguageRate(item);
    setCurrentScreen('details');
  };

  const addLanguage = () => {
    const newItem: LanguageRate = {
      id: Date.now().toString(),
      language: form.language || 'New language',
      ratePerMinute: form.ratePerMinute || '$0.00',
      status: (form.status as string) || 'Active',
    };
    setLanguages((prev) => [newItem, ...prev]);
    setCurrentScreen('info');
  };

  const updateLanguage = () => {
    if (!selectedLanguageRate) return;
    setLanguages((prev) =>
      prev.map((item) =>
        item.id === selectedLanguageRate.id
          ? { ...item, language: form.language, ratePerMinute: form.ratePerMinute, status: form.status }
          : item,
      ),
    );
    setCurrentScreen('info');
    setSelectedLanguageRate(null);
  };

  const content = () => {
    if (currentScreen === 'add') {
      return (
        <div className="form-card">
          <h3>{labels.createHeader} (2nd screen)</h3>
          <label>Language</label>
          <input value={form.language} onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))} />
          <label>Rate Per Minute</label>
          <input value={form.ratePerMinute} onChange={(e) => setForm((prev) => ({ ...prev, ratePerMinute: e.target.value }))} />
          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <div className="form-actions">
            <button className="btn-primary" onClick={addLanguage}>Save</button>
            <button className="btn-secondary" onClick={() => setCurrentScreen('info')}>Cancel</button>
          </div>
        </div>
      );
    }

    if (currentScreen === 'edit' && selectedLanguageRate) {
      return (
        <div className="form-card">
          <h3>Edit team language / rate (3rd screen)</h3>
          <label>Language</label>
          <input value={form.language} onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))} />
          <label>Rate Per Minute</label>
          <input value={form.ratePerMinute} onChange={(e) => setForm((prev) => ({ ...prev, ratePerMinute: e.target.value }))} />
          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <div className="form-actions">
            <button className="btn-primary" onClick={updateLanguage}>Update</button>
            <button className="btn-secondary" onClick={() => setCurrentScreen('info')}>Cancel</button>
          </div>
        </div>
      );
    }

    if (currentScreen === 'details' && selectedLanguageRate) {
      return (
        <div className="form-card">
          <h3>Language details (4th screen)</h3>
          <p><strong>Language:</strong> {selectedLanguageRate.language}</p>
          <p><strong>Rate / Min:</strong> {selectedLanguageRate.ratePerMinute}</p>
          <p><strong>Status:</strong> {selectedLanguageRate.status}</p>
          <button className="btn-primary" onClick={() => setCurrentScreen('info')}>Back to list</button>
        </div>
      );
    }

    if (currentScreen === 'notifications') {
      return (
        <div className="form-card">
          <h3>Notifications (5th screen)</h3>
          <ul className="notifications-list">
            <li>New interpreter request pending</li>
            <li>CSR role change approved</li>
            <li>Language rate updated</li>
          </ul>
          <button className="btn-primary" onClick={() => setCurrentScreen('info')}>Back to languages</button>
        </div>
      );
    }

    return (
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{labels.tableHeaders.language}</th>
              <th>{labels.tableHeaders.rate}</th>
              <th>{labels.tableHeaders.status}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {languages.map((item) => (
              <tr key={item.id} className={item.language === selectedLanguage ? 'selected-row' : ''}>
                <td className="font-medium">{item.language}</td>
                <td>{item.ratePerMinute}</td>
                <td>
                  <span className={`badge ${item.status.toLowerCase()}`}>
                    <span className="dot"></span> {labels.statusMap[item.status] ?? item.status}
                  </span>
                </td>
                <td>
                  <button className="btn-link" onClick={() => openDetailsScreen(item)}>View</button>
                  <button className="btn-link" onClick={() => openEditScreen(item)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="page-content">
      <div className="view-header">
        <h2>{labels.title}</h2>
        <p>{labels.subtitle}</p>
      </div>

      <div className="page-tabs">
        <button className={currentScreen === 'info' ? 'tab-active' : ''} onClick={() => setCurrentScreen('info')}>Language Info</button>
        <button className={currentScreen === 'add' ? 'tab-active' : ''} onClick={openAddScreen}>Add Language</button>
        <button className={currentScreen === 'edit' ? 'tab-active' : ''} onClick={() => selectedLanguageRate ? setCurrentScreen('edit') : openAddScreen()}>Edit Team</button>
        <button className={currentScreen === 'details' ? 'tab-active' : ''} onClick={() => selectedLanguageRate ? setCurrentScreen('details') : setCurrentScreen('info')}>Language Screen</button>
        <button className={currentScreen === 'notifications' ? 'tab-active' : ''} onClick={() => setCurrentScreen('notifications')}>Notifications</button>
      </div>

      {content()}
    </div>
  );
};

export default LanguagesPage;
