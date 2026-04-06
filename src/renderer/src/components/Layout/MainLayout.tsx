import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';

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