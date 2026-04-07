import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import { LanguageProvider } from './contexts/LanguageContext';
import './features/super-admin/pages/user.css';

// Auth Pages
import LoginPage from './features/super-admin/pages/LoginPage';
import SignupPage from './features/super-admin/pages/SignupPage';
import ForgotPasswordPage from './features/super-admin/pages/ForgotPasswordPage';
import VerifyOtpPage from './features/super-admin/pages/VerifyOtpPage';
import ResetPasswordPage from './features/super-admin/pages/ResetPasswordPage';
import CreateNewPasswordPage from './features/super-admin/pages/CreateNewPasswordPage';

// Admin Pages
import UsersPage from './features/super-admin/pages/UsersPage';
import InterpreterHistory from './features/super-admin/pages/InterpreterHistory';
import CSRHistory from './features/super-admin/pages/CSRHistory';
import CustomerHistory from './features/super-admin/pages/CustomerHistory';
import WebManager from './features/super-admin/pages/WebManager';
import MobileInterpreterHistory from './features/super-admin/pages/MobileInterpreterHistory';
import MobileManagerHistory from './features/super-admin/pages/MobileManagerHistory';
import AddInterpreterPage from './features/super-admin/pages/AddInterpreterPage';
import AddCSRPage from './features/super-admin/pages/AddCSRPage';
import AddManagerPage from './features/super-admin/pages/AddManagerPage';
import AddCustomerPage from './features/super-admin/pages/AddCustomerPage';
import EditInterpreterPage from './features/super-admin/pages/EditInterpreterPage';
import EditCSRPage from './features/super-admin/pages/EditCSRPage';
import EditManagerPage from './features/super-admin/pages/EditManagerPage';
import LanguagesPage from './features/super-admin/pages/LanguagesPage';
import LinesPage from './features/super-admin/pages/LinesPage';

// Updated Protected Route: Uses 'beloz_auth_token'
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('beloz_auth_token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/first-login-setup" element={<CreateNewPasswordPage />} />

          {/* Protected Dashboard Routes - All Wrapped in ProtectedRoute */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Inner Routes: These will be rendered inside MainLayout's <Outlet /> */}
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="history/interpreter" element={<InterpreterHistory />} />
            <Route path="history/csr" element={<CSRHistory />} />
            <Route path="history/customer" element={<CustomerHistory />} />
            <Route path="history/web-manager" element={<WebManager />} />
            <Route path="history/mobile-interpreter" element={<MobileInterpreterHistory />} />
            <Route path="history/mobile-manager" element={<MobileManagerHistory />} />
            <Route path="add/interpreter" element={<AddInterpreterPage />} />
            <Route path="add/csr" element={<AddCSRPage />} />
            <Route path="add/manager" element={<AddManagerPage />} />
            <Route path="add/customer" element={<AddCustomerPage />} />
            <Route path="edit/interpreter" element={<EditInterpreterPage />} />
            <Route path="edit/csr" element={<EditCSRPage />} />
            <Route path="edit/manager" element={<EditManagerPage />} />
            <Route path="languages" element={<LanguagesPage />} />
            <Route path="lines" element={<LinesPage />} />
          </Route>

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;