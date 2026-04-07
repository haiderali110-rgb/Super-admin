import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

// Sahi import path aur service
import { authService } from '../../super-admin/api/authService';

import './SignupPage.css'; 

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getFcmPayload = () => ({
    deviceId: localStorage.getItem('beloz_device_id') || '',
    token: localStorage.getItem('beloz_fcm_token') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (firstName.length < 3 || firstName.length > 15) {
      alert('First name must be between 3 and 15 characters.');
      return;
    }
    if (lastName.length < 3 || lastName.length > 15) {
      alert('Last name must be between 3 and 15 characters.');
      return;
    }
    
    setLoading(true);

    try {
      const response = await authService.signup({
        firstName,
        lastName,
        email,
        password,
        platform: 'web',
        fcmToken: getFcmPayload(),
      });

      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        alert('Account created successfully! Please login.');
        navigate('/login');
      } else {
        alert(data?.message || 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Signup Error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Server se connection nahi ho saka.';
      alert(`Signup failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">
      {/* LEFT SIDE */}
      <div className="left-panel">
        <div className="logo-section">
          <div className="logo-wrapper">
            <img src="/src/assets/icons/Group.png" alt="Logo" className="logo-img" />
          </div>
          <img src="/src/assets/images/img learning.png" alt="Illustration" className="side-visual" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="form-card">
          <div className="header-text">
            <h2>Create Account</h2>
            <p>Enter your details to create your account.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-with-icon">
                <User className="field-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="login-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-with-icon">
                <User className="field-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="login-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  minLength={8}
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <UserPlus size={22} />
              <span>{loading ? 'Creating...' : 'Sign Up'}</span>
            </button>
          </form>

          <div className="signup-section">
            <p>Already have an account? <button onClick={() => navigate('/login')} className="signup-link">Sign In</button></p>
          </div>

          <div className="footer-copyright">
            <p>© 2026 Beloz Ecosystem. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;