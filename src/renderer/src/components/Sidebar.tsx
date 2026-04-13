import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, History, Globe, PhoneForwarded } from 'lucide-react';
import { useLanguage, uiLabels } from '../contexts/LanguageContext';
import '../features/super-admin/pages/user.css';

const Sidebar: React.FC = () => {
  const { language } = useLanguage();
  const labels = uiLabels[language].sidebar;

  const navItems = [
    { name: labels.user, path: '/super-admin/users', icon: <Users size={20} /> },
    { name: labels.history, path: '/super-admin/history', icon: <History size={20} /> },
    { name: labels.languages, path: '/super-admin/languages', icon: <Globe size={20} /> },
    { name: labels.lines, path: '/super-admin/lines', icon: <PhoneForwarded size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <nav className="side-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;