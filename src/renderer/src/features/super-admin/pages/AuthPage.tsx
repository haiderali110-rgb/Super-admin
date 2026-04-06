import React, { useState } from 'react';
import { authService } from '../api/authService';

const AuthPage = () => {
  // Steps: 'login' | 'forgot' | 'otp' | 'reset'
  const [step, setStep] = useState<'login' | 'forgot' | 'otp' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordData, setPasswordData] = useState({ password: '', confirm: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // 1. Login Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.login(loginData);
      localStorage.setItem('token', res.data.token);
      alert("Login Successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid credentials. Please check your password.");
    }
  };

  // 2. Forgot Password - Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.sendOTP(email);
      alert("OTP sent to your email!");
      setStep('otp');
    } catch (err) {
      alert("Email not found or invalid.");
    }
  };

  // 3. Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.verifyOTP(email, otp);
      setStep('reset');
    } catch (err) {
      alert("Invalid OTP. Please try again.");
    }
  };

  // 4. Reset Password (Matching Logic)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.confirm) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await authService.resetPassword({ email, otp, password: passwordData.password });
      alert("Password updated! Now login.");
      setStep('login');
    } catch (err) {
      alert("Error resetting password.");
    }
  };

  return (
    <div className="auth-container" style={{ padding: '50px', textAlign: 'center' }}>
      
      {/* --- LOGIN STEP --- */}
      {step === 'login' && (
        <form onSubmit={handleLogin}>
          <h2>Super Admin Login</h2>
          <input type="email" placeholder="Email" required onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
          <br /><br />
          <input type="password" placeholder="Password" required onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
          <br /><br />
          <button type="submit">Login</button>
          <p onClick={() => setStep('forgot')} style={{cursor:'pointer', color:'blue'}}>Forgot Password?</p>
        </form>
      )}

      {/* --- FORGOT PASSWORD STEP --- */}
      {step === 'forgot' && (
        <form onSubmit={handleSendOTP}>
          <h2>Forgot Password</h2>
          <input type="email" placeholder="Enter Registered Email" required onChange={(e) => setEmail(e.target.value)} />
          <br /><br />
          <button type="submit">Send OTP</button>
        </form>
      )}

      {/* --- OTP VERIFY STEP --- */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP}>
          <h2>Enter OTP</h2>
          <p>Sent to: {email}</p>
          <input type="text" placeholder="6-digit OTP" required onChange={(e) => setOtp(e.target.value)} />
          <br /><br />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {/* --- NEW PASSWORD STEP --- */}
      {step === 'reset' && (
        <form onSubmit={handleResetPassword}>
          <h2>Create New Password</h2>
          <input type="password" placeholder="New Password" required onChange={(e) => setPasswordData({...passwordData, password: e.target.value})} />
          <br /><br />
          <input type="password" placeholder="Confirm Password" required onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} />
          <br /><br />
          <button type="submit">Update Password</button>
        </form>
      )}

    </div>
  );
};

export default AuthPage;