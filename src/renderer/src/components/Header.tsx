import React, { useState } from 'react';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useLanguage, uiLabels } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { language } = useLanguage();
  const labels = uiLabels[language].header;
  const [showProfileDD, setShowProfileDD] = useState(false);
  const [showNotifDD, setShowNotifDD] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('beloz_auth_token');
    localStorage.removeItem('beloz_auth_user');
    window.location.href = '/login';
  };

  return (
    <header className="top-header">
      <div className="header-logo">
        <img src="/src/assets/icons/Group.png" alt="Logo" />
      </div>
      <div className="header-right">
        <div className="dropdown-container">
          <div className="notif-box" onClick={() => { setShowNotifDD(!showNotifDD); setShowProfileDD(false); }}>
            <Bell size={20} />
            <span className="notif-dot"></span>
          </div>
          {showNotifDD && (
            <div className="dropdown-menu notification-menu">
              <div className="menu-item header-item">{labels.notifications}</div>
              <div className="menu-item">New interpreter request pending</div>
              <div className="menu-item">CSR role change approved</div>
              <div className="menu-item">Language rate updated</div>
            </div>
          )}
        </div>

        <div className="dropdown-container">
          <div className="user-profile-pill" onClick={() => { setShowProfileDD(!showProfileDD); setShowNotifDD(false); }}>
            <div className="profile-text">
              <span className="p-name">Courtney Henry</span>
              <span className="p-role">{labels.admin}</span>
            </div>
            <ChevronDown size={16} />
          </div>
          {showProfileDD && (
            <div className="dropdown-menu profile-menu">
              <div className="menu-item">
                <User size={14} /> 
                <span>{labels.myProfile}</span>
              </div>
              <div className="menu-item logout" onClick={handleLogout}>
                <LogOut size={14} /> 
                <span>{labels.logout}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;