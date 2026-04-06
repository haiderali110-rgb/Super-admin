import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Save, CheckCircle2 } from 'lucide-react';
import './CreateNewPasswordPage.css';

const CreateNewPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="create-password-root">
      <div className="create-password-card">
        <div className="create-password-content">
          <div className="create-password-header">
            <div className="create-password-icon-box">
              <ShieldCheck size={32} />
            </div>
            <h2>Create new password</h2>
            <p>Set a secure password to continue.</p>
          </div>

          <form
            className="create-password-form"
            onSubmit={(event) => {
              event.preventDefault();
              navigate('/super-admin/users');
            }}
          >
            <label className="create-password-label">New password</label>
            <input type="password" placeholder="Enter new password" className="create-password-field" />

            <label className="create-password-label">Confirm password</label>
            <input type="password" placeholder="Confirm your password" className="create-password-field" />

            <div className="create-password-help">
              <div>
                <CheckCircle2 size={14} className="help-icon" /> 8+ characters
              </div>
              <div>
                <CheckCircle2 size={14} className="help-icon" /> At least one symbol
              </div>
            </div>

            <button type="submit" className="create-password-button">
              <Save size={20} /> Save password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPasswordPage;