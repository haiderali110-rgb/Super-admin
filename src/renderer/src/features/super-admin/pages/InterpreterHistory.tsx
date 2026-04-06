
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft, Edit3, Trash2, X } from 'lucide-react';
import './user.css';
import { useLanguage, uiLabels } from '../../../contexts/LanguageContext';
import { fetchHistory } from '../api/superAdminApi';
import type { HistoryRow } from '../api/superAdminApi';

const InterpreterHistory: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const labels = uiLabels[language].pages.historyPage;
  const [showHistoryDD, setShowHistoryDD] = useState(false);
  const [rows, setRows] = useState<HistoryRow[]>([
    {
      id: '1',
      enterprise: 'Global Connect',
      datetime: '05 Aug, 2023 / 10:15 am',
      accessCode: '882104',
      language: 'Spanish',
      duration: '00:15:00',
    },
    {
      id: '2',
      enterprise: 'Direct Services',
      datetime: '06 Aug, 2023 / 02:30 pm',
      accessCode: '119042',
      language: 'French',
      duration: '00:45:12',
    },
  ]);
  const [editingRow, setEditingRow] = useState<HistoryRow | null>(null);
  const [editForm, setEditForm] = useState<HistoryRow | null>(null);

  const getRowKey = (row: HistoryRow) => row.id ?? row.accessCode;

  const handleEditChange = (field: keyof HistoryRow, value: string) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editForm || !editingRow) return;
    const editKey = getRowKey(editingRow);
    setRows((current) => current.map((row) => (getRowKey(row) === editKey ? editForm : row)));
    handleCloseEditModal();
  };

  const handleCloseEditModal = () => {
    setEditingRow(null);
    setEditForm(null);
  };

  useEffect(() => {
    fetchHistory('interpreter')
      .then(setRows)
      .catch(() => {
        // fallback to sample rows
      });
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowHistoryDD(false);
  };

  const handleEditRow = (id: string) => {
    const row = rows.find((row) => getRowKey(row) === id);
    if (!row) return;
    setEditingRow(row);
    setEditForm(row);
  };

  const handleDeleteRow = (id: string) => {
    setRows((current) => current.filter((row) => getRowKey(row) !== id));
  };

  const renderEditModal = () => {
    if (!editingRow || !editForm) return null;
    return (
      <div className="modal-backdrop" onClick={handleCloseEditModal}>
        <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
          <div className="modal-header">
            <h3>{labels.editModal.title}</h3>
            <button type="button" className="icon-button close-button" onClick={handleCloseEditModal}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label">{labels.editModal.enterprise}</label>
              <input
                type="text"
                className="form-input"
                value={editForm.enterprise}
                onChange={(e) => handleEditChange('enterprise', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{labels.editModal.dateTime}</label>
              <input
                type="text"
                className="form-input"
                value={editForm.datetime}
                onChange={(e) => handleEditChange('datetime', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{labels.editModal.accessCode}</label>
              <input
                type="text"
                className="form-input"
                value={editForm.accessCode}
                onChange={(e) => handleEditChange('accessCode', e.target.value)}
              />
            </div>
            {editForm.phone !== undefined && (
              <div className="form-group">
                <label className="form-label">{labels.editModal.phone}</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.phone}
                  onChange={(e) => handleEditChange('phone', e.target.value)}
                />
              </div>
            )}
            {editForm.language !== undefined && (
              <div className="form-group">
                <label className="form-label">{labels.editModal.language}</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.language}
                  onChange={(e) => handleEditChange('language', e.target.value)}
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">{labels.editModal.duration}</label>
              <input
                type="text"
                className="form-input"
                value={editForm.duration}
                onChange={(e) => handleEditChange('duration', e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCloseEditModal}>
                {labels.editModal.cancel}
              </button>
              <button type="submit" className="btn-primary">
                {labels.editModal.saveChanges}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="page-content">
      <div className="view-header">
      
        <div className="title-with-icon">
          <h2>{labels.pageTitle.interpreter}</h2>
        </div>

        <div className="header-actions">
          
          <div className="dropdown-container">
            <button className="btn-history-filter" onClick={() => setShowHistoryDD(!showHistoryDD)}>
              Interpreter’s history <ChevronDown size={18} />
            </button>
            
            {showHistoryDD && (
              <div className="dropdown-menu history-dd">
                    <div className="menu-item active-blue">
                  {labels.dropdown.interpreter} <ChevronRight size={14} />
                </div>
                <div className="menu-item" onClick={() => handleNavigation('/super-admin/history/csr')}>
                  {labels.dropdown.csr}
                </div>
                <div className="menu-item" onClick={() => handleNavigation('/super-admin/history/customer')}>
                  {labels.dropdown.customer}
                </div>
                <div className="menu-item" onClick={() => handleNavigation('/super-admin/history/web-manager')}>
                  {labels.dropdown.webManager}
                </div>
                <div className="menu-item" onClick={() => handleNavigation('/super-admin/history/mobile-interpreter')}>
                  {labels.dropdown.mobileInterpreter}
                </div>
                <div className="menu-item" onClick={() => handleNavigation('/super-admin/history/mobile-manager')}>
                  {labels.dropdown.mobileManager}
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
              <th>{labels.tableHeaders.enterprise}</th>
              <th>{labels.tableHeaders.dateTime}</th>
              <th>{labels.tableHeaders.accessCode}</th>
              <th>{labels.tableHeaders.language}</th>
              <th>{labels.tableHeaders.duration}</th>
              <th>{labels.tableHeaders.edit}</th>
              <th>{labels.tableHeaders.delete}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id ?? row.accessCode}>
                <td className="font-medium">{row.enterprise}</td>
                <td>{row.datetime}</td>
                <td>{row.accessCode}</td>
                <td>{row.language || '—'}</td>
                <td>{row.duration}</td>
                <td>
                  <button type="button" className="icon-button" onClick={() => handleEditRow(row.id ?? row.accessCode)}>
                    <Edit3 size={18} className="icon-edit" />
                  </button>
                </td>
                <td>
                  <button type="button" className="icon-button" onClick={() => handleDeleteRow(row.id ?? row.accessCode)}>
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
      {renderEditModal()}
    </div>
  );
};

export default InterpreterHistory;