import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Page Imports
import LoginPage from './features/super-admin/pages/LoginPage';
import SignupPage from './features/super-admin/pages/SignupPage';
import ForgotPasswordPage from './features/super-admin/pages/ForgotPasswordPage';
import VerifyOtpPage from './features/super-admin/pages/VerifyOtpPage';
import ResetPasswordPage from './features/super-admin/pages/ResetPasswordPage';
import CreateNewPasswordPage from './features/super-admin/pages/CreateNewPasswordPage';
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

          {/* Protected Dashboard Routes */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UsersPage />} />

            {/* History Nested Routes */}
            <Route path="history">
              <Route index element={<Navigate to="interpreter" replace />} />
              <Route path="interpreter" element={<InterpreterHistory />} />
              <Route path="csr" element={<CSRHistory />} />
              <Route path="customer" element={<CustomerHistory />} />
              <Route path="web-manager" element={<WebManager />} />
              <Route path="mobile-interpreter" element={<MobileInterpreterHistory />} />
              <Route path="mobile-manager" element={<MobileManagerHistory />} />
            </Route>

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