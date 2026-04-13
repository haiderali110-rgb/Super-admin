import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
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
        <div className="auth-form-content">
          
          <div className="header-text">
            <h2>Reset Password </h2>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Button type "submit" hona chahiye taaki 'required' kaam kare */}
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              <Send size={18} />
              <span>{loading ? 'Sending...' : 'Send verification code'}</span>
            </button>
          </form>

           
        </div>
      </div>
      </div>
  );
};

export default ForgotPasswordPage;