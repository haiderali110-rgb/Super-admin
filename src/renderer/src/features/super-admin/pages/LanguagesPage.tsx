import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import './user.css';
import {
  fetchLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  fetchLanguageGroups,
} from '../api/superAdminApi';
import type { LanguageRate, LanguageGroup } from '../api/superAdminApi';
import { useLanguage, uiLabels } from '../../../contexts/LanguageContext';

const ITEMS_PER_PAGE = 10;

type ModalMode = 'none' | 'add' | 'edit' | 'delete';

type LanguageForm = {
  language: string;
  languageGroup: string;
  normalCallRate: string;
  emergencyCallRate: string;
  status: string;
};

const LanguagesPage: React.FC = () => {
  const [languages, setLanguages] = useState<LanguageRate[]>([]);
  const [languageGroups, setLanguageGroups] = useState<LanguageGroup[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [selectedLanguageRate, setSelectedLanguageRate] = useState<LanguageRate | null>(null);
  const [form, setForm] = useState<LanguageForm>({
    language: '',
    languageGroup: 'Europe',
    normalCallRate: '',
    emergencyCallRate: '',
    status: 'Active',
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { language: selectedLanguage } = useLanguage();
  const labels = uiLabels[selectedLanguage]?.pages.languagesPage ?? uiLabels.English.pages.languagesPage;

  useEffect(() => {
    fetchLanguages()
      .then((data) => setLanguages(data))
      .catch(() => setLanguages([]));

    fetchLanguageGroups()
      .then((groups) => setLanguageGroups(groups))
      .catch(() =>
        setLanguageGroups([
          { _id: '1', name: 'Europe' },
          { _id: '2', name: 'Middle East' },
          { _id: '3', name: 'Asia' },
          { _id: '4', name: 'Americas' },
        ]),
      );
  }, []);

  useEffect(() => {
    if (languageGroups.length && !form.languageGroup) {
      setForm((prev) => ({ ...prev, languageGroup: languageGroups[0].name }));
    }
  }, [languageGroups]);

  const pagedLanguages = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return languages.slice(start, start + ITEMS_PER_PAGE);
  }, [languages, page]);

  const totalPages = Math.max(1, Math.ceil(languages.length / ITEMS_PER_PAGE));

  const resetForm = () => {
    setForm({
      language: '',
      languageGroup: languageGroups[0]?.name || 'Europe',
      normalCallRate: '',
      emergencyCallRate: '',
      status: 'Active',
    });
    setErrorMessage(null);
  };

  const openAddModal = () => {
    resetForm();
    setSelectedLanguageRate(null);
    setModalMode('add');
  };

  const openEditModal = (item: LanguageRate) => {
    setSelectedLanguageRate(item);
    setForm({
      language: item.language,
      languageGroup: item.languageGroup,
      normalCallRate: item.normalCallRate.toString(),
      emergencyCallRate: item.emergencyCallRate.toString(),
      status: item.status,
    });
    setErrorMessage(null);
    setModalMode('edit');
  };

  const openDeleteModal = (item: LanguageRate) => {
    setSelectedLanguageRate(item);
    setErrorMessage(null);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode('none');
    setSelectedLanguageRate(null);
    setErrorMessage(null);
  };

  const handleFormChange = (field: keyof LanguageForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!form.language.trim()) return 'Language is required.';
    if (!form.languageGroup.trim()) return 'Language group is required.';
    if (!form.normalCallRate.trim()) return 'Normal call rate is required.';
    if (!form.emergencyCallRate.trim()) return 'Emergency call rate is required.';
    if (Number.isNaN(Number(form.normalCallRate)) || Number(form.normalCallRate) < 0) return 'Normal call rate must be a valid number.';
    if (Number.isNaN(Number(form.emergencyCallRate)) || Number(form.emergencyCallRate) < 0) return 'Emergency call rate must be a valid number.';
    return null;
  };

  const handleCreateLanguage = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setLoading(true);
    try {
      const newLanguage = {
        language: form.language,
        languageGroup: form.languageGroup,
        normalCallRate: Number(form.normalCallRate),
        emergencyCallRate: Number(form.emergencyCallRate),
        status: form.status,
      };
      const created = await createLanguage(newLanguage);
      setLanguages((prev) => [created, ...prev]);
      setPage(1);
      closeModal();
    } catch {
      setErrorMessage('Unable to save language. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLanguage = async () => {
    if (!selectedLanguageRate) return;
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setLoading(true);
    try {
      const updatedItem = await updateLanguage(selectedLanguageRate._id, {
        language: form.language,
        languageGroup: form.languageGroup,
        normalCallRate: Number(form.normalCallRate),
        emergencyCallRate: Number(form.emergencyCallRate),
        status: form.status,
      });
      setLanguages((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
      closeModal();
    } catch {
      setErrorMessage('Unable to update language. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLanguage = async () => {
    if (!selectedLanguageRate) return;
    setLoading(true);
    try {
      await deleteLanguage(selectedLanguageRate._id);
      setLanguages((prev) => prev.filter((item) => item._id !== selectedLanguageRate._id));
      closeModal();
    } catch {
      setErrorMessage('Unable to delete language. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderModalContent = () => {
    if (modalMode === 'delete' && selectedLanguageRate) {
      return (
        <div className="modal-card">
          <div className="modal-header">
            <h3>{labels.deleteModalTitle}</h3>
            <button className="modal-close" onClick={closeModal}>&times;</button>
          </div>
          <p className="modal-text">{labels.deleteConfirmation}</p>
          <div className="modal-actions">
            <button className="btn-danger" onClick={handleDeleteLanguage} disabled={loading}>{labels.btnYesDelete}</button>
            <button className="btn-secondary" onClick={closeModal} disabled={loading}>{labels.btnNoKeep}</button>
          </div>
          {errorMessage && <p className="modal-error">{errorMessage}</p>}
        </div>
      );
    }

    const heading = modalMode === 'edit' ? labels.editModalTitle : labels.addModalTitle;
    const submitLabel = modalMode === 'edit' ? labels.btnSave : labels.btnCreate;

    return (
      <div className="modal-card modal-form-card">
        <div className="modal-header">
          <h3>{heading}</h3>
          <button className="modal-close" onClick={closeModal}>&times;</button>
        </div>
        <div className="form-grid modal-form-grid">
          <div className="form-group">
            <label className="form-label">{labels.tableHeaders.language}</label>
            <input
              className="form-input"
              value={form.language}
              onChange={(e) => handleFormChange('language', e.target.value)}
              placeholder="Language"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{labels.tableHeaders.languageGroup}</label>
            <select
              className="form-select"
              value={form.languageGroup}
              onChange={(e) => handleFormChange('languageGroup', e.target.value)}
            >
              {languageGroups.map((group) => (
                <option key={group._id} value={group.name}>{group.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{labels.tableHeaders.normalCallRate}</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              value={form.normalCallRate}
              onChange={(e) => handleFormChange('normalCallRate', e.target.value)}
              placeholder="e.g. 10"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{labels.tableHeaders.emergencyCallRate}</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              value={form.emergencyCallRate}
              onChange={(e) => handleFormChange('emergencyCallRate', e.target.value)}
              placeholder="e.g. 15"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{labels.tableHeaders.status}</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => handleFormChange('status', e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="form-actions modal-actions-row">
          <button className="btn-primary" onClick={modalMode === 'edit' ? handleUpdateLanguage : handleCreateLanguage} disabled={loading}>
            {loading ? 'Saving...' : submitLabel}
          </button>
          <button className="btn-secondary" onClick={closeModal} disabled={loading}>Cancel</button>
        </div>
        {errorMessage && <p className="modal-error">{errorMessage}</p>}
      </div>
    );
  };

  return (
    <div className="page-content">
      <div className="view-header space-between">
        <div>
          <h2>{labels.title}</h2>
          <p>{labels.subtitle}</p>
        </div>
        <button className="btn-create" onClick={openAddModal}>
          <Plus size={16} /> {labels.button}
        </button>
      </div>

      <div className="table-card languages-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{labels.tableHeaders.language}</th>
              <th>{labels.tableHeaders.languageGroup}</th>
              <th>{labels.tableHeaders.normalCallRate}</th>
              <th>{labels.tableHeaders.emergencyCallRate}</th>
              <th>{labels.tableHeaders.status}</th>
              <th>{labels.tableHeaders.edit}</th>
            </tr>
          </thead>
          <tbody>
            {pagedLanguages.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">No languages available.</td>
              </tr>
            ) : (
              pagedLanguages.map((item) => (
                <tr key={item._id}>
                  <td className="font-medium">{item.language}</td>
                  <td>{item.languageGroup}</td>
                  <td>{item.normalCallRate}$</td>
                  <td>{item.emergencyCallRate}$</td>
                  <td>
                    <span className={`badge ${item.status.toLowerCase()}`}>
                      <span className="dot" /> {item.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="icon-button" onClick={() => openEditModal(item)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="icon-button danger" onClick={() => openDeleteModal(item)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-footer">
        <button className="pg-arrow" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
          <ChevronLeft size={16} />
        </button>
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button key={pageNumber} className={`pg-num ${pageNumber === page ? 'active' : ''}`} onClick={() => setPage(pageNumber)}>
              {pageNumber}
            </button>
          );
        })}
        <button className="pg-arrow" disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
          <ChevronRight size={16} />
        </button>
      </div>

      {modalMode !== 'none' && <div className="modal-overlay">{renderModalContent()}</div>}
    </div>
  );
};

export default LanguagesPage;
