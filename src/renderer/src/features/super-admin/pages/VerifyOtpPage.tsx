import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './VerifyOtp.css'; 

const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/reset-password');
  };

  return (
    <div className="split-screen-container">
      
      {/* --- LEFT SIDE: Matching LoginPage --- */}
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

      {/* --- RIGHT SIDE: OTP Verification --- */}
      <div className="right-panel">
        <div className="form-card">
          
          <div className="header-text">
            <h2>Verify OTP</h2>
            <p>Please enter the 4-digit code <br /> sent to your email.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            
     
            <div className="otp-input-container">
              {[1, 2, 3, 4].map((i) => (
                <input 
                  key={i} 
                  type="text" 
                  maxLength={1} 
                  required 
                  className="otp-box"
                  pattern="\d*"
                />
              ))}
            </div>

            <button type="submit" className="login-btn">
              <span>Verify code</span>
              <ArrowRight size={20}/>
            </button>
          </form>

          <p className="resend-text">
            Didn't receive the code? <span className="resend-link">Resend code</span>
          </p>

          <div className="footer-copyright">
            <p>© 2026 Beloz Ecosystem. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;