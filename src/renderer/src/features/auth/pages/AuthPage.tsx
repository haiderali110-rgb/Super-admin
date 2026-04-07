import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
 
import { authService } from '../../super-admin/api/authService';

import './LoginPage.css'; 

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getFcmPayload = () => ({
    deviceId: localStorage.getItem('beloz_device_id') || '',
    token: localStorage.getItem('beloz_fcm_token') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        email,
        password,
        platform: 'mobile',
        fcmToken: getFcmPayload(),
      });

      const data = response.data;
      const authToken = data?.accessToken || data?.token;

      if (authToken) {
        localStorage.setItem('beloz_auth_token', authToken);

        if (data.chainToken) {
          localStorage.setItem('beloz_chain_token', data.chainToken);
        }

        if (data.user) {
          localStorage.setItem('beloz_auth_user', JSON.stringify(data.user));
        }

        if (data.verifyAccessCode) {
          localStorage.setItem('beloz_pending_login_email', email);
          navigate('/verify-otp', { state: { flow: 'login', email } });
        } else {
          navigate('/super-admin/users');
        }
      } else {
        alert(data?.message || 'Login failed: Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      const msg = error.response?.data?.message || 'Server connection error';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">
      <div className="left-panel">
        <div className="logo-section">
          <div className="logo-wrapper">
            {/* Image paths check karlein agar public folder mein hain to '/' se start karein */}
            <img src="/src/assets/icons/Group.png" alt="Logo" className="logo-img" />
          </div>
          <img src="/src/assets/images/img learning.png" alt="Illustration" className="side-visual" />
        </div>
      </div>

      <div className="right-panel">
        <div className="form-card">
          <div className="header-text">
            <h2>Welcome Back</h2>
            <p>Enter your email and password to access your account.</p>
          </div>

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

            <div className="input-group">
              <div className="input-with-icon">
                <Lock className="field-icon" size={20} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                onClick={() => navigate('/forgot-password')}
                type="button" 
                className="forgot-link"
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <LogIn size={22} />
              <span>{loading ? 'Processing...' : 'Sign In'}</span>
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

export default LoginPage;