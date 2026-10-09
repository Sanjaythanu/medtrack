import React, { useState, useContext } from 'react';
import GlassModal from '../components/common/GlassModal';
import { NotificationContext } from '../contexts/NotificationContext';

const ForgotPasswordModal = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { addToast } = useContext(NotificationContext);

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    addToast('Password reset link sent to your registered email.', 'success');
  };

  return (
    <GlassModal show={show} onClose={onClose} title="Reset Account Password">
      {!sent ? (
        <form onSubmit={handleReset}>
          <p className="small text-muted mb-3">
            Enter your hospital email address below. We will send you instructions to safely reset your password.
          </p>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Hospital Email Address</label>
            <input
              type="email"
              className="form-control glass-input"
              placeholder="user@medtrack.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-glass-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glass-primary">
              Send Reset Instructions
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-3">
          <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block"></i>
          <h5 className="fw-bold text-success">Instructions Sent!</h5>
          <p className="small text-muted mb-3">
            Please check <strong>{email}</strong> for password recovery link.
          </p>
          <button className="btn btn-glass-primary" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </GlassModal>
  );
};

export default ForgotPasswordModal;
