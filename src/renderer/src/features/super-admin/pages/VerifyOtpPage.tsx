import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    <div className="otp-screen">
      <div className="otp-left-panel">
        <div className="otp-panel-content">
          <div className="otp-brand-lockup">
            <img 
              src="/src/assets/icons/Group.png" 
              alt="Logo" 
              className="otp-logo-img" 
            />
          </div>

          <div className="otp-illustration-wrap">
            <img src="/src/assets/images/img learning.png" alt="Illustration" className="otp-side-visual" />
          </div>
        </div>
      </div>

      <div className="otp-right-panel">
        <div className="otp-form-shell">
          <div className="otp-form-content">
          <div className="otp-header-text">
            <h2>Enter OTP</h2>
            <p>Please enter OTP we've send to<br />{email || 'warren.wade@example.com'}</p>
          </div>

          <form className="otp-form" onSubmit={handleSubmit}>
            
            <div className="otp-input-row">
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
            <p className="otp-resend-text">
              Didn't Receive Code? <span className="otp-resend-link">00:00</span>
            </p>

            <button type="submit" className="otp-submit-btn" disabled={loading}>
              <span>{loading ? 'Verifying...' : 'Next'}</span>
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
