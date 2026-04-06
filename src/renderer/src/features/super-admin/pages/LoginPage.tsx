import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import './LoginPage.css'; 

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
   

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Button Clicked!"); // Console mein check karne ke liye
    e.preventDefault(); 
    
    // Yahan navigate ka path wahi hona chahiye jo App.tsx mein hai
    navigate('/super-admin/users'); 
  };

  return (
    <div className="split-screen-container">
      
      {/* LEFT SIDE */}
      <div className="left-panel">
        <div className="logo-section">
          <div className="logo-wrapper">
            <img 
              src="/src/assets/icons/Group.png" 
              alt="Logo" 
              className="logo-img" 
            />
          </div>
           
          <img src="/src/assets/images/img learning.png" alt="Illustration" className="side-visual" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="form-card">
          
          <div className="header-text">
            <h2>Welcome Back</h2>
            <p>Enter your email and password to access your account.</p>
          </div>

          {/* Form tag ka onSubmit check karein */}
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

            <div className="input-group">
              <div className="input-with-icon">
                <Lock className="field-icon" size={20} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="login-input"
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

            {/* BUTTON TYPE CHECK: Submit hona chahiye */}
            <button 
              type="submit" 
              className="login-btn"
            >
              <LogIn size={22} />
              <span>Sign In</span>
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