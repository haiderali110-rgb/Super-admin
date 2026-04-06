import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, History, Globe, PhoneForwarded } from 'lucide-react';
import { useLanguage, uiLabels } from '../../contexts/LanguageContext';

const Sidebar: React.FC = () => {
  const { language } = useLanguage();
  const labels = uiLabels[language];
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: labels.sidebar.user, path: '/super-admin/users', icon: <Users size={20} /> },
    { name: labels.sidebar.history, path: '/super-admin/history', icon: <History size={20} /> },
    { name: labels.sidebar.languages, path: '/super-admin/languages', icon: <Globe size={20} /> },
    { name: labels.sidebar.lines, path: '/super-admin/lines', icon: <PhoneForwarded size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <nav className="side-nav">
        {menu.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/super-admin' && location.pathname.startsWith(item.path));

          return (
            <div 
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              style={{ cursor: 'pointer' }}
            >
              {item.icon} 
              <span>{item.name}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;