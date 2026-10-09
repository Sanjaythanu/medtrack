import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 text-center position-relative" style={{ zIndex: 10 }}>
      <div className="glass-card p-5 max-w-md" style={{ maxWidth: '480px' }}>
        <h1 className="display-1 fw-extrabold text-primary mb-0">404</h1>
        <h4 className="fw-bold text-dark mb-2">Page Not Found</h4>
        <p className="text-muted small mb-4">The page or resource you requested does not exist on the MedTrack hospital management system.</p>
        <Link to="/dashboard" className="btn btn-glass-primary">
          <i className="bi bi-house-door me-1"></i> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
