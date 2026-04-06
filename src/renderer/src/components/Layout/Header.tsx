import React, { useState } from 'react';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useLanguage, uiLabels } from '../../contexts/LanguageContext';

const Header: React.FC = () => {
  const { language } = useLanguage();
  const labels = uiLabels[language] ?? uiLabels.English;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications: string[] = labels.notificationItems ?? [];

  return (
    <header className="top-header">
      <div className="header-logo">
        <img src="/src/assets/icons/Group.png" alt="Logo" />
        
      </div>

      <div className="header-right">
        <div className="dropdown-container">
          <div className="notif-box" onClick={() => { setShowNotifications((state) => !state); setIsProfileOpen(false); }}>
            <Bell size={20} />
            <span className="notif-dot"></span>
          </div>
          {showNotifications && (
            <div className="dropdown-menu notification-menu">
              <div className="menu-item header-item">{labels.header.notifications}</div>
              {notifications.map((note, index) => (
                <div key={index} className="menu-item">{note}</div>
              ))}
            </div>
          )}
        </div>
        <div className="dropdown-container">
          <div className="user-profile-pill" onClick={() => { setIsProfileOpen((state) => !state); setShowNotifications(false); }}>
            <div className="profile-text">
              <span className="p-name">Courtney Henry</span>
              <span className="p-role">Admin</span>
            </div>
            <ChevronDown size={16} />
          </div>
          {isProfileOpen && (
            <div className="dropdown-menu profile-menu">
              <div className="menu-item"><User size={14} /> {labels.header.myProfile}</div>
              <div className="menu-item logout" onClick={() => window.location.href='/'}>
                <LogOut size={14} /> {labels.header.logout}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;