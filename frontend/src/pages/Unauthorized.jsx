import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 text-center position-relative" style={{ zIndex: 10 }}>
      <div className="glass-card p-5 max-w-md" style={{ maxWidth: '480px' }}>
        <i className="bi bi-shield-lock-fill text-warning fs-1 mb-3 d-block"></i>
        <h3 className="fw-bold text-primary mb-2">401 - Authentication Required</h3>
        <p className="text-muted small mb-4">Your session has expired or you are not logged in. Please sign in to access the MedTrack SaaS portal.</p>
        <Link to="/login" className="btn btn-glass-primary">
          <i className="bi bi-box-arrow-in-right me-1"></i> Sign In Now
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
