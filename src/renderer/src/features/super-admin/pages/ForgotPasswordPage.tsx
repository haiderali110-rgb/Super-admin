import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { authService } from '../api/authService';
import './ForgotPassword.css'; 

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.sendOTP(email, '');
      if (response.status === 200) {
        alert('Verification code sent to your email.');
        navigate('/verify-otp', { state: { flow: 'forgot', email } });
      } else {
        alert('Unable to send verification code. Please try again.');
      }
    } catch (error: any) {
      console.error('Send OTP Error:', error);
      const errorMessage = error.response?.data?.message || 'Server se connection nahi ho saka.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-screen">
      <div className="forgot-left-panel">
        <div className="forgot-panel-content">
          <div className="forgot-brand-lockup">
            <img 
              src="/src/assets/icons/Group.png" 
              alt="Logo" 
              className="forgot-logo-img" 
            />
          </div>

          <div className="forgot-illustration-wrap">
            <img src="/src/assets/images/img learning.png" alt="Illustration" className="forgot-side-visual" />
          </div>
        </div>
      </div>

      <div className="forgot-right-panel">
        <div className="forgot-form-shell">
          <div className="forgot-form-content">
          <div className="forgot-header-text">
            <h2>Forgot password</h2>
            <p>Please provide the email address<br />linked to your account.</p>
          </div>

          <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="forgot-input-group">
              <div className="forgot-input-with-icon">
                <Mail className="forgot-field-icon" size={20} />
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="forgot-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="forgot-submit-btn"
              disabled={loading}
            >
              <span>{loading ? 'Sending...' : 'Next'}</span>
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
