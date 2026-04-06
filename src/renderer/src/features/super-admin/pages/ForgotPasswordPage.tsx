import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import './ForgotPassword.css'; 

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Page refresh hone se rokne ke liye
    navigate('/verify-otp'); // Validation pass hone ke baad aage jane ke liye
  };

  return (
    <div className="split-screen-container">
      
      {/* --- LEFT SIDE --- */}
      <div className="left-panel">
        <div className="logo-section">
          <div className="logo-placeholder">
            <img 
              src="/src/assets/icons/Group.png" 
              alt="Logo" 
              className="logo-img" 
            />
          </div>
          <img src="/src/assets/images/img learning.png" alt="Illustration" className="side-visual" />
        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="right-panel">
        <div className="form-card">
          
          <div className="header-text">
            <h2>Reset Password</h2>
            <p>Enter your email address to receive a verification code.</p>
          </div>

          {/* onSubmit function yahan lagaya gaya hai */}
          <form className="auth-form" onSubmit={handleSubmit}>
            
            <div className="input-group">
              <div className="input-with-icon">
                <Mail className="field-icon" size={20} />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="login-input"
                  required
                />
              </div>
            </div>

            {/* Button type "submit" hona chahiye taaki 'required' kaam kare */}
            <button 
              type="submit" 
              className="login-btn"
            >
              <Send size={18} />
              <span>Send verification code</span>
            </button>
          </form>

          <div className="footer-copyright">
            <p>© 2026 Beloz Ecosystem. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;