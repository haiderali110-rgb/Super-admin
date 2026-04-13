import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { authService } from '../api/authService';
import './ResetPassword.css'; 

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const state = (location.state as { email?: string; otp?: string }) || {};
  const email = state.email || '';
  const otp = state.otp || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otp) {
      alert('Session expired. Please request a new verification code.');
      navigate('/forgot-password');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword({ email, otp, password });
      if (response.status === 200) {
        alert('Password reset successful. Please login again.');
        navigate('/login');
      } else {
        alert('Unable to reset password. Please try again.');
      }
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      const errorMessage = error.response?.data?.message || 'Password reset failed.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-left-panel">
        <div className="reset-panel-content">
          <div className="reset-brand-lockup">
            <img 
              src="/src/assets/icons/Group.png" 
              alt="Logo" 
              className="reset-logo-img" 
            />
          </div>

          <div className="reset-illustration-wrap">
            <img 
              src="/src/assets/images/img learning.png" 
              alt="Learning illustration" 
              className="reset-side-visual"
            />
          </div>
        </div>
      </div>

      <div className="reset-right-panel">
        <div className="reset-form-shell">
          <div className="reset-form-container">
          <div className="reset-header-text">
            <h2>Reset password</h2>
            <p>Create a strong and secure password</p>
          </div>

          <form className="reset-main-form" onSubmit={handleSubmit}>
            
           
            <div className="reset-input-group">
              <div className="reset-input-wrapper">
                <Lock className="reset-field-icon" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter your New password" 
                  className="reset-input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
              </div>
            </div>
 
            <div className="reset-input-group">
              <div className="reset-input-wrapper">
                <KeyRound className="reset-field-icon" size={20} />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="Enter your Confirm password" 
                  className="reset-input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
              </div>
            </div>

             

            <button type="submit" className="reset-submit-btn" disabled={loading}>
              <span>{loading ? 'Resetting...' : 'Next'}</span>
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
