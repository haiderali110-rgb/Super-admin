// src/renderer/src/main.tsx
import './styles/index.css'; 
import './features/super-admin/pages/user.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
