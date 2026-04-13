import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { authService } from '../api/authService';
import './VerifyOtp.css'; 

const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  const state = (location.state as { flow?: 'forgot' | 'login'; email?: string }) || {};
  const flow = state.flow || 'forgot';
  const email = state.email || localStorage.getItem('beloz_pending_login_email') || '';

  const handleOtpChange = (val: string, index: number) => {
    const cleanVal = val.replace(/\D/g, '');
    const newOtp = [...otpArray];
    newOtp[index] = cleanVal.slice(-1);
    setOtpArray(newOtp);

    if (cleanVal && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Email missing. Please start the flow again.');
      navigate(flow === 'login' ? '/login' : '/forgot-password');
      return;
    }

    setLoading(true);
    try {
      const otpValue = otpArray.join('');
      const response = await authService.verifyOTP({ email, otp: otpValue });
      if (response.status === 200) {
        if (flow === 'forgot') {
          navigate('/reset-password', { state: { email, otp: otpValue } });
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
        <div className="auth-form-content">
          
          <div className="header-text">
            <h2>Enter OTP</h2>
            <p>Please enter  OTP we've send to <br />superadmin@gmail.com</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            
            <div className="otp-input-container">
              {otpArray.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  className="otp-box"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  required
                />
              ))}
            </div>
              <p className="resend-text">
            Didn't receive the code? <span className="resend-link">Resend code</span>
          </p>

            <button type="submit" className="login-btn" disabled={loading}>
              <span>{loading ? 'Verifying...' : 'Verify code'}</span>
              <ArrowRight size={20}/>
            </button>
          </form>

        

          
        </div>
      </div>
      </div>
  );
};

export default VerifyOtpPage;