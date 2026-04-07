import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { authService } from '../api/authService';
import './VerifyOtp.css'; 

const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const state = (location.state as { flow?: 'forgot' | 'login'; email?: string }) || {};
  const flow = state.flow || 'forgot';
  const email = state.email || localStorage.getItem('beloz_pending_login_email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Email missing. Please start the flow again.');
      navigate(flow === 'login' ? '/login' : '/forgot-password');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOTP({ email, otp });
      if (response.status === 200) {
        if (flow === 'forgot') {
          navigate('/reset-password', { state: { email, otp } });
        } else {
          localStorage.removeItem('beloz_pending_login_email');
          navigate('/super-admin/users');
        }
      } else {
        alert('Invalid verification code.');
      }
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      const errorMessage = error.response?.data?.message || 'Verification failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
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
              <input
                type="text"
                placeholder="Enter verification code"
                className="otp-box"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <span>{loading ? 'Verifying...' : 'Verify code'}</span>
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