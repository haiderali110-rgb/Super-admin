import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound } from 'lucide-react';
import './ResetPassword.css'; 

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    navigate('/login');
  };

  return (
    <div className="reset-container">
      
      {/* --- LEFT SIDE: Brand Section --- */}
      <div className="reset-left-panel">
        <div className="reset-logo-section">
          <div className="reset-logo-wrapper">
            <img 
              src="/src/assets/icons/Group.png" 
              alt="Logo" 
              className="reset-logo-img" 
            />
          </div>
         
          <img 
            src="/src/assets/images/img learning.png" 
            alt="Learning illustration" 
            className="reset-side-visual"
          />
        </div>
      </div>

      {/* --- RIGHT SIDE: Reset Password Form --- */}
      <div className="reset-right-panel">
        <div className="reset-form-card">
          
          <div className="reset-header-text">
            <h2>Reset password</h2>
            <p>Create a strong, secure password for your account.</p>
          </div>

          <form className="reset-main-form" onSubmit={handleSubmit}>
            
           
            <div className="reset-input-group">
              <div className="reset-input-wrapper">
                <Lock className="reset-field-icon" size={20} />
                <input 
                  type="password" 
                  placeholder="New password" 
                  className="reset-input-field"
                  required
                  minLength={8}
                />
              </div>
            </div>
 
            <div className="reset-input-group">
              <div className="reset-input-wrapper">
                <KeyRound className="reset-field-icon" size={20} />
                <input 
                  type="password" 
                  placeholder="Confirm password" 
                  className="reset-input-field"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <p className="reset-password-hint">
              Use at least 8 characters, including letters and numbers.
            </p>

            <button type="submit" className="reset-submit-btn">
              <span>Reset password</span>
            </button>
          </form>

          <div className="reset-footer">
            <p>© 2026 Beloz Ecosystem. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;