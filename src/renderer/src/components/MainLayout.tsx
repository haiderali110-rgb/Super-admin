import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="beloz-container">
      <Header />
      <div className="app-main-layout">
        <Sidebar />
        <main className="content-view">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;