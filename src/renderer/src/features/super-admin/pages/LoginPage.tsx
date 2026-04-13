import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, MoveRight, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../super-admin/api/authService';
import './LoginPage.css'; 

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        email, password, platform: 'desktop', fcmToken: getFcmPayload(),
      });
      const data = response.data;
      const authToken = data?.data?.accessToken || data?.accessToken || data?.token;

      if (authToken) {
        localStorage.setItem('beloz_auth_token', authToken);
        if (data.chainToken || data.data?.chainToken) localStorage.setItem('beloz_chain_token', data.chainToken || data.data.chainToken);
        if (data.user || data.data?.user) localStorage.setItem('beloz_auth_user', JSON.stringify(data.user || data.data.user));
        
        if (data.verifyAccessCode || data.data?.verifyAccessCode) {
          localStorage.setItem('beloz_pending_login_email', email);
          navigate('/verify-otp', { state: { flow: 'login', email } });
        } else {
          navigate('/super-admin/users');
        }
      } else {
        alert(data?.message || 'Invalid email or password.');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper-main">
      <div className="login-container-card">
        {/* Left Section */}
        <div className="blue-panel">
          <div className="panel-content">
            <img src="/src/assets/icons/Group.png" alt="Beloz Logo" className="brand-logo" />
            <img src="/src/assets/images/img learning.png" alt="Illustration" className="main-illustration" />
          </div>
        </div>

        {/* Right Section */}
        <div className="form-panel">
          <div className="auth-form-content">
            <div className="auth-header">
              <h1>Welcome Back :)</h1>
              <p> Please enter your <br/> login details below! </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form-main">
              <div className="input-field-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="input-field-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="forgot-pass-box">
                <button type="button" onClick={() => navigate('/forgot-password')}>Forgot password?</button>
              </div>

              <button type="submit" className="submit-btn-blue" disabled={loading}>
                <MoveRight size={20} />
                <span>{loading ? 'Processing...' : 'Sign In'}</span>
              </button>
            </form>

            <div className="signup-prompt">
              Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
            </div>
          </div>
          
           
        </div>
      </div>
    </div>
  );
};

export default LoginPage;