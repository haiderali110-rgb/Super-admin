import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './user.css';
import { fetchLines } from '../api/superAdminApi';
import type { LineExtension } from '../api/superAdminApi';
import { useLanguage, uiLabels } from '../../../contexts/LanguageContext';

const LinesPage: React.FC = () => {
  const { language } = useLanguage();
  const labels = uiLabels[language].pages.linesPage;
  const [showOptions, setShowOptions] = useState(false);
  const [lines, setLines] = useState<LineExtension[]>([
    { id: '1', lineName: 'Sales Line', extensionNumber: '1219', assignedTo: 'CSR Team', status: 'Active' },
    { id: '2', lineName: 'Support Line', extensionNumber: '1324', assignedTo: 'Interpreter Team', status: 'Active' },
    { id: '3', lineName: 'Billing Line', extensionNumber: '1047', assignedTo: 'Finance', status: 'Inactive' },
  ]);

  useEffect(() => {
    fetchLines()
      .then((data) => setLines(data))
      .catch(() => {
        // keep default data when backend is unavailable
      });
  }, []);

  return (
    <div className="page-content">
      <div className="view-header">
        <h2>{labels.title}</h2>
        <div className="header-actions">
          <div className="dropdown-container">
            <button className="btn-create" onClick={() => setShowOptions(!showOptions)}>
              <Plus size={18} /> {labels.button} <ChevronDown size={18} />
            </button>
            {showOptions && (
              <div className="dropdown-menu create-menu">
                <div className="menu-item header-item">{labels.createHeader}</div>
                <div className="menu-item">{labels.menuItems.salesLine}</div>
                <div className="menu-item">{labels.menuItems.supportLine}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{labels.tableHeaders.lineName}</th>
              <th>{labels.tableHeaders.extension}</th>
              <th>{labels.tableHeaders.assignedTo}</th>
              <th>{labels.tableHeaders.status}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((item) => (
              <tr key={item.id}>
                <td className="font-medium">{item.lineName}</td>
                <td>{item.extensionNumber}</td>
                <td>{item.assignedTo}</td>
                <td>
                  <span className={`badge ${item.status.toLowerCase()}`}>
                    <span className="dot"></span> {item.status}
                  </span>
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
    </div>
  );
};

export default LinesPage;
