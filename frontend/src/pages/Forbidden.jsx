import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 text-center position-relative" style={{ zIndex: 10 }}>
      <div className="glass-card p-5 max-w-md" style={{ maxWidth: '480px' }}>
        <i className="bi bi-slash-circle-fill text-danger fs-1 mb-3 d-block"></i>
        <h3 className="fw-bold text-danger mb-2">403 - Access Forbidden</h3>
        <p className="text-muted small mb-4">You do not have the required RBAC role permissions to perform this operation or view this resource.</p>
        <Link to="/dashboard" className="btn btn-glass-primary">
          <i className="bi bi-house-door me-1"></i> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
