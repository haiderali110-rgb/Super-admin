import React, { useEffect, useState } from 'react';
import { ChevronDown, Edit3, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './user.css';
import { fetchLines } from '../api/superAdminApi';
import type { LineExtension } from '../api/superAdminApi';

type LineRow = LineExtension & { role?: string };

const LinesPage: React.FC = () => {
  const [lines, setLines] = useState<LineRow[]>([
    { id: '1', lineName: 'Jane Cooper', role: 'Interpreter', extensionNumber: '883', assignedTo: '', status: 'Active' },
    { id: '2', lineName: 'Wade Warren', role: 'CSR', extensionNumber: '583', assignedTo: '', status: 'Active' },
    { id: '3', lineName: 'Esther Howard', role: 'Interpreter', extensionNumber: '740', assignedTo: '', status: 'Active' },
    { id: '4', lineName: 'Cameron Williamson', role: 'Manager', extensionNumber: '423', assignedTo: '', status: 'Active' },
    { id: '5', lineName: 'Brooklyn Simmons', role: 'Customer', extensionNumber: '536', assignedTo: '', status: 'Active' },
  ]);

  // --- States for Edit Modal ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<LineRow | null>(null);
  const [editForm, setEditForm] = useState({
    extension: '',
    holderName: '',
    role: ''
  });

  useEffect(() => {
    fetchLines()
      .then((data) => setLines(data as LineRow[]))
      .catch(() => { });
  }, []);

  // --- Handlers ---
  const handleEditClick = (line: LineRow) => {
    setEditingLine(line);
    setEditForm({
      extension: line.extensionNumber,
      holderName: line.lineName,
      role: line.role || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLine) return;

    // Update list state
    setLines(currentLines => 
      currentLines.map(item => 
        item.id === editingLine.id 
          ? { ...item, extensionNumber: editForm.extension, lineName: editForm.holderName, role: editForm.role }
          : item
      )
    );

    setIsEditModalOpen(false);
    setEditingLine(null);
  };

  return (
    <div className="page-content lines-page">
      <div className="view-header lines-page-header">
        <h2 className="lines-title">Extension</h2>

        <div className="lines-head-right">
          <div className="line-meta">
            <div className="line-meta-title">Line</div>
            <div className="line-meta-subtitle">Phone number</div>
          </div>

          <div className="line-phone-box">
            <button type="button" className="line-country-code">
              +1 <ChevronDown size={16} />
            </button>
            <input type="text" defaultValue="555-01106969" className="line-phone-input" />
          </div>
        </div>
      </div>

      <div className="table-card lines-table-card">
        <div className="table-container">
          <table className="data-table lines-table">
            <thead>
              <tr>
                <th>Agent Name</th>
                <th>Role</th>
                <th>Extensions</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium">{item.lineName}</td>
                  <td>{item.role || 'N/A'}</td>
                  <td>{item.extensionNumber}</td>
                  <td>
                    <button className="line-edit-btn" onClick={() => handleEditClick(item)}>
                      <Edit3 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-footer lines-pagination">
          <button className="pg-arrow"><ChevronLeft size={16} /></button>
          <button className="pg-num active">1</button>
          <button className="pg-num">2</button>
          <button className="pg-num">3</button>
          <span className="pg-dots">...</span>
          <button className="pg-num">9</button>
          <button className="pg-num">10</button>
          <button className="pg-arrow"><ChevronRight size={16} /></button>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-panel lines-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Extension</h3>
              <button type="button" className="icon-button close-button" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Extension</label>
                <input
                  className="form-input"
                  value={editForm.extension}
                  onChange={(e) => setEditForm({ ...editForm, extension: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Extension Holder</label>
                <input
                  className="form-input"
                  value={editForm.holderName}
                  onChange={(e) => setEditForm({ ...editForm, holderName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Holder Role</label>
                <input
                  className="form-input"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary lines-modal-save">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinesPage;
