import React, { useEffect, useState } from 'react';
import { ChevronDown, Edit3, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './user.css';
import { fetchUsersWithStatus } from '../api/superAdminApi';
import type { SuperAdminUser } from '../api/superAdminApi';

// ── LineRow uses SuperAdminUser directly ──
type LineRow = {
  id: string;
  lineName: string;
  role: string;
  extensionNumber: string;
  status: string;
};

const ITEMS_PER_PAGE = 10;

const LinesPage: React.FC = () => {
  const [lines, setLines] = useState<LineRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Edit Modal ──
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<LineRow | null>(null);
  const [editForm, setEditForm] = useState({
    extension: '',
    holderName: '',
    role: '',
  });

  // ── Load Users from API ──
  useEffect(() => {
    setIsLoading(true);

    fetchUsersWithStatus()
      .then((result) => {
        // Convert SuperAdminUser list to LineRow list
        // Only include users who have an extension number
        const mapped: LineRow[] = result.users
          .filter((u: SuperAdminUser) => u.extension && u.extension !== '' && u.extension !== '0')
          .map((u: SuperAdminUser) => ({
            id:              u.id,
            lineName:        u.name,
            role:            u.role,
            extensionNumber: u.extension,
            status:          u.status,
          }));

        setLines(mapped);

        if (result.ok) {
          console.log(
            '%c[LinesPage] ✅ API Success',
            'color: #22c55e; font-weight: bold;',
            { total: mapped.length, source: result.source }
          );
        } else {
          console.warn(
            '%c[LinesPage] ⚠️ API Failed — Using Fallback',
            'color: #f59e0b; font-weight: bold;',
            { message: result.message }
          );
        }
      })
      .catch((err) => {
        console.error('%c[LinesPage] ❌ Unexpected Error', 'color: #ef4444; font-weight: bold;', err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── Pagination ──
  const totalPages = Math.ceil(lines.length / ITEMS_PER_PAGE);
  const paginatedLines = lines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ── Edit Handlers ──
  const handleEditClick = (line: LineRow) => {
    setEditingLine(line);
    setEditForm({
      extension:  line.extensionNumber,
      holderName: line.lineName,
      role:       line.role,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLine) return;

    setLines((current) =>
      current.map((item) =>
        item.id === editingLine.id
          ? {
              ...item,
              extensionNumber: editForm.extension,
              lineName:        editForm.holderName,
              role:            editForm.role,
            }
          : item
      )
    );

    console.log('%c[LinesPage] ✏️ Extension Updated', 'color: #6366f1;', {
      id:        editingLine.id,
      extension: editForm.extension,
      holder:    editForm.holderName,
      role:      editForm.role,
    });

    setIsEditModalOpen(false);
    setEditingLine(null);
  };

  // ── Pagination buttons ──
  const renderPageButtons = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push('...');
      if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  return (
    <div className="page-content lines-page">
      {/* ── Header ── */}
      <div className="view-header lines-page-header">
        <h2 className="lines-title">
          Extension
          {!isLoading && (
            <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 400, marginLeft: '8px' }}>
              ({lines.length})
            </span>
          )}
        </h2>

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

      {/* ── Table ── */}
      <div className="table-card lines-table-card">
        <div className="table-container">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
              Loading extensions...
            </div>
          ) : lines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
              No extensions found.
            </div>
          ) : (
            <table className="data-table lines-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Role</th>
                  <th>Extension</th>
                  <th>Status</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLines.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.lineName}</td>
                    <td>{item.role || 'N/A'}</td>
                    <td>{item.extensionNumber}</td>
                    <td>
                      <span className={`badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="line-edit-btn" onClick={() => handleEditClick(item)}>
                        <Edit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {!isLoading && totalPages > 1 && (
          <div className="pagination-footer lines-pagination">
            <button
              className="pg-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {renderPageButtons().map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="pg-dots">...</span>
              ) : (
                <button
                  key={page}
                  className={`pg-num ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="pg-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-panel lines-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Extension</h3>
              <button
                type="button"
                className="icon-button close-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Extension Number</label>
                <input
                  className="form-input"
                  value={editForm.extension}
                  onChange={(e) => setEditForm({ ...editForm, extension: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Extension Holder</label>
                <input
                  className="form-input"
                  value={editForm.holderName}
                  onChange={(e) => setEditForm({ ...editForm, holderName: e.target.value })}
                  required
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
